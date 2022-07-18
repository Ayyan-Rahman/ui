import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useProvider } from 'wagmi';

import { TOKENS } from '@gateway/theme';

import { Box, Stack, Typography } from '@mui/material';

import { usePinata } from '../../../hooks/usePinata';
import { useAuth } from '../../../providers/auth';
import { gqlMethods } from '../../../services/api';
import { queryClient } from '../../../services/query-client';
import { SessionUser } from '../../../types/user';
import PocModalCreated from '../../organisms/poc-modal-created/poc-modal-created';
import { AvatarUploadCard } from './avatar-upload-card';
import { Form } from './form';
import { schema, NewCredentialSchema } from './schema';

export function NewCredentialTemplate() {
  const [open, setOpen] = useState<boolean>(false);
  const [credentialGroupId, setCredentialGroupId] = useState<string>('');
  const provider = useProvider();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const methods = useForm<NewCredentialSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      wallets: [],
    },
  });

  const { me } = useAuth();
  const { uploadFileToIPFS } = usePinata();

  const updateMutation = useMutation(
    'updateCredential',
    me && gqlMethods(me).create_credential_group,
    {
      onSuccess: async (data) => {
        await queryClient.cancelQueries('me');

        queryClient.setQueryData<SessionUser>('me', (old) => ({
          ...old,
          credential_groups: [
            ...old.credential_groups.filter(
              (obj) => obj.id !== data.insert_credential_group_one.id
            ),
            data.insert_credential_group_one,
          ],
        }));

        const createdGroupId = data.insert_credential_group_one.id;
        setCredentialGroupId(createdGroupId);
        handleOpen();
      },
    }
  );

  const validateWallets = async (wallets: string[]): Promise<boolean> => {
    // Validate wallets
    const errors = await Promise.all(
      wallets.map(async (wallet, index) => {
        if (!wallet.match(/^0x[0-9a-fA-F]{40}$/)) {
          const ens = await provider.resolveName(wallet);

          if (ens == null) {
            methods.setError(`wallets.${index}`, {
              message: `${wallet} is not a valid wallet address`,
            });
            return true;
          }
        }

        return false;
      })
    );

    if (errors.includes(true)) {
      return false;
    } else {
      methods.clearErrors();
      return true;
    }
  };

  const onSubmit = async (data: NewCredentialSchema) => {
    const isValid = await validateWallets(data.wallets);

    if (!isValid) {
      return;
    }

    // Upload image to IPFS
    const res = await fetch(data.image);
    const blob = await res.blob();
    const form = new FormData();
    form.append('file', blob);

    const imageHash = await uploadFileToIPFS(form);

    updateMutation.mutate({
      ...data,
      wallets: data.wallets,
      image: 'https://ipfs.mygateway.xyz/ipfs/' + imageHash,
    });
  };

  return (
    <Stack direction="column" gap={6} p={TOKENS.CONTAINER_PX}>
      <PocModalCreated
        open={open}
        handleClose={handleClose}
        credentialGroupId={credentialGroupId}
      />
      <Typography variant="h4">Create Role Credential</Typography>
      <Stack
        justifyContent="space-between"
        alignItems="flex-start"
        gap={6}
        direction={{ xs: 'column', md: 'row' }}
      >
        <Box width={{ xs: '100%', md: '25%' }} order={{ xs: '1', md: '1' }}>
          <Typography variant="h5">Details</Typography>
          {/* <Typography variant="caption">
            Use typography to present your design and content as clearly and
            efficiently as possible.
          </Typography> */}
        </Box>
        <FormProvider {...methods}>
          <Box width={{ xs: '100%', md: '25%' }} order={{ xs: '3', md: '2' }}>
            <Form
              onSubmit={onSubmit}
              validateWallets={validateWallets}
              isLoading={updateMutation.isLoading}
            />
          </Box>
          <AvatarUploadCard />
        </FormProvider>
      </Stack>
    </Stack>
  );
}

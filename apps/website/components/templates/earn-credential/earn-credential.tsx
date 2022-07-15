import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import normalizeUrl from 'normalize-url';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useMutation } from 'react-query';

import { TOKENS } from '@gateway/theme';

import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';

import { useAuth } from '../../../providers/auth';
import { gqlMethods } from '../../../services/api';
import { queryClient } from '../../../services/query-client';
import { SessionUser } from '../../../types/user';
import { NavBarAvatar } from '../../organisms/navbar/navbar-avatar';
import PocModalCompleted from '../../organisms/poc-modal-completed/poc-modal-completed';
import { AccomplishmentsForm } from './accomplishments-form';
import { CredentialDetailsForm } from './credential-details-form';

export function EarnCredentialTemplate({ credential, user }) {
  const { me } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const form = useForm({
    defaultValues: {
      role: '',
      commitmentLevel: '',
      startDate: new Date().toDateString(),
      endDate: new Date().toDateString(),
      isStillWorking: false,
      accomplishments: [
        {
          title: '',
          description: '',
          pow: [
            {
              pow_link: '',
              pow_description: '',
              pow_type: '',
            },
          ],
        },
      ],
    },
  });

  const {
    fields: accomplishments,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'accomplishments',
  });

  const updateMutation = useMutation(
    'completeCredential',
    me && gqlMethods(me).complete_credential,
    {
      onSuccess: async (data) => {
        await queryClient.cancelQueries('me');

        // Add optimistic todo to todos list
        queryClient.setQueryData<SessionUser>('me', (old) => ({
          ...old,
          claimable_credentials: old.claimable_credentials.filter(
            (obj) => obj.id !== data.update_credentials_by_pk.group_id
          ),
          credentials: [
            ...old.credentials.filter(
              (obj) => obj.id !== data.update_credentials_by_pk.id
            ),
            data.update_credentials_by_pk,
          ],
        }));

        handleOpen();
      },
    }
  );

  const complete = (data) => {
    const cred = {
      details: {
        role: data.role,
        commitmentLevel: data.commitmentLevel,
        startDate: new Date(data.startDate),
        endDate: data.isStillWorking ? null : new Date(data.endDate),
        isStillWorking: data.isStillWorking,
      },
      accomplishments: data.accomplishments.map((a) => ({
        ...a,
        pow: a.pow.map((p) => ({
          ...p,
          pow_link:
            p.pow_type === 'Link'
              ? normalizeUrl(p.pow_link, { defaultProtocol: 'https:' })
              : p.pow_link,
        })),
      })),
    };

    updateMutation.mutate(
      {
        group_id: credential.id,
        ...cred,
      },
      {
        onSuccess: () => handleOpen(),
      }
    );
  };

  return (
    <Stack gap={6} p={TOKENS.CONTAINER_PX}>
      <PocModalCompleted
        credentialId={credential.id}
        open={open}
        handleClose={handleClose}
      />
      <FormProvider {...form}>
        <Box>
          <Image
            src="/favicon-512.png"
            alt="gateway-logo"
            height={40}
            width={40}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            top: '40px',
            right: '50px',
            cursor: 'pointer',
          }}
        >
          <NavBarAvatar user={user} />
        </Box>
        <Typography
          variant="h5"
          sx={{ marginBottom: '40px', color: '#fff', fontSize: '34px' }}
          ml={{ xs: '0px', md: '92px' }}
        >
          Earn Proof of Credential
        </Typography>
        <form onSubmit={form.handleSubmit(complete)}>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={6}
          >
            {/* Credential details */}
            <Grid
              container
              direction={{ xs: 'column', md: 'row' }}
              sx={{ rowGap: '15px' }}
            >
              <Grid item xs={5}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ display: 'block', color: '#fff', fontSize: '24px' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Details
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: 'ffffffb5' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Basic Details of Credential
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Stack direction={{ xs: 'column', sm: 'row' }}>
                  {/* TODO: Responsiveness */}
                  <Image
                    src={credential.image}
                    height={389}
                    width={389}
                    alt="credential image"
                    style={{ borderRadius: '5px' }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      maxWidth: '500px',
                    }}
                    ml={{ xs: '0px', sm: '32px' }}
                    minHeight={{ xs: '180px', md: '300px' }}
                  >
                    <Typography variant="h4" sx={{ marginBottom: '10px' }}>
                      {credential.name}
                    </Typography>
                    <Chip label="Contributor" sx={{ marginBottom: '20px' }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '16px', color: '#FFFFFF' }}
                      >
                        {credential.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '0',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        sx={{ width: 'max-content' }}
                        variant="caption"
                      >
                        Created by
                      </Typography>
                      <Chip
                        avatar={
                          <Avatar
                            alt="chip avatar"
                            src={credential.issuer.pfp}
                          />
                        }
                        label={credential.issuer.name}
                        sx={{ marginLeft: '10px', width: 'max-content' }}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            <Divider light sx={{ width: '100%' }} />
            {/*
            <Grid
              container
              direction={{ xs: 'column', md: 'row' }}
              sx={{ rowGap: '15px' }}
            >
              <Grid item xs={5}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ display: 'block', color: '#fff', fontSize: '24px' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Your Details
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: 'ffffffb5' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Customize Your Credential
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <CredentialDetailsForm />
              </Grid>
            </Grid>
            <Divider light sx={{ width: '100%' }} />
            */}
            {/* Proudest Accomplishments form */}
            <Grid
              container
              direction={{ xs: 'column', md: 'row' }}
              sx={{ rowGap: '15px' }}
            >
              <Grid item xs={5}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ display: 'block', color: '#fff', fontSize: '24px' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Proudest Accomplishments
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: 'ffffffb5' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Tell the world about your greatest accomplishments and get it
                  verified!
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {accomplishments.map((accomplishment, index) => (
                  <AccomplishmentsForm
                    key={accomplishment.id}
                    accomplishmentId={index}
                    onDelete={() => remove(index)}
                  />
                ))}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={5}></Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: 'flex',
                  border: '1px solid grey',
                  padding: '25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  append({
                    title: '',
                    description: '',
                    pow: [
                      {
                        pow_link: '',
                        pow_description: '',
                        pow_type: '',
                      },
                    ],
                  })
                }
              >
                <AddBoxIcon sx={{ marginRight: '15px' }} />
                <Typography variant="h6" fontWeight="bold">
                  Add an Accomplishment
                </Typography>
              </Grid>
            </Grid>
          </Stack>
          <Stack
            sx={{
              mt: 5,
            }}
          >
            <Box alignSelf="flex-end" marginRight="100px">
              <Button
                variant="outlined"
                onClick={() => {
                  router.back();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{ marginLeft: '10px' }}
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  'Submit'
                )}
              </Button>
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </Stack>
  );
}

import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

import { Alert, Box, Snackbar, Stack, Typography } from '@mui/material';

import { ROUTES } from '../../../constants/routes';
import { useSnackbar } from '../../../hooks/use-snackbar';
import { useAuth } from '../../../providers/auth';
import { gqlMethods } from '../../../services/api';
import { Users } from '../../../services/graphql/types.generated';
import { queryClient } from '../../../services/query-client';
import { SessionUser } from '../../../types/user';
import { AvatarUploadCard } from './avatar-upload-card';
import { Form } from './form';
import { schema, NewUserSchema, defaultValues } from './schema';

export function NewUserTemplate() {
  const { t } = useTranslation('dashboard-new-user');

  const { me } = useAuth();

  const methods = useForm<NewUserSchema>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues(me),
  });

  const snackbar = useSnackbar();

  const router = useRouter();

  const email_address = methods.watch('email_address') as string;
  const username = methods.watch('username') as string;

  const { data: validateData, isLoading } = useQuery(
    ['users', email_address, username],
    () => {
      const or = [];

      !!email_address &&
        or.push({
          email_address: {
            _eq: email_address,
          },
        });

      !!username && or.push({ username: { _eq: username } });

      return me
        ? gqlMethods(me).Users({
            where: {
              _or: or,
            },
          })
        : null;
    },
    {
      enabled: !!email_address || !!username,
    }
  );

  const updateMutation = useMutation(
    'updateProfile',
    me && gqlMethods(me).update_user_profile,
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries('me');

        // Add optimistic todo to todos list
        queryClient.setQueryData<SessionUser>('me', (old) => ({
          ...old,
          ...variables,
          init: true,
        }));

        // Return context with the optimistic todo
        return { variables };
      },
      onSuccess() {
        snackbar.handleClick({ message: 'Profile updated!' });
        router.push(ROUTES.PROFILE);
      },
      onError(err: any) {
        snackbar.handleClick({ message: err.message, type: 'error' });
      },
    }
  );

  const imageUploadMutation = useMutation(
    'uploadImage',
    me && gqlMethods(me).upload_image
  );

  const validate = () => {
    if (!isLoading && validateData?.users?.length) {
      const emails = validateData.users.map((user) => user.email_address);
      const usernames = validateData.users.map((user) => user.username);
      console.log(emails, email_address);
      console.log(usernames, username);

      if (emails.includes(email_address)) {
        methods.setError('email_address', {
          message: t('form.fields.email.error'),
        });
        console.log(emails.includes(email_address));
      } else {
        methods.clearErrors('email_address');
      }

      if (usernames.includes(username)) {
        methods.setError('username', {
          message: t('form.fields.username.error'),
        });
        console.log(usernames.includes(username));
      } else {
        methods.clearErrors('username');
      }
    } else if (!isLoading && !validateData?.users?.length) {
      methods.clearErrors();
    }
  };

  const onSubmit = async (data: NewUserSchema) => {
    // 1. verify if we have an user with the same username and/or email
    validate();

    if (Object.keys(methods.formState.errors).length > 0) {
      snackbar.onOpen({ message: t('form.submit.withErrors') });
      return;
    }

    // 2. if not, update the user
    let upload = null;

    if (data.pfp !== me.pfp) {
      upload = await imageUploadMutation.mutateAsync({
        base64: data.pfp,
        name: 'pfp image',
      });
    }

    updateMutation.mutate(
      {
        id: me.id,
        ...data,
        ...(upload !== null && {
          pfp:
            'https://api.staging.mygateway.xyz/storage/file?id=' +
            upload?.upload_image?.id,
        }),
        about: '',
        discord_id: null,
      },
      {
        onSuccess: () => router.push('/profile'),
        onError: () => snackbar.onOpen({ message: 'Error updating profile' }),
      }
    );
  };

  useEffect(validate, [validateData, isLoading, email_address, username]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
        gap={2}
        sx={{
          width: '100%',
          display: { xs: 'block', md: 'flex' },
          alignSelf: 'center',
          maxWidth: (theme) => theme.breakpoints.values.lg,
        }}
      >
        <Stack
          direction="column"
          gap={7.5}
          sx={{ maxWidth: { xs: '100%', md: '50%', lg: '40%' }, width: '100%' }}
        >
          <Typography component="h1" variant="h4">
            {t('title')}
          </Typography>
          <Stack direction="column" gap={4}>
            <Box>
              <Typography component="h2" variant="h5">
                {t('form.title')}
              </Typography>
              <Typography component="p" variant="caption">
                {t('form.caption')}
              </Typography>
            </Box>
            <FormProvider {...methods}>
              <AvatarUploadCard
                showUserData={false}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
              />
              <Form
                onSubmit={onSubmit}
                isLoading={
                  updateMutation.isLoading || imageUploadMutation.isLoading
                }
              />
            </FormProvider>
          </Stack>
        </Stack>

        <FormProvider {...methods}>
          <AvatarUploadCard
            sx={{
              display: { xs: 'none', md: 'flex' },
              width: 400,
            }}
          />
        </FormProvider>
      </Stack>
      <Snackbar
        anchorOrigin={{
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal,
        }}
        open={snackbar.open}
        onClose={snackbar.handleClose}
        key={snackbar.vertical + snackbar.horizontal}
        autoHideDuration={2000}
      >
        <Alert
          onClose={snackbar.handleClose}
          severity={snackbar.type}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

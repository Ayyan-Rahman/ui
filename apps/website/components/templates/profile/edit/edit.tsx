import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

import { ROUTES } from '../../../../constants/routes';
import { useSnackbar } from '../../../../hooks/use-snackbar';
import { gqlMethods } from '../../../../services/api';
import { Users } from '../../../../services/graphql/types.generated';
import { Form } from './form';
import { schema, EditUserSchema, defaultValues } from './schema';

type Props = {
  user: Partial<Users>;
};

export function EditProfileTemplate({ user }: Props) {
  const methods = useForm<EditUserSchema>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues(user),
  });

  const router = useRouter();
  const session = useSession();
  const snackbar = useSnackbar();

  const { t } = useTranslation('user-profile');

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

      return session.data?.user
        ? gqlMethods(session.data.user).Users({
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
    session.data?.user && gqlMethods(session.data.user).update_user_profile,
    {
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
    session.data?.user && gqlMethods(session.data.user).upload_image
  );

  const validate = () => {
    if (!isLoading && validateData?.users?.length) {
      const emails = validateData.users
        .map((user) => user.email_address)
        .filter((email) => email !== user.email_address);
      const usernames = validateData.users
        .map((user) => user.username)
        .filter((username) => username !== user.username);

      if (emails.includes(email_address)) {
        methods.setError('email_address', {
          message: t('edit.email.error'),
        });
        console.log(emails.includes(email_address));
      } else {
        methods.clearErrors('email_address');
      }

      if (usernames.includes(username)) {
        methods.setError('username', {
          message: t('edit.username.error'),
        });
        console.log(usernames.includes(username));
      } else {
        methods.clearErrors('username');
      }
    } else if (!isLoading && !validateData?.users?.length) {
      methods.clearErrors();
    }
  };

  const onSubmit = async (data: EditUserSchema) => {
    validate();

    if (Object.keys(methods.formState.errors).length > 0) {
      return;
    }

    let upload = null;

    if (data.pfp !== user.pfp) {
      upload = await imageUploadMutation.mutateAsync({
        base64: data.pfp,
        name: 'pfp image',
      });
    }

    updateMutation.mutate(
      {
        id: user.id,
        ...data,
        ...(upload !== null && {
          pfp:
            'https://api.staging.mygateway.xyz/storage/file?id=' +
            upload?.upload_image?.file.id,
        }),
        discord_id: null,
      },
      {
        onSuccess: () => router.push('/profile'),
        onError: () => {
          validate();
        },
      }
    );
  };

  useEffect(validate, [validateData, isLoading, email_address, username]);

  return (
    <div>
      <FormProvider {...methods}>
        <Form
          onSubmit={onSubmit}
          userData={user}
          isLoading={updateMutation.isLoading}
        />
      </FormProvider>
      <div style={{ height: '20vh' }}></div>
    </div>
  );
}

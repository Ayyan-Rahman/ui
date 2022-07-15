import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { TOKENS } from '@gateway/theme';

import { DashboardTemplate } from '../components/templates/dashboard';
import { NewUserTemplate } from '../components/templates/new-user';
import { useAuth } from '../providers/auth';

export default function NewUser() {
  const { me } = useAuth();

  if (!me) return null;

  return (
    <DashboardTemplate
      showExplore={false}
      containerProps={{
        sx: {
          px: TOKENS.CONTAINER_PX,
          py: TOKENS.CONTAINER_PX,
          display: { xs: 'block', md: 'flex' },
          justifyContent: 'center',
        },
      }}
    >
      <NewUserTemplate />
    </DashboardTemplate>
  );
}

NewUser.auth = true;

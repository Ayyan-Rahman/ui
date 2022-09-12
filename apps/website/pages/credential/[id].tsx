import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';

import { Box } from '@mui/material';

import { Navbar } from '../../components/organisms/navbar';
import { DashboardTemplate } from '../../components/templates/dashboard';
import { GateViewTemplate } from '../../components/templates/gate-view';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../providers/auth';
import { gqlAnonMethods, gqlMethods } from '../../services/api';

export async function getServerSideProps({ req, params }) {
  const { id } = params;
  const queryClient = new QueryClient();

  const gate = await (req.cookies.token
    ? gqlMethods(req.cookies.token, req.cookies.user_id)
    : gqlAnonMethods
  ).gate({ id });

  if (!gate.gates_by_pk) {
    return {
      redirect: {
        destination: ROUTES.EXPLORE,
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery(['gate', id], () =>
    (req.cookies.token
      ? gqlMethods(req.cookies.token, req.cookies.user_id)
      : gqlAnonMethods
    ).gate({ id })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function GateProfilePage() {
  const router = useRouter();

  const id = router.query.id as string;

  const { gqlAuthMethods } = useAuth();

  const { data: gatesData } = useQuery(['gate', id], () =>
    gqlAuthMethods.gate({
      id,
    })
  );

  return (
    <DashboardTemplate
      containerProps={{
        sx: {
          overflow: '',
          pt: 2,
        },
      }}
    >
      <Box
        sx={{
          display: {
            xs: 'flex',
            md: 'none',
          },
        }}
      >
        <Navbar isInternalPage={true} />
      </Box>
      <GateViewTemplate gateProps={gatesData.gates_by_pk} />
    </DashboardTemplate>
  );
}

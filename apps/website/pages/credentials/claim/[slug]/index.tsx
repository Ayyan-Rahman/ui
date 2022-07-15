import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useQuery } from 'react-query';
import { useToggle } from 'react-use';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CredentialCard from '../../../../components/molecules/credential-card';
import { useAuth } from '../../../../providers/auth';
import { gqlAnonMethods } from '../../../../services/api';

export default function Claim() {
  const { onOpenLogin } = useAuth();

  const [credential, setCredential] = useState({
    name: '',
    description: '',
    image: '',
    categories: [],
  });

  const router = useRouter();
  const { slug } = router.query;

  useQuery(
    ['get-credential-group-by-slug'],
    () => {
      return gqlAnonMethods.get_credential_group_info_by_slug({
        slug: slug as string,
      });
    },
    {
      onSuccess: (data) =>
        setCredential({
          name: data.credential_group[0].name,
          description: data.credential_group[0].description,
          image: data.credential_group[0].image,
          categories: [data.credential_group[0].category],
        }),
    }
  );

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          p: 3,
        }}
      >
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
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h3"
              component="h3"
              fontSize={48}
              textAlign="center"
              sx={{
                mb: 2,
              }}
            >
              Claim your credential now
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mb: 6, textAlign: 'center' }}
              fontSize={16}
            >
              You&apos;re selected to claim your{' '}
              <span style={{ color: '#D083FF' }}>{credential.name}</span>{' '}
              credential.
            </Typography>
          </Box>
          <CredentialCard
            name={credential.name}
            description={credential.description}
            image={credential.image}
            categories={credential.categories}
            sx={{
              mb: 8,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button variant="contained" onClick={onOpenLogin}>
              Claim credential
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

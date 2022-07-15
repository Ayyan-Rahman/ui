import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { useQuery } from 'react-query';

import CloseIcon from '@mui/icons-material/Close';
import { Button, SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { useAuth } from '../../../providers/auth';
import { gqlMethods } from '../../../services/api';
import CredentialCard from '../../molecules/credential-card';

const style: SxProps = {
  bgcolor: 'background.paper',
  p: 3,
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
};

export default function PocModalCompleted({ credentialId, open, handleClose }) {
  const router = useRouter();
  const { me } = useAuth();

  const [credential, setCredential] = useState({
    name: '',
    description: '',
    image: '',
    categories: [],
  });

  const { refetch: getCredential } = useQuery(
    ['get-credential'],
    () => {
      if (!me) return;
      return gqlMethods(me).get_credential({
        credential_id: credentialId,
      });
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (open) {
      getCredential().then((result) =>
        setCredential({
          name: result.data.credentials_by_pk.name,
          description: result.data.credentials_by_pk.description,
          image: result.data.credentials_by_pk.image,
          categories: result.data.credentials_by_pk.categories,
        })
      );
    }
  }, [open, credentialId, getCredential]);

  return (
    <div>
      {/* TODO: Add dialog before making the modal appear */}
      {/* TODO: Modal doesn't scroll when window is not full screen */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          overflowY: 'auto',
        }}
      >
        <Box sx={style}>
          <Box>
            <Image
              src="/favicon-512.png"
              alt="gateway-logo"
              height={40}
              width={40}
            />
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
                router.push('/profile');
              }}
              sx={{
                position: 'absolute',
                right: 20,
                top: 25,
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '64px',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
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
                  mb: 3,
                }}
              >
                Submission completed with success
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mb: 6, textAlign: 'center' }}
                fontSize={16}
              >
                Your Proof of Credential submission{' '}
                <span style={{ color: '#D083FF' }}>{credential.name}</span> has
                submited with success, once confirmed you can mint it as NFT.
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
            <Button
              variant="contained"
              size="medium"
              sx={{ margin: '20px 0 0 20px' }}
              onClick={() => router.push('/profile')}
            >
              Check credential
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

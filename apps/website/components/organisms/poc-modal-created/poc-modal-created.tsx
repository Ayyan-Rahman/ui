import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { AiOutlineCopy } from 'react-icons/ai';
import { useQuery } from 'react-query';

import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, Snackbar, SxProps, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { useSnackbar } from '../../../hooks/use-snackbar';
import { useAuth } from '../../../providers/auth';
import { gqlMethods } from '../../../services/api';
import CredentialCard from '../../molecules/credential-card';

const style: SxProps = {
  bgcolor: 'background.paper',
  p: 3,
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  /*
  position: 'relative',
  zIndex: 2,
  '&:after': {
    content: '""',
    position: 'absolute',
    background:
      'radial-gradient(50% 50% at 50% 50%, rgba(154, 83, 255, 0.3) 0%, rgba(154, 83, 255, 0) 100%)',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  */
};

export default function PocModalCreated({
  credentialGroupId,
  open,
  handleClose,
}) {
  const [credential, setCredential] = useState({
    name: '',
    description: '',
    categories: [],
    slug: '',
    image: '',
  });
  const [url, setURL] = useState<string | null>(null);

  const { me } = useAuth();
  const router = useRouter();
  const snackbar = useSnackbar();

  const { refetch: getCredentialGroup } = useQuery(
    ['get-credential-group'],
    () => {
      if (!me) return;
      return gqlMethods(me).get_credential_group_info({
        credentialId: credentialGroupId,
      });
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    const callback = async () => {
      if (open) {
        const result = await getCredentialGroup();

        setCredential({
          name: result.data.credential_group_by_pk.name,
          description: result.data.credential_group_by_pk.description,
          categories: [result.data.credential_group_by_pk.category],
          slug: result.data.credential_group_by_pk.slug,
          image: result.data.credential_group_by_pk.image,
        });

        setURL(
          window?.location.protocol +
            '//' +
            window?.location.host +
            '/credentials/claim/' +
            result.data.credential_group_by_pk.slug
        );
      }
    };

    callback();
  }, [open, credentialGroupId, getCredentialGroup]);

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
                // handleClose();
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
                  mb: 3,
                }}
              >
                Proof of Credential created
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mb: 6, textAlign: 'center' }}
                fontSize={16}
              >
                You have created the{' '}
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
              {/*
              <fieldset
                style={{
                  display: 'flex',
                  border: '1px solid white',
                  borderRadius: '20px',
                }}
              >
                <legend>Share</legend>
                {'poc.mygateway.xyz/credentials/claim/' + credentialGroupId}
                <AiOutlineCopy
                  size={24}
                  style={{ marginLeft: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      'poc.mygateway.xyz/credentials/claim/' + credentialGroupId
                    );
                    snackbar.onOpen({
                      message: 'URL copied to clipboard!',
                    });
                  }}
                />
              </fieldset>
              */}
              <TextField
                label="SHARE"
                size="medium"
                value={url}
                inputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <AiOutlineCopy
                      size={24}
                      style={{ marginLeft: '10px', cursor: 'pointer' }}
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        snackbar.onOpen({
                          message: 'URL copied to clipboard!',
                        });
                      }}
                    />
                  ),
                }}
              />
              <Button
                variant="contained"
                size="medium"
                sx={{ margin: '10px 0 0 20px' }}
                onClick={() => router.push('/profile')}
              >
                Back to Profile
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal,
        }}
        open={snackbar.open}
        onClose={snackbar.handleClose}
        autoHideDuration={3000}
        key={snackbar.vertical + snackbar.horizontal}
      >
        <Alert
          onClose={snackbar.handleClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

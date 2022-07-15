import Image from 'next/image';
import { useRouter } from 'next/router';

import { PartialObjectDeep } from 'type-fest/source/partial-deep';

import CloseIcon from '@mui/icons-material/Close';
import { Button, SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { Credentials } from '../../../services/graphql/types.generated';
import CredentialCard from '../../molecules/credential-card';

/* It's a style object that is used to position the modal in the center of the screen. */
const style: SxProps = {
  bgcolor: 'background.paper',
  p: 3,
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
};

/* It's defining the props that the modal will take. */
interface ModalProps {
  open: boolean;
  credential: PartialObjectDeep<Credentials> | null;
  polygonURL: string;
  subsidised?: boolean;
  handleClose: () => void;
}

export default function PocModalMinted({
  open,
  credential,
  polygonURL,
  subsidised = false,
  handleClose,
}: ModalProps) {
  const router = useRouter();

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
              onClick={handleClose}
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
                Congrats your work is verified and on-chain.{' '}
              </Typography>
              {subsidised && (
                <Typography
                  id="modal-modal-description"
                  sx={{ mb: 6, textAlign: 'center' }}
                  fontSize={16}
                >
                  Your NFT has been minted at cost free by{' '}
                  <span style={{ color: '#D083FF' }}>Gateway</span> .
                </Typography>
              )}
            </Box>
            <CredentialCard
              name={credential?.name}
              description={credential?.description}
              image={credential?.image}
              categories={credential?.categories}
              sx={{
                mb: 8,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Button
                variant="contained"
                size="medium"
                sx={{
                  mx: 2,
                }}
                href={polygonURL}
                target="_blank"
              >
                Check Transaction
              </Button>
              <Button
                variant="contained"
                size="medium"
                sx={{
                  mx: 2,
                }}
                onClick={() => {
                  handleClose();
                  router.push('/profile');
                }}
              >
                Back to Profile
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

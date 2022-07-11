import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ReactNode, Suspense } from 'react';

import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GatewayIcon } from '@gateway/assets';
import { TOKENS } from '@gateway/theme';
import { MotionBox } from '@gateway/ui';

import TwitterIcon from '@mui/icons-material/Twitter';
import {
  Stack,
  Box,
  alpha,
  Typography,
  IconButton,
  Button,
} from '@mui/material';

const Title = dynamic(() => import('../components/atoms/landing-title'));

export function Index({ ...props }) {
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ flex: 1, width: '100%', minHeight: '100vh' }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={TOKENS.CONTAINER_PX}
        py={4}
      >
        <GatewayIcon sx={{ width: 50, height: 50 }} />
      </Stack>

      {/* Text/titles */}
      <MotionBox
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
        initial={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{
          ease: 'easeOut',
          duration: 0.75,
          opacity: { duration: 0.5 },
        }}
      >
        <Title>{`Gateway\nThe Web3 Professional Network`}</Title>
        <Typography
          marginBottom={5}
          variant="body1"
          color="rgba(255, 255, 255, 0.7)"
          fontSize="1rem"
        >
          Where talent take ownership of their work and professional growth.
        </Typography>
        <Button
          variant="contained"
          size="medium"
          href="https://blb4ytkp5bp.typeform.com/to/Wqn3x1Tu"
          target="_blank"
        >
          Enter the Gateway
        </Button>
      </MotionBox>

      {/* Image body */}
      <Box
        flex={1}
        sx={{
          background:
            'linear-gradient(180deg, #10041C 0%, rgba(16, 4, 28, 0) 37.95%), url(images/gateway-hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></Box>

      {/* Footer */}
      <Box
        sx={{
          background: '#10041C',
          width: '100%',
          padding: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">
            Gateway — Build your Web3 professional identity.
          </Typography>
          <Box>
            <IconButton
              sx={{
                bg: 'rgba(229, 229, 229, 0.16)',
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton>
              <FontAwesomeIcon icon={faDiscord} color="white" />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

export default Index;

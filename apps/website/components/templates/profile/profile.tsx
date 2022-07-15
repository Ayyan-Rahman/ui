import { useRouter } from 'next/router';
import { useState } from 'react';

import { BsFillPencilFill } from 'react-icons/bs';
import { FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useMutation } from 'react-query';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';

import {
  Button,
  Avatar,
  Paper,
  Box,
  Grid,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';

import { ROUTES } from '../../../constants/routes';
import { useBiconomyMint } from '../../../hooks/useMint';
import { usePinata } from '../../../hooks/usePinata';
import { useAuth } from '../../../providers/auth';
import { gqlMethods } from '../../../services/api';
import { Credentials, Users } from '../../../services/graphql/types.generated';
import CredentialCard from '../../molecules/credential-card';
import { NavBarAvatar } from '../../organisms/navbar/navbar-avatar';
import PocModalMinted from '../../organisms/poc-modal-minted/poc-modal-minted';

export function ProfileTemplate() {
  const [open, setOpen] = useState<boolean>(false);
  const [credential, setCredential] =
    useState<PartialObjectDeep<Credentials> | null>(null);
  const [polygonURL, setPolygonURL] = useState<string | null>(null);

  const { me } = useAuth();

  const handleOpen = (
    credential: PartialObjectDeep<Credentials>,
    polygonURL: string
  ) => {
    setCredential(credential);
    setPolygonURL(polygonURL);
    setOpen(true);
  };
  const handleClose = () => {
    setCredential(null);
    setOpen(false);
  };

  const router = useRouter();

  const mintCredentialMutation = useMutation(
    'mintCredential',
    me && gqlMethods(me).mint_credential
  );

  const { mint, loading, minted, snackbar } = useBiconomyMint(
    process.env.NEXT_PUBLIC_WEB3_NFT_ADDRESS
  );

  const { uploadMetadataToIPFS } = usePinata();

  /**
   * It mints a credential.
   * @param {Credentials} credential - the credential to be referenced
   */
  const mintNFT = async (credential: PartialObjectDeep<Credentials>) => {
    const obj = {
      name: credential.name,
      image: credential.image,
      description: credential.description,
      issuer_id: credential.issuer_id,
      target_id: me.id,
      details: credential.details,
    };

    console.log('Obj', obj);

    const ipfs = await uploadMetadataToIPFS(obj);

    console.log(`IPFS hash: ${ipfs}`);

    const { isMinted, polygonURL } = await mint(`ipfs://${ipfs}`);

    isMinted &&
      mintCredentialMutation.mutate(
        { id: credential.id },
        {
          onSuccess: () => {
            handleOpen(credential, polygonURL);
          },
        }
      );
  };

  const updateMutation = useMutation(
    'claimCredential',
    me && gqlMethods(me).claim_credential
  );

  const claimAndGoToEarn = (credentialGroupId) => {
    updateMutation.mutate(
      {
        group_id: credentialGroupId,
      },
      {
        onSuccess: (result) => {
          const credential_id = result['claim_credential'].credential.id;
          router.push(ROUTES.CREDENTIALS_EARN + credential_id);
        },
      }
    );
  };

  const goToEarn = (credentialId) =>
    router.push(ROUTES.CREDENTIALS_EARN + credentialId);

  return (
    <>
      <PocModalMinted
        open={open}
        handleClose={handleClose}
        credential={credential}
        polygonURL={polygonURL}
        subsidised
      />
      <Paper
        sx={{
          height: '280px',
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 44.13%), linear-gradient(72.04deg, #98CEFF 6.5%, #8965D2 47.65%)',
          backdropFilter: 'blur(40px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            top: '40px',
            right: '50px',
            cursor: 'pointer',
          }}
        >
          <NavBarAvatar user={me} />
        </Box>
        <Avatar
          src={me?.pfp.startsWith('http') ? me?.pfp : '/images/logo.png'}
          sx={{
            width: 150,
            height: 150,
            top: '200px',
            left: '50px',
            border: '3px solid black',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Paper>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
          alignItems: 'center',
          marginTop: 3.75,
          marginRight: 6.75,
        }}
        gap={2}
      >
        {/* Comment Social Icons for now */}

        {/* {tmpUser.email_address && (
          <Avatar
            onClick={() => window.open('mailto:' + tmpUser.email_address)}
            style={{ cursor: 'pointer' }}
          >
            <MdEmail size={28} />
          </Avatar>
        )} */}
        {/* {socials.map((icon, index) => {
          const Icon = icon.icon;
          return (
            icon.value && (
              <Avatar
                key={index}
                onClick={() => window.open(icon.value, '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <Icon size={28} />
              </Avatar>
            )
          );
        })} */}
        {/* TODO: Contains user's address, only visible if it's our profile */}
        {/* <Button variant="contained" color="secondary">
          0x0
          <FaCopy style={{ marginLeft: 2 }} />
        </Button> */}
      </Stack>
      <main>
        <Box sx={{ margin: '30px 65px', marginTop: '32px' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <h1
              style={{
                marginBottom: '0',
                marginRight: '15px',
                fontSize: '34px',
              }}
            >
              {me.name}
            </h1>
            <Avatar
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/profile/edit')}
            >
              <BsFillPencilFill />
            </Avatar>
          </Box>
          {/* <p style={{ margin: '0 auto' }}>{tmpUser.bio}</p> */}
          {me.username && (
            <p style={{ marginTop: '0', fontSize: 'small' }}>@{me.username}</p>
          )}
        </Box>
        <Divider light sx={{ width: '100%' }} />
        <Grid container>
          <Grid item className="left" xs={8} sx={{ padding: '0 65px' }}>
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '20px 0', marginTop: '51px' }}>About</h2>
              <div className="about">{me.about}</div>
              {!me.about && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: '20px' }}
                  onClick={() => router.push('/profile/edit')}
                >
                  Add now
                </Button>
              )}
            </section>
            <Divider light sx={{ width: '100%' }} />
            <section style={{ paddingBottom: '150px' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <h2
                  style={{
                    marginTop: '51px',
                    marginRight: '15px',
                    fontSize: '20px',
                  }}
                >
                  Proof of Credentials
                </h2>
                {/*isAdmin && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => router.push('/credentials/new')}
                  >
                    Create a Credential
                  </Button>
                )*/}
              </Box>
              {/* Credentials earned */}
              <Grid container rowGap={2}>
                <Box sx={{ width: '100%' }}>
                  {(!!me.claimable_credentials.length ||
                    !!me.credentials.length) && <h4>My Credentials</h4>}
                </Box>
                {me.claimable_credentials.map((credential) => (
                  <Grid item xs={4} key={credential.id}>
                    <CredentialCard
                      name={credential.name}
                      description={credential.description}
                      image={credential.image}
                      categories={[credential.category]}
                      view={() =>
                        router.push(ROUTES.CREDENTIALS_VIEW + credential.id)
                      }
                      smaller
                      claim={() => claimAndGoToEarn(credential.id)}
                      claimable
                    />
                  </Grid>
                ))}
                {me.credentials.map((credential) => (
                  <Grid item xs={4} key={credential.id}>
                    <CredentialCard
                      name={credential.name}
                      description={credential.description}
                      image={credential.image}
                      categories={credential.categories}
                      smaller
                      view={() =>
                        router.push(ROUTES.CREDENTIALS_VIEW + credential.id)
                      }
                      to_complete={credential.status === 'to_complete'}
                      complete={() => goToEarn(credential.id)}
                      pending={credential.status === 'pending'}
                      mintable={credential.status === 'to_mint'}
                      mint={() => mintNFT(credential)}
                      isNFT={credential.status === 'minted'}
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Credentials created */}
              <Grid container rowGap={2}>
                <Box sx={{ width: '100%' }}>
                  {!!me.credential_groups.length && (
                    <h4>Credentials Created</h4>
                  )}
                </Box>
                {me.credential_groups.map((credential) => (
                  <Grid item xs={4} key={credential.id}>
                    <CredentialCard
                      name={credential.name}
                      description={credential.description}
                      image={credential.image}
                      categories={[credential.category]}
                      smaller
                      view={() =>
                        router.push(ROUTES.CREDENTIALS_VIEW + credential.id)
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </section>
          </Grid>
          {/*
          <Grid item className="right" xs={4} sx={{ padding: '0 65px' }}>
            <section>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  marginTop: '51px',
                }}
              >
                <h2 style={{ marginRight: '15px', fontSize: '20px' }}>
                  Skills
                </h2>
                <Avatar
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push('/profile/edit/skills')}
                >
                  <BsFillPencilFill />
                </Avatar>
              </Box>
              <div>
                {user.skills?.map((skill, index) => {
                  return (
                    <Button
                      key={index}
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ margin: '5px' }}
                    >
                      {skill}
                    </Button>
                  );
                })}
              </div>
            </section>
            <section>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  marginTop: '27px',
                }}
              >
                <h2 style={{ marginRight: '15px', fontSize: '20px' }}>
                  Knowledges
                </h2>
                <Avatar
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push('/profile/edit/knowledge')}
                >
                  <BsFillPencilFill />
                </Avatar>
              </Box>
              <div>
                {user.knowledges?.map((skill, index) => {
                  return (
                    <Button
                      key={index}
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ margin: '5px' }}
                    >
                      {skill}
                    </Button>
                  );
                })}
              </div>
            </section>
            <section>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  marginTop: '27px',
                }}
              >
                <h2 style={{ marginRight: '15px', fontSize: '20px' }}>
                  Attitudes
                </h2>
                <Avatar
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push('/profile/edit/attitudes')}
                >
                  <BsFillPencilFill />
                </Avatar>
              </Box>
              <div>
                {user.attitudes?.map((skill, index) => {
                  return (
                    <Button
                      key={index}
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ margin: '5px' }}
                    >
                      {skill}
                    </Button>
                  );
                })}
              </div>
            </section>
          </Grid>
          */}
        </Grid>

        {/* To show messages from useMint */}
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
            severity={snackbar.type}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </>
  );
}

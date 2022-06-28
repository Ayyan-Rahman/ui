import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { BsFillPencilFill } from 'react-icons/bs';
import { FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useMutation } from 'react-query';

import {
  Button,
  Avatar,
  Paper,
  Box,
  Grid,
  Stack,
  Divider,
} from '@mui/material';

import { ROUTES } from '../../../constants/routes';
import { useBiconomyMint } from '../../../hooks/useMint';
import { usePinata } from '../../../hooks/usePinata';
import { gqlMethods } from '../../../services/api';
import { Credentials, Users } from '../../../services/graphql/types.generated';
import CredentialCard from '../../molecules/credential-card';
import { NavBarAvatar } from '../../organisms/navbar/navbar-avatar';
import PocModalMinted from '../../organisms/poc-modal-minted/poc-modal-minted';

type Props = {
  user: Partial<Users>;
  isAdmin: boolean;
  claimableCredentials: Array<Partial<Credentials>>;
};

export function ProfileTemplate({
  user,
  isAdmin,
  claimableCredentials,
}: Props) {
  const [open, setOpen] = useState(false);
  const [credential, setCredential] = useState<Credentials | null>(null);

  const handleOpen = (credential: Credentials) => {
    setCredential(credential);
    setOpen(true);
  };
  const handleClose = () => {
    setCredential(null);
    setOpen(false);
  };

  const session = useSession();
  const router = useRouter();

  const mintCredentialMutation = useMutation(
    'mintCredential',
    session.data?.user && gqlMethods(session.data.user).mint_credential
  );

  const { mint, loading, minted } = useBiconomyMint(
    process.env.NEXT_PUBLIC_WEB3_NFT_ADDRESS
  );

  const { uploadMetadataToIPFS } = usePinata();

  /**
   * It mints a credential.
   * @param {Credentials} credential - the credential to be referenced
   */
  const mintNFT = async (credential: Credentials) => {
    const obj = {
      name: credential.name,
      image: credential.image,
      description: credential.description,
      issuer_id: credential.issuer_id,
      target_id: user.id,
      details: credential.details,
    };

    console.log('Obj', obj);

    const ipfs = await uploadMetadataToIPFS(obj);

    console.log(`IPFS hash: ${ipfs}`);

    const isMinted = await mint(`ipfs://${ipfs}`);

    isMinted &&
      mintCredentialMutation.mutate(
        { id: credential.id },
        {
          onSuccess: () => {
            handleOpen(credential);
          },
        }
      );
  };

  const updateMutation = useMutation(
    'claimCredential',
    session.data?.user && gqlMethods(session.data.user).claim_credential
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

  const tmpUser = {
    pfp: 'https://i.ibb.co/bzzgBfT/random-nft.png',
  };

  return (
    <>
      <PocModalMinted
        open={open}
        handleClose={handleClose}
        credential={credential}
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
          <NavBarAvatar />
        </Box>
        <Avatar
          src={tmpUser.pfp}
          sx={{
            width: 150,
            height: 150,
            top: '200px',
            left: '50px',
            border: '3px solid black',
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
              {user.name}
            </h1>
            <Avatar
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/profile/edit')}
            >
              <BsFillPencilFill />
            </Avatar>
          </Box>
          {/* <p style={{ margin: '0 auto' }}>{tmpUser.bio}</p> */}
          {user.username && (
            <p style={{ marginTop: '0', fontSize: 'small' }}>
              @{user.username}
            </p>
          )}
        </Box>
        <Divider light sx={{ width: '100%' }} />
        <Grid container>
          <Grid item className="left" xs={8} sx={{ padding: '0 65px' }}>
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '20px 0', marginTop: '51px' }}>About</h2>
              <div className="about">{user.about}</div>
              {!user.about && (
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
                {isAdmin && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => router.push('/credentials/new')}
                  >
                    Create a Proof of Credential
                  </Button>
                )}
              </Box>
              <Grid container rowGap={2}>
                {/* <Grid item xs={4}>
                  <CredentialCard
                    smaller
                    uncomplete
                    earn={() => router.push('/credentials/earn')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CredentialCard smaller pending />
                </Grid>
                <Grid item xs={4}>
                  <CredentialCard smaller mintable mint={mintNFT} />
                </Grid>
                <Grid item xs={4}>
                  <CredentialCard smaller isNFT />
                </Grid> */}
                {claimableCredentials.map((credential) => (
                  <Grid item xs={4} key={credential.id}>
                    <CredentialCard
                      name={credential.name}
                      description={credential.description}
                      smaller
                      claim={() => claimAndGoToEarn(credential.id)}
                      claimable
                    />
                  </Grid>
                ))}
                {user.credentials.map((credential) => (
                  <Grid item xs={4} key={credential.id}>
                    <CredentialCard
                      name={credential.name}
                      description={credential.description}
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
            </section>
          </Grid>
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
        </Grid>
      </main>
    </>
  );
}

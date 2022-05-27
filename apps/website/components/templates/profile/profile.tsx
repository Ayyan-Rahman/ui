import { FaDiscord, FaTwitter, FaGithub, FaCopy } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiArrowDownSFill } from 'react-icons/ri';

import {
  Button,
  Avatar,
  Paper,
  Box,
  Grid,
  Stack,
  Divider,
} from '@mui/material';

const data = {
  skills: [
    'UX Design',
    'UI Design',
    'Branding',
    'Product Strategy',
    'Product Design',
  ],
  knowledges: ['Web3', 'Blockchain', 'Cryptocurrency', 'Business Development'],
  attitudes: [
    'Pro-Active',
    'Business Driven',
    'Collaborative',
    'Leadership',
    'Innovative',
  ],
};
const socialIcons = [MdEmail, FaGithub, FaTwitter, FaDiscord];
const randomNftUrl = 'https://i.ibb.co/bzzgBfT/random-nft.png';

export function ProfileTemplate() {
  return (
    <>
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
          <Avatar
            src={randomNftUrl}
            sx={{
              width: 30,
              height: 30,
            }}
          />
          <RiArrowDownSFill style={{ position: 'relative', top: '5px' }} />
        </Box>
        <Avatar
          src={randomNftUrl}
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
        {socialIcons.map((Icon, index) => {
          return (
            <Avatar key={index}>
              <Icon style={{ cursor: 'pointer' }} size={28} />
            </Avatar>
          );
        })}
        <Button variant="contained" color="secondary">
          nossirah.eth
          <FaCopy style={{ marginLeft: 2 }} />
        </Button>
      </Stack>
      <main>
        <Box sx={{ margin: '30px 65px' }}>
          <h1 style={{ marginBottom: '0' }}>Shriram Chandra</h1>
          <p style={{ margin: '0 auto' }}>Master Ops at Gateway</p>
          <p style={{ marginTop: '0', fontSize: 'small' }}>@shriram</p>
          <p>
            <b>120</b> Following &#183; <b>118</b> Followers
          </p>
        </Box>
        <Divider light sx={{ width: '100%' }} />
        <Grid container>
          <Grid item className="left" xs={8} sx={{ padding: '0 65px' }}>
            <section>
              <h2 style={{ margin: '20px 0' }}>About</h2>
              <p>
                I am a Design Director focused on User Experience, User
                Interfaces, Experience Design, Creative and Digital Strategy.
                I&#39;ve been lucky enough to work and solve problems for the
                most prominent brands in the world.
              </p>
              <p>
                I approach problems from the top-down, identifying the real
                issue before forming my solution. I am always challenging the
                limits of physical, social, and digital mediums through
                storytelling and functions. Each of my projects is crafted with
                precise execution and carefully considered decision making.
              </p>
            </section>
            <Divider light sx={{ width: '100%' }} />
            <section style={{ paddingBottom: '150px' }}>
              <h2 style={{ margin: '30px 0' }}>Proof of Credentials</h2>
              <Button variant="contained" size="small">
                Create a Proof of Credential
              </Button>
            </section>
          </Grid>
          <Grid item className="right" xs={4} sx={{ padding: '0 65px' }}>
            <section>
              <h2>Skills</h2>
              <div>
                {data.skills.map((skill, index) => {
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
              <h2>Knowledges</h2>
              <div>
                {data.knowledges.map((skill, index) => {
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
              <h2>Attitudes</h2>
              <div>
                {data.attitudes.map((skill, index) => {
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
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { FaDiscord } from 'react-icons/fa';
import { useQuery } from 'react-query';

import { TOKENS } from '@gateway/theme';
import { useMenu } from '@gateway/ui';

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import IosShareIcon from '@mui/icons-material/IosShare';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import RedditIcon from '@mui/icons-material/Reddit';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
  Divider,
  Button,
  AvatarGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { ROUTES } from '../../../constants/routes';
import { gqlAnonMethods, gqlMethods } from '../../../services/api';
import HoldersModal from '../../organisms/holders-modal/holders-modal';
import normalizeUrl from 'normalize-url';
import { LinkOutlined } from '@mui/icons-material';
import { CredentialCategories } from '../../molecules/credential-card';

const DetailsFieldset = ({ children }) => (
  <fieldset
    style={{
      display: 'flex',
      flexDirection: 'column',
      border: 'none',
      marginBottom: '15px',
    }}
  >
    {children}
  </fieldset>
);

export function ViewCredentialTemplate({ credential }) {
  const { element, isOpen, onClose, onOpen } = useMenu();
  const session = useSession();
  const router = useRouter();

  const [holders, setHolders] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const showHolders = () => setOpen(true);
  const hideHolders = () => setOpen(false);

  const isIssuer = credential.issuer.id === session.data?.user.id;
  const details = credential.details;
  const accomplishments = credential.pow;
  const credentialImgUrl = credential.image;

  useQuery(
    [credential.id, 'get-holders'],
    () => {
      return gqlAnonMethods.get_credential_by_groupid({
        group_id: credential.group_id,
      });
    },
    {
      onSuccess(data) {
        setHolders(data.credentials);
      },
    }
  );

  return (
    <Stack gap={6} p={TOKENS.CONTAINER_PX}>
      <HoldersModal open={open} handleClose={hideHolders} holders={holders} />
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
          alignItems: 'center',
          position: 'absolute',
          top: '40px',
          right: '50px',
          cursor: 'pointer',
        }}
      >
        {/*
        <Tooltip title="SHARE ON">
          <IconButton onClick={onOpen}>
            <Badge
              overlap="circular"
              sx={{
                [`.${badgeClasses.badge}`]: {
                  borderRadius: '100%',
                  backgroundColor: (theme) => theme.palette.common.white,
                  color: (theme) => theme.palette.secondary.contrastText,
                  width: (theme) => theme.spacing(2.5),
                  height: (theme) => theme.spacing(2.5),
                  top: 'unset',
                  bottom: (theme) => `calc(50% - ${theme.spacing(2.5)})`,
                  right: '-10%',
                  boxShadow: (theme) => theme.shadows[1],
                },
              }}
            >
              <IosShareIcon style={{ marginRight: '15px', color: '#ffffff' }} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: (theme) => theme.spacing(7) }}
          id="menu-appbar"
          anchorEl={element}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isOpen}
          onClose={onClose}
        >
          <Typography sx={{ margin: '2px 15px 2px 10px', fontSize: '12px' }}>
            SHARE ON
          </Typography>
          <MenuItem
            key="email"
            onClick={(e) => {
              const mailBody = 'body';
              window.location.href =
                'mailto:yourmail@domain.com?subject=hii&body=' + mailBody;
              e.preventDefault();
            }}
          >
            <Badge
              overlap="circular"
              sx={{ display: 'block', margin: '5px 32px 5px 0px' }}
            >
              <Avatar>
                <EmailIcon></EmailIcon>
              </Avatar>
            </Badge>
            <Typography textAlign="center">Email</Typography>
          </MenuItem>
          <MenuItem key="reddit">
            <Badge
              overlap="circular"
              sx={{ display: 'block', margin: '5px 32px 5px 0px' }}
            >
              <Avatar>
                <RedditIcon></RedditIcon>
              </Avatar>
            </Badge>
            <Typography textAlign="center">Reddit</Typography>
          </MenuItem>
          <MenuItem key="twitter">
            <Badge
              overlap="circular"
              sx={{ display: 'block', margin: '5px 32px 5px 0px' }}
            >
              <Avatar>
                <TwitterIcon></TwitterIcon>
              </Avatar>
            </Badge>
            <Typography textAlign="center">Twitter</Typography>
          </MenuItem>
          <MenuItem sx={{ paddingRight: '85px' }} key="discord">
            <Badge
              overlap="circular"
              sx={{ display: 'block', margin: '5px 32px 5px 0px' }}
            >
              <Avatar>
                <FaDiscord />
              </Avatar>
            </Badge>
            <Typography textAlign="center">Discord</Typography>
          </MenuItem>
        </Menu>*/}

        {session.data?.user && (
          <Button
            variant="outlined"
            onClick={() => router.push(ROUTES.PROFILE)}
          >
            Check profile
          </Button>
        )}
      </Box>
      <Typography
        variant="h5"
        sx={{
          display: 'block',
          color: '#fff',
          fontSize: '34px',
          marginBottom: '20px',
        }}
        ml={{ xs: '0px', md: '92px' }}
      >
        {credential?.target?.name} <br /> Proof of Credential
      </Typography>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={6}
      >
        {/* Credential details */}
        <Grid
          container
          direction={{ xs: 'column', md: 'row' }}
          sx={{ rowGap: '15px' }}
        >
          <Grid item xs={5}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ display: 'block', color: '#fff', fontSize: '24px' }}
              ml={{ xs: '0px', md: '92px' }}
            >
              Details
            </Typography>
            <Typography
              variant="caption"
              color="rgba(255, 255, 255, 0.7)"
              sx={{ display: 'block', fontSize: '14px' }}
              ml={{ xs: '0px', md: '92px' }}
            >
              Basic Details of Credential
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Stack direction={{ xs: 'column', sm: 'row' }}>
              {/* TODO: Responsiveness */}
              <Image
                src={credentialImgUrl}
                height={389}
                width={389}
                alt="credential image"
                style={{ borderRadius: '5px', objectFit: 'cover', objectPosition: 'center' }}
              />
              <Box
                sx={{
                  position: 'relative',
                  minHeight: '300px',
                  marginTop: '10px',
                }}
                ml={{ xs: '0px', sm: '32px' }}
                minHeight={{ xs: '180px', md: '300px' }}
              >
                <Typography
                  variant="h6"
                  sx={{ marginBottom: '10px', fontSize: '34px' }}
                >
                  {credential.name}
                </Typography>
                {credential.categories.map((category) => (<Chip label={CredentialCategories[category]} sx={{ marginBottom: '20px' }} />))}
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '16px' }}>
                    {credential.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'baseline',
                  }}
                >
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    sx={{ marginBottom: '10px' }}
                  >
                    {holders?.length !== 0 && (
                      <Typography
                        sx={{
                          width: 'max-content',
                          fontSize: '14px',
                          marginRight: '30px',
                        }}
                        variant="caption"
                      >
                        Holders
                      </Typography>
                    )}
                    <AvatarGroup
                      spacing={15}
                      max={4}
                      onClick={() => showHolders()}
                      sx={{ cursor: 'pointer' }}
                    >
                      {holders?.map(({ target }, index) => {
                        const { name, username, pfp } = target;
                        const alt = `${name} ${username}`;
                        return <Avatar key={index} alt={alt} src={pfp} />;
                      })}
                    </AvatarGroup>
                  </Stack>
                  <Stack direction={'row'}>
                    <Typography
                      sx={{ width: 'max-content', fontSize: '14px' }}
                      variant="caption"
                    >
                      Created by
                    </Typography>
                    <Chip
                      avatar={
                        <Avatar alt="chip avatar" src={credential.issuer.pfp} />
                      }
                      label={credential.issuer.name}
                      sx={{ marginLeft: '10px' }}
                    />
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        {(credential.status === 'pending' || 'to_mint' || 'minted') &&
          details && <Divider light sx={{ width: '100%' }} />}
        {(credential.status === 'pending' || 'to_mint' || 'minted') && details && (
          // Your details
          <Grid
            container
            direction={{ xs: 'column', md: 'row' }}
            sx={{ rowGap: '15px' }}
          >
            <Grid item md={5}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ display: 'block', color: '#fff', fontSize: '24px' }}
                ml={{ xs: '0px', md: '92px' }}
              >
                Your Details
              </Typography>
              <Typography
                variant="caption"
                color="rgba(255, 255, 255, 0.7)"
                sx={{ display: 'block', fontSize: '14px' }}
                ml={{ xs: '0px', md: '92px' }}
              >
                Customize Your Credential
              </Typography>
            </Grid>
            <Grid item md={4}>
              {details && (
                <Box>
                  <DetailsFieldset>
                    <Typography
                      variant="caption"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      Role
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {details.role}
                    </Typography>
                  </DetailsFieldset>
                  <DetailsFieldset>
                    <Typography
                      variant="caption"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      Start Date
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {new Date(details.startDate).toLocaleDateString()}
                    </Typography>
                  </DetailsFieldset>
                  <DetailsFieldset>
                    <Typography
                      variant="caption"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      End Date
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {details.isStillWorking
                        ? 'Present'
                        : new Date(details.endDate).toLocaleDateString()}
                    </Typography>
                  </DetailsFieldset>
                  <DetailsFieldset>
                    <Typography
                      variant="caption"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      Level of Commitment
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {details.commitmentLevel[0].toUpperCase() +
                        details.commitmentLevel.slice(1)}
                    </Typography>
                  </DetailsFieldset>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
        {(credential.status === 'pending' || 'to_mint' || 'minted') &&
          accomplishments && <Divider light sx={{ width: '100%' }} />}
        {(credential.status === 'pending' || 'to_mint' || 'minted') &&
          accomplishments && (
            <Grid
              container
              direction={{ xs: 'column', md: 'row' }}
              sx={{ rowGap: 4 }}
            >
              {/* Proudest Accomplishments */}
              <Grid item md={5}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ display: 'block', color: '#fff', fontSize: '24px' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Proudest Accomplishments
                </Typography>
                <Typography
                  variant="caption"
                  color="rgba(255, 255, 255, 0.7)"
                  sx={{ display: 'block', fontSize: '14px' }}
                  ml={{ xs: '0px', md: '92px' }}
                >
                  Tell the world about your greatest accomplishments and get it
                  verified!
                </Typography>
              </Grid>
              {/* <Grid item xs={4} key={index}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <LooksOneIcon />
                      {accomplishment.title}
                    </Typography>
                    <Typography variant="caption">
                      {accomplishment.accomplishmentDescription}
                    </Typography>
                    <Box sx={{ marginTop: '30px' }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        style={{ marginBottom: '20px', fontSize: '16px' }}
                      >
                        Proof of Work
                      </Typography>
                      <Box style={{ marginLeft: '0px', marginRight: '15px' }}>
                        <Typography
                          variant="subtitle2"
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <ArticleIcon style={{ marginRight: '20px' }} />
                          {accomplishment.type}
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{ marginLeft: '44px' }}
                        >
                          {accomplishment.description}
                        </Typography>
                        <br />
                        <Typography
                          variant="caption"
                          style={{ marginLeft: '44px' }}
                        >
                          {accomplishment.link}
                        </Typography>
                      </Box>
                    </Box>
                    </Grid> */}
              <Grid item md={7}>
                {accomplishments &&
                  accomplishments.map((accomplishment, index) => (
                    <Stack flexDirection="row" key={'accomplishment-' + index} sx={{
                      marginBottom: 6
                    }}>
                      <Avatar
                        sx={{
                          marginRight: 4,
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box flex={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 3,
                            wordBreak: 'break-word',
                          }}
                        >
                          {accomplishment.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="rgba(255, 255, 255, 0.7)"
                          sx={{
                            wordBreak: 'break-word',
                          }}
                        >
                          {accomplishment.description}
                        </Typography>
                        {credential.pow[index] && (
                          <Box sx={{ marginTop: 4 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Proof of Work
                            </Typography>
                            <List>
                              {credential.pow[index].pow.map((pow, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <LinkOutlined
                                      sx={{
                                        color: 'rgba(255, 255, 255, 0.56)',
                                      }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={pow.pow_description}
                                    secondary={
                                      <Link
                                        href={normalizeUrl(pow.pow_link, { defaultProtocol: "https:" })}
                                        variant="body1"
                                        target="_blank"
                                      >
                                        {normalizeUrl(pow.pow_link, { defaultProtocol: "https:" })}
                                      </Link>
                                    }
                                    sx={{
                                      wordBreak: 'break-word',
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  ))}
              </Grid>
            </Grid>
          )}
        {(session.data?.user && (credential.status === 'to_complete' ||
          credential.status === undefined) &&
          !isIssuer) && (
            <Button
              variant="contained"
              sx={{ margin: 'auto' }}
              onClick={() =>
                router.push(ROUTES.CREDENTIALS_EARN + credential.id)
              }
            >
              Complete Credential
            </Button>
          )}
      </Stack>
      {/*<Box alignSelf="flex-end" marginRight="100px">
        {(credential.status === 'pending' || 'to_mint' || 'minted') && (
          <ArrowCircleUpIcon
            fontSize="large"
            onClick={() => window.scrollTo(0, 0)}
            style={{ cursor: 'pointer' }}
          />
        )}
        </Box>*/}
    </Stack>
  );
}

import { useState } from 'react';

import { Button, CardActions, Chip, SxProps } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface CredentialCardProps {
  name: string;
  description: string;
  categories?: string[];
  image?: string;
  smaller?: boolean;
  claimable?: boolean;
  to_complete?: boolean;
  pending?: boolean;
  mintable?: boolean;
  isNFT?: boolean;
  view?: () => void;
  claim?: () => Promise<any>;
  complete?: () => Promise<any>;
  mint?: () => Promise<any>;
  sx?: SxProps;
}

export const CredentialCategories = {
  operations: 'Operations',
  marketing: 'Marketing',
  design: 'Design',
  developer: 'Developer',
  engineering: 'Engineering',
  governance: 'Governance',
  education: 'Education',
  community: 'Community',
  product: 'Product',
  'business-development': 'Business Development',
  'talent-hr': 'Talent/HR',
  treasury: 'Treasury',
  strategy: 'Strategy',
  partnerships: 'Partnerships',
  legal: 'Legal',
};

export default function CredentialCard({
  name,
  description,
  categories = [],
  image = 'https://i.postimg.cc/6QJDW2r1/olympus-credential-picture.png',
  smaller,
  claimable,
  to_complete,
  pending,
  mintable,
  isNFT,
  view,
  claim,
  complete,
  mint,
  sx,
}: CredentialCardProps) {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <Card
      sx={{ maxWidth: smaller ? '250px' : '345px', ...sx }}
      {...((pending || mintable || isNFT) && { title: 'View details' })}
    >
      <CardMedia
        component="img"
        image={image}
        alt="credential image"
        sx={{ cursor: 'pointer' }}
        onClick={view}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          fontSize={20}
          sx={{ cursor: 'pointer' }}
          onClick={view}
        >
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
          padding: '0 10px',
        }}
      >
        {categories.map((category, idx) => (
          <Chip key={`cat-${idx}`} label={CredentialCategories[category]} />
        ))}
        {pending && (
          <Chip
            label="Pending Approval"
            variant="outlined"
            sx={{ color: 'red', borderColor: 'red' }}
          />
        )}
        {isNFT && <Chip label="NFT" />}
      </CardContent>
      <CardActions>
        {claimable && (
          <Button
            variant="contained"
            sx={{ width: '100%' }}
            disabled={isLoading}
            onClick={() => {
              setLoading(true);
              claim().then(() => setLoading(false));
            }}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              'Complete Credential'
            )}
          </Button>
        )}
        {to_complete && (
          <Button
            variant="contained"
            sx={{ width: '100%' }}
            disabled={isLoading}
            onClick={() => {
              setLoading(true);
              complete().then(() => setLoading(false));
            }}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              'Complete Credential'
            )}
          </Button>
        )}
        {mintable && (
          <Button
            startIcon={<i className="fas fa-coins" />}
            variant="contained"
            sx={{ width: '100%' }}
            disabled={isLoading}
            onClick={() => {
              setLoading(true);
              mint().then(() => setLoading(false));
            }}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              'Mint NFT'
            )}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

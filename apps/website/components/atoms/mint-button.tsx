import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { PartialDeep } from 'type-fest';

import { Button, Stack } from '@mui/material';

import { TokenFilled } from '../../components/molecules/mint-card/assets/token-filled';
import { useBiconomyMint } from '../../hooks/use-mint';
import { Credentials } from '../../services/graphql/types.generated';
import { LoadingButton } from './loading-button';

type Props = {
  credential: PartialDeep<Credentials>;
};

const ToMintButton = (props) => (
  <LoadingButton
    variant="contained"
    {...props}
    startIcon={
      !props.isLoading && <TokenFilled height={20} width={20} color="action" />
    }
  >
    {props.children}
  </LoadingButton>
);
const MintedButton = (props) => (
  <Button
    variant="outlined"
    component="a"
    href={props.transaction_url}
    target="_blank"
    {...props}
    startIcon={<TokenFilled height={20} width={20} color="action" />}
  >
    {props.children}
  </Button>
);

export const MintCredentialButton = ({ credential }: Props) => {
  const { mintCredential } = useBiconomyMint();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('common');

  return (
    <Stack
      sx={{
        flex: 1,
        marginBottom: (theme) => theme.spacing(4),
      }}
    >
      {credential.status === 'minted' ? (
        <MintedButton
          transaction_url={credential.transaction_url}
          sx={{
            borderColor: '#E5E5E580',
            color: 'white',
            width: '100%',
          }}
        >
          {t('actions.check-transaction')}
        </MintedButton>
      ) : (
        <ToMintButton
          onClick={() => {
            setLoading(true);
            mintCredential(credential).finally(() => setLoading(false));
          }}
          isLoading={loading}
          sx={{
            width: '100%',
          }}
        >
          {t('actions.mint')}
        </ToMintButton>
      )}
    </Stack>
  );
};
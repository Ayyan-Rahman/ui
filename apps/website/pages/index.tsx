import useTranslation from 'next-translate/useTranslation';

import { Button } from '@mui/material';

import { LandingTemplate } from '../components/templates/landing';
import { useAuth } from '../providers/auth';

export default function Index() {
  const { t } = useTranslation('index');
  const { onOpenLogin } = useAuth();

  return (
    <>
      <LandingTemplate
        title={t('title')}
        connectButton={
          <Button variant="contained" onClick={onOpenLogin}>
            Connect Wallet
          </Button>
        }
      />
    </>
  );
}

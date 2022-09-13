import { useEffect } from 'react';

import { DashboardTemplate } from '../../components/templates/dashboard';
import { PrivateProfileTemplate } from '../../components/templates/profile';
import { useAuth } from '../../providers/auth';

// TODO: make the behavior of this page better
export default function Profile() {
  const { me, onOpenLogin } = useAuth();

  useEffect(() => {
    if (!me?.id) {
      onOpenLogin();
    }
  }, [me]);

  return me?.id ? (
    <DashboardTemplate
      containerProps={{
        sx: {
          overflow: 'hidden',
        },
      }}
    >
      <PrivateProfileTemplate />
    </DashboardTemplate>
  ) : null;
}

Profile.auth = true;

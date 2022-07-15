import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { useQuery } from 'react-query';

import { EarnCredentialTemplate } from '../../../../components/templates/earn-credential';
import { useAuth } from '../../../../providers/auth';
import { gqlMethods } from '../../../../services/api';

interface CredentialInfoProps {
  id: string;
  name: string;
  description: string;
  status?: string;
  image: string;
  admin?: {
    name: string;
    pfp: string;
  };
  issuer?: {
    name: string;
    pfp: string;
  };
  target?: {
    name: string;
  };
}

export default function EarnCredential() {
  const router = useRouter();
  const { me } = useAuth();

  const { credentialId } = router.query;

  const credential = useQuery(
    [credentialId, 'get-credential'],
    () => {
      if (!me) return;
      return gqlMethods(me).get_credential({
        credential_id: credentialId,
      });
    },
    {
      enabled: !!me && !!credentialId,
      select: (data) => {
        const credentialInfo: CredentialInfoProps =
          data?.['credentials_by_pk'] ?? data?.['credential_group_by_pk'];

        return {
          id: credentialInfo.id,
          name: credentialInfo.name,
          description: credentialInfo.description,
          status: credentialInfo.status,
          image: credentialInfo.image,
          issuer: {
            name: credentialInfo?.admin?.name || credentialInfo?.issuer?.name,
            pfp: credentialInfo?.admin?.pfp || credentialInfo?.issuer?.pfp,
          },
          target: {
            name: credentialInfo?.target?.name || '',
          },
        };
      },
    }
  );

  if (!credential.data) return null;

  return <EarnCredentialTemplate credential={credential.data} user={me} />;
}

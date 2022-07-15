import { useRouter } from 'next/router';

import { useQuery } from 'react-query';

import { ViewCredentialTemplate } from '../../../../components/templates/view-credential';
import { useAuth } from '../../../../providers/auth';
import { gqlAnonMethods, gqlMethods } from '../../../../services/api';

interface CredentialInfoProps {
  id: string;
  group_id?: string;
  name: string;
  description: string;
  status?: string;
  image?: string;
  details?: Record<string, any>;
  categories?: string[];
  category?: string;
  pow?: Record<string, any>;
  admin?: {
    id: string;
    name: string;
    pfp: string;
  };
  issuer?: {
    id: string;
    name: string;
    pfp: string;
  };
  target?: {
    name: string;
  };
}

export default function ViewCredential() {
  const router = useRouter();
  const { me } = useAuth();

  const { credentialId } = router.query;

  const credential = useQuery(
    [credentialId, 'get-credential'],
    () => {
      return gqlAnonMethods.get_credential({
        credential_id: credentialId,
      });
    },
    {
      enabled: !!credentialId,
      select: (data) => {
        const credentialInfo: CredentialInfoProps =
          data?.['credentials_by_pk'] ?? data?.['credential_group_by_pk'];

        return {
          id: credentialInfo.id,
          name: credentialInfo.name,
          description: credentialInfo.description,
          status: credentialInfo.status,
          group_id: credentialInfo.group_id || credentialInfo.id,
          image: credentialInfo.image,
          details: credentialInfo?.details,
          categories: credentialInfo?.categories
            ? credentialInfo?.categories
            : [credentialInfo?.category],
          pow: credentialInfo?.pow,
          issuer: {
            id: credentialInfo?.admin?.id || credentialInfo?.issuer?.id,
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

  return <ViewCredentialTemplate credential={credential.data} />;
}

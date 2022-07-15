import dynamic from 'next/dynamic';

import { DashboardTemplate } from '../../components/templates/dashboard';

const ProfileTemplate = dynamic(
  () =>
    import('../../components/templates/profile').then(
      (mod) => mod.ProfileTemplate
    ),
  {
    ssr: false,
  }
);

export default function Profile() {
  return (
    <DashboardTemplate showExplore={false}>
      <ProfileTemplate />
    </DashboardTemplate>
  );
}

Profile.auth = true;

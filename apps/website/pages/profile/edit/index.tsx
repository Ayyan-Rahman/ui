import dynamic from 'next/dynamic';
const EditProfileTemplate = dynamic(
  () =>
    import('../../../components/templates/profile/edit/edit').then(
      (mod) => mod.EditProfileTemplate
    ),
  {
    ssr: false,
  }
);

const EditProfile = () => {
  return <EditProfileTemplate />;
};

export default EditProfile;

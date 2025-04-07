'use client';
import SettingsForm from '@/components/SettingsForm';
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from '@/state/api';

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateTenantSettingsMutation();
  console.log(authUser);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const initialData = {
    name: authUser?.userInfo?.name,
    email: authUser?.userInfo?.email,
    phoneNumber: authUser?.userInfo?.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({ cognitoId: authUser?.cognitoInfo.userId, ...data });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType={'tenant'}
    />
  );
};

export default TenantSettings;

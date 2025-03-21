'use client';
import Card from '@/components/Card';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import {
  useGetAuthUserQuery,
  useGetCurrentResidencesQuery,
  useGetTenantQuery,
} from '@/state/api';

const ResidencesPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo.userId ?? '',
    { skip: !authUser?.cognitoInfo.userId }
  );
  const {
    data: currentResidences,
    isLoading,
    isError,
  } = useGetCurrentResidencesQuery(authUser?.cognitoInfo?.userId ?? '', {
    skip: !authUser?.cognitoInfo?.userId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>Error loading current residences</p>;
  }

  return (
    <div className="dashboard-container">
      <Header
        title="Current Residences"
        subtitle="View and manage your current living spaces"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentResidences?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={tenant.favorites.includes(property.id) || false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property.id}`}
          />
        ))}
      </div>
      {(!currentResidences || currentResidences.length === 0) && (
        <p>You do not have any current residences</p>
      )}
    </div>
  );
};

export default ResidencesPage;

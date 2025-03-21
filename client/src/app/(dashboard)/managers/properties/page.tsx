'use client';
import Card from '@/components/Card';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from '@/state/api';

const PropertiesPage = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    isError,
    isLoading,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo.userId ?? '', {
    skip: !authUser?.cognitoInfo.userId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>Error loading manager properties</p>;
  }

  return (
    <div className="dashboard-container">
      <Header
        title="My Properties"
        subtitle="View and manage your property listings"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/managers/properties/${property.id}`}
          />
        ))}
      </div>
      {(!managerProperties || managerProperties.length === 0) && (
        <p>You do not manage any properties</p>
      )}
    </div>
  );
};

export default PropertiesPage;

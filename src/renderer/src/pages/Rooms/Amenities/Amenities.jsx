import React from 'react';
import AmenitiesList from './components/AmenitiesList';
import { columns } from './components/Columns';
import Loading from '@/components/Common/Loading';

export default function Amenities() {
  const [amenities, setAmenities] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const amenities = await window.api.getAmenitys();
        setAmenities(amenities);
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    };
    setIsLoading(false);
    fetchData();
  }, []);
  return !isLoading ? (
    <AmenitiesList
      setAmenities={setAmenities}
      columns={columns}
      data={amenities}
    />
  ) : (
    <Loading />
  );
}

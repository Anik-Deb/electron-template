import React from 'react';
import { columns } from './components/Columns';
import GuestsList from './components/GuestsList';
import Loading from '@/components/Common/Loading';

const Guests = () => {
  const [user, setUser] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await window.api.getGuests();
        setUser(users);
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };
    setIsLoading(false);
    fetchData();
  }, []);
  return !isLoading ? (
    <GuestsList setUser={setUser} columns={columns} data={user} />
  ) : (
    <Loading />
  );
};

export default Guests;

import React from 'react';
import { columns } from './components/Columns';
import PosMachineDataList from './components/PosMachineDataList';
import Loading from '@/components/Common/Loading';

export default function PosMachine() {
  const [posMachines, setPosMachines] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const posMachines = await window.api.getPosMachines();
        setPosMachines(posMachines);
      } catch (error) {
        console.error('Error fetching pos machine data:', error);
      }
    };
    setIsLoading(false);
    fetchData();
  }, []);
  return !isLoading ? (
    <PosMachineDataList
      setPosMachines={setPosMachines}
      columns={columns}
      data={posMachines}
    />
  ) : (
    <Loading />
  );
}

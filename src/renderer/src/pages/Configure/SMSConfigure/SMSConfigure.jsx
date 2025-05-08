import Loading from '@/components/Common/Loading';
import React from 'react';
import SMSConfigureList from './components/SMSConfigureList';
import { columns } from './components/columns';

export default function SMSConfigure() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const config = await window.api.getSMSConfigurations();
      setData(config);
    };
    fetchData();
  }, []);

  return !isLoading ? (
    <SMSConfigureList columns={columns} data={data} setData={setData} />
  ) : (
    <Loading />
  );
}

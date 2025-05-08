import Breadcrumb from '@/components/Common/Breadcrumb/Breadcrumb';
import Loading from '@/components/Common/Loading';
import React from 'react';
import { useLocation } from 'react-router-dom';
import ServerConfigurationForm from './Components/ServerConfigurationForm';
import ServerConfigurationView from './Components/ServerConfigurationView';
export default function UpdateServerConfiguration() {
  const { pathname } = useLocation();
  const currentPath = pathname.split('/')[1];
  const [isEdit, setIsEdit] = React.useState(false);
  const [allConfigs, setAllConfigs] = React.useState(false);
  const [prevValue, setPrevValue] = React.useState({});
  React.useEffect(() => {
    const fetchData = async () => {
      const prevData = await window.api.getServerConfig();
      const allConfigs = await window.api.getServerConfigs();
      setAllConfigs(allConfigs);
      setPrevValue(prevData);
    };
    fetchData();
  }, []);
  return (
    <div>
      <div className="mb-7">
        <div className="text-2xl font-semibold flex items-center gap-1 text-primary-950">
          Server Configuration
        </div>
        {currentPath && <Breadcrumb currentPath={currentPath} />}
        {/* <PageTitle title="Server Configuration" /> */}
      </div>
      {prevValue?.host ? (
        <div className="mt-4 max-w-[800px] border-none rounded bg-white px-6 py-5">
          {isEdit ? (
            <ServerConfigurationForm
              allConfigs={allConfigs}
              setIsEdit={setIsEdit}
              prevValue={prevValue}
            />
          ) : (
            <ServerConfigurationView
              setIsEdit={setIsEdit}
              prevValue={prevValue}
            />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

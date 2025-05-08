import Loading from '@/components/Common/Loading';
import ModalTrigger from '@/components/Common/Modal/ModalTrigger';
import { Dialog } from '@/components/ui/dialog';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SMSConfigureForm from './components/SMSConfigureForm';
import { showToast } from '@/utils/toastHelper';

export default function UpdateSMSConfigure({ id }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [prevData, setPrevData] = React.useState();
  const navigate = useNavigate();
  React.useEffect(() => {
    const fetchData = async () => {
      const prevData = await window.api.getSMSConfiguration(id);
      setPrevData(prevData);
    };
    fetchData();
    setIsLoading(false);
  }, []);
  // on submit
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await window.api.updateSMSConfiguration({ id, ...data });
      console.log('result:', result);
      navigate(0);
    } catch (error) {
      console.log('Error from sms configure created Time', error);
      showToast('error', error);
    }
    setIsLoading(false);
    setIsOpen(false);
  };
  return !isLoading ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger
        variant="transparent"
        type="button"
        className="px-2 h-fit text-[13px] font-normal text-subHeading hover:bg-accent hover:text-accent-foreground w-full flex justify-start"
      >
        Edit
      </ModalTrigger>
      {prevData && <SMSConfigureForm onSubmit={onSubmit} prevData={prevData} />}
    </Dialog>
  ) : (
    <Loading />
  );
}

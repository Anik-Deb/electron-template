import { ModalContent } from '@/components/Common/Modal/ModalContent';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryForm from './components/InventoryForm';
import { showToast } from '@/utils/toastHelper';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

const EditInventory = ({ setIsModalOpen, prevData }) => {
  const navigate = useNavigate();
  // on submit
  const onSubmit = async (data) => {
    const newData = {
      id: prevData?.id,
      ...data,
    };
    try {
      const result = await window.api.updateInventory(newData);
      setIsModalOpen(false);
      // showToast('success', 'Inventory item added successfully!');
      navigate(0);
    } catch (error) {
      const error_message = errorMessage(error);
      console.log('error from edit inventory:', error_message);
      showToast('error', error_message);
    }
    // console.log('Response ->', result)
    // reset()
  };
  return (
    <ModalContent title="Edit" className="max-w-md">
      <InventoryForm
        onSubmit={onSubmit}
        setIsModalOpen={setIsModalOpen}
        prevData={prevData}
      />
    </ModalContent>
  );
};

export default EditInventory;

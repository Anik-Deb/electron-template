import { ModalContent } from '@/components/Common/Modal/ModalContent';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryForm from './components/InventoryForm';
import { showToast } from '@/utils/toastHelper';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

const AddInventory = ({ setInventories, setIsModalOpen }) => {
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const result = await window.api.addInventory(data);
      if (setInventories) {
        setInventories((prev) => [...prev, result]);
      } else {
        navigate(0);
      }
      showToast('success', 'Inventory Added successfully!');
    } catch (error) {
      const error_message = errorMessage(error);
      console.log('error from add inventory:', error_message);
      showToast('error', error_message);
    }
    // console.log('Add Inventory ->', result)
    setIsModalOpen(false);
  };
  return (
    <ModalContent title="Add Inventory Item" className="max-w-md">
      <InventoryForm onSubmit={onSubmit} setIsModalOpen={setIsModalOpen} />
    </ModalContent>
  );
};

export default AddInventory;

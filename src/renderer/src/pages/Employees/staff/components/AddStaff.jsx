import React from 'react';
import PageTitle from '@/components/Common/PageTitle';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import EmployeeForm from '../../components/EmployeeForm';

const AddStaff = () => {
  // Submit function for the form
  const navigate = useNavigate();
  const cancelURL = '/employees/staffs';
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      const user = await window.api.addUser({ role: 'staff', ...data });

      if (!user?.id) {
        throw new Error('User not created!');
      }

      await window.api.addEmployee({
        user_id: user?.id,
        ...data,
      });
      navigate('/employees/staffs');
      showToast('success', 'Staff Added successfully!');
    } catch (error) {
      console.log('Error from add employee:', error);
      showToast('error', 'Failed to add staff!');
    }
  };
  return (
    <div>
      <PageTitle title={`Add Staff`} />
      <EmployeeForm onSubmit={onSubmit} cancelURL={cancelURL}></EmployeeForm>
    </div>
  );
};

export default AddStaff;

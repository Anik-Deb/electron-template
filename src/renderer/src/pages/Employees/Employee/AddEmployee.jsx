import React from 'react';
import PageTitle from '@/components/Common/PageTitle';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import EmployeeForm from '../components/EmployeeForm';

const AddEmployee = () => {
  const navigate = useNavigate();
  const cancelURL = '/employees/employees';
  const onSubmit = async (data) => {
    try {
      console.log('Form submitted:', { ...data });
      const user = await window.api.addUser({ role: 'employee', ...data });

      if (!user?.id) {
        throw new Error('User not created!');
      }

      await window.api.addEmployee({
        user_id: user?.id,
        ...data,
      });
      navigate('/employees/employees');
      showToast('success', 'Employee added successfully!');
    } catch (error) {
      // console.log('Error from add employee:', error);
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };
  return (
    <div>
      <PageTitle title={`Add Employee`} />
      <EmployeeForm onSubmit={onSubmit} cancelURL={cancelURL}></EmployeeForm>
    </div>
  );
};

export default AddEmployee;

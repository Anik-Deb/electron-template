import React, { useState } from 'react';
import PageTitle from '@/components/Common/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@/components/Common/Loading';
import { showToast } from '@/utils/toastHelper';
import EmployeeForm from '../../components/EmployeeForm';

const EditStaff = () => {
  const navigate = useNavigate();
  const cancelURL = '/employees/staffs';
  const { id } = useParams();
  const [prevData, setPrevData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const emp = await window.api.getEmployee(id);
        setPrevData(emp);
      } catch (error) {
        console.log('error from get user:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      const updates = {
        first_name: data?.first_name,
        last_name: data?.last_name,
        email: data?.email,
        phone: data?.phone,
        emergency_contact_phone: data?.emergency_contact_phone,
        role: data?.role || 'staff',
        date_of_birth: data?.date_of_birth,
        address_1: data?.address_1,
        address_2: data?.address_2,
        profile_picture_url: data?.profile_picture_url,
      };
      const resultUser = await window.api.updateUser({
        id: prevData?.user_id,
        updates,
      });
      if (resultUser?.error) {
        throw new Error('User not update!');
      }
      const updateEmployee = {
        department: data?.department,
        position: data?.position,
        salary: data?.salary,
        hire_date: data?.hire_date,
        nid: data?.nid,
        certifications: data?.certifications,
        user_id: prevData?.user_id,
      };
      const updateEmp = await window.api.updateEmployee({
        id,
        updates: updateEmployee,
      });
      navigate('/employees/staffs');
      showToast('success', 'Update Staff successfully!');
    } catch (error) {
      console.log('error from update user:', error);
      showToast('error', 'Failed to update staff!');
    }
  };
  return (
    <div>
      <PageTitle title={`Edit Staff`} />
      {!isLoading ? (
        <EmployeeForm
          onSubmit={onSubmit}
          prevData={prevData}
          cancelURL={cancelURL}
        ></EmployeeForm>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default EditStaff;

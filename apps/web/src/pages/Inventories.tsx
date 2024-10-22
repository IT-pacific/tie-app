import React, { useEffect } from 'react';
import MainHeader from '@/components/common/MainHeader';
import InvetoryTable from '@/components/containers/invetories/InvetoryTable';
import { AppState, useAppSelector } from '@/store/store';
import { useLocation, useNavigate } from 'react-router';

const Inventories = () => {
  const { user } = useAppSelector((state: AppState) => state.auth);
  const navigate = useNavigate();

  const isReceptionist = user?.role === 'receptionist';

  useEffect(() => {
    !isReceptionist && navigate('/');
  }, []);
  
  return (
    <div className="h-full bg-white p-5">
      <MainHeader heading={'Inventories'} />
      <div className="flex flex-col">
        <InvetoryTable />
      </div>
    </div>
  );
};

export default Inventories;

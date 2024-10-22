import { AiFillHome } from 'react-icons/ai';
import { FaBookReader, FaBriefcase } from 'react-icons/fa';
import MenuItem from './MenuItem';

import { setIsOpen } from '@/store/reducers/sidebarReducer';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import { cn } from '@/utils/tw-merge';
import { CiCreditCard1 } from 'react-icons/ci';
import { FiCheckSquare } from 'react-icons/fi';
import { HiOutlineChartBarSquare, HiXMark } from 'react-icons/hi2';
import { Button } from '../ui/button';

const SideBar = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const { user } = useAppSelector((state: AppState) => state.auth);

  const isReceptionist = user?.role === "receptionist";

  const handleSidebarClose = () => {
    dispatch(setIsOpen(false));
  };
  return (
    <>
      <div
        className={cn(
          'bg-[#243563] fixed left-0  bottom-0 xl:sticky top-0 duration-300 z-50 min-w-[270px] transition-all h-[100vh] flex flex-col justify-between',
          isOpen ? 'translate-x-0' : ' -translate-x-80 xl:translate-x-0'
        )}
      >
        <div>
          <div className="h-[66px] bg-white hidden xl:flex items-center">
            <div className='flex items-center gap-[5px] px-[20px]'>
              <img src="/logo.svg" alt="Logo" className='w-[40px]' />
              <h2 className="text-blue-600 text-[20px] ">Tie-app</h2>
            </div>
            
          </div>
          <div className="flex items-center xl:hidden justify-between px-5 pt-5">
            <h2 className="text-white">Logo</h2>
            <Button
              onClick={handleSidebarClose}
              className="!px-4 !py-4 !rounded-full"
            >
              <HiXMark fontSize={24} className="text-white" />
            </Button>
          </div>
          <div className={`w-full flex flex-col pt-5`}>
            <MenuItem to="/" name="Dashbord" icon={<AiFillHome />} />
            <MenuItem
              to="/orders"
              name="Manage orders"
              icon={<FiCheckSquare />}
            />
            {isReceptionist && <MenuItem
              to="/inventory"
              name="Inventories"
              icon={<HiOutlineChartBarSquare />}
            />}
            <MenuItem to="#" name="Payments" icon={<CiCreditCard1 />} />
            <MenuItem to="/documents" name="Documents" icon={<FaBriefcase />} />
            <MenuItem to="#" name="Manage Links" icon={<FaBookReader />} />
          </div>
        </div>
        {/* <Button className='text-base font-normal flex items-center gap-3' variant={"ghost"}>
          <h2>Logout</h2>
        </Button> */}
      </div>
      {isOpen && (
        <div
          onClick={handleSidebarClose}
          className="fixed inset-0 bg-black backdrop-blur-sm opacity-10 xl:hidden"
          style={{zIndex:45}}
        ></div>
      )}
    </>
  );
};

export default SideBar;

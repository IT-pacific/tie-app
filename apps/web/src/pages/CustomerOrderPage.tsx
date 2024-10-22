import { useLocation, useParams } from 'react-router';
import CurrentCart from '@/components/containers/CustomerOrderContainer/CurrentCart';
import CurrentInventory from '@/components/containers/CustomerOrderContainer/CurrentInventory';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import { cn } from '@/utils/tw-merge';
import { Icon } from '@iconify/react';
import Navbar from '@/components/common/Navbar';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { setIsAuthenticated, setIsAuthenticating } from '@/store/reducers/authReducer';
import { logoutUser, whoAmI } from '@/store/actions/authActions';
import cookieStorage from '@/utils/cookieStorage';
import SideBar from '@/components/common/Sidebar';


const CustomerOrderPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isAuthenticating, user } = useAppSelector(
    (state: AppState) => state.auth
  );

  // Helper to check the current user's session
  const checkCurrentUser = async () => {
    const accessToken = cookieStorage.getItem("accessToken");

    if (!accessToken) {
    
      return false;
    }

    try {
      
      const resultAction = await dispatch(whoAmI());

     
      if (whoAmI.rejected.match(resultAction)) {
        return false; 
      }

      return true; 
    } catch (error) {
      console.error("Failed to authenticate: ", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Only check authentication if user is null and we're not already authenticating
      if (isAuthenticated && !user && !isAuthenticating) {
        const success = await checkCurrentUser();

        if (!success) {
          // Redirect to login if authentication fails
          dispatch(setIsAuthenticated(false));
          dispatch(logoutUser());
        } else {
          dispatch(setIsAuthenticating(false));
        }
      }
    };

    initializeAuth();
  }, [isAuthenticated, user, dispatch]);
  const { id } = useParams();
  const isOperator = user?.role === 'operator';
  const isReceptionist = user?.role === 'receptionist';
  useEffect(() => {
    
  },[user])
  return (
    <main>
     {user==null?<div className="flex h-full flex-col w-fullbg-white">
        <div className='flex items-center justify-between px-[20px] py-3 bg-[#f3f6fd]'>
        <div className='flex    items-center gap-[5px] px-[20px]'>
          <img src="/logo.svg" alt="Logo" className='w-[40px]' />
          <p></p>
           
            </div>
    
        <div className='flex  gap-[20px]'>
        <Link to={`/auth/login?redirect=/items/${id}`} className='bg-blue-600 hover:bg-blue-500 text-white rounded-full py-[10px] px-[24px]'>Login </Link>

        <Link to={`/auth/register?redirect=/items/${id}`} className='bg-transparent flex items-center hover:border-transparent gap-[4px] hover:bg-slate-300 border-[2px] border-slate-500 text-slate-500 rounded-full py-[10px] px-[24px]'> <Icon icon="ion:notifications" className="w-5 h-5 text-gray-400" /> Signup </Link>

        </div>
    </div>
       
           {/* when it's the retailer he/she can view the products and then add to cart the desired products */}
      <div className="p-5 flex-1 flex gap-5 flex-col lg:flex-row">
        {/* products table */}
        <div
          className={cn(isReceptionist ? 'w-full' : ' w-full lg:w-[60%]')}
        >
          <CurrentInventory id={id} />
        </div>
        {/* cart table */}
        {!isReceptionist && (
          <div className={cn('w-full lg:w-[40%]')}>
            <CurrentCart />
          </div>
        )}
      </div>
      </div> :
         <div className="min-h-screen flex flex-row relative">
         <SideBar />  
         <main className="flex-1 flex flex-col w-full xl:w-[calc(100%-270px)]">
           <Navbar />
           <div className="flex-1 h-[calc(100vh - 66px)]">
                {/* when it's the retailer he/she can view the products and then add to cart the desired products */}
      <div className="p-5 flex-1 flex gap-5 flex-col lg:flex-row">
        {/* products table */}
        <div
          className={cn(isReceptionist ? 'w-full' : ' w-full lg:w-[60%]')}
        >
          <CurrentInventory id={id} />
        </div>
        {/* cart table */}
        {!isReceptionist && (
          <div className={cn('w-full lg:w-[40%]')}>
            <CurrentCart />
          </div>
        )}
      </div>
           </div>
         </main>
       </div>
      
      } 
      
   
    </main>
  );
};

export default CustomerOrderPage;

import { useLocation, useParams } from 'react-router';
import CurrentCart from '@/components/containers/CustomerOrderContainer/CurrentCart';
import CurrentInventory from '@/components/containers/CustomerOrderContainer/CurrentInventory';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import { cn } from '@/utils/tw-merge';
import { Icon } from '@iconify/react';
import Navbar from '@/components/common/Navbar';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  setIsAuthenticated,
  setIsAuthenticating,
} from '@/store/reducers/authReducer';
import { logoutUser, whoAmI } from '@/store/actions/authActions';
import cookieStorage from '@/utils/cookieStorage';
import SideBar from '@/components/common/Sidebar';
import { ItemsColumns } from '@/components/common/ItemColumns';
import { getOrderById, uploadPaymentProof } from '@/store/actions/orderActions';
import { getOrderByIdApi } from '@/services/orders/order.service';
import DataTable from '@/components/common/DataTable';
import PaymentProofModal from '@/components/payment/PaymentProof';

const OrderPayment = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { currentOrder, isLoading } = useAppSelector((state) => state.order);

  const { isAuthenticated, isAuthenticating, user } = useAppSelector(
    (state: AppState) => state.auth
  );

  const checkCurrentUser = async () => {
    const accessToken = cookieStorage.getItem('accessToken');

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
      console.error('Failed to authenticate: ', error);
      return false;
    }
  };
  const { id } = useParams();
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
    const getOrder = async () => {
      dispatch(getOrderById(id));
    };
    getOrder();

    initializeAuth();
  }, [isAuthenticated, user, dispatch]);

  const isReceptionist = user?.role === 'receptionist';
  useEffect(() => {}, [user]);
  const [isPaymentProofOpen, setIsPaymentProofOpen] = useState(false);

  
  const handlePaymentProofUpload = (file: File) => {
    if (id && file) {
      dispatch(uploadPaymentProof({ orderId: id, file }));
      setIsPaymentProofOpen(false);
      dispatch(getOrderById(id))
    }
  };
useEffect(()=>{},[currentOrder])
  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentProofOpen(true);
  };
  const price = {
    originalPrice: currentOrder?.order.item_details.reduce((sum, i) => (i.quantity * i.unitPrice) + sum, 0)||0,
    discount: 0,
    shipping:0
    
  }
  return (
    <main>
      <div className="flex h-full flex-col w-fullbg-white">
        <div className="p-5 flex-1 flex gap-5 flex-col lg:flex-row">
          {/* products table */}
          <div className={cn(isReceptionist ? 'w-full' : ' w-full flex-1')}>
            <div className="h-full border border-gray-200 rounded-lg p-3">
              <div className="flex w-full items-center justify-between">
                <h2 className="font-medium text-base py-2">Item</h2>
                <p>Order #{id}</p>
              </div>

              <DataTable
                columns={ItemsColumns}
                message={'No Items yet'}
                limit={5}
                page={0}
                loading={isLoading}
                loadingMessage="current inventory loading..."
                data={currentOrder ? currentOrder.order.item_details : []}
                ColumnsNames={['name', 'quantity', 'price']}
              />
            </div>
          </div>
          <div className="mt-6 max-w-[500px] max-h-fit md:min-w-[370px] grow sm:mt-8 lg:mt-0">
            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 px-6 py-4 800">
              <div className="space-y-2">
                <div className="flex py-[20px] flex-col gap-[4px]">
                  <p className="font-[600] text-[20px]">Contact Address</p>
                  <div className="flex items-center">
                    Company name:{' '}
                    {currentOrder?.companyInfo?.companyName
                      ? currentOrder?.companyInfo?.companyName
                      : ''}
                  </div>
                  <p>
                    Email:
                    {currentOrder?.companyInfo?.email
                      ? currentOrder?.companyInfo?.email
                      : ''}
                  </p>
                  <p>
                    Phone:
                    {currentOrder?.companyInfo?.phoneNumber
                      ? currentOrder?.companyInfo?.phoneNumber
                      : ''}
                  </p>
                </div>

                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 400">
                    Original price
                  </dt>
                  <dd className="text-base font-medium text-gray-900 ">
                    {price.originalPrice} frw
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 400">
                    Discount
                  </dt>
                  <dd className="text-base font-medium text-green-500">
                    {' '}
                     {price.discount} frw
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 400">
                    Store Pickup
                  </dt>
                  <dd className="text-base font-medium text-gray-900 ">
                    {price.shipping} frw
                  </dd>
                </dl>
              </div>

              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                <dt className="text-base font-bold text-gray-900 ">Total</dt>
                <dd className="text-base font-bold text-gray-900 ">{price.originalPrice+price.discount+price.shipping} frw</dd>
              </dl>
              {currentOrder?.order.status == 'confirmed' ? (
                <div className="flex items-center gap-[20px]">
                  <button className="flex w-full items-center justify-center rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-black hover:bg-slate-400 focus:outline-none focus:ring-4  focus:ring-primary-300 600 primary-700 primary-800">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 600 primary-700 primary-800"
                    onClick={handlePayNow}
                  >
                    Pay now
                  </button>
                </div>
              ) : (
                <div>
                  {currentOrder?.order.status == 'pending' ? (
                    <div className="bg-yellow-600 cursor-pointer py-[10px] justify-center text-white rounded-lg flex items-center">
                      Waiting Confirmation
                    </div>
                  ) : currentOrder?.order.status == 'payment-pending' ? (
                    <div className="bg-green-600 cursor-pointer py-[10px] justify-center text-white rounded-lg flex items-center">
                      Waiting for payment Approval
                    </div>
                  ) : (
                    <div className="bg-green-600 cursor-pointer py-[10px] justify-center text-white rounded-lg flex items-center">
                      Paid
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PaymentProofModal
        isOpen={isPaymentProofOpen}
        onClose={() => setIsPaymentProofOpen(false)}
        onUploadSuccess={handlePaymentProofUpload}
      />
    </main>
  );
};

export default OrderPayment;

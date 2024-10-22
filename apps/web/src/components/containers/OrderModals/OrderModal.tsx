import { Loading } from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { updateOrderStatus } from '@/store/actions/orderActions';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import { Order } from '@/types';
import { cn } from '@/utils/tw-merge';
import { displayNumbers } from '@/utils/usableFunc';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import OrderItemModal from './OrderItemModal';
import PaymentProof from './PaymentProof';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

type Props = {
  selectedRow: Order;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
};
const OrderModal: React.FC<Props> = ({ selectedRow, setShowDialog }) => {

  const textToCopy = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/order/${selectedRow._id}`
  const [cancelOrderLoading, setCancelOrderLoading] = useState(false)
  const [rejectOrderLoading, setRejectOrderLoading] = useState(false)
  const [showPaymentProof,setShowPaymentProof]=useState(false)
 
  const [confirmOrderLoading,setConfirmOrderLoading]=useState(false)
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const { user } = useSelector((state: AppState) => state.auth);
  const [selectedItems, setSelectedItems] = useState<{item:string,quantity:number}[]>(selectedRow.item_details.map((i)=>({item:i._id,quantity:i.quantity})));
  const isOperator = user?.role == 'operator';
  const [showItemModal, setShowItemModal] = useState(false)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showItemModal) {
          setShowItemModal(false); 
        } else {
          setShowDialog(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showItemModal, setShowDialog]);
  const navigate=useNavigate()
  const handleCopy = async () => {
    try {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error: any) {
      throw new Error(error instanceof Error?`Failed to copy ${error.message}`:"Something went wrong ");

    }
  };

  const totalPrice = selectedRow.item_details.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);

  const handleRejectOrder = async () => {
    setRejectOrderLoading(true)
    try {
      
      if (selectedRow.status === 'pending') {
        const response = await dispatch(
          updateOrderStatus({
            newStatus: 'rejected',
            orderId: selectedRow._id ? selectedRow._id : '',
          })
        );
       
   
      }
      if (selectedRow.status === 'payment-pending') {
        const response = await dispatch(
          updateOrderStatus({
            newStatus: 'rejected',
            orderId: selectedRow._id ? selectedRow._id : '',
          })
        );
       
   
      }
      setRejectOrderLoading(false)


        
      setShowDialog(false);
    } catch (error: any) {
      setRejectOrderLoading(false)
      throw new Error(error instanceof Error?`Failed to reject order ${error.message}`:"Something went wrong while rejecting order");
   
    }
  };
  const handleCancelOrder = async () => {
    setCancelOrderLoading(true)
    try {
      
      if (selectedRow.status === 'pending') {
        const response = await dispatch(
          updateOrderStatus({
            newStatus: 'cancelled',
            orderId: selectedRow._id ? selectedRow._id : '',
          })
        );
setCancelOrderLoading(false)
        // for demo purposed only
         setShowDialog(false);
      }
    } catch (error: any) {
      setCancelOrderLoading(false)
      throw new Error(error instanceof Error?`Failed to cancel order ${error.message}`:"Something went wrong while cancelling order ");

    }
  };

  const handleCompleteOrder = async () => {
    setConfirmOrderLoading(true)
    try {
     
      if (selectedRow.status === 'pending') {
        const response = await dispatch(
          updateOrderStatus({
            newStatus: 'confirmed',
            orderId: selectedRow._id ? selectedRow._id : '',
            item_details: selectedItems,
          })
        );
        
      }
      if (selectedRow.status === 'payment-pending') {
        const response = await dispatch(
          updateOrderStatus({
            newStatus: 'completed',
            orderId: selectedRow._id ? selectedRow._id : '',
            item_details: selectedItems,
          })
        );
        
      }
      setConfirmOrderLoading(false)
       setShowDialog(false);
    } catch (error: any) {
      setConfirmOrderLoading(false)
      throw new Error(error instanceof Error?`Failed to confirm order ${error.message}`:"Something went wrong while confirming order ");

    }
  };

  return (
    <DialogContent
      className="bg-white w-fit p-5 min-w-[500px] rounded-lg"
      aria-describedby=""
    >
      <DialogTitle className="text-lg font-medium">Recieved Order</DialogTitle>
      <Separator className="bg-gray-300" />
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h2 className="text-base font-medium">Order Information</h2>
         
          <Separator className="bg-gray-300 my-3" />
          {/* order link */}
          {selectedRow.paymentProof&&(selectedRow.status=="payment-pending"||selectedRow.status=="completed"||selectedRow.status=="rejected")&&<div className='flex flex-col py-[10px]  gap-[10px] '>
            <Button
                variant={'outline'}
                onClick={()=>{setShowPaymentProof(true)}}
                className="border text-blue-600 hover:text-blue-500 border-blue-600"
              >
              Show payment proof
            </Button>
            {showPaymentProof&&<PaymentProof setShowPaymentModal={setShowPaymentProof} paymentProof={selectedRow.paymentProof}/>}
            
          </div>}
          
          
          <div className="flex items-center py-2 px-3 justify-between rounded-lg border border-gray-200">
            <h2 className="flex items-center text-sm">
              Order Link:{' '}
              <a className="text-blue-600" href={textToCopy}>
                /order/{selectedRow._id}
              </a>
            </h2>
            {!copied ? (
              <Button
                variant={'outline'}
                disabled={copied}
                onClick={handleCopy}
                className="border border-blue-600"
              >
                <FaRegCopy fontSize={12} className="text-blue-600" />
              </Button>
            ) : (
              <Button variant={'outline'} className="border border-blue-600">
                <h2 className="text-xs font-normal text-blue-600">copied</h2>
              </Button>
            )}
          </div>
          {/* order details */}
          <div className="flex flex-col gap-0.5 p-3 my-3 border border-gray-200 rounded-lg">
            <h2 className="flex items-center text-xs gap-1 font-medium">
              Order number:
              <span className="font-normal">{selectedRow.order_id}</span>
            </h2>
            <h2 className="flex items-center text-xs gap-1 font-medium">
              Customer:
              <span className="font-normal">
                {selectedRow.retail_id?.companyName}
              </span>
            </h2>
            <h2 className="flex items-center text-xs gap-1 font-medium">
              Created:
              <span className="font-normal">
                {moment(selectedRow.createdAt).format('DD/MM/YY , hh:mm:ss')}
              </span>
            </h2>
            <h2 className="flex items-center text-xs gap-1 font-medium">
              Total Cost:
              <span className="font-normal">{displayNumbers(totalPrice)}</span>
            </h2>
          </div>
          {/* order status */}
          <div
            className={cn(
              'flex items-center max-w-fit p-2 my-2 bg-opacity-10 rounded-lg',
              selectedRow.status === 'confirmed'
                ? 'bg-green-300'
                : selectedRow.status === 'pending'
                  ? 'bg-yellow-300'
                  : 'bg-red-300'
            )}
          >
            <h2 className="flex items-center text-sm font-medium gap-0.5 ">
              Status:
              <span
                className={cn(
                  '',
                  selectedRow.status === 'confirmed'
                    ? 'text-green-500'
                    : selectedRow.status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                )}
              >
                {selectedRow.status}
              </span>
            </h2>
          </div>

          {/* items lists */}
          {!isOperator && (selectedRow.status == "pending" || selectedRow.status == "confirmed") && <div className="flex flex-col gap-1">
            <button className='bg-blue-600 text-white py-[7px] px-[20px] rounded-lg' onClick={() => {setShowItemModal(true)
            }
            }>Show Items</button>
            {showItemModal && <OrderItemModal setShowItemModal={setShowItemModal} selectedItems={selectedItems} setSelectedItems={setSelectedItems} item_details={selectedRow.item_details} />
            }</div>}
          {isOperator && selectedRow.status == "confirmed" &&
           <div className="flex flex-col gap-1">
           <button className='bg-blue-600 text-white py-[7px] px-[20px] rounded-lg' onClick={()=>setShowItemModal(true)}>Show Items</button>
           {showItemModal && <OrderItemModal  setShowItemModal={setShowItemModal} selectedItems={selectedItems} setSelectedItems={setSelectedItems} item_details={selectedRow.item_details} />
           }</div>}
         
          {isOperator&&selectedRow.status=="confirmed"? <div className='w-full mt-4'>
          <Link to={textToCopy}
                      onClick={()=>{navigate(textToCopy)}}
                      className="w-full bg-green-500 rounded-md  py-[8px] flex items-center justify-center  gap-[20px] hover:bg-green-400 text-white"
                  >
                    
                      Pay
                    </Link>
            </div>:""}
          {/* buttons */}
          <div className="flex gap-3 mt-4">
            {isOperator
              ? selectedRow.status === 'pending' && (
                  <>
                    <Button
                      onClick={handleCancelOrder}
                      className="w-full flex items-center gap-[10px] bg-slate-500 hover:bg-slate-400 text-white"
                  >
                    {cancelOrderLoading?<Loading size={20}/>:""}
                      Cancel
                    </Button>
                  </>
                )
              :
            
              (selectedRow.status === 'pending' || selectedRow.status == "payment-pending") && (
                  <>
                    <Button
                      onClick={handleRejectOrder}
                      className="w-full bg-red-500 flex items-center gap-[20px] hover:bg-red-400 text-white"
                  >
                    {rejectOrderLoading?<Loading size={20}/>:""}
                      Reject
                    </Button>
                    <Button
                      onClick={handleCompleteOrder}
                      className="w-full bg-blue-600 flex items-center gap-[20px] hover:bg-blue-500 text-white"
                  >
                    {confirmOrderLoading?<Loading size={20}/>:""}
                      Confirm
                    </Button>
                  </>
                )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default OrderModal;

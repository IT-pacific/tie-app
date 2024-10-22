import DataTable from '@/components/common/DataTable';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItem,
} from '@/store/actions/cartActions';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import { items, Order } from '@/types';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { CartColumns } from './CartItemCOlumns';
import QunatityModal from './QunatityModal';
import { displayNumbers, generateRandomNumber } from '@/utils/usableFunc';
import { Button } from '@/components/ui/button';
import { clearCart } from '@/store/reducers/CartReducer';
import { useNavigate, useParams } from 'react-router';
import { addOrder } from '@/store/actions/orderActions';
import Modal from '@/components/payment/PaymentModal';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CurrentCart = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handlePayClick = () => {
    setModalOpen(true);
  };
  const user=useSelector<AppState>((state)=>state.auth.user)
  const { id } = useParams() as any;
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state: AppState) => state.cart);
  const [selectedCartItem, setSelectedCartItem] = useState<items | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
const navigate=useNavigate()
  const retailers = [
    'Bob Smith',
    'David Brown',
    'Catherine Green',
    'Alice Johnson',
    'Eva White',
  ];

  const handleQuantityAdditionModal = (row: Row<items>) => {
    
    const selectedRow = row.original;
    setSelectedCartItem(selectedRow);
    setShowUpdateModal(true);
  };

  const handleSubmit = async (values: { quantity: number }) => {
    try {
      if (selectedCartItem) {
        const existingCartItem = cartItems?.find(
          (cartItem) => cartItem._id === selectedCartItem._id
        );
        if (existingCartItem) {
          const updatedItem: items = {
            ...selectedCartItem,
            quantity: values.quantity,
          };
          const response = await dispatch(updateCartItem(updatedItem));
          if (response.payload) setShowUpdateModal(false);
        } else {
          const newItem: items = {
            ...selectedCartItem,
            quantity: values.quantity,
          };
          const response = await dispatch(addItemToCart(newItem));
          if (response.payload) setShowUpdateModal(false);
        }
      } else {
        throw new Error('there is no selected item');
      }
    } catch (error: any) {
      throw new Error(error instanceof Error?error.message:"Something went wrong whilee adding item to ");
    
    }
  };

  const handleDelete = async (row: Row<items>) => {
    try {
      const selectedItem = row.original;
      const response = await dispatch(removeItemFromCart(selectedItem._id));
    } catch (error: any) {
      throw new Error(error instanceof Error?error.message:"Something went wrong while removing item from cart ");
    }
  };
  // Calculate the total price of all items in the cart
  const getTotalPrice = () => {
    return (
      cartItems?.reduce((total, item) => {
        return total + item.unitPrice * (item.quantity || 1);
      }, 0) || 0
    );
  };

  const handleCartClear = async () => {
    try {
      dispatch(clearCart());
    } catch (error: any) {
      throw new Error(error instanceof Error?error.message:"Something went wrong while clearing cart ");
    }
  };

  function getRandomRetailer() {
    const randomIndex = Math.floor(Math.random() * retailers.length);
    return retailers[randomIndex];
  }
  
  const handleOrderNow = async () => {
    try {
      if (user != null) {
        if (cartItems) {
          const newOrder: Order = {
            order_id: 'order' + generateRandomNumber(),
            retail_id:user,
            link_id:id,
            createdAt: new Date().toISOString(),
            paymentProof: '',
            status: 'pending',
            item_details: cartItems.map((cartItem) => ({
              ...cartItem,
              item: cartItem._id,
              quantity:cartItem.quantity
            })),
          };
  
          const response = await dispatch(addOrder(newOrder));
  
          if (response.payload) dispatch(clearCart());
          setModalOpen(false);
          toast.success('Order successfully placed');
        } else {
          throw new Error("Nothing in cart");
        }
      }
      else {
        toast.error("Login to continue")
        navigate(`/auth/login?redirect=/items/${id}`)
      }
   
    } catch (error: any) {
      throw new Error(error instanceof Error?error.message:"Something went wrong ");
    }
  };
  
  return (
    <div className="w-full border border-gray-200 rounded-lg p-3 h-full">
      <h2 className="font-medium text-base py-2">Cart</h2>
      <div className="flex flex-col gap-3">
        <DataTable
          columns={CartColumns}
          message={'No cart items yet'}
          limit={5}
          page={0}
          data={cartItems ? cartItems : []}
          ColumnsNames={['name', 'quantity', 'price']}
          actions
          deleteAction
          addCartItems
          handleQuantityAdditionModal={handleQuantityAdditionModal}
          handleView={handleQuantityAdditionModal}
          handleDelete={handleDelete}
        />
        <div className="py-2 flex items-center justify-between">
          <h2 className="font-normal text-base text-black">Total Cost:</h2>
          <h2 className="font-semibold text-blue-600">
            {displayNumbers(getTotalPrice())} Frw
          </h2>
        </div>
        <div className="flex items-center justify-end gap-3">
          {cartItems !== null && (
            <>
              <Button
                onClick={handleCartClear}
                className="bg-red-600 text-white"
              >
                <h2 className="font-normal text-sm">Remove all</h2>
              </Button>
              <Button
                onClick={handleOrderNow}
                className="bg-blue-600 text-white"
              >
                <h2 className="font-normal text-sm">Order Now</h2>
              </Button>
            </>
          )}
        </div>
      </div>
      <QunatityModal
        handleSubmit={handleSubmit}
        selectedItem={selectedCartItem}
        setShowQuantityModal={setShowUpdateModal}
        showQuantityModal={showUpdateModal}
      />
      {/* Modal for payment options */}
      {/* <Modal
        pricing={{ discount: 0, shipping: 0, originalPrice: getTotalPrice() }}
        handlePaymentSuccess={handleOrderNow}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      /> */}
    </div>
  );
};

export default CurrentCart;

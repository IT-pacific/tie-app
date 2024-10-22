import DataTable from '@/components/common/DataTable';
import { stockItems } from '@/constants/Orders';
import { addItemToCart, updateCartItem } from '@/store/actions/cartActions';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import { items } from '@/types';
import { Row } from '@tanstack/react-table';
import { FC, useEffect, useState } from 'react';
import { ItemsColumns } from './itemsCOlumns';
import QunatityModal from './QunatityModal';
import { getItemsByLink } from '@/store/actions/linkActions';
import { Icon } from '@iconify/react';

type Props = {
  id?: string;
};
const CurrentInventory: FC<Props> = ({ id }) => {
  const dispatch = useAppDispatch();

  const { cartItems } = useAppSelector((state: AppState) => state.cart);
  const { linkItems, itemsLoading,company} = useAppSelector(
    (state: AppState) => state.link
  );

  const {user} = useAppSelector((state:AppState)=>state.auth)
  const isOperator = user?.role === "operator"
const isReceptionist=user?.role=="receptionist"
  const [selectedItem, setSelectedItem] = useState<items | null>(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const handleQuantityAdditionModal = (row: Row<items>) => {
    const selectedRow = row.original;
 
    setSelectedItem(selectedRow);
    setShowQuantityModal(true);
  };

  useEffect(() => {
    dispatch(getItemsByLink(id));
  }, []);

  const handleSubmit = async (values: { quantity: number }) => {
    try {
      if (selectedItem) {
        const existingCartItem = cartItems?.find(
          (cartItem) => cartItem._id === selectedItem._id
        );
        if (existingCartItem) {
          const updatedItem: items = {
            ...selectedItem,
            quantity: values.quantity,
          };
          const response = await dispatch(updateCartItem(updatedItem));
          if (response.payload) setShowQuantityModal(false);
        } else {
          const newItem: items = {
            ...selectedItem,
            quantity: values.quantity,
          };
          const response = await dispatch(addItemToCart(newItem));
          if (response.payload) setShowQuantityModal(false);
        }
      } else {
        throw new Error('there is no selected item');
      }
    } catch (error) {
      throw new Error(error instanceof Error?error.message:"Something went wrong ");
    }
  };
  return (
    <div className="h-full border border-gray-200 rounded-lg p-3">
      <div className='flex py-[20px] flex-col gap-[4px]'>
      <p className='font-[600] text-[20px]'>Contact Address</p>
      <div className='flex items-center'>Company name: {company?.companyName}</div>
      <p>Email:{company?.email}</p>
      <p>Phone:{company?.phoneNumber}</p>
      </div>
     

      <h2 className="font-medium text-base py-2">Avalable inventory</h2>
      <DataTable
        columns={ItemsColumns}
        message={'No Items yet'}
        limit={5}
        page={0}
        loading={itemsLoading}
        loadingMessage="current inventory loading..."
        data={linkItems ? (linkItems as items[]) : []}
        ColumnsNames={['name', 'quantity', 'price']}
        addCartItems
        handleQuantityAdditionModal={handleQuantityAdditionModal}
      />

      {!isReceptionist && <QunatityModal
        handleSubmit={handleSubmit}
        selectedItem={selectedItem}
        setShowQuantityModal={setShowQuantityModal}
        showQuantityModal={showQuantityModal}
      />}
    </div>
  );
};

export default CurrentInventory;

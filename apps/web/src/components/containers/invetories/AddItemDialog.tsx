import * as Yup from 'yup';
import { items } from '@/types';
import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addItem, deleteItem, updateItem } from '@/store/actions/itemAction';
import ItemForm1, { ItemForm2 } from '@/components/common/forms/ItemForm1';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import toast from 'react-hot-toast';

type Props = {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem?: items | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<items | null>>;
};

type initialValues = {
  name: string;
  description: string;
  quantityUnit: 'kilogram (kg)' | 'litre (l)' | 'meter (m)' | 'others';
  itemType: 'Finished Product' | 'Raw material' | 'others';
  unitPrice: number;
  batchNo: number;
  quantity: number;
};

type Tab = 'basic' | 'advanced';

const AddItemDialog = ({
  dialogOpen,
  setDialogOpen,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState<Tab>('basic');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedItem ? new Date(selectedItem.createdAt) : new Date()
  );

  const { fetchLoading, addLoading, updateLoading, deleteLoading } =
    useAppSelector((state: AppState) => state.items);

  const initialValues: initialValues = selectedItem
    ? {
        name: selectedItem.name || '',
        description: selectedItem.description || '',
        quantityUnit: selectedItem.quantityUnit || 'kilogram (kg)',
        itemType: selectedItem.itemType || 'Finished Product',
        unitPrice: selectedItem.unitPrice || 0,
        batchNo: selectedItem.batchNo || 0,
        quantity: selectedItem.quantity || 0,
      }
    : {
        name: '',
        description: '',
        quantityUnit: 'kilogram (kg)',
        itemType: 'Finished Product',
        unitPrice: 0,
        batchNo: 0,
        quantity: 0,
      };

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Item name is required'),
    quantity: Yup.number()
      .min(1, 'Below minimum quantity')
      .required('Quantity is required'),
    quantityUnit: Yup.mixed<initialValues['quantityUnit']>().oneOf([
      'kilogram (kg)',
      'litre (l)',
      'meter (m)',
      'others',
    ]),
    itemType: Yup.mixed<initialValues['itemType']>().oneOf([
      'Finished Product',
      'Raw material',
      'others',
    ]),

    description: Yup.string()
      .required('Description is required')
      .min(8, 'At least 8 characters of description'),

    unitPrice: Yup.number()
      .min(1, 'Below minimum price')
      .required('Unit price is required'),
    batchNo: Yup.number(),
  });

  const handleSubmit = async (values: initialValues) => {
    try {
      if (!selectedItem) {
        const newItem: Partial<items> = {
          name: values.name,
          description: values.description,
          quantity: values.quantity,
          expirationDate: selectedDate
            ? selectedDate.toISOString()
            : new Date().toISOString(),
          unitPrice: values.unitPrice,
          createdAt: new Date().toISOString(),
          batchNo: values.batchNo,
          itemType: values.itemType,
          quantityUnit: values.quantityUnit,
        };
        const response = await dispatch(addItem(newItem));
        if (response.payload) {
          setDialogOpen(false);
          setSelectedTab('basic');
        }
      } else {
        const updatedItem: Partial<items> = {
          ...selectedItem,
          name: values.name,
          description: values.description,
          quantity: values.quantity,
          expirationDate: selectedDate
            ? selectedDate.toISOString()
            : new Date().toISOString(),
          unitPrice: values.unitPrice,
          batchNo: values.batchNo,
          itemType: values.itemType,
          quantityUnit: values.quantityUnit,
        };
        const response = await dispatch(
          updateItem({ item: updatedItem, itemId: updatedItem._id })
        );
        if (response.meta.requestStatus === 'fulfilled') {
          setDialogOpen(false);
          setSelectedItem(null);
          setSelectedTab('basic');
        }
      }
    } catch (error) {
      throw new Error(error instanceof Error?error.message:"Something while adding element ");
    }
  };

  const handleNext = () => {

    setSelectedTab('advanced');
  };

  const handleBack = () => {
    if (selectedTab === 'basic') setDialogOpen(false);
    else setSelectedTab('basic');
  };

  const handleDelete = async () => {
    try {
      if (selectedItem) {
        const response = await dispatch(deleteItem(selectedItem?._id));
        if (response.meta.requestStatus === 'fulfilled') {
          setDialogOpen(false);
          setSelectedItem(null);
          setSelectedTab('basic');
        }
      } else {
        toast.error('Nothing to delete');
      }
    } catch (error) {
      throw new Error(error instanceof Error?error.message:"Something went wrong while deleting item ");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        aria-describedby=""
        className={'max-w-[600px] bg-white p-5 transition-all duration-200'}
      >
        <DialogTitle className="text-base font-medium">Add Item</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <>
              {selectedTab === 'basic' ? (
                <>
                  <ItemForm1 selectedItem={selectedItem} />
                 
                 
                </>
              ) : (
                <ItemForm2
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              )}
              <div className="flex gap-3 items-center">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="w-full bg-blue-500 text-white rounded-lg mt-3"
                >
                  {selectedTab === 'basic' ? 'Cancel' : 'Back'}
                </Button>
                {selectedItem && selectedTab === 'advanced' && (
                  <Button
                    disabled={deleteLoading}
                    type="button"
                    onClick={handleDelete}
                    className="w-full bg-red-500 text-white rounded-lg mt-3"
                  >
                    {deleteLoading ? 'Deleting item...' : 'Delete item'}
                  </Button>
                )}
                <Button
                  type="button"
                  disabled={fetchLoading || addLoading || updateLoading}
                  onClick={() =>
                    selectedTab === 'basic'
                      ? handleNext()
                      : handleSubmit()
                  }
                  className="w-full bg-blue-500 text-white rounded-lg mt-3"
                >
                  {selectedTab === 'advanced'
                    ? selectedItem
                      ? fetchLoading || addLoading || updateLoading
                        ? 'Loading...'
                        : 'Update Item'
                      : 'Add Item'
                    : 'Next'}
                </Button>
              </div>
            </>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;

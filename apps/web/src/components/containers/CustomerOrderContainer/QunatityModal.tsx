import React from 'react';
import AppFormField from '@/components/common/appInputs/AppFormField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AppState, useAppSelector } from '@/store/store';
import { items } from '@/types';
import { ErrorMessage, Formik } from 'formik';
import { FaPlus } from 'react-icons/fa6';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  quantity: Yup.number()
    .required('quantity is required')
    .min(1, 'minimum quantity is 1 item'),
});

type Props = {
  selectedItem: items | null;
  showQuantityModal: boolean;
  setShowQuantityModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (values: { quantity: number }) => void;
};
const QunatityModal: React.FC<Props> = ({
  selectedItem,
  showQuantityModal,
  setShowQuantityModal,
  handleSubmit,
}) => {
  const { cartItems } = useAppSelector((state: AppState) => state.cart);

  const existingCartItem = cartItems?.find(
    (item) => item._id === selectedItem?._id
  );

  return (
    <Dialog
      open={showQuantityModal && selectedItem !== null}
      onOpenChange={setShowQuantityModal}
    >
      <DialogContent
        aria-describedby=""
        className="bg-white w-fit p-5 min-w-[400px] rounded-lg"
      >
        <DialogTitle className="!font-medium">
          {existingCartItem ? 'Update' : 'Add'}{' '}
          <span className="text-blue-600">{selectedItem?.name}</span> to the
          cart
        </DialogTitle>
        <Separator className="bg-gray-100" />
        <div className="flex flex-col">
          <Formik
            initialValues={{
              quantity:
                existingCartItem && selectedItem
                  ? existingCartItem?.quantity
                  : 1,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <>
                {/* quantity Field */}
                <div className="mb-1">
                  <AppFormField
                    name="quantity"
                    type="number"
                    placeholder="quantity"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full bg-blue-500 text-white mt-3 flex items-center gap-3"
                >
                  <FaPlus fontSize={24} className="text-white" />
                  <h2 className="text-sm font-normal text-white">
                    {existingCartItem ? 'Update Cart' : 'Add to Cart'}
                  </h2>
                </Button>
                {existingCartItem && (
                  <h2 className="font-normal">
                    This will replace the quantity for {selectedItem?.name} in
                    the store
                  </h2>
                )}
              </>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QunatityModal;

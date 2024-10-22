import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { items } from "@/types";
import { displayNumbers } from "@/utils/usableFunc";
import { Delete, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import AppFormField from "@/components/common/appInputs/AppFormField";
import { FaPlus } from "react-icons/fa6";

function OrderItemModal({
  item_details,
  selectedItems,
  setSelectedItems,
  setShowItemModal,
}: {
  item_details: items[];
  selectedItems: { item: string; quantity: number }[];
  setSelectedItems: React.Dispatch<React.SetStateAction<{ item: string; quantity: number }[]>>;
  setShowItemModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedItem, setSelectedItem] = useState<{ item: string; quantity: number } | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Validation Schema for Quantity Field
  const validationSchema = Yup.object().shape({
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Minimum quantity is 1 item"),
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowItemModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowItemModal]);

  const handleCheckboxChange = (checked: boolean | string, item: items) => {
    if (checked) {
      setSelectedItems((prevItems) => [...prevItems, { item: item._id, quantity: item.quantity }]);
    } else {
      setSelectedItems((prevItems) => prevItems.filter((i) => i.item !== item._id));
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    console.log(quantity)
    setSelectedItems((prevItems) =>
      prevItems.map((i) => (i.item === itemId ? { ...i, quantity } : i))
    );
  };

  const handleAllChecked = (checked: boolean) => {
    if (checked) {
      setSelectedItems(item_details.map((item) => ({ item: item._id, quantity: item.quantity })));
    } else {
      setSelectedItems([]);
    }
  };

  const handleEditClick = (itemId: string, quantity: number) => {
    setSelectedItem({ item: itemId, quantity });
    setShowUpdateModal(true);
  };

  return (
    <>
      <DialogContent
        onPointerDownOutside={() => setShowItemModal(false)}
        onEscapeKeyDown={() => setShowItemModal(false)}
        className="bg-white embedded-modal w-fit p-5 min-w-[500px] rounded-lg"
        aria-describedby=""
      >
        <DialogTitle className="text-lg font-medium">Available items</DialogTitle>
        <Separator className="bg-gray-300" />
        <div className="flex gap-[10px] items-center">
          <Checkbox
            id="allItems"
            checked={selectedItems.length === item_details.length}
            onCheckedChange={handleAllChecked}
          />
          <label htmlFor="allItems">Select all items</label>
        </div>
        <div className="flex flex-col gap-1 py-3">
          {item_details.map((item, idx) => (
            <label
              htmlFor={item._id}
              key={idx}
              className="flex items-center justify-between py-3 px-2 rounded-md bg-slate-100"
            >
              <div className="flex gap-[10px] items-center">
                <Checkbox
                  checked={selectedItems.some(
                    (i) => i.item === item._id && i.quantity === item.quantity
                  )}
                  onCheckedChange={(checked) => handleCheckboxChange(checked, item)}
                  id={item._id}
                />
                <h2 className="text-xs font-normal">{idx + 1}. {item.name}</h2>
              </div>
              <h2 className="text-xs font-normal">
                {displayNumbers(item.unitPrice)} x {displayNumbers(item.quantity)}
              </h2>
              <h2 className="text-xs font-normal">
                {displayNumbers(item.quantity * item.unitPrice)}
              </h2>
              <div className="flex cursor-pointer items-center justify-center" onClick={() => handleEditClick(item._id, item.quantity)}>
                <Edit />
              </div>
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between gap-[20px]">
          <Button
            onClick={() => {
              setShowItemModal(false);
              setSelectedItems([]);
            }}
            className="w-full bg-red-500 flex items-center gap-[20px] hover:bg-red-400 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setShowItemModal(false)}
            className="w-full bg-blue-600 flex items-center gap-[20px] hover:bg-blue-500 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>

      {/* Quantity Update Modal */}
      <Dialog open={showUpdateModal && selectedItem !== null} onOpenChange={setShowUpdateModal}>
        <DialogContent aria-describedby="" className="bg-white w-fit p-5 min-w-[400px] rounded-lg">
          <Separator className="bg-gray-100" />
          <div className="flex flex-col">
            <Formik
              initialValues={{
                quantity: selectedItem?.quantity || 1,
              }}
              validationSchema={validationSchema}
              onSubmit={({ quantity }) => {
                if (selectedItem) {
                  handleItemQuantityChange(selectedItem.item, quantity);
                }
                setShowUpdateModal(false);
              }}
            >
              {({ handleSubmit }) => (
                <>
                  {/* Quantity Field */}
                  <div className="mb-1">
                    <AppFormField name="quantity" type="number" placeholder="Quantity" />
                    <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="w-full bg-blue-500 text-white mt-3 flex items-center gap-3"
                  >
                    <FaPlus fontSize={24} className="text-white" />
                    <h2 className="text-sm font-normal text-white">Update Item</h2>
                  </Button>
                </>
              )}
            </Formik>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrderItemModal;

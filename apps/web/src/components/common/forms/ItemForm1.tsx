import React from 'react';
import AppFormField from '../appInputs/AppFormField';
import { ErrorMessage, useFormikContext } from 'formik';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DateTimePicker from '../time-picker/date-time-picker-form';
import { items } from '@/types';

type Props = {
  selectedItem?: items | null;
};
type props2 = {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedItem?: items | null;
};

const ItemForm1: React.FC<Props> = () => {
  const { setFieldValue, values } = useFormikContext<Record<string, string>>();
  return (
    <>
      <div className="mb-1">
        <AppFormField name="name" type="text" placeholder="Item Name" />
        <ErrorMessage
          name="name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* desc Field */}
      <div className="mb-1">
        <AppFormField
          name="description"
          type="text"
          placeholder="Item description"
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* quantity Field */}
      <div className="mb-1">
        <AppFormField name="quantity" type="text" placeholder="Quantity" />
        <ErrorMessage
          name="quantity"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      <div className="mb-1">
        <label className="text-sm">Quantity unit</label>
        <Select
          defaultValue={values['quantityUnit']}
          onValueChange={(value) => setFieldValue('quantityUnit', value)}
        >
          <SelectTrigger className="w-full h-10 mt-1 border-[#BDBDBD] focus-within:border-[#918EF4]">
            <SelectValue placeholder={'Select the unit of the qantity'} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Quantity Unit</SelectLabel>
              <SelectItem value="kilogram (kg)">kilogram (kg)</SelectItem>
              <SelectItem value="litre (l)">litre (l)</SelectItem>
              <SelectItem value="meter (m)">meter (m)</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ErrorMessage
          name="quantityUnit"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </>
  );
};

export default ItemForm1;

export const ItemForm2: React.FC<props2> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  return (
    <>
      <div className="mb-1">
        <label className="text-sm">Item Type</label>
        <Select
          defaultValue={values['itemType']}
          onValueChange={(value) => setFieldValue('itemType', value)}
        >
          <SelectTrigger className="w-full h-10 mt-1 border-[#BDBDBD] focus-within:border-[#918EF4]">
            <SelectValue placeholder={'Select the type of item'} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Item Types</SelectLabel>
              <SelectItem value="Finished Product">
                FInished Products
              </SelectItem>
              <SelectItem value="Raw material">Raw materials</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ErrorMessage
          name="itemType"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="mb-1">
        <AppFormField name="unitPrice" type="number" placeholder="Unit Price" />
        <ErrorMessage
          name="unitPrice"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="mb-1">
        <AppFormField name="batchNo" type="number" placeholder="Unit Price" />
        <ErrorMessage
          name="batchNo"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      {/* Username Field */}
      <div className="mb-1">
        <label
          htmlFor={'expiry date'}
          className="flex items-center text-sm capitalize mb-0.5"
        >
          Expiry Date
        </label>
        <DateTimePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
    </>
  );
};

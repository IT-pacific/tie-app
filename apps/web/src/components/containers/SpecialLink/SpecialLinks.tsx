import DataTable from '@/components/common/DataTable';
import { SpecificLinkColumns } from '@/components/common/SpecificLinkColumns';
import DateTimePicker from '@/components/common/time-picker/date-time-picker-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Links } from '@/constants/Orders';
import { Link } from '@/types';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import GeneralLinkModal from '../LinksModals/GeneralLinkModal';
import SelectItemsContainer from '../SelectItemsContainer';
import { Row } from '@tanstack/react-table';
import { useDispatch } from 'react-redux';
import { AppDispatch, AppState, useAppSelector } from '@/store/store';
import {addSpecificLink,deleteLink,getAllLinks } from '@/store/actions/linkActions';
const SpecialLinks = () => {
  const [addLinkDialogVisible, setAddLinkDialogVisible] = useState(false);
  const [selectItemsModal, setSelectItemsModal] = useState(false);
  const { links, addLoading, fetchLoading } = useAppSelector(
    (state: AppState) => state.link
  );
  const { user } = useAppSelector((state: AppState) => state.auth);
  const dispatch = useDispatch<AppDispatch>()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const isOperator = user?.role === 'operator';

  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [selectItems, setSelectItems] = useState(false);

  const handleDialogOpen = () => {
    setAddLinkDialogVisible(true);
  };
  useEffect(() => {
    if (!links?.length) dispatch(getAllLinks());
  }, [dispatch]);

  const showSelectItemsModal = () => {
    setSelectItemsModal(true);
  };

  const handlePreviewOpen = (row: Row<Link>) => {
    const selectedRow = row.original;
    setSelectedLink(selectedRow);
    setShowDialog(true);
  };

  const [selectedItems, setSelectedItems] = useState<string[] | null>(null);
  const handleLinkCreation = () => {
 
    dispatch(
      addSpecificLink({ item_ids: selectedItems, expiresAt: selectedDate })
    );
    setSelectItemsModal(false);
    setAddLinkDialogVisible(false);
    
  };
  const handleItemSelection = (itemId: string) => {
   
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems) {
        const isAlreadySelected = prevSelectedItems.includes(itemId);
        if (isAlreadySelected) {
          return prevSelectedItems.filter((item) => item !== itemId);
        } else {
          return [...prevSelectedItems, itemId];
        }
      } else {
        return [itemId];
      }
    });
  };
  const handleLinkDeletion = async (row: Row<Link>) => {
    const selectedLink = row.original;
    await dispatch(deleteLink(selectedLink._id));
  };

  return (
    <div className="w-full">
      <DataTable<Link>
        columns={SpecificLinkColumns}
        page={0}
        limit={5}
        data={links ? (links.filter((link)=>link.allItems==false) as Link[]) : []}
        handleButtonPress={handleDialogOpen}
        buttonPlaceholder={isOperator?"":"Add Specific Link"}
        ColumnsNames={['']}
        type="Link"
        actions
        deleteAction
        handleView={handlePreviewOpen}
        handleDelete={handleLinkDeletion}
      />
      <div>
        <Dialog
          open={addLinkDialogVisible}
          onOpenChange={setAddLinkDialogVisible}
        >
          <DialogContent className="max-w-[400px] bg-white rounded-lg">
            <h2 className="text-lg font-medium">Add Specific Link</h2>
            <Separator className=" bg-gray-200" />
            <div className="flex items-center justify-between">
              <div className="font-normal flex items-center gap-3 text-[14px] leading-[20px] text-black px-2">
                <Checkbox
                  onCheckedChange={() => {
                    setSelectItems((prev) => !prev);
                  }}
                  checked={selectItems}
                />
                <label
                  htmlFor={'selectItems'}
                  className="capitalize text-black"
                >
                  Select specific items
                </label>
              </div>
              {selectItems && (
                <>
                  <Button
                    onClick={showSelectItemsModal}
                    variant={'secondary'}
                    className="px-3 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-1"
                  >
                    <FaPlus className="text-white" fontSize={14} />
                    <h2 className="text-white text-sm">Select items</h2>
                  </Button>
                </>
              )}
            </div>
            <Separator className=" bg-gray-100" />
            <div className="">
              <h2 className="text-sm font-medium">Expiration Date / Time</h2>
              <div>
                <DateTimePicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
              <div className="pt-5">
                <Button
                  onClick={() => setAddLinkDialogVisible(false)}
                  className="bg-blue-500 rounded-lg py-2 w-full"
                >
                  <h2 className="text-white text-sm">Generate Link</h2>{' '}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* selecting items modal */}
      <Dialog open={selectItemsModal} onOpenChange={setSelectItemsModal}>
        <DialogContent className="bg-white max-w-[1000px]">
          <div className="overflow-auto pt-5">
            <SelectItemsContainer
              handleItemSelection={handleItemSelection}
              selectedItems={selectedItems}
            />
          </div>
          <div className="flex gap-[20px] justify-end w-full">
            <button
              onClick={() => {
                setSelectItemsModal(false);
              }}
              className="bg-slate-300  text-gray-800 rounded-md py-[10px] px-[30px]"
            >
              Cancel
            </button>
            <button
              onClick={handleLinkCreation}
              className="bg-blue-600 text-white rounded-md py-[10px] px-[30px]"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* selected item preview */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {selectedLink && <GeneralLinkModal selectedRow={selectedLink} />}
      </Dialog>
    </div>
  );
};

export default SpecialLinks;

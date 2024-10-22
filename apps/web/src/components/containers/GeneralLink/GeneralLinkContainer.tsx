import DataTable, { DisplayFilters } from '@/components/common/DataTable';
import { LinkColumns } from '@/components/common/LinkColumns';
import DateTimePicker from '@/components/common/time-picker/date-time-picker-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Filter, Link } from '@/types';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import { addLink, deleteLink, getAllLinks } from '@/store/actions/linkActions';
import { Row } from '@tanstack/react-table';
import GeneralLinkModal from '../LinksModals/GeneralLinkModal';
import { Loading } from '@/components/common/Loading';
import { Checkbox } from '@/components/ui/checkbox';
import { FaPlus } from 'react-icons/fa6';

const GeneralLinkContainer = () => {
  const dispatch = useAppDispatch();
  const { links, addLoading, fetchLoading } = useAppSelector(
    (state: AppState) => state.link
  );
  const [selectField, setSelectField] = useState(false);

  const { user } = useAppSelector((state: AppState) => state.auth);
  const isOperator = user?.role === 'operator';

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [addLinkDialogVisible, setAddLinkDialogVisible] = useState(false);


  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const columnNames = ['quantity', 'unitPrice','expirationDate'];

  useEffect(() => {
    dispatch(getAllLinks());
  }, [dispatch]);

  const handleDialogOpen = () => {
    setAddLinkDialogVisible(true);
  };

  const handlePreviewOpen = (row: Row<Link>) => {
    const selectedRow = row.original;
    setSelectedLink(selectedRow);
    setShowDialog(true);
  };

  // link creation
  const handleLinkCreation = async () => {
    const newLink: Partial<Link> = {
      hiddenFields:selectedColumns,
      expiresAt: selectedDate?.toISOString()
        ? selectedDate.toISOString()
        : new Date().toISOString(),
    };
    const response = await dispatch(addLink(newLink));
    // Handle successful creation
    if (addLink.fulfilled.match(response)) {
      setAddLinkDialogVisible(false);
    }
  };

  // link deletion
  const handleLinkDeletion = async (row: Row<Link>) => {
    const selectedLink = row.original;
    await dispatch(deleteLink(selectedLink._id));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedColumns(columnNames);
    } else {
      setSelectedColumns([]);
    }
  };

  const handleColumnSelection = (column: string, checked: boolean|string) => {
    if (checked) {
      setSelectedColumns((prev) => [...prev, column]);
    } else {
      setSelectedColumns((prev) =>
        prev.filter((col) => col !== column)
      );
    }
  };

  return (
    <div className="w-full">
      <DataTable<Link>
        columns={LinkColumns}
        page={0}
        limit={5}
        loading={fetchLoading}
        loadingMessage="Loading Links..."
        data={links ? (links.filter((link) => link.allItems === true) as Link[]) : []}
        message="No links generated yet"
        handleButtonPress={handleDialogOpen}
        buttonPlaceholder={isOperator ? "" : "Add General Link"}
        ColumnsNames={['_id', 'expiresAt', 'createdAt']}
        type="Link"
        actions
        deleteAction
        handleView={handlePreviewOpen}
        handleDelete={handleLinkDeletion}
      />

      <div>
        <Dialog open={addLinkDialogVisible} onOpenChange={setAddLinkDialogVisible}>
          <DialogContent className="max-w-[400px] bg-white rounded-lg">
            <h2 className="text-lg font-medium">Add General Link</h2>
            <Separator className="bg-gray-200" />
            <div className="flex flex-col items-center w-full gap-[10px]">
              <div className="font-normal w-full flex items-center gap-3 text-[14px] leading-[20px] text-black px-2">
                <Checkbox
                  id="selectedField"
                  onCheckedChange={() => {
                    setSelectField((prev) => !prev);
                  }}
                  checked={selectField}
                />
                <label htmlFor="selectedField" className="capitalize text-black">
                  Hide fields
                </label>
              </div >

              {selectField && (
                <div className="flex flex-wrap gap-2 mt-1 w-full">
                  <div className="font-normal flex items-center gap-3 text-[14px] leading-[20px] text-black py-1.5 px-2">
                    <Checkbox
                      id="selectAll"
                      onCheckedChange={handleSelectAll}
                      checked={selectedColumns.length === columnNames.length}
                    />
                    <label htmlFor="selectAll" className="capitalize text-black">
                      Select All
                    </label>
                  </div>
                  <div className='flex flex-wrap gap-[4px]'>
                  {columnNames.map((column, idx) => (
                    <div
                      key={idx}
                      className="font-normal flex items-center gap-3 text-[14px] leading-[20px] text-black py-1.5 px-2"
                    >
                      <Checkbox
                        id={column.toLowerCase()}
                        onCheckedChange={(checked) =>
                          handleColumnSelection(column, checked)
                        }
                        checked={selectedColumns.includes(column)}
                      />
                      <label htmlFor={column.toLowerCase()} className="capitalize text-black">
                        {column}
                      </label>
                    </div>
                  ))}
                    </div>
                  
                </div>
              )}
            </div>

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
                  disabled={addLoading}
                  onClick={handleLinkCreation}
                  className="bg-blue-500 rounded-lg py-2 w-full"
                >
                  {addLoading ? (
                    <Loading size={25} />
                  ) : (
                    <h2 className="text-white text-sm">Generate Link</h2>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          {selectedLink && <GeneralLinkModal selectedRow={selectedLink} />}
        </Dialog>
      </div>
    </div>
  );
};

export default GeneralLinkContainer;

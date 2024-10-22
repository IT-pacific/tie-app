import { useEffect, useState } from 'react';
import { items } from '@/types';
import { Row } from '@tanstack/react-table';

import AddItemDialog from './AddItemDialog';
import DataTable from '@/components/common/DataTable';
import { ItemsColumns } from '@/components/common/ItemColumns';
import { AppState, useAppDispatch, useAppSelector } from '@/store/store';
import UploadExcelDialog from './UploadExcelDialog';
import { fetchItems } from '@/store/actions/itemAction';

const InvetoryTable = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<items | null>(null);

  // global state
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state: AppState) => state.items);

  const { fetchLoading } = useAppSelector((state: AppState) => state.items);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleView = (row: Row<items>) => {
    const selectedRow = row.original;
    setSelectedItem(selectedRow);
    setDialogOpen(true);
  };

  const handleUploadDialog = () => {
    setUploadDialog(true);
  };

  useEffect(() => {
    if (!items?.length) dispatch(fetchItems());
  }, []);

  return (
    <div>
      <DataTable
        columns={ItemsColumns}
        data={items ? (items as items[]) : []}
        message={'No Items yet'}
        limit={5}
        page={0}
        loading={fetchLoading}
        loadingMessage="Loading items..."
        handleView={handleView}
        handleButtonPress={handleDialogOpen}
        buttonPlaceholder="Add Item"
        ColumnsNames={['name', 'quantity', 'price']}
        uploadButtonPlaceholder="Upload Excel sheet"
        handleUploadButton={handleUploadDialog}
      />
      <div>
        <AddItemDialog
          setSelectedItem={setSelectedItem}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedItem={selectedItem}
        />
        <UploadExcelDialog
          uploadDialog={uploadDialog}
          setUploadDialog={setUploadDialog}
        />
      </div>
    </div>
  );
};

export default InvetoryTable;

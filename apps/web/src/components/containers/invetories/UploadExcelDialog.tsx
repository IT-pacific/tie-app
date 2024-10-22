import * as XLSX from 'xlsx';
import { items } from '@/types';
import { FaFileUpload } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Button } from '@/components/ui/button';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { addItem, addManyItem } from '@/store/actions/itemAction';
import { Separator } from '@/components/ui/separator';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { downloadExcel } from '@/utils/usableFunc';

type Props = {
  uploadDialog: boolean;
  setUploadDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadExcelDialog: FC<Props> = ({ uploadDialog, setUploadDialog }) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const {addLoading}=useAppSelector((state)=>state.items)
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension !== 'xlsx') {
        setError('Invalid file format. Please upload an Excel (.xlsx) file.');
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
      });
      

      const mappedData = jsonData.slice(1).map(
        (row: any[]) =>
          ({
            name: row[0],
            description: row[1],
            quantity: row[2]||"",
            quantityUnit: row[3]||"",
            itemType: row[4]||"",
            unitPrice: Number(row[5])||"",
            batchNo: Number(row[6])||"",
            expirationDate: row[7] ? new Date(row[7]) : null,
          }) as Partial<items>
      );
      console.log(mappedData)
      dispatch(addManyItem(mappedData))
      
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (uploadProgress === totalFiles) {
      setUploadDialog(false);
    }
  }, [uploadProgress]);

  return (
    <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
      <DialogContent aria-describedby="" className="max-w-[600px] bg-white">
        <DialogTitle className="text-base !font-medium">
          Upload Excel sheet
        </DialogTitle>
        <Separator className="bg-gray-300 my-2" />
        <div className="flex flex-col">
          <h2 className="text-base font-medium">
            Upload the document in the following format
          </h2>
          <Button
            onClick={() => downloadExcel()}
            variant={'secondary'}
            className="px-3 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 mt-2"
          >
            <FaCloudDownloadAlt className="text-white" fontSize={14} />
            <h2 className="text-white text-sm">Download Template Format</h2>
          </Button>
        </div>
        <Separator className="bg-gray-300 my-2" />
        <div className="flex flex-col">
          <h2 className="text-base font-medium">
            After seeing the Format Upload your Document here
          </h2>
          <div className="flex flex-col">
            <Input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              onClick={handleUploadButtonClick}
              variant={'secondary'}
              className="px-3 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2 mt-2"
            >
              <FaFileUpload className="text-white" fontSize={14} />
              <h2 className="text-white text-sm">
                {addLoading
                  ? `uploading `
                  : 'Upload File'}
              </h2>
            </Button>
            {error && (
              <p className="text-red-500 mt-2 text-xs text-center">{error}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadExcelDialog;

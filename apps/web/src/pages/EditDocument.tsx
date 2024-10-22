import React, { useState, useEffect, useRef } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { PROTECTED_API } from '@/services/axios';
import { v4 as uuidV4 } from 'uuid';
import * as XLSX from 'xlsx';
import { items } from '@/types';
import { FaFileUpload } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTitle, DialogDescription,
  DialogFooter,
  DialogHeader, DialogTrigger} from '@/components/ui/dialog';
import { convertToCellData, downloadExcel } from '@/utils/usableFunc';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '@/store/store';
import { fetchDocumentById, fetchDocuments } from '@/store/actions/documentActions';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router';
import { current } from '@reduxjs/toolkit';


const Document: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentDocument, loading,error } = useSelector((state:AppState) => state.document);

  useEffect(() => {
    dispatch(fetchDocumentById(id));
  }, [dispatch])
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [addDocument, setAddDocument] = useState<boolean>(false);
  const templateSheetData=[
    {
        "r": 0,
        "c": 0,
        "v": {
            "v": "Name",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Name",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    {
        "r": 0,
        "c": 1,
        "v": {
            "v": "Description",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Description",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    {
        "r": 0,
        "c": 2,
        "v": {
            "v": "Quantity",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Quantity",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    {
        "r": 0,
        "c": 3,
        "v": {
            "v": "Quantity Unit",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Quantity Unit",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    {
        "r": 0,
        "c": 4,
        "v": {
            "v": "Item Type",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Item Type",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    {
        "r": 0,
        "c": 5,
        "v": {
            "v": "Unit Price",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Unit Price",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    {
        "r": 0,
        "c": 6,
        "v": {
            "v": "Batch No",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Batch No",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    {
        "r": 0,
        "c": 7,
        "v": {
            "v": "Expiration Date",
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": "Expiration Date",
            "bg": null,
            "bl": 1,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },
    
    {
        "r": 1,
        "c": 2,
        "v": {
            "v": 50,
            "ct": {
                "fa": "General",
                "t": "g"
            },
            "m": 50,
            "bg": null,
            "bl": 0,
            "it": 0,
            "ff": 9,
            "fs": 10,
            "fc": "rgb(0, 0, 0)",
            "ht": 1,
            "vt": 0
        }
    },  
]
  const [sheetData, setSheetData] = useState<any>([]);
  const [workbookData, setWorkbookData] = useState<any>(
   
  );
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
      });

      const mappedData = jsonData.slice(1).map((row: any[]) => ({
        name: row[0],
        description: row[1],
        quantity: row[2] || '',
        quantityUnit: row[3] || '',
        itemType: row[4] || '',
        unitPrice: Number(row[5]) || '',
        batchNo: Number(row[6]) || '',
        expirationDate: row[7] ? new Date(row[7]) : null,
      }) as Partial<items>);

      const headers = [
        'Name',
        'Description',
        'Quantity',
        'Quantity Unit',
        'Item Type',
        'Unit Price',
        'Batch No',
        'Expiration Date',
      ];

      const newSheetData = convertToCellData(headers, mappedData);
      setSheetData(newSheetData);
      console.log(newSheetData)
      setWorkbookData([{ name: 'Sheet 1', color: '', celldata: newSheetData }]);
      setAddDocument(true);
      
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSave = async () => {
    try {
      const newId =currentDocument!=null?currentDocument.id:uuidV4();
      const response = await PROTECTED_API.post('/document/save', {
        id: newId,
        sheets: workbookData,
      });
      console.log('Document saved:', response.data);
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document.');
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-70px)] flex flex-col px-[20px] gap-[30px]">
        <div className="w-full py-[10px]">
          <div className='flex justify-between pb-[15px] items-center'>
            <p className="font-[600] text-[24px]">Document</p>
            <div className='flex items-center gap-[20px]'>
              {currentDocument!=null&& <>
                <button className="border border-slate-300 text-slate-600 px-4 py-2 rounded" onClick={() => {
                  
                    setWorkbookData([{ name: 'Sheet 1', color: '', celldata: templateSheetData }]);
                    setAddDocument(true)
                }}>Use Template</button>
                  <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUploadButtonClick}>Upload File</button>
        
              </>}
                  </div>
          </div>
          <div className="flex justify-between items-center">
           
            {currentDocument!=null && (
              <button
                onClick={handleSave}
                className="border border-slate-300 text-slate-600 px-4 py-2 rounded"
              >
                Save
              </button>
            )}
          </div>
        </div>

    
          {currentDocument!=null ? (
          <div className="flex-1 block w-full overflow-hidden">
            <Workbook
              data={currentDocument!=null&&!loading?currentDocument.sheetData: [{
                name: 'Sheet 1',
                color: '',
                celldata: [],
              }]}
              onChange={(data: any) => {
                setWorkbookData(data);
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-5 border border-dashed border-gray-300 rounded bg-gray-50">
            <div>
                <h2 className="text-xl font-semibold mb-2">{ error?error:"No Document Associated with this link"}</h2>
              <p className="text-gray-600">
                Click "Upload File" to load an Excel document or use the provided template.
                </p>
                <div className='flex items-center mt-4 justify-center gap-[20px]'>
                  <button className="border border-slate-300 text-slate-600 px-4 py-2 rounded" onClick={() => {
                    setSheetData(templateSheetData)
                    setWorkbookData([{ name: 'Sheet 1', color: '', celldata: templateSheetData }]);
                    setAddDocument(true)
                  }}>Use Template</button>
                   <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
                
                <Button 
                className=" bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUploadButtonClick}
              >
                Upload File
              </Button></div>
              
            </div>
          </div>
        )}
      </div>

   
    </>
  );
};

export default Document;

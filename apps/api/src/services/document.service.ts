import Document from "../models/document.model";
import Sheet from "../models/sheet.model";
import { convertToKeyValuePair, removeNullOnlyArrays, revertCellData } from "../utils/document.utils";
export class DocumentService {

  static async saveDocumentWithSheets(id: string, sheets: any[],user:string|undefined) {

    const savedSheets = await Promise.all(
      sheets.map(async (sheetData: any) => {
        return await Sheet.findOneAndUpdate(
          { sheet_id: sheetData.id },
          
          {sheet_name:sheetData.name,data:removeNullOnlyArrays(sheetData.data)},
          { new: true, upsert: true }
        );
      })
    );


    let document = await Document.findOne({ doc_id: id });
    console.log(document)

    if (!document) {

      const lastDocument = await Document.findOne()
        .sort({ doc_name: "desc" })

      let newDocName = 'doc 0001';

      if (lastDocument && lastDocument.doc_name) {

        const lastDocNumber = parseInt(lastDocument.doc_name.split(' ')[1], 10);
        const newDocNumber = lastDocNumber + 1;

      
        newDocName = `doc ${String(newDocNumber).padStart(4, '0')}`;
      }

   
      document = await Document.findOneAndUpdate(
        { doc_id: id },
        {
          user:user,
          doc_name: newDocName,
          sheets: savedSheets.map((sheet) => sheet._id),
        },
        { new: true, upsert: true }
      );
    } else {
      document = await Document.findOneAndUpdate(
        { doc_id: id },
        {
         
          sheets: savedSheets.map((sheet) => sheet._id),
        },
        { new: true }
      );
    }

    return document;
  }
  static async getAllDocuments(user:string|undefined) {
    console.log(user)
    return await Document.find({ user: user });
  }
  static async getDocumentById(user: string|undefined,id:string|undefined) {
    const document = await Document.findById(id)
    if (document?.user?.toString() == user) {
      return await Document.findById(id).populate("sheets")
    }
    else {
      throw new Error("Unauthorized");
    }
  }
  static async generateLink(user: string | undefined, id: string | undefined) {
    if (!user || !id) {
      throw new Error("Invalid parameters: user and id are required.");
    }
  
    const document = await Document.findById(id);
    if (!document) {
      throw new Error("Document not found.");
    }
  
    if (document?.user?.toString() !== user) {
      throw new Error("Unauthorized");
    }
  
    
    const headers = [
      [
        'itemName',
        'description',
        'quantity',
        'quantityUnit',
        'itemType',
        'unitPrice',
        'batchNo',
        'expirationDate',
      ],
    ];
    
    if (document.sheets && document.sheets.length > 0) {
     
   for (const sheetId of document.sheets) {
        const sheet = await Sheet.findById(sheetId);
  
        if (sheet?.data) {
          const sheetFormattedData = sheet.data.slice(1).map((arr: any[]) => {
            return convertToKeyValuePair(headers,arr);  
          });
          
        return sheetFormattedData.flat()
        }
        
      }

      
      
    } else {
      throw new Error("No sheets found in the document.");
    }
  }
  
  
  
}

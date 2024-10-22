import { createSlice } from "@reduxjs/toolkit";
import { fetchDocumentById, fetchDocuments, saveDocument } from "../actions/documentActions";
import { convertToTemplateSheetData } from "@/utils/usableFunc";

interface DocumentState {
  documents: any[]; 
  currentDocument: any | null;
  loading: boolean; 
  error: string | null; 
}

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,
};
const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    resetCurrentDocument: (state) => {
      state.currentDocument=null
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.loading = false;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchDocumentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        
        state.currentDocument = {
          id:action.payload.doc_id,
          sheetData: action.payload.sheets.map((sheet: any, i: number) => {
            return (
    
              {
                name:sheet.name||`Sheet ${i+1}`,
                color:'',
                celldata:sheet.data = convertToTemplateSheetData(sheet.data)
              });
        })
        }
          
      
        
        console.log(state.currentDocument)
        ;
        state.loading = false;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(saveDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDocument.fulfilled, (state, action) => {
        state.currentDocument = action.payload;
        state.loading = false;
      })
      .addCase(saveDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default documentSlice.reducer;
export const{resetCurrentDocument }=documentSlice.actions
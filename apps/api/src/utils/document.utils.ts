export function removeNullOnlyArrays(arrays: any[][]): any[][] {
  return arrays.filter(array => !array.every(item => item === null));
}

export function revertCellData(celldata: any[]): any[] {
  const rows: { [key: number]: any[] } = {};

  celldata.forEach(cell => {
    if (cell !== null && cell.v !== undefined) {  
      const { r, c, v } = cell;
      if (!rows[r]) {
        rows[r] = [];
      }
      rows[r][c] = v.v; 
    }
  });
  console.log(celldata)

  const headers = rows[0] || []; 


  const result = Object.keys(rows)
    .filter(row => row !== '0') 
    .map(row => {
      const rowData = rows[parseInt(row, 10)] || [];  
      const obj: { [key: string]: any } = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = rowData[index] !== undefined ? rowData[index] : null;  
      });
      return obj;
    });
  console.log(result)

  return result;
}

export function convertToKeyValuePair(headers: string[][], cellData: any[]): { [key: string]: any }[] {
  const result: { [key: string]: any }[] = [];
  const rowData = cellData;

  const item: { [key: string]: any } = {};
  headers[0].forEach((header: string, index: number) => {
    const cellValue = rowData[index] ? rowData[index].v : null;
    item[header] = cellValue;
  });

  result.push(item);
  return result;
}


export function generateRandomNumber(): string {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `${randomNumber}`;
}

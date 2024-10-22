import { items } from '@/types';
import moment from 'moment';
import * as XLSX from 'xlsx';

export function formatPercentage(number: number): string {
  return `${parseFloat(number.toFixed(2))}%`;
}

// format number

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

//   displaying numbers with commas
export const displayNumbers = (num: number): string => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// format time ago
export function formatTimeAgo(date: Date) {
  const now = moment();
  const createdAt = moment(date);

  const years = now.diff(createdAt, 'years');
  if (years > 0) return `${years}years ago`;

  const months = now.diff(createdAt, 'months');
  if (months > 0) return `${months}months ago`;

  const weeks = now.diff(createdAt, 'weeks');
  if (weeks > 0) return `${weeks}weeks ago`;

  const days = now.diff(createdAt, 'days');
  if (days > 0) return `${days}days ago`;

  const hours = now.diff(createdAt, 'hours');
  if (hours > 0) return `${hours}hrs ago`;

  const minutes = now.diff(createdAt, 'minutes');
  if (minutes > 0) return `${minutes}min ago`;
  return `just now`;
}

// total price of orders

export function findTotalPricePerOrder(items: items[]) {
  const total = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  return displayNumbers(parseFloat(total.toFixed(2)));
}

// items in stock
export function checkOrderStock(items: items[]) {
  const lowStockItems = items.filter((item) => item.quantity <= 5);
  return lowStockItems.length;
}

export function generateRandomNumber(): string {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `${randomNumber}`;
}

// Function to download the template or items

export const downloadExcel = (items?: items[]) => {
  const headers = [
    [
      'Item Name',
      'Description',
      'Quantity',
      'Quantity Unit',
      'Item Type',
      'Unit Price',
      'Batch No',
      'Expiration Date',
    ],
  ];

  const dummyData = [
    [
      'Sample Item 1',
      'Sample description 1',
      50,
      'kilogram (kg)',
      'Finished Product',
      10.99,
      1001,
      '2025-12-31',
    ],
    [
      'Sample Item 2',
      'Sample description 2',
      100,
      'litre (l)',
      'Raw material',
      5.5,
      2002,
      '2024-11-30',
    ],
    [
      'Sample Item 3',
      'Sample description 3',
      30,
      'meter (m)',
      'Others',
      15.75,
      3003,
      '2026-10-15',
    ],
  ];

  const data = items
    ? items.map((item) => [
        item.name,
        item.description,
        item.quantity,
        item.quantityUnit,
        item.itemType,
        item.unitPrice,
        item.batchNo,
        item.expirationDate,
      ])
    : dummyData;

  const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');

  XLSX.writeFile(workbook, 'items.xlsx');
};

export const formatId = (id: string): string => {
  if (id.length <= 14) return id;
  const firstPart = id.slice(0, 6);
  const lastPart = id.slice(-6);
  return `${firstPart}.....${lastPart}`;
};

export function getFullDomainUrl() {
  const { protocol, hostname, port } = window.location;
  const portPart = port ? `:${port}` : '';
  return `${protocol}//${hostname}${portPart}`;
}
export const formatDate = (inputDate: Date): string => {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - new Date(inputDate).getTime()) / 1000);

  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  if (secondsAgo < 60) {
    return 'Just now';
  }
  if (minutesAgo < 60) {
    return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
  }
  if (hoursAgo < 24) {
    return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
  }
  if (daysAgo === 0) {
    return 'Today';
  }
  if (daysAgo === 1) {
    return 'Yesterday';
  }

  if (daysAgo <= 30) {
    return `${daysAgo} days ago`;
  }

  if (daysAgo > 30) {
    return `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`;
  }
  return '';
};


export function hashCode(str: string) {
  let hash = 0;
  let i;
  let chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i += 1) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; 
  }
  return hash;
}

export function convertToFortuneSheetFormat(data:any,isBold?:boolean) {
  const formattedData = data.map((item: any) => [
    {
      m: item.name,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.name,
      "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    },
    {
      m: item.description,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.description,
       "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    },
    {
      m: item.quantity,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.quantity,
       "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    },
    {
      m: item.quantityUnit,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.quantityUnit,
       "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    },
    {
      m: item.itemType,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.itemType,
       "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    },
    {
      m: item.unitPrice,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.unitPrice,
       "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    },
    {
      m: item.batchNo,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.batchNo,
       "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    },
    {
      m: item.expirationDate,
      "ct": {
        "fa": "General",
        "t": "g"
      },
      "v": item.expirationDate,
       "bl": isBold?1:0,
      "it": 0,
      "fc": "#000000",
      "fs": 18
    }
]);
  
  const fortuneSheetFormat = [ ...formattedData];

  return fortuneSheetFormat;
}

export function convertToCellData(headers:any[],items:any[]) {
  const celldata:any[] = [];


  headers.forEach((header, c) => {
      celldata.push({
          r: 0,
          c: c,
          v: {
              v: header,
              ct: {
                  fa: "General",
                  t: "g"
              },
              m: header,
              bg: null,
              bl: 1,
              it: 0,
              ff: 9,
              fs: 10,
              fc: "rgb(0, 0, 0)",
              ht: 1,
              vt: 0
          }
      });
  });
  items.forEach((item, r) => {
      celldata.push(
          {
              r: r + 1,
              c: 0,
              v: {
                  v: item.name,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.name,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          },
          {
              r: r + 1,
              c: 1,
              v: {
                  v: item.description,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.description,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          },
          {
              r: r + 1,
              c: 2,
              v: {
                  v: item.quantity,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.quantity,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          },
          {
              r: r + 1,
              c: 3,
              v: {
                  v: item.quantityUnit,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.quantityUnit,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          },
          {
              r: r + 1,
              c: 4,
              v: {
                  v: item.itemType,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.itemType,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          },
          {
              r: r + 1,
              c: 5,
              v: {
                  v: item.unitPrice,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.unitPrice,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          },
          {
              r: r + 1,
              c: 6,
              v: {
                  v: item.batchNo,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.batchNo,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          },
          {
              r: r + 1,
              c: 7,
              v: {
                  v: item.expirationDate,
                  ct: {
                      fa: "General",
                      t: "g"
                  },
                  m: item.expirationDate,
                  bg: null,
                  bl: 0,
                  it: 0,
                  ff: 9,
                  fs: 10,
                  fc: "rgb(0, 0, 0)",
                  ht: 1,
                  vt: 0
              }
          }
      );
  });

  return celldata ;
}

export function convertToTemplateSheetData(input: any[][]): any[] {
  const result: any[] = [];
  input.forEach((row, rowIndex) => {
    row.forEach((item, colIndex) => {
      if (item !== null && item !== undefined) {
        result.push({
          r: rowIndex, 
          c: colIndex, 
          v:item,
        });
      }
    });
  });

  console.log(result)
  return result;
}





// "r": 0,
//         "c": 0,
//         "v": {
//             "v": "Name",
//             "ct": {
//                 "fa": "General",
//                 "t": "g"
//             },
//             "m": "Name",
//             "bg": null,
//             "bl": 1,
//             "it": 0,
//             "ff": 9,
//             "fs": 10,
//             "fc": "rgb(0, 0, 0)",
//             "ht": 1,
//             "vt": 0
//         }
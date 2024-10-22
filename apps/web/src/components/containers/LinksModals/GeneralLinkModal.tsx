'use client';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/types';
import { formatId, getFullDomainUrl } from '@/utils/usableFunc';
import moment from 'moment';
import React, { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa6';

type Props = {
  selectedRow: Link;
};
const GeneralLinkModal: React.FC<Props> = ({ selectedRow }) => {
  const textToCopy = `${getFullDomainUrl()}/items/${
    selectedRow._id
  }`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error: any) {
      throw new Error(error instanceof Error?`Failed to copy ${error.message}`:"Something went wrong ");
    }
  };
  return (
    <DialogContent
      className="bg-white w-fit p-5 min-w-[400px] rounded-lg"
      aria-describedby=""
    >
      <DialogTitle className="text-lg font-medium">General Link</DialogTitle>
      <Separator className="bg-gray-300" />
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h2 className="text-base font-medium">Link Information</h2>
          <Separator className="bg-gray-300 my-3" />
          {/* order link */}
          <div className="flex items-center py-2 px-3 justify-between rounded-lg border border-gray-200">
            <h2 className="text-blue-500 text-xs">
              Share the link with the customer for them to order from your
              inventory
            </h2>
          </div>
          {selectedRow.status === 'expired' && (
            <h2 className="text-red-600 text-xs">
              Order link expired. You can update the expiration date.
            </h2>
          )}
          {/* order link */}
          <div className="flex items-center py-2 px-3 justify-between rounded-lg border border-gray-200">
            <h2 className="flex items-center text-sm">
              Order Link:{' '}
              <a className="text-blue-600" href={textToCopy}>
                /items/{formatId(selectedRow._id)}
              </a>
            </h2>
            {!copied ? (
              <Button
                variant={'outline'}
                disabled={copied}
                onClick={handleCopy}
                className="border border-blue-600"
              >
                <FaRegCopy fontSize={12} className="text-blue-600" />
              </Button>
            ) : (
              <Button variant={'outline'} className="border border-blue-600">
                <h2 className="text-xs font-normal text-blue-600">copied</h2>
              </Button>
            )}
          </div>
          {/* order details */}
          <div className="flex flex-col gap-0.5 p-3 my-3 border border-gray-200 rounded-lg">
            <h2 className="flex items-center text-xs gap-1 font-medium">
              Link number:
              <span className="font-normal">{selectedRow._id}</span>
            </h2>
            <h2 className="flex items-center text-xs gap-1 font-medium">
              Created:
              <span className="font-normal">
                {moment(selectedRow.createdAt).format('DD/MM/YY , h:mm:ss')}
              </span>
            </h2>
            <h2 className="flex items-center text-xs gap-1 font-medium">
              Expiry:
              <span className="font-normal">
                {moment(selectedRow.expiresAt).format('DD/MM/YY , h:mm:ss')}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default GeneralLinkModal;

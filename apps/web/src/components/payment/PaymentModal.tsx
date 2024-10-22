import React, { useState } from 'react';
import PaymentProofModal from './PaymentProof';
import toast from 'react-hot-toast';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handlePaymentSuccess: () => void,
  pricing: {
    discount: number,
    originalPrice: number,
    shipping:number,
  }
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose,handlePaymentSuccess,pricing}) => {
  if (!isOpen) return null;
  const [isPaymentProofOpen, setIsPaymentProofOpen] = useState(false);

 

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentProofOpen(true); 
  };



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
       <section className="bg-white rounded-lg  p-8 antialiased  md:py-16">
    <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Payment</h2>
  
        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
          <form action="#" className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-smsm:p-6 lg:max-w-xl lg:p-8">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-900 "> Full name (as displayed on card)* </label>
                <input type="text" id="full_name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 600 gray-400 primary-500 primary-500" placeholder="Bonnie Green" required />
              </div>
  
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="card-number-input" className="mb-2 block text-sm font-medium text-gray-900 "> Card number* </label>
                <input type="text" id="card-number-input" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  600 gray-400 primary-500 primary-500" placeholder="xxxx-xxxx-xxxx-xxxx" pattern="^4[0-9]{12}(?:[0-9]{3})?$" required />
              </div>
  
              <div>
                <label htmlFor="card-expiration-input" className="mb-2 block text-sm font-medium text-gray-900 ">Card expiration* </label>
                <div className="relative top-[20px]">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                    <svg className="h-4 w-4 text-gray-500 400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fill-rule="evenodd"
                        d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                    </div>
                <input type="text" id="cvv-input" aria-describedby="helper-text-explanation" className="block pl-[35px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 600 gray-400 primary-500 primary-500"  required />
                    
              </div>
              <div>
                <label htmlFor="cvv-input" className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 ">
                  CVV*
                  <button data-tooltip-target="cvv-desc" data-tooltip-trigger="hover" className="text-gray-400 hover:text-gray-900 500 white">
                    <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <div id="cvv-desc" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300">
                    The last 3 digits on back of card
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </label>
                <input type="number" id="cvv-input" aria-describedby="helper-text-explanation" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 600 gray-400 primary-500 primary-500" placeholder="•••" required />
              </div>
                </div>
                <div className='flex items-center gap-[20px]'>
            <button onClick={onClose}  className="flex w-full items-center justify-center rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-black hover:bg-slate-400 focus:outline-none focus:ring-4  focus:ring-primary-300 600 primary-700 primary-800">Cancel</button>

                <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-blue-600  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 600 primary-700 primary-800" onClick={handlePayNow}>Pay now</button>

                </div>
  
          </form>
  
          <div className="mt-6 min-w-[270px] grow sm:mt-8 lg:mt-0">
            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 800">
              <div className="space-y-2">
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 400">Original price</dt>
                      <dd className="text-base font-medium text-gray-900 ">{pricing.originalPrice} frw</dd>
                </dl>
  
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 400">Discount</dt>
                  <dd className="text-base font-medium text-green-500"> {pricing.discount} frw</dd>
                </dl>
  
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 400">Store Pickup</dt>
                  <dd className="text-base font-medium text-gray-900 ">{pricing.shipping} frw</dd>
                </dl>

              </div>
  
              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                <dt className="text-base font-bold text-gray-900 ">Total</dt>
                <dd className="text-base font-bold text-gray-900 ">{pricing.originalPrice-pricing.discount} frw</dd>
              </dl>
            </div>
  
            
          </div>
        </div>
  
        
      </div>
        </div>
        <PaymentProofModal
          isOpen={isPaymentProofOpen} 
          onClose={() => setIsPaymentProofOpen(false)} 
          onUploadSuccess={handlePaymentSuccess}
        />
  </section>
    </div>
  );
};

export default Modal;
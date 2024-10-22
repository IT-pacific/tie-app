import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { useEffect } from "react";
import { saveAs } from 'file-saver';
function PaymentProof({ paymentProof,setShowPaymentModal}: { paymentProof: string | undefined, setShowPaymentModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPaymentModal(false); 
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowPaymentModal]);
  const handleImageDownload = () => {
    
    const imageURL = import.meta.env.VITE_BASE_URL+'/uploads/'+paymentProof; 
    saveAs(imageURL, new Date(Date.now()).toISOString()+'payment_proof.png'); 
  };
  return (
    <DialogContent
    onPointerDownOutside={()=>{setShowPaymentModal(false)}}
    onEscapeKeyDown={()=>{setShowPaymentModal(false)}}
      
    className="bg-white w-fit embedded-modal p-5 min-w-[500px] rounded-lg"
    aria-describedby=""
  >
    <DialogTitle className="text-lg font-medium">Payment proof</DialogTitle>
      <Separator className="bg-gray-300" />
      <img src={`${import.meta.env.VITE_BASE_URL+'/uploads/'+paymentProof}`} className='w-full object-cover h-[180px]'/>
      <div className="flex items-center justify-between gap-[20px]">
        <Button       
          onClick={() => {
            setShowPaymentModal(false) 
            
          }}    
                      className="w-full bg-red-500 flex items-center gap-[20px] hover:bg-red-400 text-white"
                  >
                   
                      Cancel
                    </Button>
                    <Button
                       onClick={handleImageDownload}  
                      className="w-full bg-blue-600 flex items-center gap-[20px] hover:bg-blue-500 text-white"
                  >
                   
                      Download 
                    </Button>
      </div>
      </DialogContent>
  )
}

export default PaymentProof
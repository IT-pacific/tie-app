import React, { useState } from 'react';

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (file: File) => any;
}

const PaymentProofModal: React.FC<PaymentProofModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Close the modal if it's not open
  if (!isOpen) return null;

  // Handle the file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Set the selected file in the state
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedFile) {
      onUploadSuccess(selectedFile); // Pass the file to the parent component
      onClose(); // Close the modal
    } else {
      alert("Please select a file before submitting."); // Notify the user to select a file
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <section className="bg-white rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900">Upload Payment Proof</h2>

        {/* File input */}
        <input 
          type="file" 
          onChange={handleFileUpload} 
          accept="image/*" 
          required 
        />

        <div className='flex justify-end mt-4'>
          <button 
            onClick={onClose} 
            className="mr-2 rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-black hover:bg-slate-400"
          >
            Cancel
          </button>

          <button 
            onClick={handleSubmit} 
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};

export default PaymentProofModal;

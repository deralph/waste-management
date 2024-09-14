import React from "react";

interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg max-h-full">
        <button className="text-black float-right" onClick={onClose}>
          ✖
        </button>
        <img
          src={imageUrl}
          alt="Waste Item"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Modal;

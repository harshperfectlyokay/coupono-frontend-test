import React from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl mt-8 h-full overflow-y-auto relative">
        {title && <h2 className="text-2xl mb-6">{title}</h2>}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

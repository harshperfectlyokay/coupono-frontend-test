"use client"
import React, { useState } from 'react';
import CronModal from './modals/CronModal';

interface AddCronButtonProps {
  // onCronChange: () => void; // Callback to notify parent about changes
}

const AddCronButton: React.FC<AddCronButtonProps> = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(prev => !prev);
  };

  return (
    <div className="">
      <button onClick={handleClick} className="btn-primary !outline-none mb-10">
        Add New Cron
      </button>
      {openModal && (
        <CronModal onClose={() => {
          setOpenModal(false);
        }} />
      )}
    </div>
  );
};

export default AddCronButton;

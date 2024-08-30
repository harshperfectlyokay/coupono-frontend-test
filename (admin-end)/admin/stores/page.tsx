'use client'
import { useState } from "react";
import StoreTable from "../../../components/admin/StoreTable";
import AddStoreModal from "../../../components/admin/addStoreModel";

const Stores: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };


  return (
    <>
      <div className="w-full p-1">
      <button onClick={handleOpenModal} className="flex justify-center btn-full-width">
        Add Stores
      </button>
      {isModalOpen && <AddStoreModal onClose={handleCloseModal} />}
      </div>
      <StoreTable />
    </>
  );
};

export default Stores;

'use client'
import { useState } from "react";
import OfferTable from "../../../components/admin/OfferTable";
import AddOfferModel from "../../../components/admin/addOfferModel";

const Offers: React.FC = () => {
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
        Add New Coupon
      </button>
      {isModalOpen && <AddOfferModel onClose={() => setIsModalOpen(false)} />}
      </div>
      <OfferTable />
    </>
  );
};

export default Offers;

'use client'
import Link from "next/link";
import Table from "../../../components/admin/Table";
import { useEffect, useState } from "react";
import CategoryTable from "../../../components/admin/CategoryTable";
import AddCategoryModal from "../../../components/admin/addCategoryModel";

const Categories: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    // useEffect(()=>{
    //     async function getAndSetUsers(){
    //         const data = await getUsers()
    //         console.log('data - ',data);
    //     }
    //     getAndSetUsers()
    // },[])
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
        Add Category
      </button>
      {isModalOpen && <AddCategoryModal onClose={handleCloseModal} />}
      </div>
      <CategoryTable />
    </>
  );
};

export default Categories;

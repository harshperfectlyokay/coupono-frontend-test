"use client";

import React, { useEffect, useState } from "react";
// import { deleteCron, updateCronStatus } from "@/services/cronServices";
import { FaEdit, FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa";
import { IoMdRefreshCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import CronModal from "./modals/CronModal";
import Confirmation from "./ConfirmationBox";
import { deleteCron, updateCronStatus } from "@/app/app-service/cronService";
import toast from "react-hot-toast";
import { CronJob } from "@/app/types/cronType";
import { useRouter } from "next/navigation";

interface TableProps {
  columns: string[];
  cronJobs: CronJob[] | null; // Receive cronJobs as a prop
  // onCronChange: () => void; // Callback to notify parent about changes
}


const Table: React.FC<TableProps> = ({ columns, cronJobs }) => {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false);
  const [selectedCronJob, setSelectedCronJob] = useState<CronJob | undefined>(
    undefined
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false); //handling the 

  const handleEdit = (id: string) => {
    const cronToEdit = cronJobs?.find((cron) => cron._id === id);
    console.log("cronToEdit ", cronToEdit)
    if (cronToEdit) {
      setSelectedCronJob(cronToEdit);
      setOpenModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error("Cron is not selected!");
    } else {
      const res = await deleteCron(id);
      if (res.status === 200) {
        router.refresh();
        toast.success(res.message);
      } else {
        console.error("Failed to delete cron job");
      }
    }
  };

  const handleStatusToggle = async (id: string) => {
    if (id) {
      const cronToUpdate = cronJobs?.find((cron) => cron._id === id);
      if (cronToUpdate) {
        const newStatus =
          cronToUpdate.status === "Active" ? "Inactive" : "Active";
        const response = await updateCronStatus(id, newStatus);
        if (response.status === 200) {
          router.refresh();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } else {
      console.log("CronId is not there");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  const openDeleteModal = (cronJob: CronJob) => {
    setSelectedCronJob(cronJob);
    setDeleteModal(true);
  };

  return (
    <div>
      {openModal && (
        <CronModal onClose={handleClose} cronJob={selectedCronJob} />
      )}
      <Confirmation
        isShow={deleteModal}
        setIsShow={setDeleteModal}
        externalMethod={async () => {
          if (selectedCronJob) {
            await handleDelete(selectedCronJob._id);
          }
        }}
        argument="abCategory"
        content={{
          title: "Delete Category",
          body: "Do you really want to delete the category?",
        }}
      />
      <div className="overflow-x-auto sm:w-full">
        <table className="table-responsive border-collapse border border-gray-200">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-2 bg-gray-100"
                >
                  {column}
                </th>
              ))}
              <th className="border border-gray-300 p-2 bg-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {cronJobs?.map((item) => (
              <tr key={item._id} className="border border-gray-300">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    {item[column.toLowerCase() as keyof typeof item] || "N/A"}
                  </td>
                ))}
                <td className="flex gap-2 justify-center p-3.5">
                  <button
                    onClick={() => handleEdit(item._id)}
                    title="Edit CronJob"
                    className="btn btn-edit"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    title="Remove cronJob"
                    className="btn btn-delete"
                  >
                    <MdDelete size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    title="Remove cronJob"
                    className="btn btn-delete"
                  >
                    <IoMdRefreshCircle size={20} />
                  </button>
                  <button
                    onClick={() => handleStatusToggle(item._id)}
                    title={item.status === "Active" ? "Pause" : "Activate"}
                    className="btn btn-active"
                  >
                    {item.status === "Active" ? (
                      <FaRegPauseCircle size={20} />
                    ) : (
                      <FaRegPlayCircle size={20} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

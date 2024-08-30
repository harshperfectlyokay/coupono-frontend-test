"use client";
import { getUsers } from "@/services/userService";
import React, { useEffect, useState } from "react";
import Confirmation from "./ConfirmationBox";
import { MdDelete } from "react-icons/md";
import { FaEdit} from "react-icons/fa";
import { FaCirclePause } from "react-icons/fa6";
import { deleteUser } from "@/services/userService";
import { IoMdRefresh } from "react-icons/io";

// Define a User type with the expected properties
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserTable: React.FC = () => {
  // Define the state with the User type
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
        try {
            const {users} = await getUsers();
            setUsers(users); 
            setLoading(false)
        } catch (error) {
            console.log('error occured while getting users :',error);
            setLoading(false)
        }
      // Set the fetched data to the state
    }
    fetchUsers();
  }, []);
  const handleDelete = async (id: string) => {
    try {
      const data = await deleteUser(id)
      if (data.success) {
        setUsers(users.filter((user)=>user._id != id))
      } else {
        console.log(`Failed to delete user: ${data.message}`)
      }
    } catch (error) {
      console.error('Error occurred while deleting user:', error);
    }
  };
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteModal(true);
  };

  return (
    <div className="container px-2 py-4 mx-auto">
      <div className="overflow-x-auto sm:w-full">
        {loading && <h1 className="">Loading...</h1>}
        {!loading && (
          <table id="userTable" className="max-w-min md:min-w-full">
            <thead>
              <tr className="bg-stone-700 text-white text-left">
                <th className="px-4 py-2 border ">Name</th>
                <th className="px-4 py-2 border ">Email</th>
                <th className="px-4 py-2 border ">Role</th>
                <th className="px-4 py-2 border ">Action</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, index) => (
                  <tr key={index} className="bg-slate-100 hover:bg-white">
                    <td className="px-4 py-2 border ">{user.name}</td>
                    <td className="px-4 py-2 border ">{user.email}</td>
                    <td className="px-4 py-2 border ">{user.role}</td>
                    <td className=" py-4 border-t flex justify-center gap-4">
                      <button
                        className=""
                        onClick={() => openDeleteModal(user)}
                      >
                        <MdDelete size={20} />
                      </button>
                      <button
                        // onClick={}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        // onClick={}
                      >
                        <FaCirclePause size={20} />
                      </button>
                      <button
                        // onClick={}
                      >
                        <IoMdRefresh size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <Confirmation
              isShow={deleteModal}
              setIsShow={setDeleteModal}
              externalMethod={async () => {
                if (userToDelete) {
                  await handleDelete(userToDelete._id);
                }
              }}
              argument=""
              content={{
                title: "Delete User",
                body: `Do you really want to delete user - ${userToDelete?.name}?`,
              }}
            />
        {!loading && users.length < 1 && (
          <h2 className="text-center p-2 text-lg font-medium text-opacity-80 text-black">
            No Users in database
          </h2>
        )}
      </div>
    </div>
  );
};

export default UserTable;

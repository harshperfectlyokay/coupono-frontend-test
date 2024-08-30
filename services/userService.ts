import { httpAxios } from "@/utils/httpHelper";

export const getUsers = async function () {
    const {data} = await httpAxios.get('/api/user'); 
    return data;
};

export const createUser = async function (user:{}) {
    const {data} = await httpAxios.post('/api/user',{user}); 
    return data;
};
export const deleteUser = async (id: string) => {
    try {
      const { data } = await httpAxios.delete(`/api/user`, {
        data: { userId:id } // Send the ID in the request body
      });
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };
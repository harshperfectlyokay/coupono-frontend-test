

export const fetchStoresFromAPI = async (
    page: number,
    itemsPerPage: number,
    sortField: string,
    sortDirection: "asc" | "desc" | null,
    filters: any
  ) => {
    try {
      const filterParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value && value !== "select") {
          filterParams.append(key, value.toString());
        }
      }
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/private/store?page=${page}&itemsPerPage=${itemsPerPage}&sortField=${sortField}&sortDirection=${sortDirection}&${filterParams.toString()}`
      );
  
      if (!res.ok) {
        throw new Error(`Failed to fetch stores: ${res.statusText}`);
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error occurred while fetching stores:", error);
      throw error;
    }
  };
  

  export const toggleStoreStatus = async (storeId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/private/store", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: storeId, status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update store status: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error occurred while updating store status:", error);
      throw error;
    }
  };
  


export const updateStoreFieldfromAPI = async (storeId: any, field: string, value: any) => {
    try {
      const response = await fetch(`/api/private/store/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: storeId,
          field: field,
          value: value,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update store field: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error occurred while updating store field:", error);
      throw error;
    }
  };
  
  export const saveStoreToAPI = async (payload: any) => {
    try {
      const response = await fetch("/api/private/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save store: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving store:", error);
      throw error;
    }
  };

import { StoreType } from '../../types/store';

export const getStore = async (storeName : string): Promise<StoreType | null> => {
  try {
    // const response = await fetch(`http://localhost:3004/store?storeName=${storeName}`);
    const response = await fetch(`https://coupono-frontend-test.vercel.app/api/public/stores?store_website=https://${storeName}`);
    // const response = await fetch(`http://localhost:3000/api/public/stores?store_website=https://007Store.com`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jsonData = await response.json();
    // console.log('response', JSON.stringify(data.store : StoreType));
    // console.log('response',jsonData);
     console.log('response 2 store: ',jsonData.data.store);
    return jsonData.data.store;
  } catch (error) {
    console.error('Error fetching store:', error);
    // Optionally return a default value or handle the error
    return null; 
  }
};

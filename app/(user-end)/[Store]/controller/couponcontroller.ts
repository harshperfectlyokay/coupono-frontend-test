import { Offer } from '../../types/offer';

export const getActiveCoupons = async (storeName: string,status:string,page: number,itemsPerPage:number): Promise<Offer[]> => {
  try {
    // const response = await fetch(`http://localhost:3004/coupons?page=${page}`);
    // console.log('offer params 1: ', storeName,'sttus ', status,'itermsperpage: ', itemsPerPage);
   
    const response = await fetch(`https://coupono-frontend-test.vercel.app/api/public/offers?store_website=https://${storeName}&status=${status}&page=${page}&itemsPerPage=${itemsPerPage}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jsonData = await response.json();
    console.log('coupon response: ', jsonData.data.offers);
    return jsonData.data.offers;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
};

export const getAllActiveCouponsUptoPage = async (storeName: string,status:string,page: number,itemsPerPage:number,upto : boolean = true): Promise<Offer[]> => {
  try {
    // const response = await fetch(`http://localhost:3004/allcouponsuptopage?page=${page}`);
    // console.log('offer params: ', storeName,'sttus ', status,'itermsperpage: ', itemsPerPage,'upto: ', upto);
    const response = await fetch(`https://coupono-frontend-test.vercel.app/api/public/offers?store_website=https://${storeName}&status=${status}&page=${page}&itemsPerPage=${itemsPerPage}&upto=${upto}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jsonData = await response.json();
     console.log('jsonData allAcitve uptopage: ', jsonData);
    return jsonData.data.offers;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
};

export const getExpiredCoupons = async (storeName: string,status:string,page: number,itemsPerPage:number): Promise<Offer[]> => {
  try {
    // const response = await fetch(`http://localhost:3004/expiredcoupons?page=${page}`);
    const response = await fetch(`https://coupono-frontend-test.vercel.app/api/public/offers?store_website=https://${storeName}&status=${status}&page=${page}&itemsPerPage=${itemsPerPage}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jsonData = await response.json();
    // console.log('expired coupon response: ', jsonData.data.offers);
    return jsonData.data.offers;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
};
export const getAllExpiredCouponsUptoPage = async (storeName: string,status:string,page: number,itemsPerPage:number,upto : boolean = true): Promise<Offer[]> => {
  try {
    // const response = await fetch(`http://localhost:3004/allexpiredcouponsuptopage?page=${page}`);
    const response = await fetch(`https://coupono-frontend-test.vercel.app/api/public/offers?store_website=https://${storeName}&status=${status}&page=${page}&itemsPerPage=${itemsPerPage}&upto=${upto}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const jsonData = await response.json();
    // console.log('jsonData Expired Coupons: ', jsonData);
    return jsonData.data.offers;
  } catch (error) {

    console.error('Error fetching coupons:', error);
    return [];
  }
};

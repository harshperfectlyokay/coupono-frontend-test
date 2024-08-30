"use client"
import React, { useEffect, useState } from 'react';
import CouponCard from '../../../components/user/CouponCard';

import { Offer } from "../../types/offer";
import { getAllExpiredCouponsUptoPage, getExpiredCoupons } from '../controller/couponcontroller';
import { useModal } from '../Context/ModalProvider';
import { StoreType } from '../../types/store';

interface ExpiredStoreWrapperProps {
  coupons: Offer[];
  MyStore: StoreType | null;
  store_slug: string;
}


const ExpiredCouponWrapper:React.FC<ExpiredStoreWrapperProps> = ({ MyStore,store_slug,coupons }) => {
  const [allcoupons, setCoupons] = useState<Offer[]>(coupons);
  const { expiredPageNumber,setExpiredPageNumber} = useModal(); 

  const handleClick = async () => {
    // const currentPage = Math.ceil(allcoupons.length / 10);
  
    // Calculate the next page number
    // console.log('first page: ' + currentPage)
    // const nextPage = currentPage + 1;
    const currentDateTime = new Date().toISOString();
    localStorage.setItem('lastVisitTime', currentDateTime);

    const finalPage = expiredPageNumber + 1;
    setExpiredPageNumber(finalPage);
    const checkpagenumber = ((allcoupons.length)/2) + 1;  //change page
    // localStorage.setItem("localStorageExpiredPageNumber", String(finalPage - 1));
    localStorage.setItem("localStorageExpiredPageNumber", String(checkpagenumber));

    try {
      let newCoupons: Offer[] = [];
      const pageNumber = localStorage.getItem("localStorageExpiredPageNumber");
      // console.log("localStorageExpiredPageNumber", pageNumber);
      const localStorageExpiredPageNumber = pageNumber
        ? parseInt(pageNumber, 10)
        : 0;
      
      
        if (localStorageExpiredPageNumber > 1) {
          let page = localStorageExpiredPageNumber - 1;
          // localStorage.removeItem("localStorageActivePageNumber");
          if (coupons.length > 0) {
            newCoupons = await getExpiredCoupons(store_slug,'expired',localStorageExpiredPageNumber,2);
          } else  {
            newCoupons = await getAllExpiredCouponsUptoPage(store_slug,'expired',page,2,true);
            
          }
        } else {
          // console.log("hello there 2");
          let page = localStorageExpiredPageNumber - 1;
          newCoupons = await getExpiredCoupons(store_slug,'expired',page,2);
        }

      // console.log('Cjected: ', newCoupons)
      

      setCoupons([...allcoupons,...newCoupons])
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }

  }

  useEffect(()=>{
    const lastVisitTime = localStorage.getItem('lastVisitTime');

    if (lastVisitTime) {
      // Calculate the time difference
      const currentTime = new Date();
      const previousTime = new Date(lastVisitTime);
      const timeDifference = currentTime.getTime() - previousTime.getTime();

      // Convert time difference from milliseconds to hours
      // const hoursDifference = timeDifference / (1000 * 60 * 60);
      const secondsDifference = timeDifference / 1000;
      // If more than 2 hours have passed, clear the 'localActiveItem' from localStorage
      if (secondsDifference > 20) {
        localStorage.removeItem('localStorageExpiredPageNumber');
        // console.log('localActiveItem cleared from localStorage');
      }
    }
    

    const check_store_slug = localStorage.getItem('store_slug');
    // console.log(first)
    // console.log('Hello slug: expired: ' + check_store_slug);
    // console.log('Hello slug: params expired: ' + store_slug);
    // console.log('Hello slug: params expired: 3: '  + JSON.stringify(MyStore?._id));

  
    // if(check_store_slug !== JSON.stringify(MyStore?._id)){
    if(check_store_slug !== store_slug){

      // console.log('Inside store_slug')
      localStorage.removeItem('localStorageExpiredPageNumber');
      localStorage.removeItem('localStorageActivePageNumber');
      const check_store_slug_2 = localStorage.getItem('store_slug');

      // console.log('Hello slug: expired: ' + check_store_slug_2);
      // console.log('Hello slug: expired: ai bi: ' + JSON.stringify(MyStore?._id));
      localStorage.removeItem('store_slug');
    }

    // if (MyStore?._id) {
    //   localStorage.setItem('store_slug',JSON.stringify(MyStore?._id));  
    // }
    localStorage.setItem('store_slug',store_slug);  
    
    let newCoupons: Offer[] = [];
      const pageNumber = localStorage.getItem("localStorageExpiredPageNumber");
      // console.log("localStorageActivePageNumber", pageNumber);
      const localStorageExpiredPageNumber = pageNumber
        ? parseInt(pageNumber, 10)
        : 0;

        if (localStorageExpiredPageNumber > 0) {
          const fetchExpiredCoupons = async () => {
            // console.log('localStorageActivePageNumber: ', localStorageActivePageNumber)
          newCoupons = await getAllExpiredCouponsUptoPage(store_slug,'expired',localStorageExpiredPageNumber,2)
          // console.log('newCoupons', newCoupons)
          setCoupons([...newCoupons]);
          }
          fetchExpiredCoupons();
        }
  },[])

  // useEffect(() => {
  //   console.log('Checking all coupon',allcoupons);
  //   // setAllStoreCoupons([...allcoupons]);
  // }, [allcoupons]);

  return (
    <div className="w-full">
      {/* lg:w-3/5 */}
      <h1 className="text-2xl font-bold mb-4">Expired Coupons</h1>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {allcoupons.length>0 && (allcoupons.map((coupon, index) => (
          <div key={coupon._id}>
            <CouponCard MyStore={MyStore} coupon={coupon} />
          </div>
        )))}
      </div>

      <div className="flex justify-center my-2 mb-4">
        <button
          // onClick={handleLoadMore}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleClick}
        >
          Load More
        </button>
      </div>
    </div>
  );
}

export default ExpiredCouponWrapper;

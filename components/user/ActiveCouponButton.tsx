"use client"
import React from 'react'
import { Offer } from '../../(user-end)/types/offer'
import { useModal } from '../../(user-end)/[Store]/Context/ModalProvider';

interface ActiveCouponButtonProps {
    coupons: Offer[];
  }

const ActiveCouponButton:React.FC<ActiveCouponButtonProps> = ({coupons}) => {
    const { setActivePageNumber, activePageNumber } = useModal();

    const handleClick = (coupons: Offer[]) => {
        
          
        // setActivePageNumber(activePageNumber + 1);
        // updateAllStoreCoupons(coupons);    
      }
  return (
    <div><button
    // onClick={handleLoadMore}
    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
    onClick={()=>handleClick(coupons)}
  >
    Load More
  </button></div>
  )
}

export default ActiveCouponButton
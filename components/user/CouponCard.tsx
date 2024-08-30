"use client";

import { useState, MouseEvent, useEffect, useRef } from "react";
// import { useRouter } from 'next/navigation';
import { FaCheckCircle } from "react-icons/fa";
import { Offer } from "../../(user-end)/types/offer";
import { useModal } from "../../(user-end)/[Store]/Context/ModalProvider";
import { useSearchParams } from "next/navigation";
import { StoreType } from "@/app/(user-end)/types/store";

interface CouponCardProps {
  coupon: Offer;
  MyStore: StoreType | null;
}


const CouponCard: React.FC<CouponCardProps> = ({MyStore, coupon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // const router = useRouter();
  const { openModal } = useModal();
  const [hash, setHash] = useState('');
  // const cardRef = useRef<HTMLDivElement | null>(null);

  // Type the event parameter as MouseEvent
  const handleCardClick = (id: string) => {
    // e.preventDefault();  //e: MouseEvent<HTMLDivElement>

    // Check if coupon.offer_link is defined
    // if (coupon.offer_link) {
      // Open the coupon code page in a new tab
      // localStorage.removeItem('localStorage_offer_id');
      // console.log('Hello id: ',id);
      localStorage.setItem('localStorage_offer_id',String(id));
      const store_slug_id = localStorage.getItem('store_slug');
      // console.log('COuponCard store_slug_id: ',store_slug_id);
      // console.log('COuponCard MyStore Id: ',MyStore?._id);

      // if (store_slug_id === JSON.stringify(MyStore?._id)) {
        window.open(`/${store_slug_id}#voucher-${coupon.offer_store_id}`, '_blank', 'noopener,noreferrer');
        openModal();  
      // }
      
     

      // console.log('checking coupon', coupon.offer_link);

      // Redirect the current page to OurStore
      // router.push(coupon.offer_link);
     
    // }
  };

  useEffect(() => {
    // Set the initial hash value
    setHash(window.location.hash);
  }, []);

 
  
  
  // useEffect(() => {
  //   const hash = window.location.hash;
  //   const couponIdFromHash = hash.match(/voucher-(\d+)/)?.[1];

  //   if (couponIdFromHash && cardRef.current) {
  //     const itemId = coupon.offer_store_id.toString();
  //     if (couponIdFromHash === itemId) {
  //       const item = cardRef.current;
  //       item?.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center',  // Center the item in the viewport
  //         inline: 'nearest' // Align horizontally if needed
  //       });
  //     }
  //   }
  // }, [coupon.offer_store_id]);


  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     // Remove a specific item from localStorage
  //     localStorage.removeItem('localStorage_offer_id');

  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   // Cleanup event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);


  const toggleDetails = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation(); // Prevent triggering the handleCardClick
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      // id={`voucher-${coupon.offer_store_id}`}
      // ref={cardRef}
      onClick={()=>{handleCardClick(coupon?._id); console.log('myonclick: ',coupon.id)}} // Attach the click handler
      className="bg-white border border-gray-300 shadow-lg rounded-lg p-4 mb-0 md:mb-4 cursor-pointer z-10 transition-all duration-300 ease-in-out"
    >
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-white-100 border-2 border-dashed border-gray-700 rounded-lg p-2 text-center">
          <div className="text-xs font-bold uppercase text-black">
            Exclusive
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-4 xl:mt-3">
            ${coupon?.offer_benefit?.split("%")[0]}
          </div>
          <span className="text-sm font-semibold text-gray-500">OFF</span>
        </div>
        <div className="col-span-2 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <span className="text-lg font-semibold text-gray-800">
              {coupon.offer_title}
            </span>
          </div>
          <h3 className="text-sm font-bold mb-2">
            Added by {coupon.offer_user_id} • {coupon.offer_use_count} used
            today
          </h3>
          <div className="text-sm mb-2">
            <span>
              {coupon.offer_type} •{" "}
              <span className="text-card-button">
                {" "}
                <FaCheckCircle className="mb-1 inline text-card-button" />{" "}
                Verified{" "}
              </span>
            </span>
          </div>
          {/* Clickable "See Details" text */}
          <span
            className="w-[36%] lg:w-[26%] xl:w-[17%] text-secondary-button hover:text-secondary-button-hover text-sm hover:underline mb-2 cursor-pointer"
            onClick={toggleDetails}
          >
            {isExpanded ? "Show Less" : "See Details"}
          </span>
        </div>
        <div className="hidden md:col-span-1 md:flex flex-col justify-center relative">
          <div className="w-full relative text-white px-4 py-2 rounded-md z-10">
            <span className="absolute left-0 w-[79%] hover:w-[76%] md:w-[74%] md:hover:w-[71%] xl:w-[83%] xl:hover:w-[80%] bg-card-button hover:bg-card-button-hover text-white xl:px-4 py-2.5 bottom-2 flex justify-center items-center rounded-l-md text-base">
              Show Code
            </span>
            <span className="flex items-center justify-end w-full text-black border border-dashed border-card-button py-2 px-1 xl:h-11">
              {coupon.offer_code}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded description within the same div */}
      <div
        className={`overflow-hidden transition-[max-height] ${
          isExpanded ? "ease-in max-h-40" : "ease-out max-h-0"
        } duration-700`}
      >
        <div className="mt-4 grid grid-cols-3">
          <p className="col-span-2 text-sm text-gray-600">
            {coupon.offer_description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;

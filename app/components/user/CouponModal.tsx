// Modal.js
"use client";
import Image from "next/image";
import { useModal } from "../../(user-end)/[Store]/Context/ModalProvider";
import CouponAlert from "./CouponAlert";
import { useEffect, useState } from "react";
import { Offer } from "@/app/(user-end)/types/offer";
import { getAllActiveCouponsUptoPage, getAllExpiredCouponsUptoPage } from "@/app/(user-end)/[Store]/controller/couponcontroller";
import { StoreType } from "@/app/(user-end)/types/store";

interface CouponModalProps {
  MyStore: StoreType| null;
  activeCoupons: Offer[];
  expiredCoupons: Offer[];
  store_slug: string;
}

const CouponModal:React.FC<CouponModalProps> = ({store_slug,MyStore,activeCoupons,expiredCoupons}) => {
  // console.log('activeCoupons',activeCoupons)
  // console.log('expiredCoupons',expiredCoupons)
  const [allActiveCoupons, setAllCoupons] = useState<Offer[]>(activeCoupons);
  const [allExpiredCoupons, setAllExpiredCoupons] = useState<Offer[]>(expiredCoupons);
  const { isModalOpen,openModal, closeModal } = useModal();

  const [currentCoupon, setCurrentCoupon] = useState<Offer | null>(null);
  const [hash, setHash] = useState('');
 

  useEffect(() => {
    setHash(window.location.hash);
  }, [])
  

  // useEffect(() => {
  //   let pageNumber = localStorage.getItem('localStorageActivePageNumber') || '1';
  //   let currentpageNumber = parseInt(pageNumber, 10);
  //   const fetchActiveCoupons = async () => {
  //     let activeCouponsData = activeCoupons;
  //     if (currentpageNumber > 1) {
  //       activeCouponsData = await getAllActiveCouponsUptoPage(currentpageNumber);
  //       console.log('activeCouponsData', activeCouponsData)
  //     }
  //     setAllCoupons(activeCouponsData);
  //   };
  
  //   fetchActiveCoupons();
    
    
  //   const userID = localStorage.getItem('localStorage_offer_id');

  //   if (userID) {
  //     // Find the coupon by its ID
  //     const foundCoupon = allActiveCoupons.find(
  //       (coupon) => coupon.id === parseInt(userID, 10)
  //     );

  //     console.log('Hello current coupon',foundCoupon);

  //     if (foundCoupon) {
  //       setCurrentCoupon(foundCoupon);
  //       openModal();
  //     }
  //   }
  // }, [openModal])
  
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      const pageNumber = localStorage.getItem('localStorageActivePageNumber') || '1';
      // console.log('current page number: ' + pageNumber);
      const currentpageNumber = parseInt(pageNumber, 10);

      let activeCouponsData = activeCoupons;
      if (currentpageNumber > 1) {
        activeCouponsData = await getAllActiveCouponsUptoPage(store_slug,'active',currentpageNumber,2,true);
        // console.log('activeCouponsData', activeCouponsData);
      }
      setAllCoupons(activeCouponsData);
    };

    fetchActiveCoupons();
  }, [activeCoupons]);

  useEffect(() => {
    const fetchExpiredCoupons = async () => {
      const pageNumber = localStorage.getItem('localStorageExpiredPageNumber') || '1';
      const currentpageNumber = parseInt(pageNumber, 10);

      let expiredCouponsData = expiredCoupons;
      if (currentpageNumber > 1) {
        expiredCouponsData = await getAllExpiredCouponsUptoPage(store_slug,'expired',currentpageNumber,2,true);
        // console.log('activeCouponsData', expiredCouponsData);
      }
      setAllExpiredCoupons(expiredCouponsData);
    };

    fetchExpiredCoupons();
  }, [expiredCoupons]);

  // Find and set the current coupon after allCoupons state is updated
  useEffect(() => {
    const userID = localStorage.getItem('localStorage_offer_id');

    if (userID) {
      const foundActiveCoupon = allActiveCoupons.find(
        // (coupon) => coupon.id === parseInt(userID,10)
        (coupon) => coupon._id === userID
      );
      const foundExpiredCoupon = allExpiredCoupons.find(
        // (coupon) => coupon.id === parseInt(userID,10)
        (coupon) => coupon._id === userID
      );

            
      console.log('Hello all coupon', allActiveCoupons);
      // console.log('Hello current coupon', foundCoupon);

      if (foundActiveCoupon) {
        console.log('foundActiveCoupon: ', foundActiveCoupon);
        setCurrentCoupon(foundActiveCoupon);

        openModal();
      }else if(foundExpiredCoupon){
        console.log('foundExpiredCoupon: ', foundExpiredCoupon);

        setCurrentCoupon(foundExpiredCoupon);
        openModal();
      }
    }
  }, [allActiveCoupons,allExpiredCoupons, openModal]);


  // useEffect(() => {

  // }, [ openModal]);

    // Handle click outside the modal
   
  

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full md:w-7/12 lg:w-2/5 max-w-screen-lg">
        <div className="text-center px-8 py-2">
        <button
          onClick={closeModal}
          className="text-gray-500 absolute top-4 right-4 text-3xl"
        >
          &times;
        </button>
        <Image
          src="/images/sample image/instacart.webp"
          alt="eBay Logo"
          className="mx-auto mb-4 w-24 h-auto"
          height={96}
          width={96}
        />
        <h2 className="text-2xl font-bold mb-2">{currentCoupon?.offer_title}</h2>
        <p className="text-gray-700 mb-4">Copy and paste this code at <a href="https://ebay.com" className="text-purple-600">ebay.com</a></p>
        <div className="flex items-center justify-center mb-4">
          <input
            type="text"
            value={currentCoupon?.offer_code}
            readOnly
            className="border border-dashed border-card-button rounded-lg p-2 text-center font-mono w-1/2"
          />
          <button
            className="bg-card-button hover:bg-card-button-hover text-white px-4 py-2 rounded-lg ml-2 font-bold"
            onClick={() => {
              if (currentCoupon?.offer_code) {
                navigator.clipboard.writeText(currentCoupon.offer_code);
              }
            }}
          >
            COPY
          </button>
        </div>
        <button className="bg-card-button-light hover:bg-card-button text-card-button-hover shadow-md border border-card-button-light-hover hover:text-white px-4 py-2 rounded-sm w-full lg:w-1/2 font-semibold mb-4">
          Redeem at ${MyStore?.store_name} &gt;
        </button>
        <div className="flex justify-center items-center text-gray-500 mb-4">
          <p>Did the code work?</p>
          <button className="ml-2 mr-1 text-xl">👍</button>
          <button className="text-xl">👎</button>
        </div>
        {/* <hr className="my-4"/> */}
        </div>
        <div className="text-left px-8 py-2">
        <p className="text-sm text-gray-600">
          <strong>Offer Details:</strong> Enjoy 20% off on select tech, auto tools, and more when you apply this eBay coupon code at checkout. No min, $500 max, 2x use.
        </p>
        <p className="text-sm text-gray-500 mt-2"><strong>Expiration Date:</strong> 8/18/2024</p>
        </div>
        {/* <div className="bg-blue-900 rounded-b-lg"><p className="p-2 text-white text-center">
          Get coupon alerts for eBay and never miss another deal!
          </p>
          </div> */}
          <CouponAlert/>
      </div>
    </div>
  );
};

export default CouponModal;

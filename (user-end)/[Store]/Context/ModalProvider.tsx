"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Offer } from '../../types/offer';


interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  allStoreCoupons: Offer[];
  updateAllStoreCoupons: (coupons: Offer[]) => void;
  // currentCouponModal: any;
  // updateCurrentCouponModal: (coupon: any) => void;
  activePageNumber: number;
  setActivePageNumber: (page: number) => void;
  expiredPageNumber: number;
  setExpiredPageNumber: (page: number) => void;
  setAllStoreCoupons: React.Dispatch<React.SetStateAction<Offer[]>>; 
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allStoreCoupons, setAllStoreCoupons] = useState<Offer[]>([]);
  // const [currentCouponModal, setCurrentCouponModal] = useState({});
  const [activePageNumber, setActivePageNumber] = useState(2);
  const [expiredPageNumber, setExpiredPageNumber] = useState(2);
  // const [hash, setHash] = useState('');


  useEffect(() => {
    // localStorage.setItem('localStorage_offer_id',String(id) );
    const userID = localStorage.getItem('localStorage_offer_id');
    // const userID = true;
    if (userID) {
      // localStorage.setItem('offer_id', '123456'); // Replace 'someOfferId' with your actual offer ID
      openModal()
    }
  }, []);

  const openModal = () => {
    
    if (window.location.hash.includes('#voucher')) {
      setIsModalOpen(true);
    }
    
    // console.log('Chekcing open modal', isModalOpen);
  }
  const closeModal = () => {setIsModalOpen(false);
    localStorage.removeItem('localStorage_offer_id');
    window.history.replaceState(null, '', window.location.pathname);
//  console.log('Chekcing closed modal', isModalOpen);
  }

   // Function to update allStoreCoupons
   const updateAllStoreCoupons = (coupons: Offer[]) => {
    setAllStoreCoupons([...coupons]);
  };

 useEffect(() => {
   
  // console.log('Halo All Store Coupons: ',allStoreCoupons)
   
 }, [activePageNumber])
 

  // Function to update currentCouponModal
  // const updateCurrentCouponModal = (coupon: any) => {
    // setCurrentCouponModal(coupon);
  // };


  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal ,allStoreCoupons, updateAllStoreCoupons,activePageNumber,setActivePageNumber, expiredPageNumber,setExpiredPageNumber, setAllStoreCoupons}}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

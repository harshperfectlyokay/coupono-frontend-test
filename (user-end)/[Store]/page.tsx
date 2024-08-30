  // pages/page.tsx
  import React from 'react';
  // import { Coupon } from '../../Sample/coupons';
  // import StoreWrapper from '@/app/(userend)/[Store]/StoreWrapper';
  // import {ModalProvider} from "./Context/ModalProvider"
  import CouponModal from "../../components/user/CouponModal"

  import axios from 'axios';
  // import { Offer } from '../types/offer';
  import StoreWrapper from './Store/StoreWrapper';
  // import { AllStores } from '@/app/Sample/stores';
  import { StoreType } from '../types/store';
  import { ModalProvider } from './Context/ModalProvider';
  import { Offer } from '../types/offer';
  // import page from '../../(userend)/page';
  import { getActiveCoupons, getExpiredCoupons } from './controller/couponcontroller';
  import { getStore } from './controller/storecontroller';

  // interface PageProps {
  //   coupons: Offer[];
  //   Store: StoreType;
  // }

  // const getStore= async (StoreName: String):Promise<StoreType> =>{

  //   // fetch data from your API here
  //   const response = await axios.get<StoreType>(`http://localhost:3004/store?storeName=${StoreName}`); 
  //   const AllStores: StoreType = response.data;
  //   //  console.log('ALl store',AllStores)
  //   return AllStores;
  // }



  const Page = async ({ params }: { params: { Store: string } }) => { 
    // console.log('Checking params', params.Store)
    const storeData: StoreType | null = await getStore(params.Store);

    let activeCouponsData = await getActiveCoupons(params.Store,'active',1,2);  // Active coupons
    
    const expiredCouponsData = await getExpiredCoupons(params.Store,'expired',1,2); // expired coupons

    // const theStore = AllStores[0];
    // console.log('first store', AllStores);

    return (
      <div>
            <ModalProvider>

            <StoreWrapper store_slug={params.Store} MyStore={storeData} activeCoupons={activeCouponsData} expiredCoupons={expiredCouponsData}/>
            <CouponModal store_slug={params.Store} MyStore={storeData} activeCoupons={activeCouponsData} expiredCoupons = {expiredCouponsData}/>
            </ModalProvider>
            
      </div>

    );
  };

  // export const getServerSideProps = async () => {
  //   try {
  //     const response = await axios.get('https://api.example.com/coupons'); // Replace with your API endpoint
  //     const coupons: Coupon[] = response.data;

  //     return {
  //       props: {
  //         coupons,
  //       },
  //     };
  //   } catch (error) {
  //     console.error('Error fetching coupons:', error);
  //     return {
  //       props: {
  //         coupons: [], // Return an empty array if there is an error
  //       },
  //     };
  //   }
  // };

  export default Page;

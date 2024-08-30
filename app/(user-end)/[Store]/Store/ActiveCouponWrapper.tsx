"use client";
import { useEffect, useState } from "react";
import CouponCard from "../../../components/user/CouponCard";
import EmailAlertCard from "../../../components/user/EmailAlertCard";
import { Offer } from "../../types/offer";
import { StoreType } from "../../types/store";
import {
  getActiveCoupons,
  getAllActiveCouponsUptoPage,
} from "../controller/couponcontroller";
import { useModal } from "../Context/ModalProvider";
import { useRouter, useSearchParams } from "next/navigation";
// import { useModal } from '../Context/ModalProvider';

interface ActiveCouponWrapperProps {
  coupons: Offer[];
  MyStore: StoreType | null;
  store_slug: string;
}

const ActiveCouponWrapper: React.FC<ActiveCouponWrapperProps> = ({store_slug,
  coupons,
  MyStore,
}) => {
  const [allcoupons, setCoupons] = useState<Offer[]>(coupons);
  const { activePageNumber, setActivePageNumber, setAllStoreCoupons } =
    useModal();
  console.log('Hello checking in server')
  console.log('Hello checking in server 2',coupons)
  const emailAlertCardIndex = 1; // Index after which the EmailAlertCard should appear (0-based index)
  // let nextPage =  1;
  const handleClick = async () => {
    // const currentPage = Math.ceil(allcoupons.length / 10);

    // Calculate the next page number
    // console.log('first page: ' + currentPage)
    const currentDateTime = new Date().toISOString();
    localStorage.setItem('lastVisitTime', currentDateTime);

    const finalPage = activePageNumber + 1;
    setActivePageNumber(finalPage);
    // localStorage.setItem("localStorageActivePageNumber", String(finalPage - 1));
    const checkpagenumber = ((allcoupons.length)/2) + 1;  //change page
    localStorage.setItem("localStorageActivePageNumber", String(checkpagenumber));

    try {
      let newCoupons: Offer[] = [];
      const pageNumber = localStorage.getItem("localStorageActivePageNumber");
      console.log("localStorageActivePageNumber", pageNumber);
      const localStorageActivePageNumber = pageNumber
        ? parseInt(pageNumber, 10)
        : 0;

      if (localStorageActivePageNumber > 1) {
        let page = localStorageActivePageNumber - 1;
        // localStorage.removeItem("localStorageActivePageNumber");
        if (coupons.length > 0) {
          newCoupons = await getActiveCoupons(store_slug,'active',localStorageActivePageNumber,2);
          console.log('My Life Checking')
        } else  {
          newCoupons = await getAllActiveCouponsUptoPage(store_slug,'active',page,2,true);
          console.log('My Life Checking 2..')
        }
      } else {
        console.log("My Life Checking 3");
        let page = localStorageActivePageNumber - 1;
        newCoupons = await getActiveCoupons(store_slug,'active',page,2);
      }
      // console.log("Cjected: ", newCoupons);

      setCoupons([...allcoupons, ...newCoupons]);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    // console.log('Checking all coupon',allcoupons);
    // if (allcoupons.length > 0) {

      setAllStoreCoupons([...allcoupons]);
    // }
  }, [allcoupons]);

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
        localStorage.removeItem('localStorageActivePageNumber');
        // console.log('localActiveItem cleared from localStorage');
      }
    }
    

    // const check_store_slug = localStorage.getItem('store_slug');
    // if(check_store_slug !== store_slug){
    //   localStorage.removeItem('localStorageActivePageNumber');
    //   localStorage.removeItem('localStorageExpiredPageNumber');
    //   localStorage.removeItem('store_slug');
    // }
    // localStorage.setItem('store_slug',store_slug);
    let newCoupons: Offer[] = [];
      const pageNumber = localStorage.getItem("localStorageActivePageNumber");
      console.log("localStorageActivePageNumber", pageNumber);
      const localStorageActivePageNumber = pageNumber
        ? parseInt(pageNumber, 10)
        : 0;

        if (localStorageActivePageNumber > 0) {
          const fetchActiveCoupons = async () => {
            // console.log('localStorageActivePageNumber: ', localStorageActivePageNumber)
          newCoupons = await getAllActiveCouponsUptoPage(store_slug,'active',localStorageActivePageNumber,2,true)
          // console.log('newCoupons', newCoupons.data.offers)
          // if (newCoupons.length > 0) {
            setCoupons([...newCoupons]);
          // }
          }
          fetchActiveCoupons();
        }
  },[])

  // const StoreName = "Instacart"

  // const { updateAllStoreCoupons } = useModal();

  // // Call updateAllStoreCoupons directly when coupons data is available
  // updateAllStoreCoupons(coupons);

  return (
    <div className="w-full">
      {/* lg:w-3/5 */}
      <h1 className="text-2xl font-bold mb-4">Available Coupons</h1>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {allcoupons.length>0 && (allcoupons.map((coupon, index) => (
          <div key={coupon._id}>
            <CouponCard coupon={coupon} MyStore={MyStore} />
            {/* Render EmailAlertCard once after a specific index */}
            {index === emailAlertCardIndex && (
              <EmailAlertCard MyStore={MyStore} />
            )}
          </div>
        )))}
      </div>

      <div className="flex justify-center my-2 mb-4">
        <button
          // onClick={handleLoadMore}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={() => handleClick()}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default ActiveCouponWrapper;

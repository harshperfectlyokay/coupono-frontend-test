import ActiveCouponWrapper from "./ActiveCouponWrapper";
import SideBar from "./store components/SideBar";
import ExpiredCouponWrapper from "./ExpiredCouponWrapper";
import CouponTable from "../../../components/user/CouponTable";
import FAQ from "../../../components/user/FAQ";
import PromoBar from "./PromoBar";
import { Offer } from "../../types/offer";
import { StoreType } from "../../types/store";

interface StoreWrapperProps {
  activeCoupons: Offer[];
  expiredCoupons: Offer[];
  MyStore : StoreType|null;
  store_slug: string;
}


const StoreWrapper : React.FC<StoreWrapperProps> = ({ store_slug,activeCoupons = [],expiredCoupons = [], MyStore }) => {

  // const getcoupons = (coupons: Offer[]) => { 

  // }

  return (
    <div>
      <PromoBar MyStore={MyStore}/>
      <div className="grid gap-4 lg:gap-0 grid-cols-1 lg:grid-cols-12 lg:px-24 xl:px-36">
        <div className="px-6 py-4 lg:px-0 lg:col-span-9">
          {activeCoupons.length>0 && <ActiveCouponWrapper store_slug={store_slug} MyStore={MyStore} coupons={activeCoupons} />}
          {expiredCoupons.length>0 && <ExpiredCouponWrapper MyStore={MyStore} store_slug={store_slug} coupons={expiredCoupons} />}
          {activeCoupons.length>0 && <CouponTable coupons={activeCoupons} />}
          <FAQ  />
        </div>
        <div className="px-6 py-4 lg:pr-0 lg:pl-6 xl:px-6 lg:col-span-3">
          <SideBar MyStore={MyStore}/>
        </div>
      </div>
    </div>
  );
};

export default StoreWrapper;

import React, { useState } from "react";
import Spinner from "./Spinner";
import { updateStoreFieldfromAPI } from "@/app/app-service/storeService";

interface Store {
  _id: String;
  name: string;
  store_website: string;
  store_logo: string;
  store_description: string;
  store_affiliate_link: string;
  store_category: number;
  slug: string;
  status: string;
  store_priority_score: number;
  store_search_target: string;
  store_best_discount: number;
  store_tags: string;
  store_facebook: string;
  store_instagram: string;
  store_twitter: string;
  store_youtube: string;
  store_tiktok: string;
  store_email: string;
  store_phone_number: string;
  store_address: string;
  store_help_desk: string;
  store_contact_page: string;
  store_country: string;
  store_last_updated: Date;
  store_last_checked: Date;
  store_saving_tips: string;
  store_how_to_use_coupon: string;
  store_faq: string;
  store_payment_modes: string;
  store_program_platform: number;
}
interface Option {
  value: string | number;
  displayName: string;
}

interface EditEachStoreModalProps {
  onClose: () => void;
  store?: Store;
  field?: keyof Store;
  options?: Option[];
}

const EditEachStoreModal: React.FC<EditEachStoreModalProps> = ({
  onClose,
  store,
  field,
  options,
}) => {
  const [fieldValue, setFieldValue] = useState(
    store ? store[field as keyof Store] : ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async (fieldValue: any) => {
    if (!store || !field) {
      console.error("Store or field is not defined.");
      return;
    }
  
    try {
      setIsLoading(true);
      const result = await updateStoreFieldfromAPI(store._id, field, fieldValue);
  
      if (result.status === 200) {
        (store as any)[field] = fieldValue;
        onClose();
      } else {
        console.error("Error updating store: ", result.message);
      }
    } catch (error) {
      console.error("Error updating store: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const renderInputField = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center">
          <Spinner thickness={5} size={25} />
        </div>
      );
    }

    switch (field) {
      case "status":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(e.target.value);
              handleSave(e.target.value);
            }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="PAUSED">PAUSED</option>
          </select>
        );
      case "store_category":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(e.target.value);
              handleSave(e.target.value);
            }}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayName}
              </option>
            ))}
          </select>
        );

      case "store_priority_score":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as number}
            onChange={(e) => {
              setFieldValue(Number(e.target.value));
              handleSave(Number(e.target.value));
            }}
          >
            <option value="">Select Priority</option>
            <option value="0">LOW</option>
            <option value="0.5">MODERATE</option>
            <option value="1">HIGH</option>
          </select>
        );
      case "store_tags":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(e.target.value);
              handleSave(e.target.value);
            }}
          >
          <option value="">Select Tag</option>
          <option value="temporary-pause">Temporary Pause</option>
          <option value="find-affiliate-program">Find Affiliate Program</option>
          <option value="store-shutdown">Store Shutdown</option>
          <option value="advertiser-warning">
            Advertiser Warning Received
          </option>
          <option value="network-warning">Network Warning Received</option>
          <option value="no-coupons">No Coupons</option>
          <option value="non-coupon-site">No Coupon Sites</option>
          <option value="no-ppc">No PPC</option>
          <option value="no-tm-ppc">No TM PPC</option>
          <option value="no-visibility">No Visibility</option>
          <option value="non-responsive">Non Responsive</option>
          <option value="payment-delay">Payment Delays</option>
          <option value="payment-not-done">Payment Not Done</option>
          <option value="poor-performance">Poor PPC Performance</option>
          <option value="precautionary-pause">Precautionary Pause</option>
          <option value="program-unstable">
            Program Goes Offline Frequently
          </option>
          <option value="re-apply-later">Re-apply Later</option>
          <option value="technical-problems">Technical Problems</option>
          <option value="ppc-risky">PPC Risky</option>
          <option value="no-competitor-ppc">No Competitor Running Ads</option>
          <option value="have-to-apply">Have to Apply</option>
          <option value="not-to-apply">Not to Apply</option>
          <option value="no-affiliate-program">No Affiliate Program</option>
          </select>
        );
      case "store_search_target":
        return (
          <select
            className="w-full p-2 border rounded mb-4"
            value={fieldValue as string}
            onChange={(e) => {
              setFieldValue(e.target.value);
              handleSave(e.target.value);
            }}
          >
            <option value="">Select Target</option>
            <option value="organic-paid">Organic & Paid</option>
            <option value="organic">Organic</option>
            <option value="paid">Paid</option>
          </select>
        );
      case "store_last_checked":
        return (
          <input
            type="date"
            className="w-full p-2 border rounded mb-4"
            value={new Date(fieldValue as Date).toISOString().substr(0, 10)}
            onChange={(e) => {
              setFieldValue(new Date(e.target.value));
              handleSave(new Date(e.target.value));
            }}
          />
        );
      default:
        return (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={fieldValue as string}
              onChange={(e) => setFieldValue(e.target.value)}
            />
            <div className="flex justify-end">
              {/* <button
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
              >
                Cancel
              </button> */}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleSave(fieldValue)}
              >
                Save
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md w-1/2 relative">
        <button
          className="absolute top-0 right-0 m-2 text-xl text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl mb-4">Edit {field?.replace("_", " ")}</h2>
        {renderInputField()}
      </div>
    </div>
  );
};

export default EditEachStoreModal;

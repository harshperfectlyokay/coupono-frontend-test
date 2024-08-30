import React, { useState, useEffect } from "react";
import Modal from "./modals/modal";
import { saveOffertoAPI } from "@/app/app-service/offerService";

interface OfferModelProps {
  onClose: () => void;
  offer?: {
    _id?: string;
    offer_user_id?: string | null;
    offer_store_id?: string | null;
    offer_added_date?: Date;
    offer_updated_date?: string;
    offer_status?: string;
    offer_type?: string;
    offer_benefit?: string;
    offer_title?: string;
    offer_description?: string;
    offer_minimum_order?: number;
    offer_code?: string;
    offer_start_date?: string;
    offer_end_date?: string;
    offer_link?: string;
    offer_category_id?: string;
    offer_tags?: string;
    offer_last_used_date?: string;
    offer_use_count?: string;
    offer_view_count?: string;
    offer_use_percent?: string;
    offer_working_percent?: string;
    offer_addedBy?: string;
    offer_isExpired?: string;
    offer_isChecked?: string;
    offer_isHidden?: string;
    offer_lastUpdate?: string;
    offer_addedOn?: string;
    offer_checkedBy?: string;
  };
}

const AddOfferModel: React.FC<OfferModelProps> = ({ onClose, offer }) => {
  const [type, setType] = useState(offer?.offer_type || "");
  const [description, setDescription] = useState(
    offer?.offer_description || ""
  );
  const [benefit, setBenefit] = useState(offer?.offer_benefit || "");
  const [category, setCategory] = useState(offer?.offer_category_id || "");
  const [title, setTitle] = useState(offer?.offer_title || "");
  const [status, setStatus] = useState(offer?.offer_status || "");
  const [minOrder, setMinOrder] = useState(offer?.offer_minimum_order || "");
  const [code, setCode] = useState(offer?.offer_code || "");
  const [startDate, setStartDate] = useState(offer?.offer_start_date || "");
  const [endDate, setEndDate] = useState(offer?.offer_end_date || "");
  const [link, setLink] = useState(offer?.offer_link || "");
  const [tags, setTags] = useState(offer?.offer_tags || "");
  const [store, setStore] = useState(offer?.offer_store_id || "");

  // const handleSave = async () => {
    // const payload = {
    //   offer_user_id: "",
    //   offer_store_id: store,
    //   offer_added_date: new Date(),
    //   offer_updated_date: new Date(),
    //   offer_status: status,
    //   offer_type: type,
    //   offer_benefit: benefit,
    //   offer_title: title,
    //   offer_description: description,
    //   offer_minimum_order: minOrder,
    //   offer_code: code,
    //   offer_start_date: startDate,
    //   offer_end_date: endDate,
    //   offer_link: link,
    //   offer_category_id: category,
    //   offer_tags: tags,
    //   offer_last_used_date: "",
    //   offer_use_count: "",
    //   offer_view_count: "",
    //   offer_use_percent: "",
    //   offer_working_percent: "",
    //   offer_addedOn: "",
    //   offer_checkedBy: "",
    // };

  //   try {
  //     // console.log(payload)
  //     const response = await fetch("/api/private/offer", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       console.log("Offer added successfully");
  //       onClose();
  //     } else {
  //       console.error("Failed to add offer:", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error adding offer:", error);
  //   }
  // };


  const handleSave = async () => {
    const payload = {
      offer_user_id: "",
      offer_store_id: store,
      offer_added_date: new Date(),
      offer_updated_date: new Date(),
      offer_status: status,
      offer_type: type,
      offer_benefit: benefit,
      offer_title: title,
      offer_description: description,
      offer_minimum_order: minOrder,
      offer_code: code,
      offer_start_date: startDate,
      offer_end_date: endDate,
      offer_link: link,
      offer_category_id: category,
      offer_tags: tags,
      offer_last_used_date: "",
      offer_use_count: "",
      offer_view_count: "",
      offer_use_percent: "",
      offer_working_percent: "",
      offer_addedOn: "",
      offer_checkedBy: "",
    };
  
    try {
      const result = await saveOffertoAPI(payload);
  
      if (result.status === 200) {
        console.log("Offer added successfully");
        onClose();
      } else {
        console.error("Failed to add offer:", result.message);
      }
    } catch (error) {
      console.error("Error adding offer:", error);
    }
  };


  return (
    <Modal onClose={onClose} title="Add New Coupon">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Store</label>
          <select
            className="w-full p-2 border rounded"
            value={store}
            onChange={(e) => setStore(e.target.value)}
          >
            <option value="">Select Store</option>
            {/* Add your store options here */}
          </select>
        </div>
        <div>
          <label className="block mb-2">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {/* Add your category options here */}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Type</label>
          <select
            className="w-full p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="DEAL">Deal</option>
            <option value="COUPON">Code</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block mb-2">Benefits</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
          ></input>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Minimun Order</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="block mb-2">Code</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="block mb-2">Tags</label>
          <select
            className="w-full p-2 border rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          >
            <option value="">Select Tags</option>
            <option value="sitewide">Sitewide</option>
            <option value="select-products">Select Products</option>
            <option value="clearance">Clearance</option>
            <option value="exclusive">Exclusive</option>
            <option value="flash-sale">Flash Sale</option>
            <option value="free-gift">Free Gift</option>
            <option value="free-shipping">Free Shipping</option>
            <option value="new-users">New Users</option>
            <option value="bogo">BOGO</option>
            <option value="autumn">Autumn</option>
            <option value="back-to-school">Back to School</option>
            <option value="black-friday">Black Friday</option>
            <option value="christmas">Christmas</option>
            <option value="cyber-monday">Cyber Monday</option>
            <option value="diwali">Diwali</option>
            <option value="easter">Easter</option>
            <option value="fall">Fall</option>
            <option value="fathers-day">Fathers Day</option>
            <option value="halloween">Halloween</option>
            <option value="independence-day">Independence Day</option>
            <option value="labor-day">Labor Day</option>
            <option value="members-only">Members Only</option>
            <option value="memorial-day">Memorial Day</option>
            <option value="mothers-day">Mothers Day</option>
            <option value="new-year">New Year</option>
            <option value="presidents-day">Presidents Day</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="thanksgiving">Thanksgiving</option>
            <option value="valentines-day">Valentines Day</option>
            <option value="veterans-day">Veterans Day</option>
            <option value="winter">Winter</option>
            <option value="womens-day">Womens Day</option>
            <option value="tocheck">tocheck</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="block mb-2">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          ></input>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Link</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        ></input>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleSave}
        >
          Submit
        </button>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default AddOfferModel;

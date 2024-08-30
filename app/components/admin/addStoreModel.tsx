import React, { useState, useEffect } from "react";
import Modal from "./modals/modal";
import { saveStoreToAPI } from "@/app/app-service/storeService";

interface StoreModalProps {
  onClose: () => void;
  store?: {
    _id?: string;
    name: string;
    store_website?: string;
    store_logo?: string;
    store_description?: string;
    store_affiliate_link?: string;
    store_category?: number;
    slug: string;
    status: string;
    store_priority_score?: number;
    store_search_target?: string;
    store_best_discount?: number;
    store_tags?: string;
    store_facebook?: string;
    store_instagram?: string;
    store_twitter?: string;
    store_youtube?: string;
    store_tiktok?: string;
    store_email?: string;
    store_phone_number?: string;
    store_address?: string;
    store_help_desk?: string;
    store_contact_page?: string;
    store_country?: string;
    store_last_updated?: Date;
    store_last_checked?: Date;
    store_saving_tips?: string;
    store_how_to_use_coupon?: string;
    store_faq?: string;
    store_payment_modes?: string;
    store_program_platform?: number;
    imageData?: Buffer | undefined;
  };
}

const AddStoreModal: React.FC<StoreModalProps> = ({ onClose, store }) => {
  const [name, setName] = useState(store?.name || "");
  const [website, setWebsite] = useState(store?.store_website || "");
  const [logo, setLogo] = useState(store?.store_logo || "");
  const [description, setDescription] = useState(
    store?.store_description || ""
  );
  const [affiliateLink, setAffiliateLink] = useState(
    store?.store_affiliate_link || ""
  );
  const [category, setCategory] = useState<number | undefined>(
    store?.store_category
  );
  const [slug, setSlug] = useState(store?.slug || "");
  const [status, setStatus] = useState(store?.status || "active");
  const [priorityScore, setPriorityScore] = useState<number | undefined>(
    store?.store_priority_score
  );
  const [searchTarget, setSearchTarget] = useState(
    store?.store_search_target || ""
  );
  const [bestDiscount, setBestDiscount] = useState<number | undefined>(
    store?.store_best_discount
  );
  const [tags, setTags] = useState(store?.store_tags || "");
  const [facebook, setFacebook] = useState(store?.store_facebook || "");
  const [instagram, setInstagram] = useState(store?.store_instagram || "");
  const [twitter, setTwitter] = useState(store?.store_twitter || "");
  const [youtube, setYoutube] = useState(store?.store_youtube || "");
  const [tiktok, setTiktok] = useState(store?.store_tiktok || "");
  const [email, setEmail] = useState(store?.store_email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    store?.store_phone_number || ""
  );
  const [address, setAddress] = useState(store?.store_address || "");
  const [helpDesk, setHelpDesk] = useState(store?.store_help_desk || "");
  const [contactPage, setContactPage] = useState(
    store?.store_contact_page || ""
  );
  const [country, setCountry] = useState(store?.store_country || "");
  const [lastUpdated, setLastUpdated] = useState(
    store?.store_last_updated || new Date()
  );
  const [lastChecked, setLastChecked] = useState(
    store?.store_last_checked || new Date()
  );
  const [savingTips, setSavingTips] = useState(store?.store_saving_tips || "");
  const [howToUseCoupon, setHowToUseCoupon] = useState(
    store?.store_how_to_use_coupon || ""
  );
  const [faq, setFaq] = useState(store?.store_faq || "");
  const [paymentModes, setPaymentModes] = useState(
    store?.store_payment_modes || ""
  );
  const [programPlatform, setProgramPlatform] = useState<number | undefined>(
    store?.store_program_platform
  );
  const [image, setImage] = useState<ArrayBuffer | undefined>(undefined);

  useEffect(() => {
    if (name) {
      setSlug(generateSlug(name));
    }
  }, [name]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      const imageBuffer = await file?.arrayBuffer();
      setImage(imageBuffer);
    } catch (error) {
      console.error("Error uploading store image:", error);
    }
  };

  const handleSave = async () => {
    if (!name || !slug) {
      console.error("Name and slug are required");
      return;
    }
  
    let base64Image = null;
    if (image) {
      base64Image = await new Promise((resolve, reject) => {
        const blob = new Blob([image], { type: "image/jpg" });
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  
    const payload = {
      name,
      store_website: website,
      store_logo: logo,
      store_description: description,
      store_affiliate_link: affiliateLink,
      store_category: category,
      slug,
      status,
      store_priority_score: priorityScore,
      store_search_target: searchTarget,
      store_best_discount: bestDiscount,
      store_tags: tags,
      store_facebook: facebook,
      store_instagram: instagram,
      store_twitter: twitter,
      store_youtube: youtube,
      store_tiktok: tiktok,
      store_email: email,
      store_phone_number: phoneNumber,
      store_address: address,
      store_help_desk: helpDesk,
      store_contact_page: contactPage,
      store_country: country,
      store_last_updated: new Date(),
      store_last_checked: new Date(),
      store_saving_tips: savingTips,
      store_how_to_use_coupon: howToUseCoupon,
      store_faq: faq,
      store_payment_modes: paymentModes,
      store_program_platform: programPlatform,
      imageData: base64Image,
    };
  
    try {
      const result = await saveStoreToAPI(payload);
  
      if (result.status === 200) {
        console.log("Store added successfully");
        onClose();
      } else {
        console.error("Failed to add store:", result.message);
      }
    } catch (error) {
      console.error("Error adding store:", error);
    }
  };


  // const handleSave = async () => {
  //   if (!name || !slug) {
  //     console.error("Name and slug are required");
  //     return;
  //   }

  //   let base64Image = null;
  //   if (image) {
  //     base64Image = await new Promise((resolve, reject) => {
  //       const blob = new Blob([image], { type: "image/jpg" });
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result);
  //       reader.onerror = reject;
  //       reader.readAsDataURL(blob);
  //     });
  //   }

  //   const payload = {
  //     name,
  //     store_website: website,
  //     store_logo: logo,
  //     store_description: description,
  //     store_affiliate_link: affiliateLink,
  //     store_category: category,
  //     slug,
  //     status,
  //     store_priority_score: priorityScore,
  //     store_search_target: searchTarget,
  //     store_best_discount: bestDiscount,
  //     store_tags: tags,
  //     store_facebook: facebook,
  //     store_instagram: instagram,
  //     store_twitter: twitter,
  //     store_youtube: youtube,
  //     store_tiktok: tiktok,
  //     store_email: email,
  //     store_phone_number: phoneNumber,
  //     store_address: address,
  //     store_help_desk: helpDesk,
  //     store_contact_page: contactPage,
  //     store_country: country,
  //     store_last_updated: new Date(),
  //     store_last_checked: new Date(),
  //     store_saving_tips: savingTips,
  //     store_how_to_use_coupon: howToUseCoupon,
  //     store_faq: faq,
  //     store_payment_modes: paymentModes,
  //     store_program_platform: programPlatform,
  //     imageData: base64Image,
  //   };

  //   try {
  //     const response = await fetch("/api/private/store", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       console.log("Store added successfully");
  //       onClose();
  //     } else {
  //       console.error("Failed to add store:", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error adding store:", error);
  //   }
  // };

  return (
    <Modal onClose={onClose} title="Add New Store">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Slug</label>
          <input className="w-full p-2 border rounded" value={slug} readOnly />
        </div>
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
          <label className="block mb-2">Category</label>
          <input
            className="w-full p-2 border rounded"
            value={category}
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2">Logo</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Website</label>
          <input
            className="w-full p-2 border rounded"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Affiliate Link</label>
          <input
            className="w-full p-2 border rounded"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block mb-2">Facebook</label>
          <input
            className="w-full p-2 border rounded"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Instagram</label>
          <input
            className="w-full p-2 border rounded"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Twitter</label>
          <input
            className="w-full p-2 border rounded"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">YouTube</label>
          <input
            className="w-full p-2 border rounded"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">TikTok</label>
          <input
            className="w-full p-2 border rounded"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Email</label>
          <input
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Phone Number</label>
          <input
            className="w-full p-2 border rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="PAUSED">PAUSED</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Contact Page</label>
          <input
            className="w-full p-2 border rounded"
            value={contactPage}
            onChange={(e) => setContactPage(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Country</label>
          <input
            className="w-full p-2 border rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Tags</label>
          <select
            className="w-full p-2 border rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2">FAQ</label>
        <textarea
          className="w-full p-2 border rounded"
          value={faq}
          onChange={(e) => setFaq(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Saving Tips</label>
        <textarea
          className="w-full p-2 border rounded"
          value={savingTips}
          onChange={(e) => setSavingTips(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Help Desk</label>
        <input
          className="w-full p-2 border rounded"
          value={helpDesk}
          onChange={(e) => setHelpDesk(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Payment Modes</label>
        <input
          className="w-full p-2 border rounded"
          value={paymentModes}
          onChange={(e) => setPaymentModes(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Program Platform</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={programPlatform}
          onChange={(e) => setProgramPlatform(Number(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">How to use coupon</label>
        <textarea
          className="w-full p-2 border rounded"
          value={howToUseCoupon}
          onChange={(e) => setHowToUseCoupon(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Address</label>
        <input
          className="w-full p-2 border rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></input>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Priority Score</label>
          <select
            className="w-full p-2 border rounded"
            value={priorityScore}
            onChange={(e) => setPriorityScore(Number(e.target.value))}
          >
            <option value="">Select Priority</option>
            <option value="0">LOW</option>
            <option value="0.5">MODERATE</option>
            <option value="1">HIGH</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Search Target</label>
          <select
            className="w-full p-2 border rounded"
            value={priorityScore}
            onChange={(e) => setSearchTarget(e.target.value)}
          >
            <option value="">Select Target</option>
            <option value="organic-paid">Organic & Paid</option>
            <option value="organic">Organic</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Best Discount</label>
          <input
            className="w-full p-2 border rounded"
            value={bestDiscount}
            onChange={(e) => setBestDiscount(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex justify-end">
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

export default AddStoreModal;

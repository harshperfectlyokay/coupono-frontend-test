import React, { useState, useEffect } from "react";

interface StoreModalProps {
  onClose: () => void;
  store?: {
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
  };
}

const StoreModal: React.FC<StoreModalProps> = ({ onClose, store }) => {
    const [image, setImage] = useState<ArrayBuffer | undefined>(undefined);
  const [name, setName] = useState(store?.name);
  const [storeWebsite, setStoreWebsite] = useState(store?.store_website);
  const [storeLogo, setStoreLogo] = useState(store?.store_logo);
  const [storeDescription, setStoreDescription] = useState(
    store?.store_description || ""
  );
  const [storeAffiliateLink, setStoreAffiliateLink] = useState(
    store?.store_affiliate_link
  );
  const [storeCategory, setStoreCategory] = useState(store?.store_category);
  const [slug, setSlug] = useState(store?.slug);
  const [status, setStatus] = useState(store?.status);
  const [storePriorityScore, setStorePriorityScore] = useState(
    store?.store_priority_score
  );
  const [storeSearchTarget, setStoreSearchTarget] = useState(
    store?.store_search_target
  );
  const [storeBestDiscount, setStoreBestDiscount] = useState(
    store?.store_best_discount
  );
  const [storeTags, setStoreTags] = useState(store?.store_tags);
  const [storeFacebook, setStoreFacebook] = useState(store?.store_facebook);
  const [storeInstagram, setStoreInstagram] = useState(store?.store_instagram);
  const [storeTwitter, setStoreTwitter] = useState(store?.store_twitter);
  const [storeYoutube, setStoreYoutube] = useState(store?.store_youtube);
  const [storeTiktok, setStoreTiktok] = useState(store?.store_tiktok);
  const [storeEmail, setStoreEmail] = useState(store?.store_email);
  const [storePhoneNumber, setStorePhoneNumber] = useState(
    store?.store_phone_number
  );
  const [storeAddress, setStoreAddress] = useState(store?.store_address);
  const [storeHelpDesk, setStoreHelpDesk] = useState(store?.store_help_desk);
  const [storeContactPage, setStoreContactPage] = useState(
    store?.store_contact_page
  );
  const [storeCountry, setStoreCountry] = useState(store?.store_country);
  const [storeLastUpdated, setStoreLastUpdated] = useState(
    store?.store_last_updated
  );
  const [storeLastChecked, setStoreLastChecked] = useState(
    store?.store_last_checked
  );
  const [storeSavingTips, setStoreSavingTips] = useState(
    store?.store_saving_tips
  );
  const [storeHowToUseCoupon, setStoreHowToUseCoupon] = useState(
    store?.store_how_to_use_coupon
  );
  const [storeFaq, setStoreFaq] = useState(store?.store_faq);
  const [storePaymentModes, setStorePaymentModes] = useState(
    store?.store_payment_modes
  );
  const [storeProgramPlatform, setStoreProgramPlatform] = useState(
    store?.store_program_platform
  );

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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("image upload");
      try {
        const file = event.target.files?.[0];
        const imageBuffer = await file?.arrayBuffer();
        setImage(imageBuffer);
      } catch (error) {
        console.error(`Error saving store image for ${store?.name}:`, error);
      }
    };

  const handleEdit = async () => {
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
      id: store?._id,
      name,
      store_website: storeWebsite,
      store_logo: storeLogo,
      store_description: storeDescription,
      store_affiliate_link: storeAffiliateLink,
      store_category: storeCategory,
      slug,
      status,
      store_priority_score: storePriorityScore,
      store_search_target: storeSearchTarget,
      store_best_discount: storeBestDiscount,
      store_tags: storeTags,
      store_facebook: storeFacebook,
      store_instagram: storeInstagram,
      store_twitter: storeTwitter,
      store_youtube: storeYoutube,
      store_tiktok: storeTiktok,
      store_email: storeEmail,
      store_phone_number: storePhoneNumber,
      store_address: storeAddress,
      store_help_desk: storeHelpDesk,
      store_contact_page: storeContactPage,
      store_country: storeCountry,
      store_last_updated: new Date(),
      store_last_checked: new Date(),
      store_saving_tips: storeSavingTips,
      store_how_to_use_coupon: storeHowToUseCoupon,
      store_faq: storeFaq,
      store_payment_modes: storePaymentModes,
      store_program_platform: storeProgramPlatform,
      imageData: base64Image
    };

    try {
      const response = await fetch("/api/private/store", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Store updated successfully");
        onClose();
      } else {
        console.error("Failed to update store:", result.message);
      }
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
    //   <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-full overflow-y-auto">
        <h2 className="text-2xl mb-4">Edit Store</h2>

        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Website</label>
          <input
            className="w-full p-2 border rounded"
            value={storeWebsite}
            onChange={(e) => setStoreWebsite(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Logo</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={handleImageUpload}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Affiliate Link</label>
          <input
            className="w-full p-2 border rounded"
            value={storeAffiliateLink}
            onChange={(e) => setStoreAffiliateLink(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            className="w-full p-2 border rounded"
            value={storeCategory}
            readOnly
            // onChange={(e) => setStoreCategory(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Slug</label>
          <input
            className="w-full p-2 border rounded"
            value={slug}
            readOnly
          ></input>
        </div>

        {/* <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="PAUSED">PAUSED</option>
          </select>
        </div> */}

        <div className="mb-4">
          <label className="block mb-2">Priority Score</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={storePriorityScore}
            onChange={(e) => setStorePriorityScore(Number(e.target.value))}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Search Target</label>
          <input
            className="w-full p-2 border rounded"
            value={storeSearchTarget}
            onChange={(e) => setStoreSearchTarget(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Best Discount</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={storeBestDiscount}
            onChange={(e) => setStoreBestDiscount(Number(e.target.value))}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tags</label>
          <input
            className="w-full p-2 border rounded"
            value={storeTags}
            onChange={(e) => setStoreTags(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Facebook</label>
          <input
            className="w-full p-2 border rounded"
            value={storeFacebook}
            onChange={(e) => setStoreFacebook(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Instagram</label>
          <input
            className="w-full p-2 border rounded"
            value={storeInstagram}
            onChange={(e) => setStoreInstagram(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Twitter</label>
          <input
            className="w-full p-2 border rounded"
            value={storeTwitter}
            onChange={(e) => setStoreTwitter(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">YouTube</label>
          <input
            className="w-full p-2 border rounded"
            value={storeYoutube}
            onChange={(e) => setStoreYoutube(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">TikTok</label>
          <input
            className="w-full p-2 border rounded"
            value={storeTiktok}
            onChange={(e) => setStoreTiktok(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            className="w-full p-2 border rounded"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Phone Number</label>
          <input
            className="w-full p-2 border rounded"
            value={storePhoneNumber}
            onChange={(e) => setStorePhoneNumber(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Address</label>
          <input
            className="w-full p-2 border rounded"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Help Desk</label>
          <input
            className="w-full p-2 border rounded"
            value={storeHelpDesk}
            onChange={(e) => setStoreHelpDesk(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Contact Page</label>
          <input
            className="w-full p-2 border rounded"
            value={storeContactPage}
            onChange={(e) => setStoreContactPage(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Country</label>
          <input
            className="w-full p-2 border rounded"
            value={storeCountry}
            onChange={(e) => setStoreCountry(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Saving Tips</label>
          <textarea
            className="w-full p-2 border rounded"
            value={storeSavingTips}
            onChange={(e) => setStoreSavingTips(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">How to Use Coupon</label>
          <textarea
            className="w-full p-2 border rounded"
            value={storeHowToUseCoupon}
            onChange={(e) => setStoreHowToUseCoupon(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">FAQ</label>
          <textarea
            className="w-full p-2 border rounded"
            value={storeFaq}
            onChange={(e) => setStoreFaq(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Payment Modes</label>
          <input
            className="w-full p-2 border rounded"
            value={storePaymentModes}
            onChange={(e) => setStorePaymentModes(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Program Platform</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={storeProgramPlatform}
            onChange={(e) => setStoreProgramPlatform(Number(e.target.value))}
          ></input>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleEdit}
          >
            Update
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;

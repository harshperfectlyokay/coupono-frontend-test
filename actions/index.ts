'use server'

import { signIn, signOut } from "@/auth";
import { connectToDB } from "@/utils/db";
import { Offer } from "../api/private/offer/route";
import { ObjectId } from "mongodb";
import { Store } from "../api/private/store/route";
import { saveStoreImageToLocal } from "@/utils/helperMethods";
import { OfferFromMySQL } from "../api/private/offer/reload/route";
import { StoreFromMSQL } from "../api/private/store/reload/route";

export async function doLogout() {
    await signOut({ redirectTo: "/" });
  }
  
  export async function doCredentialLogin(credentials:{}) {  
    try {
      const response = await signIn("credentials", {
        ...credentials,
        redirect:true,
        redirectTo:process.env.BASE_URL || 'http://localhost:3000/'
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

export const getAllCron = () => {
    return [{name:'Cron 1',interval:'daily'},{name:'Cron 2',interval:'twice a day'}]
}

export async function getAllRoutesAccess() {
  

  try {
    
    const db = await connectToDB();
    const collection = db.collection('routes');

    const routes = await collection.find().toArray();

    const pagesAccess:{
      referer: string,
      access: string[],
    }[] = [];
    const apisAccess:{
      origin: string,
      referer: string,
      path: string,
      access: string[],
    }[] = [];

    routes.forEach((route) => {
      if (route.referer) {
        pagesAccess.push({
          referer: route.referer,
          access: route.access,
        });
      } else if(route.referer == null){
        pagesAccess.push({
          referer: process.env.BASE_URL || '/',
          access: route.access,
        });
      }

      // Add APIs
      if (route.api && route.api.length > 0) {
        route.api.forEach((api:{path:string,access:string[],note:string|null}) => {
          apisAccess.push({
            origin: route.origin,
            referer: route.referer ? route.referer : process.env.BASE_URL,
            path: api.path,
            access: api.access,
          });
        });
      }
    });

    return {
      pagesAccess,
      apisAccess,
    };
  } catch (error) {
    console.error('Error retrieving routes:', error);
    return { pagesAccess: [], apisAccess: [] };
  }
}

export async function fetchOffers(params: {
  page: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  addedBy?: string;
  store?: string;
  type?: string;
  tags?: string;
  status?: string;
  lastCheck?: string;
}) {
  const { page, itemsPerPage, sortField, sortDirection, addedBy, store, type, tags, status, lastCheck } = params;

  const db = await connectToDB();
  const skip = (page - 1) * itemsPerPage;

  try {
    const query: any = {};
    if (addedBy) query.offer_addedBy = addedBy;
    if (store) query.offer_store_id = store;
    if (type) query.offer_type = type;
    if (tags) query.offer_tags = tags;
    if (status) query.offer_status = status;
    if (lastCheck) query.offer_added_date = { $gte: new Date(lastCheck) };

    const offersCollection = db.collection<Offer>("offers");

    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortField] = sortDirection === 'asc' ? 1 : -1;

    const filteredOffersCount = await offersCollection.countDocuments(query);
    const offersCursor = offersCollection.find(query).sort(sort).skip(skip).limit(itemsPerPage);
    const offers = await offersCursor.toArray();

    const storeNameMap: { id: string, name: string }[] = [];
    try {
      const stores = await db.collection("stores").find({}).toArray();
      stores.forEach(store => {
        storeNameMap.push({
          id: store.id,
          name: store.name
        });
      });
    } catch (error) {
      console.log("Error fetching stores:", error);
    }

    const offersWithStoreName = await Promise.all(
      offers.map(async (offer) => {
        let storeName = "";
        let storeId = offer.offer_store_id as string | number | undefined;
        if (typeof storeId === "number") {
          storeId = storeId.toString();
        }
        if (storeId) {
          const store = await db.collection("stores").findOne({ id: storeId });
          storeName = store ? store.name : "Unknown Store";
        }
        return {
          ...offer,
          offer_store_id: storeName,
        };
      })
    );

    return {
      offers: offersWithStoreName,
      totalItems: filteredOffersCount,
      offerOfStore: storeNameMap,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

export async function updateOffer(offerData: Offer & { _id: string }) {
  const db = await connectToDB();
  const { _id, ...updateData } = offerData;

  if (!_id) {
    throw new Error("Offer ID is required");
  }

  const offersCollection = db.collection<Offer>("offers");
  const objectId = new ObjectId(_id);

  const existingOffer = await offersCollection.findOne({ _id: objectId });

  if (!existingOffer) {
    throw new Error("Offer does not exist");
  }

  await offersCollection.updateOne(
    { _id: objectId },
    { $set: updateData }
  );

  return {
    success: true,
    message: "Offer updated successfully",
  };
}

export async function addOffer(offerData: Offer) {
  const db = await connectToDB();
  const offersCollection = db.collection<Offer>("offers");

  const {
    offer_title,
    offer_code,
    offer_added_date,
    offer_updated_date,
    offer_status,
    offer_type,
    offer_benefit,
    offer_description,
    offer_minimum_order,
    offer_start_date,
    offer_end_date,
    offer_link,
    offer_category_id,
    offer_tags,
    offer_last_used_date,
    offer_use_count,
    offer_view_count,
    offer_use_percent,
    offer_working_percent,
    offer_addedOn,
    offer_checkedBy,
    offer_user_id,
    offer_store_id,
  } = offerData;
 // !offer_code 
  if (!offer_title) {
    throw new Error("Offer title and code are required");
  }

  if (offer_type === "coupon" && !offer_code) {
    throw new Error("Offer code is required for coupons");
  }

  // const existingOffer = await offersCollection.findOne({
  //   offer_title,
  //   offer_code,
  // });

  // if (existingOffer) {
  //   throw new Error("Offer with this code and title already exists");
  // }

  const result = await offersCollection.insertOne({
    offer_user_id,
    offer_store_id,
    offer_added_date: offer_added_date || new Date(),
    offer_updated_date: offer_updated_date || new Date().toISOString(),
    offer_status: offer_status || 'PENDING',
    offer_type: offer_type || undefined,
    offer_benefit: offer_benefit || '',
    offer_title,
    offer_description: offer_description || '',
    offer_minimum_order: offer_minimum_order || 0,
    offer_code: offer_type === "coupon" ? offer_code : undefined,
    offer_start_date: offer_start_date || new Date().toISOString(),
    offer_end_date: offer_end_date || '',
    offer_link: offer_link || '',
    offer_category_id: offer_category_id || '',
    offer_tags: offer_tags || '',
    offer_last_used_date: offer_last_used_date || new Date().toISOString(),
    offer_use_count: offer_use_count || '0',
    offer_view_count: offer_view_count || '0',
    offer_use_percent: offer_use_percent || '',
    offer_working_percent: offer_working_percent || '',
    offer_addedOn: offer_addedOn || '',
    offer_checkedBy: offer_checkedBy || ''
  });

  const insertedOffer = await offersCollection.findOne({ _id: result.insertedId });

  return {
    success: true,
    message: "Offer added successfully",
    offer: insertedOffer
  };
}

export async function updateOfferField(id: string, field: keyof Offer, value: any) {
  const db = await connectToDB();
  const offerCollection = db.collection<Offer>("offers");
  const objectId = new ObjectId(id);

  const existingOffer = await offerCollection.findOne({ _id: objectId });

  if (!existingOffer) {
    throw new Error("Offer does not exist");
  }

  await offerCollection.updateOne(
    { _id: objectId },
    { $set: { [field]: value } }
  );

  return {
    success: true,
    message: "Offer updated successfully",
  };
}

export async function deleteOffer(offerId: string) {
  const db = await connectToDB();
  const offersCollection = db.collection<Offer>("offers");

  const existingOffer = await offersCollection.findOne({ _id: new ObjectId(offerId) });

  if (!existingOffer) {
    throw new Error("Offer not found");
  }

  const result = await offersCollection.deleteOne({ _id: new ObjectId(offerId) });

  if (result.deletedCount === 0) {
    return {
      success: false,
      message: "Failed to delete offer",
    };
  }

  return {
    success: true,
    message: "Offer deleted successfully",
  };
}

export async function fetchStores({
  page = 1,
  itemsPerPage = 50,
  sortField = 'name',
  sortDirection = 'asc',
  all = false,
  filters = {}
}: {
  page?: number;
  itemsPerPage?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  all?: boolean;
  filters?: {
      name?: string;
      status?: string;
      priority?: string;
      target?: string;
      category?: string;
      lastCheck?: string;
  };
}) {
  const db = await connectToDB();
  const skip = (page - 1) * itemsPerPage;
  
  const query: any = {};
  if (filters.name) query.name = { $regex: new RegExp(filters.name, 'i') };
  if (filters.status) query.store_status = filters.status;
  if (filters.priority) query.store_priority_score = filters.priority;
  if (filters.target) query.target = filters.target;
  if (filters.category) query.store_category = filters.category;
  if (filters.lastCheck) query.store_last_checked = { $gte: new Date(filters.lastCheck) };

  const storesCollection = db.collection<Store>("stores");
  let stores: Store[] = [];
  let totalItems: number = 0;

  if (all) {
      stores = await storesCollection.find().toArray();
      totalItems = stores.length;
  } else {
      totalItems = await storesCollection.countDocuments(query);
      const sort: { [key: string]: 1 | -1 } = {};
      sort[sortField] = sortDirection === 'asc' ? 1 : -1;

      const storesCursor = storesCollection.find(query).sort(sort).skip(skip).limit(itemsPerPage);
      stores = await storesCursor.toArray();
  }

  const categoriesNameMap: { id: string, name: string }[] = [];
  try {
      const categories = await db.collection("categories").find({}).toArray();
      categories.forEach(category => {
          categoriesNameMap.push({
              id: category.id,
              name: category.category_name
          });
      });
  } catch (error) {
      console.error("Error fetching categories:", error);
  }

  const storesWithCategoryNames = await Promise.all(stores.map(async (store) => {
      let categoryName = "";

      if (store.store_category) {
          const category = await db.collection("categories").findOne({ id: store.store_category });
          categoryName = category ? category.category_name : "Unknown Category";
      }

      return {
          ...store,
          store_category: categoryName,
      };
  }));

  return {
      stores: storesWithCategoryNames,
      totalItems,
      categories: categoriesNameMap,
  };
}

export async function updateStore({
  id,
  storeData
}: {
  id: string;
  storeData: Partial<Store>;
}) {
  const db = await connectToDB();
  const storesCollection = db.collection<Store>("stores");
  const objectId = new ObjectId(id);

  const existingStore = await storesCollection.findOne({ _id: objectId });

  if (!existingStore) {
      throw new Error("Store does not exist");
  }

  if (storeData.imageData) {
      try {
          storeData.store_logo = await saveStoreImageToLocal(storeData.imageData, storeData.name || "default");
      } catch (error) {
          console.error("Error saving image:", error);
      }
  }

  await storesCollection.updateOne({ _id: objectId }, { $set: storeData });
}

export async function addStore({
  storeData
}: {
  storeData: Store & { imageData?: string };
}) {
  const db = await connectToDB();
  const storesCollection = db.collection<Store>("stores");

  const existingStore = await storesCollection.findOne({ slug: storeData.slug });

  if (existingStore) {
      throw new Error("Store with this slug already exists");
  }

  if (storeData.imageData) {
      try {
          storeData.store_logo = await saveStoreImageToLocal(storeData.imageData, storeData.name);
      } catch (error) {
          console.error("Error saving image:", error);
      }
  }

  await storesCollection.insertOne(storeData);
}

export async function updateStoreStatus({
  id,
  status
}: {
  id: string;
  status: string;
}) {
  const db = await connectToDB();
  const storesCollection = db.collection<Store>("stores");
  const objectId = new ObjectId(id);

  const existingStore = await storesCollection.findOne({ _id: objectId });

  if (!existingStore) {
      throw new Error("Store does not exist");
  }

  if (status !== 'ACTIVE' && status !== 'PAUSED') {
      throw new Error("Invalid status value");
  }

  await storesCollection.updateOne({ _id: objectId }, { $set: { status } });
}

export async function updateStoreField({
  id,
  field,
  value
}: {
  id: string;
  field: keyof Store;
  value: any;
}) {
  const db = await connectToDB();
  const storesCollection = db.collection<Store>("stores");
  const objectId = new ObjectId(id);

  const existingStore = await storesCollection.findOne({ _id: objectId });

  if (!existingStore) {
      throw new Error("Store does not exist");
  }

  const result = await storesCollection.updateOne(
      { _id: objectId },
      { $set: { [field]: value } }
  );

  return result;
}

async function fetchExternalOffers() {
  const externalResponse = await fetch('http://localhost:3000/api/v1/offers', {
      headers: {
          "authorization": "VSOmureCBRckufLIeZbMunv09rok2lKHGF4NEAWWBbeigvTm4VMhKp9Dc2pg57wE",
          "Content-Type": "application/json",
      },
  });

  if (externalResponse.ok) {
      const retrievedOffers = await externalResponse.json();
      return retrievedOffers.data.offers;
  } else {
      console.log("Failed to fetch offers from external API.");
      return [];
  }
}

async function processOffers(offers: OfferFromMySQL[], offersCollection: any) {
  const updatedExternalOffers = offers.map((offer) => {
      const {
          offer_user_id,
          offer_store_id,
          offer_added_date,
          offer_updated_date,
          offer_status,
          offer_type,
          offer_benefit,
          offer_title,
          offer_description,
          offer_minimum_order,
          offer_code,
          offer_start_date,
          offer_end_date,
          offer_link,
          offer_category_id,
          offer_tags,
          offer_last_used_date,
          offer_use_count,
          offer_view_count,
          offer_use_percent,
          offer_working_percent,
          offer_addedOn,
          offer_checkedBy,
          type,
          storeId,
          code,
          title,
          description,
          benefit,
          expiryDate,
          addedBy,
          addedOn,
          isExpired,
          isChecked
      } = offer;

      return {
          offer_user_id: offer_user_id || null,
          offer_store_id: storeId || null,
          offer_added_date: offer_added_date || new Date(),
          offer_updated_date: offer_updated_date || new Date().toISOString(),
          offer_status: offer_status || 'active',
          offer_type: type,
          offer_benefit: benefit,
          offer_title: title,
          offer_description: description,
          offer_minimum_order: offer_minimum_order || 0,
          offer_code: code || '',
          offer_start_date: offer_start_date || '',
          offer_end_date: expiryDate,
          offer_link: offer_link || '',
          offer_category_id: offer_category_id || '',
          offer_tags: offer_tags || '',
          offer_last_used_date: offer_last_used_date || '',
          offer_use_count: offer_use_count || '0',
          offer_view_count: offer_view_count || '0',
          offer_use_percent: offer_use_percent || '',
          offer_working_percent: offer_working_percent || '',
          offer_addedBy: addedBy || '',
          offer_addedOn: addedOn || '',
          offer_isVerified : isChecked,
          offer_isExpired : isExpired,
      };
  });

  const newOffers = [];
  for (const offer of updatedExternalOffers) {
      const existingOffer = await offersCollection.findOne({
          offer_title: offer.offer_title,
          offer_code: offer.offer_code,
      });

      if (!existingOffer) {
          newOffers.push(offer);
      }
  }

  if (newOffers.length > 0) {
      await offersCollection.insertMany(newOffers);
  }
}

export async function saveExternalOffer() {
  const db = await connectToDB();
  const offersCollection = db.collection<OfferFromMySQL>("offers");

  const totalItems = await offersCollection.countDocuments();

  const externalOffers = await fetchExternalOffers();
  await processOffers(externalOffers, offersCollection);

  const offersCursor = offersCollection.find();
  const offers = await offersCursor.toArray();

  return { offers, totalItems };
}

async function fetchExternalStores() {
  const externalResponse = await fetch('http://localhost:3000/api/v1/allStore', {
      headers: {
          "authorization": "VSOmureCBRckufLIeZbMunv09rok2lKHGF4NEAWWBbeigvTm4VMhKp9Dc2pg57wE",
          "Content-Type": "application/json",
      },
  });

  if (externalResponse.ok) {
      const retrievedStores = await externalResponse.json();
      return retrievedStores.data.stores;
  } else {
      console.log("Failed to fetch stores from external API.");
      return [];
  }
}

async function processStores(stores: StoreFromMSQL[], storesCollection: any) {
  const updatedExternalStores = stores.map((store : StoreFromMSQL) => ({
      ...store,
      store_status: store.status,
      store_logo: store.store_logo || '',
      store_description: store.store_description || '',
      store_affiliate_link: store.store_affiliate_link || '',
      store_category: store.store_category ?? undefined,
      store_priority_score: store.store_priority_score ?? undefined,
      store_search_target: store.store_search_target || '',
      store_best_discount: store.store_best_discount || undefined,
      store_tags: store.store_tags || '',
      store_facebook: store.store_facebook || '',
      store_instagram: store.store_instagram || '',
      store_twitter: store.store_twitter || '',
      store_youtube: store.store_youtube || '',
      store_tiktok: store.store_tiktok || '',
      store_email: store.store_email || '',
      store_phone_number: store.store_phone_number || '',
      store_address: store.store_address || '',
      store_help_desk: store.store_help_desk || '',
      store_contact_page: store.store_contact_page || '',
      store_country: store.store_country || '',
      store_last_updated: store.store_last_updated || new Date(),
      store_last_checked: store.store_last_checked || new Date(),
      store_saving_tips: store.store_saving_tips || '',
      store_how_to_use_coupon: store.store_how_to_use_coupon || '',
      store_faq: store.store_faq || '',
      store_payment_modes: store.store_payment_modes || '',
      store_program_platform: store.store_program_platform ?? undefined,
      store_disclaimer: store.store_disclaimer || '',
      store_template: store.store_template || '',
      store_rating: store.store_rating ?? undefined,
      store_view_count: store.store_view_count ?? undefined,
      store_average_rating: store.store_average_rating ?? undefined,
      store_alternate_slug: store.store_alternate_slug ?? undefined,
  }));

  const existingStores = await storesCollection.find().toArray();
  const existingStoreNames = new Set(existingStores.map((store : StoreFromMSQL) => store.name));

  const newStores = updatedExternalStores.filter(store => !existingStoreNames.has(store.name));

  if (newStores.length > 0) {
      await storesCollection.insertMany(newStores);
  }
}

export async function saveExternalStore() {
  const db = await connectToDB();
  const storesCollection = db.collection<StoreFromMSQL>("stores");

  const totalItems = await storesCollection.countDocuments();

  const externalStores = await fetchExternalStores();
  await processStores(externalStores, storesCollection);

  const storesCursor = storesCollection.find();
  const stores = await storesCursor.toArray();

  return { stores, totalItems };
}


//User End Server Functions : 

export async function fetchStoreDetails(storeWebsite: string) {
  try {
      const db = await connectToDB();
      const storesCollection = db.collection('stores');
      const offersCollection = db.collection('offers');

      const store = await storesCollection.findOne({ store_website: storeWebsite }, {
          projection: {
              id: 1,
              store_name: 1,
              store_website: 1,
              store_logo: 1,
              store_description: 1,
              store_affiliate_link: 1,
              store_category: 1,
              store_slug: 1,
              store_facebook: 1,
              store_instagram: 1,
              store_twitter: 1,
              store_youtube: 1,
              store_tiktok: 1,
              store_saving_tips: 1,
              store_how_to_use_coupon: 1,
              store_faq: 1,
              store_rating: 1,
              store_status: 1
          }
      });

      if (!store) {
        throw new Error("Store not found");
      }

      const storeId = store.id.toString();
      const activeDealsCount = await offersCollection.countDocuments({
          offer_store_id: storeId,
          offer_type: "DEAL",
          offer_isExpired: 1
      });

      const activeCouponsCount = await offersCollection.countDocuments({
          offer_store_id: storeId,
          offer_isExpired: 1,
          offer_type: "COUPON"
      });

      const totalActiveOffersCount = activeDealsCount + activeCouponsCount;
      store.store_deals_count = activeDealsCount;
      store.store_coupons_count = activeCouponsCount;
      store.store_total_offer_count = totalActiveOffersCount;

      return {
          store : store
      };
  } catch (error: any) {
      console.error(error);
      return {
          success: false,
          message: error.message,
          status: 500
      };
  }
}

export async function fetchOffersDetailsOfStore(
  storeWebsite: string,
  status: string,
  page: number,
  itemsPerPage: number,
  upto: boolean
) {
  try {
    const db = await connectToDB();
    const storesCollection = db.collection('stores');
    const offersCollection = db.collection('offers');

    const store = await storesCollection.findOne({ store_website: storeWebsite });

    if (!store) {
      throw new Error("Store not found");
    }

    const storeId = store.id.toString();
    const query: any = { offer_store_id: storeId };

    if (status === 'active') {
      query.offer_isExpired = 0;
    } else if (status === 'expired') {
      query.offer_isExpired = 1;
    }

    const skipPages = upto ? 0 : (page - 1) * itemsPerPage;
    const limit = upto ? page * itemsPerPage : itemsPerPage;

    const offers = await offersCollection.find(
      query,
      {
        projection: {
          _id: 1,
          offer_user_id: 1,
          offer_store_id: 1,
          offer_status: 1,
          offer_type: 1,
          offer_benefit: 1,
          offer_title: 1,
          offer_description: 1,
          offer_code: 1,
          offer_end_date: 1,
          offer_link: 1,
          offer_category_id: 1,
          offer_use_count: 1,
          offer_isVerified: 1,
          offer_isExpired: 1,
        },
        skip: skipPages,
        limit: limit,
      }
    ).toArray();

    return {
      offers
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
      status: 500
    };
  }
}
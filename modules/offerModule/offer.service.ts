import { OfferFromMySQL } from "@/app/api/private/offer/reload/route";
import { Offer } from "@/app/api/private/offer/route";
import HandleResponse from "@/helpers/serverResponse";
import { connectToDB } from "@/utils/db";
import { ObjectId } from "mongodb";


export const fetchOffersService = async (params: {
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
}) => {
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

        const offersCollection = db.collection('offers');

        const sort: { [key: string]: 1 | -1 } = {};
        sort[sortField] = sortDirection === 'asc' ? 1 : -1;

        const filteredOffersCount = await offersCollection.countDocuments(query);
        const offersCursor = offersCollection.find(query).sort(sort).skip(skip).limit(itemsPerPage);
        const offers = await offersCursor.toArray();

        const storeNameMap: { id: string, name: string }[] = [];
        try {
            const stores = await db.collection('stores').find({}).toArray();
            stores.forEach(store => {
                storeNameMap.push({
                    id: store.id,
                    name: store.name
                });
            });
        } catch (error) {
            console.log("Error fetching stores:", error);
        }

        // const offersWithStoreName = await Promise.all(
        //     offers.map(async (offer) => {
        //         let storeName = "";
        //         let storeId = offer.offer_store_id as string | number | undefined;
        //         if (typeof storeId === "number") {
        //             storeId = storeId.toString();
        //         }
        //         if (storeId) {
        //             const store = await db.collection('stores').findOne({ id: storeId });
        //             storeName = store ? store.name : "Unknown Store";
        //         }
        //         return {
        //             ...offer,
        //             offer_store_id: storeName,
        //         };
        //     })
        // );

        const offersWithStoreName = await Promise.all(
            (offers || []).map(async (offer) => {
              let storeName = "";
              let storeId = offer.offer_store_id as string | number | undefined;
              if (typeof storeId === "number") {
                storeId = storeId.toString();
              }
              if (storeId) {
                const store = await db.collection('stores').findOne({ id: storeId });
                storeName = store ? store.name : "Unknown Store";
              }
              return {
                ...offer,
                offer_store_id: storeName,
              };
            })
          );

        return new HandleResponse(200, "Offers fetched successfully!", {
            offers: offersWithStoreName,
            totalItems: filteredOffersCount,
            offerOfStore: storeNameMap,
        });
    } catch (error: any) {
        console.log(error);
        return new HandleResponse(500, `Failed to fetch offers: ${error.message}`, null);
    }
};


export const updateOfferService = async (offerData: Offer & { _id: string }) => {
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

    return new HandleResponse(200, "Offer updated successfully", null);
};

export const addOfferService = async (offerData: Offer) => {
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

    if (!offer_title) {
        throw new Error("Offer title and code are required");
    }

    if (offer_type === "coupon" && !offer_code) {
        throw new Error("Offer code is required for coupons");
    }

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

    return new HandleResponse(200, "Offer added successfully", insertedOffer);
};

export const deleteOfferService = async (offerId: string) => {
    const db = await connectToDB();
    const offersCollection = db.collection<Offer>("offers");

    const existingOffer = await offersCollection.findOne({ _id: new ObjectId(offerId) });

    if (!existingOffer) {
        throw new Error("Offer not found");
    }

    const result = await offersCollection.deleteOne({ _id: new ObjectId(offerId) });

    if (result.deletedCount === 0) {
        return new HandleResponse(500, "Failed to delete offer", null);
    }

    return new HandleResponse(200, "Offer deleted successfully", null);
};

export const updateOfferFieldService = async ({
    id,
    field,
    value
}: {
    id: string;
    field: keyof Offer;
    value: any;
}) => {
    const db = await connectToDB();
    const offersCollection = db.collection<Offer>("offers");
    const objectId = new ObjectId(id);

    const existingOffer = await offersCollection.findOne({ _id: objectId });

    if (!existingOffer) {
        throw new Error("Offer does not exist");
    }

    await offersCollection.updateOne(
        { _id: objectId },
        { $set: { [field]: value } }
    );

    return {
        success: true,
        message: "Offer updated successfully",
    };
};

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

export const fetchAndSaveExternalOffersService = async () => {
    const db = await connectToDB();
    const offersCollection = db.collection<OfferFromMySQL>("offers");

    const totalItems = await offersCollection.countDocuments();

    const externalOffers = await fetchExternalOffers();
    await processOffers(externalOffers, offersCollection);

    const offersCursor = offersCollection.find();
    const offers = await offersCursor.toArray();

    return { offers, totalItems };
};


export const fetchOffersDetailsService = async (
    storeWebsite: string,
    status: string,
    page: number,
    itemsPerPage: number,
    upto: boolean
  ) => {
    const db = await connectToDB();
    const storesCollection = db.collection('stores');
    const offersCollection = db.collection('offers');
  
    try {
      const store = await storesCollection.findOne({ store_website: storeWebsite });
  
      if (!store) {
        return new HandleResponse(404, "Store not found", null);
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

    // const offers = await offersCollection.find(
    //     query,
    //     {
    //       skip: skipPages,
    //       limit: limit,
    //     }
    //   ).toArray();
  
      return new HandleResponse(200, "Offers fetched successfully", { offers });
  
    } catch (error: any) {
      console.error(error);
      return new HandleResponse(500, error.message, null);
    }
  };
import { StoreFromMSQL } from "@/app/api/private/store/reload/route";
import { Store } from "@/app/api/private/store/route";
import HandleResponse from "@/helpers/serverResponse";
import { connectToDB } from "@/utils/db";
import { saveStoreImageToLocal } from "@/utils/helperMethods";
import { ObjectId } from "mongodb";




export const fetchStoresService = async ({
    page,
    itemsPerPage,
    sortField,
    sortDirection,
    all,
    filters
}: {
    page: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    all: boolean;
    filters: {
        name?: string;
        status?: string;
        priority?: string;
        target?: string;
        category?: string;
        lastCheck?: string;
    };
}) => {
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

    return new HandleResponse(200, "Stores fetched successfully", {
        stores: storesWithCategoryNames,
        totalItems,
        categories: categoriesNameMap,
    });
};

export const updateStoreService = async ({ id, storeData }: { id: string; storeData: Partial<Store> }) => {
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
    return new HandleResponse(200, "Store updated successfully", null);
};

export const addStoreService = async ({ storeData }: { storeData: Store & { imageData?: string } }) => {
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
    return new HandleResponse(200, "Store added successfully", null);
};

export const updateStoreStatusService = async ({ id, status }: { id: string; status: string }) => {
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
    return new HandleResponse(200, "Store status updated successfully", null);
};

export const updateStoreFieldService = async ({
    id,
    field,
    value
}: {
    id: string;
    field: keyof Store;
    value: any;
}) => {
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
};


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
    const updatedExternalStores = stores.map((store: StoreFromMSQL) => ({
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
    const existingStoreNames = new Set(existingStores.map((store: StoreFromMSQL) => store.name));

    const newStores = updatedExternalStores.filter(store => !existingStoreNames.has(store.name));

    if (newStores.length > 0) {
        await storesCollection.insertMany(newStores);
    }
}

export const fetchAndSaveExternalStoresService = async () => {
    const db = await connectToDB();
    const storesCollection = db.collection<StoreFromMSQL>("stores");

    const totalItems = await storesCollection.countDocuments();

    const externalStores = await fetchExternalStores();
    await processStores(externalStores, storesCollection);

    const storesCursor = storesCollection.find();
    const stores = await storesCursor.toArray();

    return { stores, totalItems };
};

export const fetchStoreDetailsService = async (storeWebsite: string) => {
    const db = await connectToDB();
    const storesCollection = db.collection('stores');
    const offersCollection = db.collection('offers');

    try {
        const store = await storesCollection.findOne(
            { store_website: storeWebsite },
            {
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
            }
        );

        if (!store) {
            return new HandleResponse(404, "Store not found", null);
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

        return new HandleResponse(200, "Store details fetched successfully", { store });

    } catch (error: any) {
        console.error(error);
        return new HandleResponse(500, error.message, null);
    }
};
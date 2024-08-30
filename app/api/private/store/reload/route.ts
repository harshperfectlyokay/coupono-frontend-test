import { saveExternalStore } from "@/app/actions";
import { fetchAndSaveExternalStoresController } from "@/modules/storeModule/store.controller";
import { connectToDB } from "@/utils/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
export interface StoreFromMSQL {
    _id?: ObjectId;
    name: string;
    slug: string;
    status: string;
    store_alternate_slug: string,
    store_website?: string;
    store_logo?: string;
    store_description?: string;
    store_affiliate_link?: string;
    store_category?: ObjectId;
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
    store_disclaimer?: string;
    store_template?: string;
    store_rating?: number;
    store_view_count?: number;
    store_average_rating?: number;
    store_name: string;
    store_slug: string;
    store_status: string;
}

// export async function GET(req: NextRequest) {
//     const db = await connectToDB();

//     try {
//         const storesCollection = db.collection<StoreFromMSQL>("stores");
//         const totalItems = await storesCollection.countDocuments();

//         let externalStores: StoreFromMSQL[] = [];
//         const externalResponse = await fetch(`http://localhost:3000/api/v1/allStore`, {
//             headers: {
//                 "authorization": "VSOmureCBRckufLIeZbMunv09rok2lKHGF4NEAWWBbeigvTm4VMhKp9Dc2pg57wE",
//                 "Content-Type": "application/json",
//             },
//         });

//         if (externalResponse.ok) {
//             const retrievedStores = await externalResponse.json();
//             externalStores = retrievedStores.data.stores;
//         } else {
//             console.log("Failed to fetch stores from external API, continuing with local data.");
//         }

//         const updatedExternalStores = externalStores.map(store => ({
//             ...store,
//             store_status: store.status,
//             store_logo: store.store_logo || '',
//             store_description: store.store_description || '',
//             store_affiliate_link: store.store_affiliate_link || '',
//             store_category: store.store_category ?? undefined,
//             store_priority_score: store.store_priority_score ?? undefined,
//             store_search_target: store.store_search_target || '',
//             store_best_discount: store.store_best_discount || undefined,
//             store_tags: store.store_tags || '',
//             store_facebook: store.store_facebook || '',
//             store_instagram: store.store_instagram || '',
//             store_twitter: store.store_twitter || '',
//             store_youtube: store.store_youtube || '',
//             store_tiktok: store.store_tiktok || '',
//             store_email: store.store_email || '',
//             store_phone_number: store.store_phone_number || '',
//             store_address: store.store_address || '',
//             store_help_desk: store.store_help_desk || '',
//             store_contact_page: store.store_contact_page || '',
//             store_country: store.store_country || '',
//             store_last_updated: store.store_last_updated || new Date(),
//             store_last_checked: store.store_last_checked || new Date(),
//             store_saving_tips: store.store_saving_tips || '',
//             store_how_to_use_coupon: store.store_how_to_use_coupon || '',
//             store_faq: store.store_faq || '',
//             store_payment_modes: store.store_payment_modes || '',
//             store_program_platform: store.store_program_platform ?? undefined,
//         }));

//         const existingStores = await storesCollection.find().toArray();
//         const existingStoreNames = new Set(existingStores.map(store => store.name));

//         const newStores = updatedExternalStores.filter(store => !existingStoreNames.has(store.name));

//         if (newStores.length > 0) {
//             await storesCollection.insertMany(newStores);
//         }
//         const storesCursor = storesCollection.find();
//         const stores = await storesCursor.toArray();

//         return NextResponse.json({
//             stores: stores,
//             totalItems: totalItems,
//             success: true,
//         });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({
//             success: false,
//         });
//     }
// }

// export async function GET(req: NextRequest) {
//     const db = await connectToDB();
//     const pageData = req.nextUrl?.searchParams.get('page') || '1';
//     const page = parseInt(pageData);
//     const itemsData = req.nextUrl?.searchParams.get('itemsPerPage') || '50';
//     const itemsPerPage = parseInt(itemsData);
//     const skip = (page - 1) * itemsPerPage;
//     const sortField = req.nextUrl?.searchParams.get('sortField') || 'name';
//     const sortDirection = req.nextUrl?.searchParams.get('sortDirection') || 'asc';

//     const name = req.nextUrl.searchParams.get('name') || '';
//     const status = req.nextUrl.searchParams.get('status') || '';
//     const priority = req.nextUrl.searchParams.get('priority') || '';
//     const target = req.nextUrl.searchParams.get('target') || '';
//     const category = req.nextUrl.searchParams.get('category') || '';
//     const lastCheck = req.nextUrl.searchParams.get('lastCheck') || '';

//     try {
//         const query: any = {};
//         if (name) query.name = { $regex: name, $options: 'i' };
//         if (status) query.store_status = status;
//         if (priority) query.store_priority_score = priority;
//         if (target) query.target = target;
//         if (category) query.store_category = category;
//         if (lastCheck) query.store_last_checked = { $gte: new Date(lastCheck) };

//         const storesCollection = db.collection<StoreFromMSQL>("stores");

//         const totalItems = await storesCollection.countDocuments();

//         let externalStores: StoreFromMSQL[] = [];
//         if (totalItems < page * itemsPerPage) {
//             try {
//                 const externalResponse = await fetch(`http://localhost:3000/api/v1/allStore?page=${page}&itemPerPage=${itemsPerPage + 10}`, {
//                     headers: {
//                         "authorization": "VSOmureCBRckufLIeZbMunv09rok2lKHGF4NEAWWBbeigvTm4VMhKp9Dc2pg57wE",
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (externalResponse.ok) {
//                     const retrievedStores = await externalResponse.json();
//                     externalStores = retrievedStores.data.stores;
//                 } else {
//                     console.log("Failed to fetch stores from external API, continuing with local data.");
//                 }
//             } catch (error) {
//                 console.log("Error fetching stores from external API");
//             }

//             const updatedExternalStores = externalStores.map(store => ({
//                 ...store,
//                 store_name: store.name,
//                 store_slug:store.slug,
//                 store_status: store.status,
//                 store_logo: store.store_logo || '',
//                 store_description: store.store_description || '',
//                 store_affiliate_link: store.store_affiliate_link || '',
//                 store_category: store.store_category ?? undefined,
//                 store_priority_score: store.store_priority_score ?? undefined,
//                 store_search_target: store.store_search_target || '',
//                 store_best_discount: store.store_best_discount || undefined,
//                 store_tags: store.store_tags || '',
//                 store_facebook: store.store_facebook || '',
//                 store_instagram: store.store_instagram || '',
//                 store_twitter: store.store_twitter || '',
//                 store_youtube: store.store_youtube || '',
//                 store_tiktok: store.store_tiktok || '',
//                 store_email: store.store_email || '',
//                 store_phone_number: store.store_phone_number || '',
//                 store_address: store.store_address || '',
//                 store_help_desk: store.store_help_desk || '',
//                 store_contact_page: store.store_contact_page || '',
//                 store_country: store.store_country || '',
//                 store_last_updated: store.store_last_updated || new Date(),
//                 store_last_checked: store.store_last_checked || new Date(),
//                 store_saving_tips: store.store_saving_tips || '',
//                 store_how_to_use_coupon: store.store_how_to_use_coupon || '',
//                 store_faq: store.store_faq || '',
//                 store_payment_modes: store.store_payment_modes || '',
//                 store_program_platform: store.store_program_platform ?? undefined,
//                 store_disclaimer: store.store_disclaimer || '',
//                 store_template: store.store_template || '',
//                 store_rating: store.store_rating ?? undefined,
//                 store_view_count: store.store_view_count ?? undefined,
//                 store_average_rating: store.store_average_rating ?? undefined,
//             }));
//             console.log(externalStores)

//             const existingStores = await storesCollection.find().toArray();
//             const existingStoreNames = new Set(existingStores.map(store => store.name));

//             const newStores = updatedExternalStores.filter(store => !existingStoreNames.has(store.name));

//             if (newStores.length > 0) {
//                 await storesCollection.insertMany(newStores);
//             }
//         }

//         const sort: { [key: string]: 1 | -1 } = {};
//         sort[sortField] = sortDirection === 'asc' ? 1 : -1;

//         const filteredStoresCount = await storesCollection.countDocuments(query);
//         const storesCursor = storesCollection.find(query).sort(sort).skip(skip).limit(itemsPerPage);
//         const stores = await storesCursor.toArray();
//         console.log(stores.length)

//         const storesWithCategoryNames = await Promise.all(stores.map(async (store) => {
//             let categoryName = "";

//             if (store.store_category) {
//                 const category = await db.collection("categories").findOne({ id: store.store_category });
//                 categoryName = category ? category.category_name : "Unknown Category";
//             }

//             return {
//                 ...store,
//                 store_category: categoryName,
//             };
//         }));

//         return NextResponse.json({
//             stores: storesWithCategoryNames,
//             totalItems: filteredStoresCount,
//             success: true,
//         });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({
//             success: false,
//         });
//     }
// }


export async function GET(req: NextRequest) {
    try {
        const result = await fetchAndSaveExternalStoresController();

        return NextResponse.json({
            result,
            success: true,
        });
    } catch (error: any) {
        console.error("Error", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to fetch stores",
        });
    }
}

// export async function GET(req: NextRequest) {
//     try {
//         const { stores, totalItems } = await saveExternalStore();

//         return NextResponse.json({
//             stores,
//             totalItems,
//             success: true,
//         });
//     } catch (error) {
//         console.log("Error", error);
//         return NextResponse.json({
//             success: false,
//         });
//     }
// }


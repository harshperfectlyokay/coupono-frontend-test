import { addStore, fetchStores, updateStore, updateStoreStatus } from "@/app/actions";
import { addStoreController, fetchStoresController, updateStoreController, updateStoreStatusController } from "@/modules/storeModule/store.controller";
import { connectToDB } from "@/utils/db";
import { saveStoreImageToLocal } from "@/utils/helperMethods";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";



export interface Store {
    _id?: ObjectId;
    name: string;
    store_website?: string;
    store_logo?: string;
    store_description?: string;
    store_affiliate_link?: string;
    store_category?: ObjectId;
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
    imageData?: string | null;
}




export async function GET(req: NextRequest) {
    try {
        const pageData = req.nextUrl?.searchParams.get('page') || '1';
        const page = parseInt(pageData);
        const itemsData = req.nextUrl?.searchParams.get('itemsPerPage') || '50';
        const itemsPerPage = parseInt(itemsData);
        const sortField = req.nextUrl?.searchParams.get('sortField') || 'name';
        const sortDirection = (req.nextUrl?.searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';
        const all = req.nextUrl?.searchParams.get('all') === 'true';
        
        const filters = {
            name: req.nextUrl.searchParams.get('name') || '',
            status: req.nextUrl.searchParams.get('status') || '',
            priority: req.nextUrl.searchParams.get('priority') || '',
            target: req.nextUrl.searchParams.get('target') || '',
            category: req.nextUrl.searchParams.get('category') || '',
            lastCheck: req.nextUrl.searchParams.get('lastCheck') || ''
        };
        const result = await fetchStoresController({
            page,
            itemsPerPage,
            sortField,
            sortDirection,
            all,
            filters
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to fetch stores',
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, ...storeData }: { id: string } & Partial<Store> = await request.json();
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Store ID is required",
            });
        }

        const result = await updateStoreController({ id, storeData });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to update store',
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const storeData: Store & { imageData?: string } = await request.json();
        if (!storeData.name || !storeData.slug) {
            return NextResponse.json({
                success: false,
                message: "Store name and slug are required",
            });
        }

        const result = await addStoreController({ storeData });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to add store',
        });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { id, status }: { id: string; status: string } = await request.json();
        if (!id || !status) {
            return NextResponse.json({
                success: false,
                message: "Store ID and status are required",
            });
        }

        const result = await updateStoreStatusController({ id, status });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to update store status',
        });
    }
}
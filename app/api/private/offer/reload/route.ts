import { saveExternalOffer } from "@/app/actions";
import { fetchAndSaveExternalOffersController } from "@/modules/offerModule/offer.controller";
import { connectToDB } from "@/utils/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";



export interface OfferFromMySQL {
    _id?: ObjectId
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
    offer_isExpired?: number;
    offer_isChecked?: string;
    offer_isHidden?: string;
    offer_addedOn?: string;
    offer_checkedBy?: string;
    type?: string,
    storeId?: string,
    code?: string,
    title?: string,
    description?: string,
    benefit?: string,
    expiryDate?: string,
    addedBy?: string,
    addedOn?: string,
    isChecked?: number,
    isExpired?: number,
}

// export async function GET(req: NextRequest) {
//   try {
//       const { offers, totalItems } = await saveExternalOffer();

//       return NextResponse.json({
//           offers,
//           totalItems,
//           success: true,
//       });
//   } catch (error) {
//       console.log("Error", error);
//       return NextResponse.json({
//           success: false,
//       });
//   }
// }

export async function GET(req: NextRequest) {
    try {
        const result = await fetchAndSaveExternalOffersController();

        return NextResponse.json({
            result,
            success: true,
        });
    } catch (error: any) {
        console.error("Error", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to fetch offers",
        });
    }
}
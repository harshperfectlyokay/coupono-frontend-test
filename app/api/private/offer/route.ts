import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { addOffer, deleteOffer, fetchOffers, updateOffer } from "@/app/actions";
import { addOfferController, deleteOfferController, fetchOffersController, updateOfferController } from "@/modules/offerModule/offer.controller";


export interface Offer {
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
  offer_isExpired?: string;
  offer_isChecked?: string;
  offer_isHidden?: string;
  offer_addedOn?: string;
  offer_checkedBy?: string;
  offer_isVerified?: number;
  type?: string,
  storeId?: string,
  code?: string,
  title?: string,
  description?: string,
  benefit?: string,
  expiryDate?: string,
  addedBy?: string,
  addedOn?: string,
  linkDomain?: string,
  isVerified? : string,
  offer_lastUpdate?: string;
}

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl?.searchParams.get('page') || '1');
  const itemsPerPage = parseInt(req.nextUrl?.searchParams.get('itemsPerPage') || '50');
  const sortField = req.nextUrl?.searchParams.get('sortField') || 'offer_addedDate';
  const sortDirection = (req.nextUrl?.searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';
  const addedBy = req.nextUrl.searchParams.get('addedBy') || '';
  const store = req.nextUrl.searchParams.get('store') || '';
  const type = req.nextUrl.searchParams.get('type') || '';
  const tags = req.nextUrl.searchParams.get('tags') || '';
  const status = req.nextUrl.searchParams.get('status') || '';
  const lastCheck = req.nextUrl.searchParams.get('lastCheck') || '';

  const result = await fetchOffersController({
    page,
    itemsPerPage,
    sortField,
    sortDirection,
    addedBy,
    store,
    type,
    tags,
    status,
    lastCheck,
  });

  return NextResponse.json(result);
}

// export async function PUT(request: NextRequest) {
//   try {
//     const offerData: Offer & { _id: string } = await request.json();

//     const result = await updateOffer(offerData);

//     return NextResponse.json(result);
//   } catch (error : any) {
//     console.error(error);
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Failed to update offer",
//     });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const offerData: Offer = await request.json();

//     const result = await addOffer(offerData);

//     return NextResponse.json(result);
//   } catch (error : any) {
//     console.error(error);
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Failed to add offer",
//     });
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const { offerId }: { offerId: string } = await request.json();

//     const result = await deleteOffer(offerId);

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Failed to delete offer",
//     });
//   }
// }

export async function PUT(request: NextRequest) {
  try {
    const offerData: Offer & { _id: string } = await request.json();
    const result = await updateOfferController(offerData);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update offer",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const offerData: Offer = await request.json();
    const result = await addOfferController(offerData);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to add offer",
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { offerId }: { offerId: string } = await request.json();
    const result = await deleteOfferController(offerId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to delete offer",
    });
  }
}
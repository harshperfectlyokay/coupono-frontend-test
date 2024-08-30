import { fetchOffersDetailsOfStore } from "@/app/actions";
import { fetchOffersDetailsController } from "@/modules/offerModule/offer.controller";
import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";


// export async function GET(req: NextRequest) {
//     try {
//       const store_website = req.nextUrl?.searchParams.get('store_website');
//       const status = req.nextUrl?.searchParams.get('status') || '';
//       const pageData = req.nextUrl?.searchParams.get('page') || '1';
//       const itemsPerPageData = req.nextUrl?.searchParams.get('itemsPerPage') || '10';
//       const upto = req.nextUrl?.searchParams.get('upto') === 'true';
  
//       const page = parseInt(pageData);
//       const itemsPerPage = parseInt(itemsPerPageData);
  
//       if (!store_website) {
//         return NextResponse.json({
//           success: false,
//           message: 'Store Website is required',
//         }, { status: 400 });
//       }
  
//       const result = await fetchOffersDetailsOfStore(store_website, status, page, itemsPerPage, upto);
  
//       if (result.success === false) {
//         return NextResponse.json({
//           success: false,
//           message: result.message,
//         }, { status: result.status || 500 });
//       }
  
//       return NextResponse.json({
//         success: true,
//         offers: result.offers
//       }, { status: 200 });
//     } catch (error: any) {
//       console.error(error);
//       return NextResponse.json({
//         success: false,
//         message: error.message,
//       }, { status: 500 });
//     }
//   }
  
export async function GET(req: NextRequest) {
  try {
    const storeWebsite = req.nextUrl?.searchParams.get('store_website');
    const status = req.nextUrl?.searchParams.get('status') || '';
    const pageData = req.nextUrl?.searchParams.get('page') || '1';
    const itemsPerPageData = req.nextUrl?.searchParams.get('itemsPerPage') || '10';
    const upto = req.nextUrl?.searchParams.get('upto') === 'true';

    const page = parseInt(pageData);
    const itemsPerPage = parseInt(itemsPerPageData);

    if (!storeWebsite) {
      return NextResponse.json({
        success: false,
        message: 'Store Website is required',
      }, { status: 400 });
    }

    const result = await fetchOffersDetailsController({ storeWebsite, status, page, itemsPerPage, upto });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch offers',
    }, { status: 500 });
  }
}
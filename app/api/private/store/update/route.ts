import { NextRequest, NextResponse } from 'next/server';

import { ObjectId } from 'mongodb';
import { connectToDB } from '@/utils/db';
import { updateStoreField } from '@/app/actions';
import { updateStoreFieldController } from '@/modules/storeModule/store.controller';

interface Store {
  _id: ObjectId;
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
}

// export async function PATCH(request: NextRequest) {
//   try {
//       const { id, field, value }: { id: string; field: keyof Store; value: any } = await request.json();

//       if (!id || !field) {
//           return NextResponse.json({
//               success: false,
//               message: "Store ID and field are required",
//           });
//       }

//       await updateStoreField({ id, field, value });

//       return NextResponse.json({
//           success: true,
//           message: "Store updated successfully",
//       });
//   } catch (error) {
//       console.error(error);
//       return NextResponse.json({
//           success: false,
//           message: "Failed to update store",
//       });
//   }
// }


export async function PATCH(request: NextRequest) {
    try {
        const { id, field, value }: { id: string; field: keyof Store; value: any } = await request.json();

        if (!id || !field) {
            return NextResponse.json({
                success: false,
                message: "Store ID and field are required",
            });
        }

        const result = await updateStoreFieldController({ id, field, value });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to update store',
        });
    }
}
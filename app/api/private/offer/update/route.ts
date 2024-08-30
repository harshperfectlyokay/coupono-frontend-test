import { NextRequest, NextResponse } from 'next/server';

import { ObjectId } from 'mongodb';
import { connectToDB } from '@/utils/db';
import { updateOfferField } from '@/app/actions';
import { Offer } from '../route';
import { updateOfferFieldController } from '@/modules/offerModule/offer.controller';



  
// export async function PATCH(request: NextRequest) {
//   try {
//     const { id, field, value }: { id: string; field: keyof Offer; value: any } = await request.json();

//     if (!id || !field) {
//       return NextResponse.json({
//         success: false,
//         message: "Offer ID and field are required",
//       });
//     }

//     const result = await updateOfferField(id, field, value);

//     return NextResponse.json(result);
//   } catch (error : any) {
//     console.error(error);
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Failed to update offer",
//     });
//   }
// }



export async function PATCH(request: NextRequest) {
  try {
      const { id, field, value }: { id: string; field: keyof Offer; value: any } = await request.json();

      if (!id || !field) {
          return NextResponse.json({
              success: false,
              message: "Offer ID and field are required",
          });
      }

      const result = await updateOfferFieldController({ id, field, value });

      return NextResponse.json(result);
  } catch (error: any) {
      console.error(error);
      return NextResponse.json({
          success: false,
          message: error.message || "Failed to update offer",
      });
  }
}
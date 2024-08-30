import { signOut } from "@/auth";
import { isAccessible } from "@/lib/Actions/accessControlActions";
import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface Route {
  path: string;
  access: string[];
  note: string | null;
}

// export async function GET(req: NextRequest) {
//   try {
//     const url = new URL(req.url);
//     const queryParams = url.searchParams;
//     let pathname = queryParams.get('pathname');
//     let origin = queryParams.get('origin');
//     let referer = queryParams.get('referer') === '' ? null : queryParams.get('referer');
//     const userRole = queryParams.get('role');

//     const db = await connectToDB();
//     const collection = db.collection('routes');

//     const isApi = pathname?.startsWith('/api');
//     const key = isApi ? 'api' : 'page';

//     const document: any = await collection.findOne({ origin, referer });

//     if (!document) {
//       return NextResponse.json({
//         message: `No access control data found for the origin-${origin}, referer-${referer}, and path-${pathname}.`,
//         success: false,
//       });
//     }

//     let route: Route | undefined;

//     if (isApi) {
//       route = document.api?.find((route: Route) => route.path === pathname);
//     } else {
//       if (pathname && (`${process.env.BASE_URL}${pathname}` === referer || `${process.env.BASE_URL}${pathname}` === origin)) {
//         route = { path: pathname, access: document.access, note: null };
//       }
//     }
//     console.log('route - ',route);
//     if (!route) {
//       return NextResponse.json({
//         message: "Route not found in access control list.",
//         success: false,
//       });
//     }
//     if (userRole && route.access.includes(userRole)) {
//       console.log('Access Granted for - ',pathname);
//       return NextResponse.json({
//         message: "Access Granted.",
//         success: true,
//       }); 
//     } else {
//       await signOut()
//       return NextResponse.json({
//         message: "Permission denied: You do not have access to this route.",
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error(error); 
//     return NextResponse.json({
//       message: "Error checking access in the database",
//       success: false,
//     });
//   }
// }
export async function POST(req: NextRequest) {
  try {
   const {pathname,referer,token} = await req.json()
   const hasAccess = await isAccessible(pathname,referer,token)
   if(hasAccess) {
    return NextResponse.json({
      message: "Permission Granted",
      success: true,
    });
   } else {
    return NextResponse.json({
      message: "Access Denied",
      success: false,
    });
   }

  } catch (error) {
    console.error(error); 
    return NextResponse.json({
      message: "Error checking access in the /accesscontrol/checkaccess",
      success: false,
    });
  }
}

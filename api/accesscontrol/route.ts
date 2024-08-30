import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface Route {
  path: string;
  access: string[];
  note: string | null;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the pathname from the request body
    const { pathname, origin, referer, method } = await req.json();
    // Connect to the database
    const db = await connectToDB();
    const collection = db.collection("routes");

    // Determine if the pathname is for an API or a page
    const isApi = pathname.startsWith("/api");
    const key = isApi ? "api" : "page";

    // Check if a document exists
    let document: any = await collection.findOne({ origin, referer });

    if (!document) {
      // Create a new document if none exists
      document = {
        referer,
        origin,
        api: [],
        access: ["ADMIN"], // Example roles; modify as needed
      };
    }

    const existingRoute = document[key]?.find(
      (route: Route) => route.path === pathname
    );

    if (!existingRoute) {
      document[key]?.push({ path: pathname, access: ["ADMIN"], method: method, note: null });
    }

    // Save the document back to the database
    await collection.updateOne(
      { origin, referer },
      { $set: document },
      { upsert: true }
    );

    // Respond with success
    return NextResponse.json({
      message: "Route data updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({
      message: "Error updating routes in database",
      success: false,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Parse the incoming data from the request body
    const { pathname, access, referer } = await req.json();
    console.log('path , access , referer - ',pathname, access,referer);
    // Connect to the database
    const db = await connectToDB();
    const collection = db.collection("routes");

    // Determine if the pathname is for an API or a page
    const isApi = pathname.startsWith("/api");
    const key = isApi ? "api" : "page";

    // Find the existing document based on origin and referer
    if (key == "page") {
      const document: any = await collection.findOne({ referer: pathname==process.env.baseURL ? null : pathname });
      console.log('updating this doc - ',document);
      if (!document) {
        return NextResponse.json({
          message: "Document not found.",
          success: false,
        });
      } else {
        document.access = access;
      }
      console.log('updated doc - ',document);

      // Save the updated document back to the database
      const res = await collection.updateOne({ referer: pathname==process.env.baseURL ? null : pathname }, { $set: document });
      console.log('final res of api before return :',res);

      // Respond with success
      return NextResponse.json({
        message: "Page Access updated successfully.",
        success: true,
      });
    } else if (isApi) {
      const document: any = await collection.findOne({ referer: referer==process.env.baseURL ? null : referer });

      if (!document) {
        return NextResponse.json({
          message: "Document not found.",
          success: false,
        });
      }

      // Update the access for the specific API or page
      console.log('updating for path : ',pathname);
      const apiIndex = document.api?.findIndex(
        (route: Route) => route.path === pathname
      );
      console.log('api obj - ',document.api);
      console.log('index of path : ',apiIndex);
      console.log('access of path : ',document.api[apiIndex].access);
      if (apiIndex >= 0) {
        document.api[apiIndex].access = access;
      } else {
        return NextResponse.json({
          message: "API route not found.",
          success: false,
        });
      }

      await collection.updateOne({ referer: referer==process.env.baseURL ? null : referer }, { $set: document });
      return NextResponse.json({
        message: "Api Access updated successfully.",
        success: true,
      });
    }

    return NextResponse.json({
      message: `Incorrect pathname - ${pathname}`,
      success: false,
    });
    // Save the updated document back to the database

    // Respond with success
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({
      message: "Error updating access in database",
      success: false,
    });
  }
}
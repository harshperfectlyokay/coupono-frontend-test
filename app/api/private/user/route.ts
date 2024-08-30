import { connectToDB } from "@/utils/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const db = await connectToDB();
  try {
    const usersCollection = db.collection("users");
    const usersCursor = usersCollection.find().limit(10);
    const users = await usersCursor.toArray();
    return NextResponse.json({
      users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
    });
  }
}
export async function POST(req: NextRequest) {
    try {
      const { user } = await req.json();
  
      if (!user.email) {
        return NextResponse.json({
          message: "Email is required",
          success: false,
        });
      }
  
      const db = await connectToDB();
      const usersCollection = db.collection("users");
  
      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email:user.email });
  
      if (existingUser) {
        return NextResponse.json({
          message: "User already exists",
          success: false,
        });
      }  
      // Create a new user
      const newUser = {
        email:user.email,
        name:user.name,
        password: '123',
        role:'USER'
      };
  
      // Insert the new user into the collection
      await usersCollection.insertOne(newUser);
  
      return NextResponse.json({
        user: {
          email: newUser.email,
        },
        success: true,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        message: "Error creating user",
        success: false,
      });
    }
  }export async function DELETE(request: NextRequest) {
  try {
    // Parse the JSON body of the request
    const { userId } = await request.json();
    // Validate the ID
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    // Connect to the database
    const db = await connectToDB();
    const usersCollection = db.collection("users");

    // Delete the user with the specified ID
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "An error occurred",
    });
  }
}
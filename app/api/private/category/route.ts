import { connectToDB } from "@/utils/db";
import { saveImageToLocal } from "@/utils/helperMethods";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface Category {
  _id?: ObjectId;
  category_name: string;
  category_slug: string;
  category_count?: number;
  category_status?: string;
  category_image?: string;
  category_description?: string;
  category_manager?: string;
  parent_categories?: Array<[]>;
  imageData?: string | null;
}
//This api can be use in CRON for gettig categories from external server. 
// export async function GET() {
//   const db = await connectToDB();
//   try {
//     const externalResponse = await fetch("http://localhost:3000/api/v1/category", {
//       headers: {
//         "authorization": "VSOmureCBRckufLIeZbMunv09rok2lKHGF4NEAWWBbeigvTm4VMhKp9Dc2pg57wE",
//         "Content-Type": "application/json",
//       },
//     });
//     if (!externalResponse.ok) {
//       throw new Error("Failed to fetch categories from API");
//     }
//     const retriveCategories = await externalResponse.json();

//     const externalCategories: Category[] = retriveCategories.data.category

//     const updatedExternalCategories = externalCategories.map(category => ({
//       ...category,
//       category_status: 'active',
//       category_image: '',
//       category_description: '',
//       category_manager: '',
//     }));

//     const categoriesCollection = db.collection<Category>("categories");
//     const existingCategories = await categoriesCollection.find().toArray();
//     const existingCategoryNames = new Set(
//       existingCategories.map((category) => category.category_name)
//     );

//     const newCategories = updatedExternalCategories.filter(
//       (category) => !existingCategoryNames.has(category.category_name)
//     );

//     if (newCategories.length > 0) {
//       await categoriesCollection.insertMany(newCategories);
//     }

//     const categoriesCursor = categoriesCollection.find().limit(50);
//     const categories = await categoriesCursor.toArray();
//     return NextResponse.json({
//       categories,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({
//       success: false,
//     });
//   }
// }

export async function GET(req: NextRequest) {
  const db = await connectToDB();
  const pageData = req.nextUrl?.searchParams.get('page') || '1';
  const page = parseInt(pageData);
  const itemsData = req.nextUrl?.searchParams.get('itemsPerPage') || '50';
  const itemsPerPage = parseInt(itemsData);
  const skip = (page - 1) * itemsPerPage;
  const sortField = req.nextUrl?.searchParams.get('sortField') || 'name';
  const sortDirection = req.nextUrl?.searchParams.get('sortDirection') || 'asc';
  const search = req.nextUrl?.searchParams.get('search') || '';


  try {
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortField] = sortDirection === 'asc' ? 1 : -1;

    const categoriesCollection = db.collection<Category>("categories");

    const query: any = {};
    if (search) {
      query.category_name = { $regex: new RegExp(search, 'i') };
    }
    
    const totalItems = await categoriesCollection.countDocuments(query);
    // Fetch categories from the database
    const categoriesCursor = categoriesCollection.find(query).sort(sort).skip(skip).limit(itemsPerPage);
    const categories = await categoriesCursor.toArray();

    return NextResponse.json({
      categories,
      totalItems: totalItems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
    });
  }
}

export async function PUT(request: NextRequest) {
  const db = await connectToDB();
  try {
    let {
      id,
      category_name,
      category_slug,
      category_image,
      category_description,
      category_manager,
      count,
      imageData
    }: {
      id: string; category_name: string; category_slug: string; count: number; category_image?: string; category_description?: string; category_manager?: string; imageData?: string | null
    } =
      await request.json();

    if (!id || !category_name || !category_slug === undefined) {
      return NextResponse.json({
        success: false,
        message: "Category ID, name, and slug are required",
      });
    }

    const categoriesCollection = db.collection<Category>("categories");
    const objectId = new ObjectId(id);

    const existingCategory = await categoriesCollection.findOne({
      _id: objectId,
    });

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Category does not exist",
      });
    }

    let imagePath = null;
    if (imageData) {
      try {
        imagePath = await saveImageToLocal(imageData, category_name);

        category_image = `/images/categories/${category_name}.webp`;
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }

    const result = await categoriesCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          category_name, category_slug, count, category_image, category_description, category_manager,
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to update category",
    });
  }
}

export async function DELETE(request: NextRequest) {
  const db = await connectToDB();
  try {
    const { id }: { id: string } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Category ID is required",
      });
    }

    const categoriesCollection = db.collection<Category>("categories");
    const objectId = new ObjectId(id);

    // Find the category by ID
    const existingCategory = await categoriesCollection.findOne({
      _id: objectId,
    });

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Category does not exist",
      });
    }

    // Delete the category
    const result = await categoriesCollection.deleteOne({ _id: objectId });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete category",
    });
  }
}

export async function POST(request: NextRequest) {
  const db = await connectToDB();
  try {
    let { category_name, category_slug, category_image, category_description, category_manager, imageData }: { category_name: string; category_slug: string; category_image?: string; category_description?: string; category_manager?: string; imageData?: string | null } =
      await request.json();

    if (!category_name || !category_slug) {
      return NextResponse.json({
        success: false,
        message: "Category name, and slug are required",
      });
    }

    const categoriesCollection = db.collection<Category>("categories");

    // Check if a category with the same slug already exists
    const existingCategory = await categoriesCollection.findOne({ category_slug });

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Category with this slug already exists",
      });
    }

    let imagePath = null;
    if (imageData) {
      try {
        imagePath = await saveImageToLocal(imageData, category_name);

        category_image = `/images/categories/${category_name}.webp`;
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }

    // Insert the new category
    const result = await categoriesCollection.insertOne({ category_name, category_slug, category_image, category_description, category_status: "active", category_manager, category_count: 0, parent_categories: [] });

    return NextResponse.json({
      success: true,
      message: "Category added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to add category",
    });
  }
}

export async function PATCH(request: NextRequest) {
  const db = await connectToDB();
  try {
    const { id, status }: { id: string; status: string } = await request.json();

    if (!id || !status) {
      return NextResponse.json({
        success: false,
        message: "Category ID and status are required",
      });
    }

    if (status !== 'active' && status !== 'paused') {
      return NextResponse.json({
        success: false,
        message: "Invalid status value",
      });
    }

    const categoriesCollection = db.collection<Category>("categories");
    const objectId = new ObjectId(id);

    const existingCategory = await categoriesCollection.findOne({
      _id: objectId,
    });

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Category does not exist",
      });
    }

    const result = await categoriesCollection.updateOne(
      { _id: objectId },
      { $set: { category_status: status } }
    );

    return NextResponse.json({
      success: true,
      message: "Category status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to update category status",
    });
  }
}
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { NextRequest } from "next/server";

// GET /api/properties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const page = Number(request.nextUrl.searchParams.get("page")) || 1;
    const pageSize = Number(request.nextUrl.searchParams.get("pageSize")) || 6;

    const skip = (page - 1) * pageSize;

    const total = await Property.countDocuments({});

    const properties = await Property.find({}).skip(skip).limit(pageSize);

    const result = {
      total,
      properties,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong...", { status: 500 });
  }
};

export const POST = async (request: any) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const formData = await request.formData();

    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((image: File) => image.name !== "");

    let propertyData: {
      type: any;
      description: any;
      name: any;
      location: {
        street: any;
        city: any;
        state: any;
        zipcode: any;
      };
      beds: any;
      baths: any;
      square_feet: any;
      rates: {
        weekly: any;
        nightly: any;
        monthly: any;
      };
      seller_info: {
        name: any;
        email: any;
        phone: any;
      };
      owner: any;
      amenities: any;
      images?: string[];
    };

    propertyData = {
      type: formData.get("type"),
      description: formData.get("description"),
      name: formData.get("name"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      rates: {
        weekly: formData.get("rates.weekly"),
        nightly: formData.get("rates.nightly"),
        monthly: formData.get("rates.monthly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
      amenities,
      images: [],
    };

    // Upload image(s) to Cloudinary
    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // Convert the image data to base64
      const imageBase64 = imageData.toString("base64");

      // Make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
        }
      );

      imageUploadPromises.push(result.secure_url);

      // Wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises);
      // Add uploaded images to the propertyData object
      propertyData.images = uploadedImages;
    }

    const newProperty = new Property(propertyData);
    console.log(newProperty);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );
  } catch (error) {
    console.log(error);
    return new Response("Failed to add property", { status: 500 });
  }
};

import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest } from "next/server";

// GET /api/properties/:id
export const GET = async (request: NextRequest, { params }: any) => {
  try {
    await connectDB();

    const property = await Property.findById(params.id);

    if (!property) return new Response("Property Not Found", { status: 404 });
    return new Response(JSON.stringify(property), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong...", { status: 500 });
  }
};

// DELETE /api/properties/:id
export const DELETE = async (request: NextRequest, { params }: any) => {
  try {
    const propertyId = params.id;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) return new Response("Property Not Found", { status: 404 });

    if (property.owner.toString() !== userId) {
      return new Response("Unauthorized");
    }

    await property.deleteOne();

    return new Response("Property Deleted", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong...", { status: 500 });
  }
};

// PUT /api/properties/:id
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params;
    const { userId } = sessionUser;

    const formData = await request.formData();

    const amenities = formData.getAll("amenities");

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return new Response("Property does not exist", { status: 404 });
    }

    if (existingProperty.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

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
      // images: [],
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to add property", { status: 500 });
  }
};

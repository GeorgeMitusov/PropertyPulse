import connectDB from "@/config/database";
import Property from "@/models/Property";
import { NextRequest } from "next/server";

interface Query {
  $or: (
    | { name: RegExp | null }
    | { description: RegExp | null }
    | { "location.street": RegExp | null }
    | { "location.state": RegExp | null }
    | { "location.city": RegExp | null }
    | { "location.zipcode": RegExp | null }
  )[];
  type?: RegExp | null;
}

// GET / api / properties / search;
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const propertyType = searchParams.get("propertyType");

    const locationPattern = location ? new RegExp(location, "i") : null;

    let query: Query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.street": locationPattern },
        { "location.state": locationPattern },
        { "location.city": locationPattern },
        { "location.zipcode": locationPattern },
      ],
    };

    if (propertyType && propertyType !== "All") {
      const typePattern = new RegExp(propertyType, "i");
      query.type = typePattern;
    }

    const properties = await Property.find(query);

    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong...", { status: 500 });
  }
};

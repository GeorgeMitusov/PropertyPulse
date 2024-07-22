import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log("No valid session or user found");
      return null;
    }

    return {
      user: session.user,
      userId: session.user.id,
    };
  } catch (error) {
    console.error("Error fetching session user:", error);
    return null;
  }
};

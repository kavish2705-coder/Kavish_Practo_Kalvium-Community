import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Authentication required", 401);
  }

  return successResponse(user);
}

import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json(); // Parse the webhook body
    const { id, email } = body; // Extract relevant info (order id, customer email, etc.)
    console.log(id, email);
    // Step 1: Validate the webhook (Shopify can send verification headers, optionally handle that)
    // You can validate the request using Shopify shared secret (optional for now)

    // Step 2: Create a cookie to signal that the cart should be cleared on the client-side
    const response = NextResponse.json({ success: true });

    // Set a cookie with `httpOnly` flag (so it's inaccessible from JS), signaling the frontend to clear the cart
    cookie.serialize("clearCart", "true", {
      httpOnly: true,
      path: "/",
      secure: true, // Ensures it's only sent over HTTPS
    });

    response.cookies.set("clearCart", "true", {
      httpOnly: true,
      path: "/",
      secure: true, // Ensures it's only sent over HTTPS
    });

    return response;
  } catch (err) {
    console.error("Error handling the webhook: ", err);
    return new NextResponse("Error", { status: 500 });
  }
};

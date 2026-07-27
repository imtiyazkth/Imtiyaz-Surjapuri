import { NextResponse } from "next/server";

// File upload is disabled — all media uses external URLs.
// Images are sourced from Unsplash, Cloudinary, Imgur, etc.
// and saved as URL strings directly in Firestore.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Direct file upload is disabled. Please use an external image URL " +
        "(Unsplash, Cloudinary, Imgur, etc.) and paste it in the Cover Image URL field.",
    },
    { status: 410 }
  );
}

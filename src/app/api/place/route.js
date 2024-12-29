import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("input");

  const apiKey = process.env.GOOGLE_PLACE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    data
  )}&key=${apiKey}`;

  const response = await fetch(url);
  const locData = await response.json();

  return NextResponse.json({ locData });
}
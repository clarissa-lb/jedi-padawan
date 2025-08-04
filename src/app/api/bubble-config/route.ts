import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    apiKey: process.env.BUBBLE_API_KEY,
    appId: process.env.BUBBLE_APP_ID,
    baseUrl: process.env.BUBBLE_BASE_URL,
  });
} 
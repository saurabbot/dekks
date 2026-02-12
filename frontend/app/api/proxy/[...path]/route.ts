import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${request.nextUrl.pathname.replace('/api', '')}`);
  const data = await response.json();
  return NextResponse.json(data);
}

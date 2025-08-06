import {NextRequest, NextResponse} from 'next/server';

const BASE_URL = process.env.API_BASE_URL;

export async function PUT(req: NextRequest) {
  if (BASE_URL) {
    const result = await fetch(`${BASE_URL}/meetings`, {
      method: 'PUT',
      body: JSON.stringify(req.body)
    });

    if (!result.ok) {
      return NextResponse.json({error: 'Failed to create meeting'}, {status: 500});
    }
    return NextResponse.json({}, {status: 201});
  }
}

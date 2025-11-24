import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('API route called');
  const { searchParams } = new URL(request.url);
  const departure_id = searchParams.get('departure_id');
  const arrival_id = searchParams.get('arrival_id');
  const outbound_date = searchParams.get('outbound_date');
  const return_date = searchParams.get('return_date');

  console.log('Search params:', { departure_id, arrival_id, outbound_date, return_date });

  const API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY;

  console.log('API key present:', !!API_KEY);

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'SERP API key is missing. Please add NEXT_PUBLIC_SERP_API_KEY to your .env file.' },
      { status: 500 }
    );
  }

  if (!departure_id || !arrival_id || !outbound_date || !return_date) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&return_date=${return_date}&currency=USD&hl=en&api_key=${API_KEY}`;
    
    console.log('Calling SERP API...');
    const response = await fetch(url, { cache: 'no-store' });
    
    console.log('SERP API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`SERP API error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('SERP API returned data:', Object.keys(data));
    return NextResponse.json(data);
  } catch (error) {
    console.error('SERP API failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flights', details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { flightNumber, departureDate, origin, destination } = await request.json();
    
    console.log('Seatmap request:', { flightNumber, departureDate, origin, destination });
    console.log('API Key exists:', !!process.env.AMADEUS_API_KEY);
    console.log('API Secret exists:', !!process.env.AMADEUS_API_SECRET);

    // Get Amadeus access token
    const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token error:', errorText);
      throw new Error('Failed to get Amadeus access token: ' + errorText);
    }

    const { access_token } = await tokenResponse.json();
    console.log('Access token obtained successfully');

    // First, search for flight offers to get the flight details
    const flightOffersUrl = new URL('https://test.api.amadeus.com/v2/shopping/flight-offers');
    flightOffersUrl.searchParams.append('originLocationCode', origin);
    flightOffersUrl.searchParams.append('destinationLocationCode', destination);
    flightOffersUrl.searchParams.append('departureDate', departureDate);
    flightOffersUrl.searchParams.append('adults', '1');
    flightOffersUrl.searchParams.append('max', '5');

    const flightOffersResponse = await fetch(flightOffersUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!flightOffersResponse.ok) {
      const errorText = await flightOffersResponse.text();
      console.error('Flight offers error:', errorText);
      throw new Error('Failed to fetch flight offers: ' + errorText);
    }

    const flightOffersData = await flightOffersResponse.json();
    console.log('Flight offers found:', flightOffersData.data?.length || 0);

    // Try to find the specific flight or use the first available flight
    let selectedOffer = flightOffersData.data?.[0];
    
    if (!selectedOffer) {
      console.error('No flights found in response');
      return NextResponse.json({ error: 'No flights found' }, { status: 404 });
    }
    
    console.log('Selected offer:', JSON.stringify(selectedOffer, null, 2));

    // Now fetch the seatmap for this flight offer
    const seatmapResponse = await fetch('https://test.api.amadeus.com/v1/shopping/seatmaps', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [selectedOffer]
      }),
    });

    if (!seatmapResponse.ok) {
      const errorText = await seatmapResponse.text();
      console.error('Seatmap API error response:', errorText);
      console.log('Note: Seatmap data may not be available for all flights in test API');
      // Return a specific error that the frontend can handle
      return NextResponse.json(
        { error: 'Seatmap not available', details: errorText },
        { status: 404 }
      );
    }

    const seatmapData = await seatmapResponse.json();
    console.log('Seatmap data successfully received from Amadeus API');

    return NextResponse.json(seatmapData);
  } catch (error) {
    console.error('Seatmap API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch seatmap data' },
      { status: 500 }
    );
  }
}

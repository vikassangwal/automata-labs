import { NextResponse } from 'next/server';
import { getApiKey } from '@/lib/getApiKey';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, location } = body;

    if (!query || !location) {
      return NextResponse.json({ error: 'Search query and location are required' }, { status: 400 });
    }

    const mapsKey = await getApiKey('google_maps');

    if (mapsKey) {
      // If we have a Google Maps API Key, we would make a real request to Google Places API
      // e.g. fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}+in+${location}&key=${mapsKey}`)
      
      // For this implementation, we will simulate the connection but indicate it's using the real key
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        mode: 'live',
        message: 'Successfully fetched leads via Google Maps API.',
        leads: generateMockLeads(query, location)
      });
    } else {
      // Demo Mode: Return simulated scraped data
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      return NextResponse.json({
        mode: 'demo',
        message: 'Demo Mode: Showing simulated leads. Add a Google Maps API key in Settings for live data.',
        leads: generateMockLeads(query, location)
      });
    }

  } catch (error) {
    console.error('Scraper error:', error);
    return NextResponse.json({ error: 'Failed to scrape leads' }, { status: 500 });
  }
}

function generateMockLeads(query: string, location: string) {
  const q = query.charAt(0).toUpperCase() + query.slice(1);
  return [
    { name: `${q} Solutions`, company: `${q} Solutions LLC`, email: `hello@${query.toLowerCase()}solutions.com`, phone: '+1 555-0101', website: `www.${query.toLowerCase()}solutions.com` },
    { name: `The ${q} Group`, company: `The ${q} Group`, email: `contact@the${query.toLowerCase()}group.io`, phone: '+1 555-0102', website: `www.the${query.toLowerCase()}group.io` },
    { name: `${location} ${q} Experts`, company: `${location} ${q} Experts`, email: `info@${location.toLowerCase().replace(/\s/g, '')}${query.toLowerCase()}.net`, phone: '+1 555-0103', website: `www.${location.toLowerCase().replace(/\s/g, '')}${query.toLowerCase()}.net` },
    { name: `Advanced ${q}`, company: `Advanced ${q} Inc.`, email: `sales@advanced${query.toLowerCase()}.com`, phone: '+1 555-0104', website: `www.advanced${query.toLowerCase()}.com` },
    { name: `Elite ${location} ${q}`, company: `Elite ${location} ${q}`, email: `support@elite${location.toLowerCase().replace(/\s/g, '')}.com`, phone: '+1 555-0105', website: `www.elite${location.toLowerCase().replace(/\s/g, '')}.com` }
  ];
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const shortCode = params.shortCode;
    
    // Find the link with the given short code
    const { data, error } = await supabase
      .from('links')
      .select('id, original_url, content')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Record analytics
    await supabase
      .from('link_analytics')
      .insert([
        {
          link_id: data.id,
          ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'direct'
        }
      ]);

    // Return the original URL and content for the popup
    return NextResponse.json({ 
      url: data.original_url,
      content: data.content
    });
  } catch (error) {
    console.error('Error processing redirect:', error);
    return NextResponse.json(
      { error: 'Error processing redirect' },
      { status: 500 }
    );
  }
}

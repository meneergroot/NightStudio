import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { mockPosts } from '@/data/mockData';

export async function GET() {
  try {
    // Try to fetch from Supabase first
    const { data: posts, error } = await supabaseServer
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      // Fallback to mock data if database is not set up yet
      return NextResponse.json({
        success: true,
        data: mockPosts,
        message: 'Posts fetched successfully (mock data)'
      });
    }

    return NextResponse.json({
      success: true,
      data: posts || [],
      message: 'Posts fetched successfully from database'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Try to save to Supabase
    const { data, error } = await supabaseServer
      .from('posts')
      .insert({
        creator_id: body.creator_id || 'default',
        title: body.title || 'New Post',
        teaser_text: body.teaser_text || body.content || '',
        media_url: body.media_url || body.image || '',
        price_usdc: body.price_usdc || body.price || 0,
        is_locked: body.is_locked !== undefined ? body.is_locked : true
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create post in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: data
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    );
  }
} 
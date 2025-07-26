import { NextResponse } from 'next/server';
import { mockPosts } from '@/data/mockData';

export async function GET() {
  try {
    // In a real app, you'd fetch from Supabase here
    // const { data, error } = await supabase.from('posts').select('*');
    
    return NextResponse.json({
      success: true,
      data: mockPosts,
      message: 'Posts fetched successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, you'd save to Supabase here
    // const { data, error } = await supabase.from('posts').insert(body);
    
    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      data: { id: Date.now().toString(), ...body }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    );
  }
} 
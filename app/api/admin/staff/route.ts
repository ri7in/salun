import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('staff')
      .select(`
        *,
        user:users(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { user_id, specialty, calendly_url, bio, avatar_url } = body;

    if (!user_id || !specialty || !calendly_url) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update user role to staff
    await supabaseAdmin
      .from('users')
      .update({ role: 'staff' })
      .eq('id', user_id);

    // Create staff profile
    const { data, error } = await supabaseAdmin
      .from('staff')
      .insert([{ user_id, specialty, calendly_url, bio, avatar_url }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error updating staff:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

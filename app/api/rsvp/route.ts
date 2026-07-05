import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '../../lib/supabase';

// Local file fallback path (in the project workspace)
const LOCAL_RSVP_PATH = path.join(process.cwd(), 'rsvps.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wedding_slug, name, attending, guests_count, notes } = body;

    if (!wedding_slug || !name) {
      return NextResponse.json({ error: 'Slug and Name are required' }, { status: 400 });
    }

    // Try Supabase first
    const { data, error } = await supabase
      .from('rsvps')
      .insert({
        wedding_slug,
        name,
        attending,
        guests_count: guests_count || 1,
        notes: notes || ''
      })
      .select()
      .single();

    // Check if error was due to table not existing
    const tableNotExist = error && (
      error.code === 'PGRST205' || 
      (error.message && error.message.includes('does not exist')) || 
      (error.message && error.message.includes('relation "public.rsvps" does not exist'))
    );

    if (error && !tableNotExist) {
      console.error('Supabase RSVP insert error:', error);
      throw error;
    }

    if (tableNotExist) {
      console.log('Supabase "rsvps" table does not exist. Falling back to local storage.');
      
      let localRsvps: any[] = [];
      if (fs.existsSync(LOCAL_RSVP_PATH)) {
        try {
          const content = fs.readFileSync(LOCAL_RSVP_PATH, 'utf-8');
          localRsvps = JSON.parse(content);
        } catch (e) {
          console.error('Error reading local RSVPs file:', e);
        }
      }

      const newRsvp = {
        id: Math.random().toString(36).substring(2, 9),
        wedding_slug,
        name,
        attending,
        guests_count: guests_count || 1,
        notes: notes || '',
        created_at: new Date().toISOString(),
      };

      localRsvps.push(newRsvp);
      fs.writeFileSync(LOCAL_RSVP_PATH, JSON.stringify(localRsvps, null, 2), 'utf-8');
      return NextResponse.json({ success: true, rsvp: newRsvp });
    }

    return NextResponse.json({ success: true, rsvp: data });
  } catch (error: any) {
    console.error('RSVP submission error:', error);
    return NextResponse.json({ error: error.message || 'RSVP submission failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Try Supabase first
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_slug', slug)
      .order('created_at', { ascending: false });

    const tableNotExist = error && (
      error.code === 'PGRST205' || 
      (error.message && error.message.includes('does not exist')) || 
      (error.message && error.message.includes('relation "public.rsvps" does not exist'))
    );

    if (error && !tableNotExist) {
      console.error('Supabase RSVP select error:', error);
      throw error;
    }

    if (tableNotExist) {
      console.log('Supabase "rsvps" table does not exist. Reading from local storage.');
      
      let localRsvps: any[] = [];
      if (fs.existsSync(LOCAL_RSVP_PATH)) {
        try {
          const content = fs.readFileSync(LOCAL_RSVP_PATH, 'utf-8');
          localRsvps = JSON.parse(content);
        } catch (e) {
          console.error('Error reading local RSVPs file:', e);
        }
      }

      const filtered = localRsvps.filter((r: any) => r.wedding_slug === slug);
      return NextResponse.json({ success: true, rsvps: filtered });
    }

    return NextResponse.json({ success: true, rsvps: data || [] });
  } catch (error: any) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch RSVPs' }, { status: 500 });
  }
}

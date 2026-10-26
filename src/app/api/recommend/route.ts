import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || '';
const n8nWebhookSecret = process.env.N8N_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Invalid token or unauthorized' }, { status: 401 });

    const body = await req.json();
    const question = (body.question || '').trim();
    if (!question || question.length > 2000) {
      return NextResponse.json({ error: 'Invalid question length (1-2000 chars required)' }, { status: 400 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count, error: countError } = await supabaseAdmin
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString());

    if (!countError && count !== null && count >= 10) {
      return NextResponse.json({ 
        error: 'Daily limit reached', 
        message: 'You have reached your 10 free daily requests limit. Upgrade options coming soon!' 
      }, { status: 429 });
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': n8nWebhookSecret
      },
      body: JSON.stringify({ question, userId: user.id })
    });

    if (!n8nResponse.ok) return NextResponse.json({ error: 'Orchestration service error' }, { status: 502 });

    const resultData = await n8nResponse.json();
    return NextResponse.json(resultData, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

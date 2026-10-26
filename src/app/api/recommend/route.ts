import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || '';
const n8nWebhookSecret = process.env.N8N_WEBHOOK_SECRET || '';

// The n8n Webhook node checks this header with a Header Auth credential (name and value must match).
const SECRET_HEADER = 'X-Webhook-Secret';

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

    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    const { count, error: countError } = await supabaseAdmin
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', dayStart.toISOString());

    if (!countError && count !== null && count >= 10) {
      return NextResponse.json({
        error: 'Daily limit reached',
        message: 'You have reached your 10 free daily requests limit. Upgrade options coming soon!'
      }, { status: 429 });
    }

    // The user id never leaves this server: n8n and Jev only get the question, the user's routing settings and the rules.
    const [{ data: settings }, { data: rules }] = await Promise.all([
      supabaseAdmin.from('settings').select('confidence_threshold, preference, do_not_store_question').eq('user_id', user.id).maybeSingle(),
      supabaseAdmin.from('routing_rules').select('category, difficulty_min, difficulty_max, model, reason, cheaper_alternative, stronger_alternative')
    ]);

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [SECRET_HEADER]: n8nWebhookSecret },
      body: JSON.stringify({
        question,
        settings: {
          confidence_threshold: settings?.confidence_threshold ?? 0.75,
          preference: settings?.preference ?? 'best_quality'
        },
        rules: rules ?? []
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (!n8nResponse.ok) return NextResponse.json({ error: 'Orchestration service error' }, { status: 502 });

    const result = await n8nResponse.json();

    const { error: logError } = await supabaseAdmin.from('requests').insert({
      user_id: user.id,
      category: result.category,
      difficulty: result.difficulty,
      risk: result.risk,
      chosen_model: result.recommended_model ?? 'unconfigured',
      confidence: result.confidence,
      reason: result.reason,
      cheaper_alternative: result.cheaper_alternative,
      stronger_alternative: result.stronger_alternative,
      question_text: settings?.do_not_store_question ? null : question
    });
    if (logError) console.error('recommend: could not log request', logError.message);

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

# ModelMatch

Recommends the most suitable AI model for a question. Flow: Next.js app -> `/api/recommend` -> n8n webhook -> TypeSafe Jev (classifies category, difficulty, high-stakes risk) -> routing rules -> recommendation.

## Setup
1. **Supabase:** run `supabase/migrations/20260305000000_initial_schema.sql`, then then run `supabase/seed_routing_rules.sql` (starter rules from the four tiers; edit model names any time).
2. **n8n:** import `n8n/workflow.json`. Create two credentials, both "Header Auth":
   - Webhook credential: name `X-Webhook-Secret`, value = your chosen secret (same value as `N8N_WEBHOOK_SECRET`). Attach it to the Webhook node.
   - TypeSafe credential: name `Authorization`, value `Bearer <your TypeSafe key>`. Attach it to the "TypeSafe Jev Request" node.
   Activate the workflow and copy the production webhook URL.
3. **Environment variables** (copy `.env.example` to `.env.local`; set values yourself, never commit them): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`. The TypeSafe key lives only in n8n.
4. `npm install`, `npm run dev`.

## Notes
- The user id never reaches n8n or Jev; only the question, the user's routing settings and the rules are sent.
- Jev request/response format follows https://docs.typesafe.ai (choice / score / noul, answers by question id).
- `evaluation/` holds 50 sample questions; the expected models there were a draft guess, not measured results.

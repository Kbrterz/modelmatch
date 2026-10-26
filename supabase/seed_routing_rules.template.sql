-- ModelMatch: starter routing rules. NOT applied automatically.
-- Replace every MODEL_* placeholder with a real model name you have checked on the provider's pricing page,
-- then run in the Supabase SQL editor. Categories must match the n8n workflow:
-- coding, data_analysis, long_document_reasoning, writing_editing, translation,
-- quick_factual_lookup, math, image_understanding, other.
-- Difficulty is 1 (trivial) to 5 (very hard). One row per category and difficulty band.
insert into public.routing_rules
  (category, difficulty_min, difficulty_max, model, cheaper_alternative, stronger_alternative, reason)
values
  ('coding', 1, 2, 'MODEL_CHEAP',  null,          'MODEL_MID',    'Simple coding task: a fast, low-cost model is enough.'),
  ('coding', 3, 5, 'MODEL_MID',    'MODEL_CHEAP', 'MODEL_STRONG', 'Multi-step coding task: a stronger model reduces errors.');

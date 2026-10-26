import fs from 'fs';
import path from 'path';

interface TestCase {
  id: number;
  question: string;
  expected_model: string;
}

async function runEvaluation() {
  const filePath = path.join(__dirname, 'test_cases.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const testCases: TestCase[] = JSON.parse(fileContent);

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error('Error: N8N_WEBHOOK_URL and N8N_WEBHOOK_SECRET must be set.');
    process.exit(1);
  }

  console.log(`Running evaluation across ${testCases.length} test cases...\n`);
  const results: Array<{ id: number; question: string; expected: string; actual: string; match: boolean; estimated_cost: string; latency_ms: number; }> = [];

  for (const test of testCases) {
    const startTime = Date.now();
    let actualModel = 'error';
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': webhookSecret },
        body: JSON.stringify({ question: test.question, userId: 'evaluation-script-user' })
      });
      const data = await response.json();
      if (response.ok && data.recommended_model) actualModel = data.recommended_model;
    } catch (err) {
      actualModel = 'failed';
    }

    const latency = Date.now() - startTime;
    const match = actualModel === test.expected_model;

    results.push({
      id: test.id,
      question: test.question.length > 50 ? test.question.substring(0, 47) + '...' : test.question,
      expected: test.expected_model,
      actual: actualModel,
      match,
      estimated_cost: '-',
      latency_ms: latency
    });
  }

  console.log('| ID | Question | Expected Model | Actual Model | Correct? | Cost | Latency (ms) |');
  console.log('|----|----------|----------------|--------------|----------|------|--------------|');
  for (const r of results) {
    console.log(`| ${r.id} | ${r.question} | ${r.expected} | ${r.actual} | ${r.match ? '✅ Yes' : '❌ No'} | ${r.estimated_cost} | ${r.latency_ms} |`);
  }

  const correctCount = results.filter(r => r.match).length;
  console.log(`\nEvaluation Complete. Accuracy: ${correctCount}/${results.length} (${((correctCount / results.length) * 100).toFixed(1)}%)`);
}

runEvaluation();

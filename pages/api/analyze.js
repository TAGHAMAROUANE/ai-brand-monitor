export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { site } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: `You are an AI brand monitoring expert. Analyze how this brand appears in the AI ecosystem. Return ONLY raw JSON, no markdown, no backticks:
{"summary":"overview","mentions":[{"source":"ChatGPT","context":"how it appears","sentiment":"positive","url":null,"relevance":"high"}],"opportunities":["op1"],"issues":["issue1"],"score":65}`,
      messages: [{ role: 'user', content: `Analyze AI visibility for: ${site}` }],
    }),
  });

  const data = await response.json();
  const text = data.content?.find(b => b.type === 'text')?.text || '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const json = JSON.parse(text.slice(start, end + 1));

  res.status(200).json(json);
}

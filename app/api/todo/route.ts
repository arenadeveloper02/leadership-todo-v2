import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_WORKFLOW_URL =
  'https://agent.thearena.ai/api/workflows/3f3f2f7c-2ade-41b0-b4ec-09a855d50638/execute';

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const apiKey = process.env.ARENA_API_KEY;
  const simEmail = process.env.SIM_USER_EMAIL;
  if (!apiKey) {
    return NextResponse.json({ error: 'ARENA_API_KEY is not configured on the server' }, { status: 500 });
  }

  if (!simEmail) {
    return NextResponse.json(
      { error: 'SIM_USER_EMAIL is not configured on the server' },
      { status: 500 }
    );
  }

  const url = process.env.ARENA_WORKFLOW_URL ?? DEFAULT_WORKFLOW_URL;

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'X-Sim-Email': simEmail,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await upstream.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: 'Failed to reach the workflow endpoint' }, { status: 502 });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_WORKFLOW_URL =
  'https://agent.thearena.ai/api/v2/workflows/3f3f2f7c-2ade-41b0-b4ec-09a855d50638/execute';

const PROXY_VERSION = 'input-v3';

/** Normalize client body to Arena v2 `{ input: { action, rowId?, data? } }`. */
function buildArenaPayload(body: unknown): { input: Record<string, unknown> } {
  const raw = body && typeof body === 'object' && !Array.isArray(body)
    ? (body as Record<string, unknown>)
    : {};

  const source =
    raw.input && typeof raw.input === 'object' && !Array.isArray(raw.input)
      ? (raw.input as Record<string, unknown>)
      : raw;

  const input: Record<string, unknown> = {};
  if (typeof source.action === 'string') input.action = source.action;
  if (typeof source.rowId === 'string') input.rowId = source.rowId;
  if (source.data && typeof source.data === 'object' && !Array.isArray(source.data)) {
    input.data = source.data;
  }
  return { input };
}

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
  const payload = buildArenaPayload(body);

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'X-Sim-Email': simEmail,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const text = await upstream.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    const response = NextResponse.json(data, { status: upstream.status });
    response.headers.set('x-todo-proxy', PROXY_VERSION);
    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to reach the workflow endpoint' }, { status: 502 });
  }
}

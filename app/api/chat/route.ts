import { NextResponse } from 'next/server';

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'anthropic-version': '2024-02-15'
      },
      body: JSON.stringify({
        messages: messages.map(({ role, content }) => ({
          role: role === 'user' ? 'user' : 'assistant',
          content
        })),
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        temperature: 0.7,
        system: "You are Zerox, an expert AI coding assistant. Your responses are direct and focused on delivering working solutions efficiently."
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    return NextResponse.json({ content: data.content[0].text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
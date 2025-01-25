import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
        system: "You are Zerox, an expert AI coding assistant focused on rapid development. You have deep knowledge of modern frameworks and best practices. Your responses are direct, practical, and focused on delivering working solutions quickly. You excel at understanding requirements and implementing them efficiently. You use a confident, knowledgeable tone while remaining helpful and clear."
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ content: data.content[0].text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}
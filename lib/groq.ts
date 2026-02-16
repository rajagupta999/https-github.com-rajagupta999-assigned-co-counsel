// GROQ API integration for Co-Pilot
// Using client-side calls (static export compatibility)

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const SYSTEM_PROMPT = `You are Assigned Co-Counsel AI, a legal assistant for assigned counsel attorneys (assigned counsel panel attorneys, public defenders, and court-appointed lawyers).

Your capabilities:
- Draft legal documents (motions, briefs, letters)
- Summarize cases and legal concepts
- Guide attorneys through workflows (divorce, criminal defense, family law)
- Help with voucher tracking and billing documentation
- Answer procedural questions about court processes

Guidelines:
- Be concise and professional
- Use proper legal terminology
- Always note that attorneys should verify citations and legal advice
- Format responses clearly with headers and bullet points when appropriate
- If asked to draft something, provide a complete, usable draft

You are helpful, efficient, and understand the challenges of indigent defense work.`;

export async function chatWithGroq(
  messages: Message[],
  onStream?: (chunk: string) => void
): Promise<string> {
  const fullMessages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: !!onStream,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GROQ API error:', error);
      throw new Error(`GROQ API error: ${response.status}`);
    }

    if (onStream && response.body) {
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onStream(content);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      return fullContent;
    } else {
      // Handle non-streaming response
      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response generated.';
    }
  } catch (error) {
    console.error('Error calling GROQ:', error);
    throw error;
  }
}

// Helper to convert chat history format
export function convertMessages(
  chatMessages: { role: string; content: string }[]
): Message[] {
  return chatMessages
    .filter(msg => msg.role === 'user' || msg.role === 'ai')
    .map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content,
    })) as Message[];
}

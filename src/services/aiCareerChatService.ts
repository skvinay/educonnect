type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

const AI_CHAT_ENDPOINT =
  import.meta.env.VITE_AI_CHAT_ENDPOINT || "/api/ai-chat";

type ChatReply = {
  text: string;
  audio: string;
};

export async function chatWithCareerAI(
  messages: ChatMessage[],
  idToken: string
): Promise<ChatReply> {
  if (!idToken) {
    throw new Error("Missing auth token for AI chat request.");
  }

  const response = await fetch(AI_CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "AI chat request failed.");
  }

  const data = (await response.json()) as Partial<ChatReply> & {
    error?: string;
  };

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    text:
      data.text ||
      "I'm sorry, I couldn't generate a response right now. Please try again.",
    audio: data.audio || "",
  };
}

export type { ChatMessage, ChatReply };

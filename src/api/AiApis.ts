import { AiChatMessage } from "@/types/aiChatMessage";

export async function getAiResponse(aiChatMessage: AiChatMessage): Promise<AiChatMessage> {
  try {
    const url = `http://192.168.29.152:8080/chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: aiChatMessage.message }),
    });
    const data = await response.json();
    return { ...aiChatMessage, content: data.response };
  } catch (error) {
    console.error("Error make chat call:", error);
    throw new Error("Failed to make chat call: " + (error as any).message);
  }
}

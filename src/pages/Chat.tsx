import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Copy, Check } from "lucide-react";
import { getAiResponse } from "@/api/AiApis";
import { AiChatMessage } from "@/types/aiChatMessage";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
      const savedMessages = localStorage.getItem("chat_messages");
      return savedMessages
        ? JSON.parse(savedMessages).map((message: Message) => ({
            ...message,
            timestamp: new Date(message.timestamp), // Convert timestamp to Date object
          }))
        : [
            {
              id: '1',
              content: "Hello! I'm your merchant support assistant—how can I help you today with order status, payments, or customer information?",
              sender: 'system',
              timestamp: new Date(),
            },
          ];
   });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
      messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const systemResponseContent = await getSystemResponse(inputMessage); // Await the response
      const systemResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: systemResponseContent,
        sender: 'system',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, systemResponse]);
    } catch (error) {
      console.error('Error fetching system response:', error);
    } finally {
      setIsLoading(false);
    }
  };

const getSystemResponse = async (userInput: string): Promise<string> => {
  const aiChatMessage: AiChatMessage = { message: userInput };
  try {
    const answer = await getAiResponse(aiChatMessage);
    return answer.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, I couldn't process your request.";
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50">
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-3 py-2 sm:px-6 sm:py-3 border-b bg-white flex-shrink-0">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
            Happy - AI
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Get instant help for orders, payments & reports
          </p>
        </div>

        {/* Chat container */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Card className="flex-1 flex flex-col rounded-none border-0 sm:border sm:rounded-lg sm:m-4 min-h-0 shadow-none sm:shadow">
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">

              {/* Messages */}
              <ScrollArea className="flex-1 px-2 py-3 sm:p-4 min-h-0 flex flex-col">
                <div className="flex-1 flex flex-col space-y-4 sm:space-y-6 max-w-full">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 sm:gap-3 max-w-full ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {/* Avatar */}
                      {message.sender === "system" && (
                        <div className="shrink-0 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-green-600 text-white self-start">
                          <Bot className="h-3 w-3 sm:h-5 sm:w-5" />
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`${message.sender === "user" ? "flex flex-col items-end max-w-[85%]" : "flex-1 max-w-[90%]"}`}>
                        <div
                          className={`chat-message rounded-lg text-sm sm:text-[15px] leading-relaxed overflow-hidden ${
                            message.sender === "user"
                              ? "bg-gray-200 text-gray-900 p-3 sm:p-4 break-words"
                              : "bg-transparent text-gray-900 break-words"
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Code blocks with syntax highlighting
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                const codeId = `${message.id}-${match?.[1] || 'code'}`;
                                const codeString = String(children).replace(/\n$/, '');
                                
                                return !inline && match ? (
                                  <div className="relative group my-4">
                                    <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-xs font-mono">
                                      <span>{match[1]}</span>
                                      <button
                                        onClick={() => copyToClipboard(codeString, codeId)}
                                        className="flex items-center gap-1 hover:text-white transition-colors"
                                      >
                                        {copiedCode === codeId ? (
                                          <>
                                            <Check className="h-3 w-3" />
                                            <span>Copied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="h-3 w-3" />
                                            <span>Copy code</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      className="!mt-0 !rounded-t-none text-sm"
                                      {...props}
                                    >
                                      {codeString}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code className={`${message.sender === "user" ? "bg-gray-300" : "bg-gray-200"} text-red-600 px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              // Tables
                              table({ children }) {
                                return (
                                  <div className="my-4 overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-300">
                                      {children}
                                    </table>
                                  </div>
                                );
                              },
                              thead({ children }) {
                                return <thead className="bg-gray-100">{children}</thead>;
                              },
                              th({ children }) {
                                return (
                                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
                                    {children}
                                  </th>
                                );
                              },
                              td({ children }) {
                                return (
                                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                    {children}
                                  </td>
                                );
                              },
                              // Headings
                              h1({ children }) {
                                return <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>;
                              },
                              h2({ children }) {
                                return <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>;
                              },
                              h3({ children }) {
                                return <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>;
                              },
                              // Lists
                              ul({ children }) {
                                return <ul className="list-disc list-inside my-3 space-y-1">{children}</ul>;
                              },
                              ol({ children }) {
                                return <ol className="list-decimal list-inside my-3 space-y-1">{children}</ol>;
                              },
                              li({ children }) {
                                return <li className="ml-4">{children}</li>;
                              },
                              // Paragraphs
                              p({ children }) {
                                return <p className="my-3 leading-7 break-words overflow-wrap-anywhere">{children}</p>;
                              },
                              // Links
                              a({ href, children }) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${message.sender === "user" ? "text-blue-700 underline" : "text-blue-600 hover:text-blue-800 underline"}`}
                                  >
                                    {children}
                                  </a>
                                );
                              },
                              // Blockquotes
                              blockquote({ children }) {
                                return (
                                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
                                    {children}
                                  </blockquote>
                                );
                              },
                              // Strong/Bold
                              strong({ children }) {
                                return <strong className="font-semibold">{children}</strong>;
                              },
                              // Emphasis/Italic
                              em({ children }) {
                                return <em className="italic">{children}</em>;
                              },
                            }}
                          >
                            {message.content.replace(/\\n/g, "\n")}
                          </ReactMarkdown>
                        </div>
                        <p className="text-xs mt-2 text-gray-500">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* User Avatar */}
                      {message.sender === "user" && (
                        <div className="shrink-0 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-blue-600 text-white self-start">
                          <User className="h-3 w-3 sm:h-5 sm:w-5" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="shrink-0 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-green-600 text-white">
                        <Bot className="h-3 w-3 sm:h-5 sm:w-5" />
                      </div>
                      <div className="bg-gray-100 px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex gap-1.5">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input bar → sticky */}
              <div className="border-t bg-white p-2 sm:p-4 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about an order..."
                    disabled={isLoading}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );


};

export default Chat;

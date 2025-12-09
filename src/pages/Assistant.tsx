import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageCircle, Send, Mic, MicOff, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Namaste! I'm your 24/7 Virtual Vaidya. How can I assist you with your health and wellness today? I can help with symptoms, Ayurvedic guidance, nutrition advice, and much more!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => 
        `${msg.sender === 'user' ? 'User' : 'Virtual Vaidya'}: ${msg.content}`
      ).join('\n');

      const prompt = `
You are a knowledgeable Virtual Vaidya (Ayurvedic Health Assistant) named "AyurGen Assistant". You combine modern medical knowledge with traditional Ayurvedic wisdom.

CONVERSATION CONTEXT:
${conversationHistory}

USER'S CURRENT QUESTION: ${currentInput}

GUIDELINES:
1. Be compassionate, knowledgeable, and professional
2. Provide practical, actionable advice
3. Include both modern and Ayurvedic perspectives when relevant
4. Always recommend consulting healthcare professionals for serious conditions
5. Use simple, understandable language
6. Include relevant Ayurvedic concepts (doshas, herbs, lifestyle) when appropriate
7. Keep responses conversational and helpful
8. If asked about symptoms, provide structured guidance but emphasize professional consultation

RESPONSE FORMAT:
- Use clear, conversational tone
- Include practical tips and recommendations
- Mention relevant Ayurvedic herbs or practices when applicable
- Always include appropriate medical disclaimers

Provide a helpful, compassionate response:
      `;

      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt, 
          type: 'assistant' 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to get response');
      }

      const botResponse = data.response;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Recognition",
        description: "Voice recognition not supported in this browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <MessageCircle className="h-7 w-7 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-green-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  AI Health Assistant
                </h1>
                <p className="text-sm text-muted-foreground">
                  24/7 Virtual Vaidya
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                24/7 Virtual Vaidya
              </h1>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-green-400 animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your personal AI health assistant combining modern medicine with ancient Ayurvedic wisdom
            </p>
          </div>

          {/* Chat Interface */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                AyurGen Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}>
                            {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-muted text-foreground border'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 border">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about symptoms, Ayurveda, nutrition, or any health question..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={startListening}
                    variant="outline"
                    size="icon"
                    className={isListening ? 'bg-red-100 border-red-300 dark:bg-red-950/20' : ''}
                    disabled={loading}
                  >
                    {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={sendMessage} disabled={!input.trim() || loading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setInput("What are some natural remedies for stress and anxiety?")}>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-foreground mb-2">Stress Relief</h3>
                <p className="text-sm text-muted-foreground">Natural remedies for anxiety</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setInput("Can you help me understand my dosha type?")}>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-foreground mb-2">Dosha Analysis</h3>
                <p className="text-sm text-muted-foreground">Understand your body type</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setInput("What should I eat for better digestion according to Ayurveda?")}>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-foreground mb-2">Digestive Health</h3>
                <p className="text-sm text-muted-foreground">Ayurvedic nutrition tips</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assistant;
import { createContext, type ReactNode, useState } from "react";

type MessageProviderProps = {
  children: ReactNode;
};

type MessageTone = "success" | "info" | "warning" | "error";

type AppMessage = {
  id: string;
  text: string;
  tone: MessageTone;
};

type MessageContextValue = {
  currentMessage: AppMessage | undefined;
  showMessage: (text: string, tone: MessageTone) => void;
  dismissMessage: (id: string) => void;
};

const MessageContext = createContext<MessageContextValue | undefined>(
  undefined,
);

export function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const currentMessage = messages[0];

  function showMessage(text: string, tone: MessageTone) {
    const newMessage: AppMessage = {
      id: crypto.randomUUID(),
      text,
      tone,
    };

    setMessages((currentMessages) => [...currentMessages, newMessage]);
  }

  function dismissMessage(id: string) {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== id),
    );
  }

  return (
    <MessageContext.Provider
      value={{
        currentMessage,
        showMessage,
        dismissMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

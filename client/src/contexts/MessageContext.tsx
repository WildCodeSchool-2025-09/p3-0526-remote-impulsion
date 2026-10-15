import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

const MESSAGE_DURATION_MS = 5000;

export function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const currentMessage = messages[0];

  useEffect(() => {
    if (currentMessage === undefined || currentMessage.tone === "error") {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setMessages((currentMessages) => currentMessages.slice(1));
    }, MESSAGE_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [currentMessage]);

  const showMessage = useCallback((text: string, tone: MessageTone) => {
    const newMessage: AppMessage = {
      id: crypto.randomUUID(),
      text,
      tone,
    };

    setMessages((currentMessages) => [...currentMessages, newMessage]);
  }, []);

  const dismissMessage = useCallback((id: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== id),
    );
  }, []);

  const value = useMemo(
    () => ({ currentMessage, showMessage, dismissMessage }),
    [currentMessage, showMessage, dismissMessage],
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);

  if (context === undefined) {
    throw new Error("useMessages doit être utilisé dans un MessageProvider");
  }
  return context;
}

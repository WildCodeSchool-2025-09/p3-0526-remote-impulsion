type MessageTone = "success" | "info" | "warning" | "error";

type AppMessage = {
  id: string;
  text: string;
  tone: MessageTone;
};

type MessageContextValue = {
  currentMessage: AppMessage | undefined;
  showMessage: (text: string, tone: MessageTone) => void;
  dismissMessage: () => void;
};
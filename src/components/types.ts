export type TContentEditableComponentProps ={
    sendDataToParent: (data: boolean) => void; // Function that accepts a boolean value
    content: string;
    setContent: (content: string) => void;
  }
  
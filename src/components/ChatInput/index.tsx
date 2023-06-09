"use client";

import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";
import TextAreaAutosize from "react-textarea-autosize";
import Button from "../ui/Button";

type ChatInputProps = {
  chatPartner: IUser;
  chatId: string;
};

const ChatInput: React.FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textAreaRef.current?.focus();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextAreaAutosize
          ref={textAreaRef}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Message ${chatPartner.name} ...`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />
        <div
          onClick={() => textAreaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button isLoading={isLoading} type="submit" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

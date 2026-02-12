import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import { useState } from "react";

export default function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 transition-all duration-300 bg-gray-900/50 z-999999"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className="glass-card flex-col rounded-2xl xl:flex xl:w-1/4">
        <ChatHeader onToggle={toggleSidebar} />
        <ChatList isOpen={isOpen} onToggle={toggleSidebar} />
      </div>
    </>
  );
}

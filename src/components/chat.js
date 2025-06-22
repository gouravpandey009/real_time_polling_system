"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Cards";
import { Button } from "./ui/Buttons";
import { Input } from "./ui/Input";
import { X, Send, MessageCircle } from "./ui/Icons";

function Chat({ socket, userName, userType, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("get-chat-history");

    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("new-message");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("send-message", { message: newMessage.trim() });
      setNewMessage("");
    }
  };

  return (
    <Card className="chat-popup">
      <CardHeader className="chat-header">
        <CardTitle className="chat-title">
          <MessageCircle size={20} />
          <span>Live Chat</span>
          <div className="online-indicator">
            <div className="online-dot"></div>
            <span>Online</span>
          </div>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="close-btn"
        >
          <X size={18} />
        </Button>
      </CardHeader>

      <CardContent className="chat-content">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <MessageCircle size={32} />
              <p>No messages yet</p>
              <span>Start the conversation!</span>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.senderType} ${
                  message.sender === userName ? "own" : ""
                }`}
              >
                <div className="message-avatar">
                  {message.sender.charAt(0).toUpperCase()}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">{message.sender}</span>
                    <span className={`sender-badge ${message.senderType}`}>
                      {message.senderType === "teacher"
                        ? "Instructor"
                        : "Student"}
                    </span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="input-container">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              maxLength={200}
              className="message-input"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="send-button"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default Chat;

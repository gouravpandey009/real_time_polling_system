"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import WelcomeScreen from "./components/WelcomeScreen";
import Chat from "./components/chat";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Check if user name exists in sessionStorage
    const savedName = sessionStorage.getItem("userName");
    const savedType = sessionStorage.getItem("userType");

    if (savedName && savedType) {
      setUserName(savedName);
      setUserType(savedType);

      if (savedType === "teacher") {
        socket.emit("teacher-join", { name: savedName });
      } else {
        socket.emit("student-join", { name: savedName });
      }
    }

    socket.on("teacher-joined", () => setIsConnected(true));
    socket.on("student-joined", () => setIsConnected(true));

    socket.on("kicked", () => {
      alert("You have been kicked out by the teacher");
      sessionStorage.clear();
      window.location.reload();
    });

    return () => {
      socket.off("teacher-joined");
      socket.off("student-joined");
      socket.off("kicked");
    };
  }, []);

  const handleJoin = (type, name) => {
    setUserType(type);
    setUserName(name);
    setIsConnected(true);

    // Save to sessionStorage
    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userType", type);

    if (type === "teacher") {
      socket.emit("teacher-join", { name });
    } else {
      socket.emit("student-join", { name });
    }
  };

  if (!isConnected) {
    return <WelcomeScreen onJoin={handleJoin} />;
  }

  return (
    <div className="App">
      {userType === "teacher" ? (
        <TeacherDashboard socket={socket} userName={userName} />
      ) : (
        <StudentDashboard socket={socket} userName={userName} />
      )}

      <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
        <div className="chat-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <span>Chat</span>
      </button>

      {showChat && (
        <Chat
          socket={socket}
          userName={userName}
          userType={userType}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default App;

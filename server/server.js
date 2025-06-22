const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
let currentPoll = null;
let pollResults = {};
const students = new Map();
const teachers = new Map();
const pollHistory = [];
const chatMessages = [];

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Teacher joins
  socket.on("teacher-join", (data) => {
    teachers.set(socket.id, { ...data, socketId: socket.id });
    socket.join("teachers");
    socket.emit("teacher-joined", { success: true });

    // Send current poll state
    if (currentPoll) {
      socket.emit("current-poll", currentPoll);
      socket.emit("poll-results", pollResults);
    }

    // Send student list
    socket.emit("students-list", Array.from(students.values()));
    console.log("Teacher joined:", data.name);
  });

  // Student joins
  socket.on("student-join", (data) => {
    const student = { ...data, socketId: socket.id, hasAnswered: false };
    students.set(socket.id, student);
    socket.join("students");
    socket.emit("student-joined", { success: true });

    // Notify teachers about new student
    io.to("teachers").emit("students-list", Array.from(students.values()));

    // Send current poll if exists
    if (currentPoll) {
      socket.emit("new-poll", currentPoll);
    }

    console.log("Student joined:", data.name);
  });

  // Teacher creates a new poll
  socket.on("create-poll", (pollData) => {
    if (!teachers.has(socket.id)) return;

    // Check if can create new poll
    const allStudentsAnswered = Array.from(students.values()).every(
      (s) => s.hasAnswered
    );
    if (currentPoll && !allStudentsAnswered) {
      socket.emit("poll-error", {
        message: "Wait for all students to answer current question",
      });
      return;
    }

    currentPoll = {
      id: Date.now(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date(),
      isActive: true,
    };

    pollResults = {};
    pollData.options.forEach((option) => {
      pollResults[option] = 0;
    });

    // Reset student answered status
    students.forEach((student) => {
      student.hasAnswered = false;
    });

    // Send poll to all students
    io.to("students").emit("new-poll", currentPoll);
    io.to("teachers").emit("poll-created", currentPoll);

    console.log("New poll created:", currentPoll.question);

    // Auto-close poll after time limit
    setTimeout(() => {
      if (currentPoll && currentPoll.id === pollData.id) {
        closePoll();
      }
    }, currentPoll.timeLimit * 1000);
  });

  // Student submits answer
  socket.on("submit-answer", (data) => {
    if (!students.has(socket.id) || !currentPoll) return;

    const student = students.get(socket.id);
    if (student.hasAnswered) return;

    // Update results
    if (pollResults.hasOwnProperty(data.answer)) {
      pollResults[data.answer]++;
    }

    // Mark student as answered
    student.hasAnswered = true;
    students.set(socket.id, student);

    // Send updated results to everyone
    io.emit("poll-results", pollResults);

    // Check if all students answered
    const allAnswered = Array.from(students.values()).every(
      (s) => s.hasAnswered
    );
    if (allAnswered) {
      closePoll();
    }

    console.log("Answer submitted:", data.answer, "by", student.name);
  });

  // Chat message
  socket.on("send-message", (data) => {
    const user = students.get(socket.id) || teachers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now(),
      text: data.message,
      sender: user.name,
      senderType: students.has(socket.id) ? "student" : "teacher",
      timestamp: new Date(),
    };

    chatMessages.push(message);
    io.emit("new-message", message);
  });

  // Teacher kicks student
  socket.on("kick-student", (data) => {
    if (!teachers.has(socket.id)) return;

    const studentSocket = Array.from(students.entries()).find(
      ([_, student]) => student.name === data.studentName
    );

    if (studentSocket) {
      const [studentSocketId] = studentSocket;
      io.to(studentSocketId).emit("kicked");
      students.delete(studentSocketId);
      io.to("teachers").emit("students-list", Array.from(students.values()));
    }
  });

  // Get poll history
  socket.on("get-poll-history", () => {
    if (teachers.has(socket.id)) {
      socket.emit("poll-history", pollHistory);
    }
  });

  // Get chat history
  socket.on("get-chat-history", () => {
    socket.emit("chat-history", chatMessages);
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (students.has(socket.id)) {
      const student = students.get(socket.id);
      students.delete(socket.id);
      io.to("teachers").emit("students-list", Array.from(students.values()));
      console.log("Student disconnected:", student?.name);
    }

    if (teachers.has(socket.id)) {
      const teacher = teachers.get(socket.id);
      teachers.delete(socket.id);
      console.log("Teacher disconnected:", teacher?.name);
    }
  });
});

function closePoll() {
  if (!currentPoll) return;

  currentPoll.isActive = false;

  // Save to history
  pollHistory.push({
    ...currentPoll,
    results: { ...pollResults },
    totalResponses: Object.values(pollResults).reduce((a, b) => a + b, 0),
    closedAt: new Date(),
  });

  io.emit("poll-closed", { results: pollResults });
  console.log("Poll closed:", currentPoll.question);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

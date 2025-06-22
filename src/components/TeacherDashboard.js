"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Cards";
import { Button } from "./ui/Buttons";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Plus, Users, BarChart3, History, Crown, Zap } from "./ui/Icons";

function TeacherDashboard({ socket, userName }) {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResults, setPollResults] = useState({});
  const [students, setStudents] = useState([]);
  const [pollHistory, setPollHistory] = useState([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", "", "", ""],
    timeLimit: 60,
  });

  useEffect(() => {
    socket.on("current-poll", (poll) => setCurrentPoll(poll));
    socket.on("poll-results", (results) => setPollResults(results));
    socket.on("students-list", (studentsList) => setStudents(studentsList));
    socket.on("poll-created", (poll) => {
      setCurrentPoll(poll);
      setShowCreatePoll(false);
    });
    socket.on("poll-closed", (data) => {
      setCurrentPoll((prev) => (prev ? { ...prev, isActive: false } : null));
    });
    socket.on("poll-error", (error) => {
      alert(error.message);
    });
    socket.on("poll-history", (history) => setPollHistory(history));

    socket.emit("get-poll-history");

    return () => {
      socket.off("current-poll");
      socket.off("poll-results");
      socket.off("students-list");
      socket.off("poll-created");
      socket.off("poll-closed");
      socket.off("poll-error");
      socket.off("poll-history");
    };
  }, [socket]);

  const handleCreatePoll = (e) => {
    e.preventDefault();
    const validOptions = newPoll.options.filter((opt) => opt.trim());

    if (newPoll.question.trim() && validOptions.length >= 2) {
      socket.emit("create-poll", {
        ...newPoll,
        options: validOptions,
        id: Date.now(),
      });

      setNewPoll({
        question: "",
        options: ["", "", "", ""],
        timeLimit: 60,
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({ ...newPoll, options: newOptions });
  };

  const kickStudent = (studentName) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${studentName} from the session?`
      )
    ) {
      socket.emit("kick-student", { studentName });
    }
  };

  const canCreateNewPoll =
    !currentPoll ||
    !currentPoll.isActive ||
    students.every((student) => student.hasAnswered);
  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="user-avatar">
              <Crown size={20} />
            </div>
            <div className="user-info">
              <h1>Instructor Dashboard</h1>
              <p>
                Welcome back, <span className="user-name">{userName}</span>
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <Users size={16} />
              <span>{students.length} Students</span>
            </div>
            <div className="stat-item">
              <BarChart3 size={16} />
              <span>{pollHistory.length} Polls</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="main-content">
          <div className="controls-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
              <p>Manage your polling session</p>
            </div>
            <div className="controls">
              <Button
                onClick={() => setShowCreatePoll(true)}
                disabled={!canCreateNewPoll}
                className="attractive-btn primary-btn"
              >
                <Plus size={20} />
                <span>Create New Poll</span>
              </Button>
              <Button
                onClick={() => setShowHistory(true)}
                className="attractive-btn secondary-btn"
              >
                <History size={20} />
                <span>View History</span>
              </Button>
            </div>
          </div>

          {currentPoll && (
            <div className="compact-poll-results">
              <div className="poll-header-section">
                <div className="poll-title-row">
                  <h2 className="poll-question-number">Question 1</h2>
                  {currentPoll.isActive && (
                    <div className="live-status">
                      <div className="live-dot"></div>
                      <span>LIVE</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="poll-question-header">
                <h3>{currentPoll.question}</h3>
              </div>

              <div className="compact-results-list">
                {currentPoll.options.map((option, index) => {
                  const votes = pollResults[option] || 0;
                  const percentage =
                    totalVotes > 0
                      ? ((votes / totalVotes) * 100).toFixed(0)
                      : 0;

                  return (
                    <div key={index} className="compact-result-item">
                      <div className="compact-result-content">
                        <div className="result-number">{index + 1}</div>
                        <span className="result-text">{option}</span>
                        <span className="result-percentage">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="compact-poll-stats">
                <p>
                  Total responses: <strong>{totalVotes}</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar">
          <Card className="students-panel">
            <CardHeader className="students-header">
              <CardTitle className="students-title">
                <Users size={20} />
                <span>Connected Students</span>
                <div className="student-count">{students.length}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="students-content">
              <div className="students-list">
                {students.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <p>No students connected yet</p>
                    <span>Students will appear here when they join</span>
                  </div>
                ) : (
                  students.map((student, index) => (
                    <div key={index} className="student-item">
                      <div className="student-avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        {currentPoll && currentPoll.isActive && (
                          <div
                            className={`student-status ${
                              student.hasAnswered ? "answered" : "pending"
                            }`}
                          >
                            {student.hasAnswered ? (
                              <>
                                <div className="status-dot answered"></div>
                                <span>Answered</span>
                              </>
                            ) : (
                              <>
                                <div className="status-dot pending"></div>
                                <span>Waiting...</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => kickStudent(student.name)}
                        className="remove-btn"
                        title="Remove student"
                      >
                        ×
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showCreatePoll && (
        <div className="modal-overlay">
          <Card className="modal create-poll-modal">
            <CardHeader className="modal-header">
              <CardTitle className="modal-title">
                <Zap size={24} />
                Create New Poll
              </CardTitle>
              <p className="modal-subtitle">
                Design an engaging poll for your students
              </p>
            </CardHeader>
            <CardContent className="modal-content">
              <form onSubmit={handleCreatePoll} className="poll-form">
                <div className="form-section">
                  <Label className="form-label">Poll Question</Label>
                  <Input
                    type="text"
                    value={newPoll.question}
                    onChange={(e) =>
                      setNewPoll({ ...newPoll, question: e.target.value })
                    }
                    placeholder="What would you like to ask your students?"
                    required
                    className="question-input"
                  />
                </div>

                <div className="form-section">
                  <Label className="form-label">Answer Options</Label>
                  <div className="options-grid">
                    {newPoll.options.map((option, index) => (
                      <div key={index} className="option-input-group">
                        <div className="option-label">{index + 1}</div>
                        <Input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                          className="option-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <Label className="form-label">Time Limit</Label>
                  <div className="enhanced-time-section">
                    <div className="time-selector-container">
                      <div className="time-input-wrapper">
                        <Input
                          type="number"
                          value={newPoll.timeLimit}
                          onChange={(e) =>
                            setNewPoll({
                              ...newPoll,
                              timeLimit: Number.parseInt(e.target.value),
                            })
                          }
                          min="10"
                          max="300"
                          className="enhanced-time-input"
                        />
                        <span className="time-unit-label">seconds</span>
                      </div>
                      <div className="time-presets">
                        {[30, 60, 90, 120].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setNewPoll({ ...newPoll, timeLimit: time })
                            }
                            className={`time-preset ${
                              newPoll.timeLimit === time ? "active" : ""
                            }`}
                          >
                            {time}s
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="time-description">
                      <p>
                        Students will have {newPoll.timeLimit} seconds to answer
                        this question
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <Button
                    type="button"
                    onClick={() => setShowCreatePoll(false)}
                    className="attractive-btn cancel-btn"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="attractive-btn primary-btn">
                    <Zap size={16} />
                    Create Poll
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showHistory && (
        <div className="modal-overlay">
          <Card className="modal history-modal">
            <CardHeader className="modal-header">
              <CardTitle className="modal-title">
                <History size={24} />
                Poll History
              </CardTitle>
              <p className="modal-subtitle">
                Review your previous polling sessions
              </p>
            </CardHeader>
            <CardContent className="modal-content">
              <div className="history-list">
                {pollHistory.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>No polls created yet</p>
                    <span>Your poll history will appear here</span>
                  </div>
                ) : (
                  pollHistory.map((poll, index) => (
                    <Card key={index} className="history-item">
                      <CardContent className="history-content">
                        <div className="history-header">
                          <h4>{poll.question}</h4>
                          <div className="history-meta">
                            <span>
                              {new Date(poll.createdAt).toLocaleDateString()}
                            </span>
                            <span>{poll.totalResponses} responses</span>
                          </div>
                        </div>
                        <div className="history-results">
                          {Object.entries(poll.results).map(
                            ([option, votes]) => (
                              <div key={option} className="history-result">
                                <span className="result-option">{option}</span>
                                <span className="result-votes">
                                  {votes} votes
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <div className="modal-actions">
                <Button
                  onClick={() => setShowHistory(false)}
                  className="attractive-btn primary-btn"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;

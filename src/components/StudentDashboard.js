"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/Cards";
import { Button } from "./ui/Buttons";
import { Clock, CheckCircle, User, Trophy, Zap } from "./ui/Icons";

function StudentDashboard({ socket, userName }) {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResults, setPollResults] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    socket.on("new-poll", (poll) => {
      setCurrentPoll(poll);
      setHasAnswered(false);
      setSelectedAnswer("");
      setShowResults(false);
      setTimeLeft(poll.timeLimit);
    });

    socket.on("poll-results", (results) => {
      setPollResults(results);
      if (hasAnswered) {
        setShowResults(true);
      }
    });

    socket.on("poll-closed", (data) => {
      setPollResults(data.results);
      setShowResults(true);
      setCurrentPoll((prev) => (prev ? { ...prev, isActive: false } : null));
    });

    return () => {
      socket.off("new-poll");
      socket.off("poll-results");
      socket.off("poll-closed");
    };
  }, [socket, hasAnswered]);

  useEffect(() => {
    let timer;
    if (currentPoll && currentPoll.isActive && timeLeft > 0 && !hasAnswered) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [currentPoll, timeLeft, hasAnswered]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer && !hasAnswered) {
      socket.emit("submit-answer", { answer: selectedAnswer });
      setHasAnswered(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="user-avatar student-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <h1>Student Dashboard</h1>
              <p>
                Welcome, <span className="user-name">{userName}</span>
              </p>
            </div>
          </div>
          <div className="connection-status">
            <div className="status-indicator connected">
              <div className="status-dot"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {!currentPoll ? (
          <div className="waiting-state">
            <Card className="waiting-card">
              <CardContent className="waiting-content">
                <div className="waiting-animation">
                  <div className="pulse-circle">
                    <Clock size={48} />
                  </div>
                  <div className="waiting-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
                <div className="waiting-text">
                  <h2>Waiting for instructor...</h2>
                  <p>Your instructor will start a poll soon. Stay tuned!</p>
                </div>
                <div className="waiting-tips">
                  <div className="tip">
                    <Zap size={16} />
                    <span>Polls appear instantly when created</span>
                  </div>
                  <div className="tip">
                    <Trophy size={16} />
                    <span>Be quick to submit your answers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="poll-container">
            {!showResults &&
            currentPoll.isActive &&
            !hasAnswered &&
            timeLeft > 0 ? (
              <div className="student-poll-container">
                <div className="poll-header-section">
                  <div className="poll-title-row">
                    <h2 className="poll-question-number">Question 1</h2>
                    <div className="timer-display">
                      <Clock size={16} />
                      <span
                        className={`timer-text ${
                          timeLeft <= 10 ? "urgent" : ""
                        }`}
                      >
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="poll-question-header">
                  <h3>{currentPoll.question}</h3>
                </div>

                <div className="poll-options-list">
                  {currentPoll.options.map((option, index) => (
                    <div
                      key={index}
                      className={`option-bar-item ${
                        selectedAnswer === option ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAnswer(option)}
                    >
                      <div className="option-bar-container">
                        <div className="option-bar-left">
                          <div className="option-number">{index + 1}</div>
                          <span className="option-text">{option}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="attractive-btn submit-btn"
                >
                  <CheckCircle size={20} />
                  <span>Submit Answer</span>
                </Button>
              </div>
            ) : (
              <div className="student-results-container">
                <div className="poll-header-section">
                  <div className="poll-title-row">
                    <h2 className="poll-question-number">Question 1</h2>
                    {!currentPoll.isActive && (
                      <div className="completed-status">
                        <CheckCircle size={16} />
                        <span>COMPLETED</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="poll-question-header">
                  <h3>{currentPoll.question}</h3>
                </div>

                <div className="poll-results-list">
                  {currentPoll.options.map((option, index) => {
                    const votes = pollResults[option] || 0;
                    const percentage =
                      totalVotes > 0
                        ? ((votes / totalVotes) * 100).toFixed(0)
                        : 0;
                    const isUserChoice = selectedAnswer === option;

                    return (
                      <div
                        key={index}
                        className={`result-bar-item ${
                          isUserChoice ? "user-choice" : ""
                        }`}
                      >
                        <div className="result-bar-container">
                          <div className="result-bar-left">
                            <div className="option-number">{index + 1}</div>
                            <span className="option-text">
                              {option}
                              {isUserChoice && (
                                <span className="your-choice-badge">
                                  Your choice
                                </span>
                              )}
                            </span>
                          </div>
                          <div
                            className="result-bar-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <div className="result-percentage">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!currentPoll.isActive ? (
                  <div className="waiting-message">
                    <p>Wait for the teacher to ask a new question..</p>
                  </div>
                ) : (
                  <div className="poll-stats">
                    <p>
                      Total responses: <strong>{totalVotes}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;

"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/Cards";
import { Button } from "./ui/Buttons";
import { Input } from "./ui/Input";

function WelcomeScreen({ onJoin }) {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && userType) {
      onJoin(userType, name.trim());
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <div className="welcome-container-compact">
        <Card className="welcome-card-compact">
          <CardContent className="welcome-card-content-compact">
            <div className="brand-badge">
              <span>Intervue Poll</span>
            </div>

            <div className="welcome-header-compact">
              <h1 className="welcome-title">
                Welcome to the Live Polling System
              </h1>
              <p className="welcome-description">
                Please select the role that best describes you to begin using
                the live polling system
              </p>
            </div>

            <form onSubmit={handleSubmit} className="welcome-form-compact">
              <div className="role-selection-inline">
                <label
                  className={`role-card ${
                    userType === "student" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="student"
                    checked={userType === "student"}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <div className="role-content">
                    <h3>I'm a Student</h3>
                    <p>
                      I am Student and I want to answer questions and
                      participate in live polls.
                    </p>
                  </div>
                </label>

                <label
                  className={`role-card ${
                    userType === "teacher" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="teacher"
                    checked={userType === "teacher"}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <div className="role-content">
                    <h3>I'm a Teacher</h3>
                    <p>
                      Submit answers and view live poll results in real-time.
                    </p>
                  </div>
                </label>
              </div>

              <div className="name-input-section">
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="name-input-compact"
                />
              </div>

              <Button
                type="submit"
                disabled={!userType || !name.trim()}
                className="continue-button"
              >
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WelcomeScreen;

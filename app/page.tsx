"use client";

import { useState } from "react";
import { Button } from "../src/components/ui/Buttons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../src/components/ui/Cards";
import { Input } from "../src/components/ui/Input";
import { Label } from "../src/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "../src/components/ui/RadioGroup";
import { Progress } from "../src/components/ui/Progress";
import { Users, BarChart3, Clock, CheckCircle } from "lucide-react";

export default function LivePollingSystem() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [userType, setUserType] = useState("");
  const [pollData, setPollData] = useState({
    question: "",
    options: ["", "", "", ""],
    results: [45, 30, 15, 10],
  });

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md" onClick={() => {}}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#000000]">
            Welcome to the Live Polling System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer hover:bg-[#f1f1f1] transition-colors border-2 hover:border-[#7451b6]"
              onClick={() => {
                setUserType("student");
                setCurrentScreen("getStarted");
              }}
            >
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-[#7451b6]" />
                <h3 className="font-semibold text-[#000000]">I'm a Student</h3>
                <p className="text-sm text-[#454545]">
                  Join a live poll session
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-[#f1f1f1] transition-colors border-2 hover:border-[#7451b6]"
              onClick={() => {
                setUserType("teacher");
                setCurrentScreen("getStarted");
              }}
            >
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-[#7451b6]" />
                <h3 className="font-semibold text-[#000000]">I'm a Teacher</h3>
                <p className="text-sm text-[#454545]">
                  Create and manage polls
                </p>
              </CardContent>
            </Card>
          </div>

          <Button
            className="w-full bg-[#7451b6] hover:bg-[#5a66d1] text-white"
            onClick={() => setCurrentScreen("getStarted")}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const GetStartedScreen = () => (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md" onClick={() => {}}>
        <CardHeader>
          <div className="w-8 h-8 bg-[#7451b6] rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-sm font-bold">1</span>
          </div>
          <CardTitle className="text-xl font-bold text-[#000000]">
            Let's Get Started
          </CardTitle>
          <p className="text-[#454545]">
            {userType === "teacher"
              ? "Set up your polling session to engage with your students"
              : "Enter the session details to join the live poll"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#000000]">
              Enter your name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              value={""}
              onChange={() => {}}
              className="border-[#d9d9d9] focus:border-[#7451b6]"
              min=""
              max=""
            />
          </div>

          {userType === "student" && (
            <div className="space-y-2">
              <Label htmlFor="sessionId" className="text-[#000000]">
                Session ID
              </Label>
              <Input
                id="sessionId"
                name="sessionId"
                placeholder="Enter session ID"
                value={""}
                onChange={() => {}}
                className="border-[#d9d9d9] focus:border-[#7451b6]"
                min=""
                max=""
              />
            </div>
          )}

          <Button
            className="w-full bg-[#7451b6] hover:bg-[#5a66d1] text-white"
            onClick={() =>
              setCurrentScreen(
                userType === "teacher" ? "createQuestion" : "waitingRoom"
              )
            }
          >
            {userType === "teacher" ? "Create Session" : "Join Session"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const CreateQuestionScreen = () => (
    <div className="min-h-screen bg-[#f6f6f6] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">Question</h1>
          <div className="flex items-center gap-4 text-sm text-[#454545]">
            <span>Session ID: ABC123</span>
            <span>•</span>
            <span>Live</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card onClick={() => {}}>
            <CardHeader>
              <CardTitle className="text-lg text-[#000000]">
                Create Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question" className="text-[#000000]">
                  Question
                </Label>
                <Input
                  id="question"
                  name="question"
                  min=""
                  max=""
                  placeholder="Enter your question"
                  value={pollData.question}
                  onChange={(e) =>
                    setPollData({ ...pollData, question: e.target.value })
                  }
                  className="border-[#d9d9d9] focus:border-[#7451b6]"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="option-0" className="text-[#000000]">
                  Answer Options
                </Label>
                {pollData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#7451b6] text-white rounded text-sm flex items-center justify-center font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <Input
                      id={`option-${index}`}
                      name={`option-${index}`}
                      min=""
                      max=""
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...pollData.options];
                        newOptions[index] = e.target.value;
                        setPollData({ ...pollData, options: newOptions });
                      }}
                      className="border-[#d9d9d9] focus:border-[#7451b6]"
                    />
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-[#7451b6] hover:bg-[#5a66d1] text-white"
                onClick={() => setCurrentScreen("livePolling")}
              >
                Start Poll
              </Button>
            </CardContent>
          </Card>

          <Card onClick={() => {}}>
            <CardHeader>
              <CardTitle className="text-lg text-[#000000]">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold text-[#000000]">
                  {pollData.question || "Your question will appear here"}
                </h3>
                <RadioGroup value="" onValueChange={() => {}}>
                  {pollData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={`option-${index}`}
                        id={`option-${index}`}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-[#454545]"
                      >
                        {option || `Option ${index + 1}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const WaitingRoomScreen = () => (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center" onClick={() => {}}>
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-[#7451b6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#000000] mb-2">
            Wait for the teacher to ask questions.
          </h2>
          <p className="text-[#454545] mb-6">
            You'll see the question appear here when the session starts.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-[#7451b6] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#7451b6] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#7451b6] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LivePollingScreen = () => (
    <div className="min-h-screen bg-[#f6f6f6] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">
            Question 1 - Live
          </h1>
          <div className="flex items-center gap-4 text-sm text-[#454545]">
            <span>Session ID: ABC123</span>
            <span>•</span>
            <span className="text-[#7451b6] font-semibold">12 responses</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card onClick={() => {}}>
            <CardHeader>
              <CardTitle className="text-lg text-[#000000]">
                What is your favorite programming language?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                className="space-y-3"
                value=""
                onValueChange={() => {}}
              >
                {["JavaScript", "Python", "Java", "C++"].map(
                  (option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-[#d9d9d9] hover:bg-[#f1f1f1] cursor-pointer"
                    >
                      <RadioGroupItem
                        value={`option-${index}`}
                        id={`option-${index}`}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-[#000000]"
                      >
                        {option}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>

              <Button
                className="w-full mt-4 bg-[#7451b6] hover:bg-[#5a66d1] text-white"
                onClick={() => setCurrentScreen("results")}
              >
                Submit Answer
              </Button>
            </CardContent>
          </Card>

          <Card onClick={() => {}}>
            <CardHeader>
              <CardTitle className="text-lg text-[#000000]">
                Live Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["JavaScript", "Python", "Java", "C++"].map((option, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#000000]">{option}</span>
                    <span className="text-[#454545]">
                      {pollData.results[index]}%
                    </span>
                  </div>
                  <Progress
                    value={pollData.results[index]}
                    className="h-2 bg-[#d9d9d9]"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-[#d9d9d9]">
                <p className="text-sm text-[#454545]">
                  Total responses:{" "}
                  <span className="font-semibold text-[#7451b6]">12</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const ResultsScreen = () => (
    <div className="min-h-screen bg-[#f6f6f6] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">
            Poll Results
          </h1>
          <div className="flex items-center gap-4 text-sm text-[#454545]">
            <span>Session ID: ABC123</span>
            <span>•</span>
            <span>Completed</span>
          </div>
        </div>

        <Card onClick={() => {}}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-[#7451b6]" />
              <div>
                <CardTitle className="text-lg text-[#000000]">
                  What is your favorite programming language?
                </CardTitle>
                <p className="text-sm text-[#454545]">Final Results</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {["JavaScript", "Python", "Java", "C++"].map(
                  (option, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#000000] font-medium">
                          {option}
                        </span>
                        <span className="text-[#454545]">
                          {pollData.results[index]}% (
                          {Math.round(pollData.results[index] * 0.12)} votes)
                        </span>
                      </div>
                      <Progress
                        value={pollData.results[index]}
                        className="h-3"
                      />
                    </div>
                  )
                )}
              </div>

              <div className="bg-[#f1f1f1] p-4 rounded-lg">
                <h3 className="font-semibold text-[#000000] mb-3">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#454545]">Total Responses:</span>
                    <span className="font-semibold text-[#000000]">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#454545]">Most Popular:</span>
                    <span className="font-semibold text-[#7451b6]">
                      JavaScript
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#454545]">Response Rate:</span>
                    <span className="font-semibold text-[#000000]">100%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-[#7451b6] text-[#7451b6] hover:bg-[#7451b6] hover:text-white"
                onClick={() => setCurrentScreen("createQuestion")}
              >
                Create New Poll
              </Button>
              <Button
                className="bg-[#7451b6] hover:bg-[#5a66d1] text-white"
                onClick={() => {
                  // TODO: Implement export functionality
                }}
              >
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const screens = {
    welcome: <WelcomeScreen />,
    getStarted: <GetStartedScreen />,
    createQuestion: <CreateQuestionScreen />,
    waitingRoom: <WaitingRoomScreen />,
    livePolling: <LivePollingScreen />,
    results: <ResultsScreen />,
  };

  return (
    <div className="min-h-screen">
      {screens[currentScreen as keyof typeof screens]}

      {/* Navigation for demo purposes */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 border border-[#d9d9d9]">
        <div className="flex gap-1">
          {Object.keys(screens).map((screen) => (
            <span key={screen}>
              <Button
                variant={currentScreen === screen ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentScreen(screen)}
                className={
                  currentScreen === screen
                    ? "bg-[#7451b6] hover:bg-[#5a66d1] text-white"
                    : "text-[#454545]"
                }
              >
                {screen.charAt(0).toUpperCase()}
              </Button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

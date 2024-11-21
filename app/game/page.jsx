"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { decode } from "html-entities";

export default function GamePage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(
    () => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      fetchQuestions();
    },
    [isAuthenticated, router]
  );

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=10");
      const data = await response.json();
      const formattedQuestions = data.results.map(q => ({
        ...q,
        all_answers: [...q.incorrect_answers, q.correct_answer].sort(
          () => Math.random() - 0.5
        )
      }));
      setQuestions(formattedQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswer = async selectedAnswer => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    if (!isCorrect) {
      setLives(prev => prev - 1);
      if (lives <= 1) {
        await saveGameResults();
        setGameOver(true);
        setTimeout(() => router.push("/"), 2000);
        return;
      }
    } else {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex + 1 >= questions.length) {
      await fetchQuestions();
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const saveGameResults = async () => {
    try {
      await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          correctAnswers: score,
          totalQuestions: currentQuestionIndex + 1
        })
      });
    } catch (error) {
      console.error("Error saving game results:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dodger-blue-600 grid place-items-center text-white">
        Loading questions...
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-dodger-blue-600 grid place-items-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p>
            Final Score: {score}
          </p>
          <p>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-dodger-blue-600 p-6 text-white">
      <div className="max-w-lg mx-auto relative pt-12">
        {/* Question counter and lives */}
        <div className="flex justify-between items-start mb-12">
          <span className="text-6xl font-bold opacity-50">
            {String(currentQuestionIndex + 1).padStart(2, "0")}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) =>
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${i < lives
                  ? "bg-red-500"
                  : "bg-red-500/30"}`}
              />
            )}
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl mb-2">
            {currentQuestion.category}
          </h3>
          <p className="text-lg">
            {decode(currentQuestion.question)}
          </p>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.all_answers.map((answer, index) =>
            <button
              key={index}
              onClick={() => handleAnswer(answer)}
              className="bg-white/90 hover:bg-white text-dodger-blue-600 p-4 rounded-lg text-center transition-colors"
            >
              {decode(answer)}
            </button>
          )}
        </div>

        {/* Score */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <p className="text-sm">
            Score: {score}
          </p>
        </div>
      </div>
    </div>
  );
}

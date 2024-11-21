'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from 'lucide-react'

// Function to decode HTML entities
const decodeHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.documentElement.textContent
}

export default function GamePage() {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [answerStatus, setAnswerStatus] = useState(null)
  const [answersOpacity, setAnswersOpacity] = useState(1)

  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    fetchQuestions()
  }, [user, isAuthenticated, router])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=10&difficulty=easy")
      const data = await response.json()
      const formattedQuestions = data.results.map(q => ({
        ...q,
        all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
      }))
      setQuestions(formattedQuestions)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching questions:", error)
    }
  }

  const handleAnswer = async (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct_answer

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect')
    setAnswersOpacity(0.3); // Reduce opacity of answers

    if (!isCorrect) {
      setLives(prev => prev - 1)
      if (lives <= 1) {
        await saveGameResults()
        setGameOver(true)
        return
      }
    } else {
      setScore(prev => prev + 1)
    }

    // Delay before moving to the next question
    setTimeout(() => {
      setAnswerStatus(null)
      setAnswersOpacity(1); // Restore opacity
      if (currentQuestionIndex + 1 >= questions.length) {
        fetchQuestions()
        setCurrentQuestionIndex(0)
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }, 1500)
  }

  const saveGameResults = async () => {
    try {
      await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          correctAnswers: score,
          totalQuestions: currentQuestionIndex + 1,
        }),
      })
    } catch (error) {
      console.error("Error saving game results:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-dodger-blue-600 grid place-items-center text-white">
        <div className="text-2xl font-bold">Loading questions...</div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen w-screen bg-dodger-blue-600 grid place-items-center text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-dodger-blue-600 p-8 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-4">Final Score: {score}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="bg-dodger-blue-600 text-white px-6 py-2 rounded-full text-lg font-semibold"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen w-screen bg-dodger-blue-600 p-6 text-white overflow-hidden">
      <div className="max-w-2xl mx-auto relative pt-12 h-full">
        {/* Question counter and lives */}
        <div className="flex justify-between items-start mb-12">
          <span className="text-9xl font-bold opacity-50 -ml-8">
            {String(currentQuestionIndex + 1).padStart(2, "0")}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < lives ? "bg-red-500" : "bg-red-500/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl mb-2">{currentQuestion.category}</h3>
          <p className="text-2xl font-semibold">
            {decodeHtml(currentQuestion.question)}
          </p>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-2 gap-4" style={{ opacity: answersOpacity }}>
          {currentQuestion.all_answers.map((answer, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(answer)}
              className="bg-white/90 hover:bg-white text-dodger-blue-600 p-4 rounded-lg text-center transition-colors text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {decodeHtml(answer)}
            </motion.button>
          ))}
        </div>

        {/* Score */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <p className="text-lg font-semibold">Score: {score}</p>
        </div>

        {/* Answer feedback */}
        <AnimatePresence>
          {answerStatus && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 text-center p-4 rounded-lg ${
                answerStatus === 'correct' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <div className="text-4xl font-bold mb-2">
                {answerStatus === 'correct' ? (
                  <Check className="inline-block mr-2" />
                ) : (
                  <X className="inline-block mr-2" />
                )}
                {answerStatus === 'correct' ? 'Correct!' : 'Incorrect!'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

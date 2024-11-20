"use client";
import { useState, useEffect } from "react";

const Page = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("https://the-trivia-api.com/v2/questions");
      const data = await response.json();
      setQuestions(data);

      if (data.length > 0) {
        loadNewQuestion(data[0]);
      }
    };

    fetchQuestions();
  }, []);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const loadNewQuestion = (question) => {
    const allAnswers = [
      question.correctAnswer,
      ...question.incorrectAnswers,
    ];
    setAnswers(shuffleArray(allAnswers));
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerClick = (answer) => {
    const currentQuestion = questions[questionIndex];

    if (answer === currentQuestion.correctAnswer) {
      setIsCorrect(true);
      setSelectedAnswer(answer);
      setScore(score + 1);

      setTimeout(() => {
        if (questionIndex + 1 < questions.length) {
          setQuestionIndex(questionIndex + 1);
          loadNewQuestion(questions[questionIndex + 1]);
        } else {
          alert("¡Ganaste! Has respondido todas las preguntas.");
        }
      }, 1000);
    } else {
      setIsCorrect(false);
      setLives(lives - 1);
      setSelectedAnswer(answer);

      if (lives - 1 === 0) {
        setIsGameOver(true);
        alert("Juego terminado. ¡Se te acabaron los círculos rojos!");
      } else {
        setTimeout(() => {
          if (questionIndex + 1 < questions.length) {
            setQuestionIndex(questionIndex + 1);
            loadNewQuestion(questions[questionIndex + 1]);
          }
        }, 1000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, score }),
    });
  
    if (!response.ok) {
      alert("Error al guardar el puntaje");
    } else {
      alert("Puntaje guardado con éxito");
      window.location.href = "/"; // Redirige a la página principal
    }
  };

  return (
    <div className="relative w-screen h-screen bg-dodger-blue-600 flex justify-center items-center p-8">
      <span
        id="questionIndex"
        className="absolute font-semibold text-[10vw] text-dodger-blue-500 -top-16 -left-6 transform -translate-x-3 -translate-y-6"
      >
        {String(questionIndex + 1).padStart(2, "0")}
      </span>
      <div className="absolute top-8 right-8 flex flex-col gap-1">
        {[...Array(lives)].map((_, index) => (
          <div key={index} className="w-4 h-4 bg-razzmatazz-700 rounded-full" />
        ))}
      </div>
      {questions && questions[questionIndex] && (
        <div id="questionContainer" className="flex flex-col justify-start">
          <h1 id="category" className="font-semibold text-xl md:text-3xl">
            {questions[questionIndex]?.category.replace(/_/g, " ")}
          </h1>
          <p className="text-2xl">{questions[questionIndex]?.question?.text}</p>

          <div id="optionsContainer" className="flex flex-col">
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                className={`w-full h-10 rounded-lg mt-2 text-lg px-6 ${
                  selectedAnswer === answer
                    ? isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-dodger-blue-50 text-dodger-blue-600"
                }`}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      )}
      {isGameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-dodger-blue-950 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Juego Terminado</h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Nombre:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </label>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Guardar Puntaje
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;

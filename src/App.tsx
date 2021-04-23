import React, { useState } from 'react';

import { fetchQuizQuestions } from './Api'

// components
import QuestionCard from './components/QuestionCard'

// types
import { Difficulty, QuestionState } from './Api'


type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}


const TOTAL_QUESTIONS = 10


const App = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  // console.log(fetchQuizQuestions(TOTAL_QUETSIONS, Difficulty.EASY))

  const startQuiz = async () => {
    setIsLoading(true)
    setGameOver(false)

    const newQuestinos = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY)
    setQuestions(newQuestinos)
    setScore(0)
    setUserAnswers([])
    setNumber(0)
    setIsLoading(false)
  }

  const checkAnwer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user answer
      const answer = event.currentTarget.value
      // check answer against correct answer
      const correct = questions[number].correct_answer === answer
      // add score if answer is correct
      if (correct) setScore(prev => prev + 1)
      // save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }

      setUserAnswers(prev => [...prev, answerObject])
    }
  }

  const nextQusetion = () => {
    // move to next question
    const nextQuestion = number + 1

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    }
    else {
      setNumber(nextQuestion)
    }
  }

  return (
    <div>
      <h1>Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className={`start`} onClick={startQuiz}>Start Quiz</button>
      ) : null}

      {!gameOver ? <p className={`score`}>Score:</p> : null }
      
      {isLoading && <p>Loading Questions...</p>}
      
      {!isLoading && !gameOver && (
        <QuestionCard 
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnwer}
        />
      )}

      {!gameOver && !isLoading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button className={`next`} onClick={nextQusetion}>Next Question</button>
      ) : null }
      
    </div>
  );
}

export default App;

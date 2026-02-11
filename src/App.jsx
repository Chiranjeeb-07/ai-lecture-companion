import React, { useState } from 'react'
import './App.css?inline'
import { generateSummary, generateQuiz, generateFlashcards } from './services/gemini'

function App() {
  const [lectureNotes, setLectureNotes] = useState('')
  const [summary, setSummary] = useState('')
  const [quiz, setQuiz] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const handleGenerateSummary = async () => {
    if (!lectureNotes.trim()) {
      alert('Please paste your lecture notes first!')
      return
    }

    setLoading(true)
    const result = await generateSummary(lectureNotes)
    setSummary(result)
    setLoading(false)
    setActiveTab('summary')
  }

  const handleGenerateQuiz = async () => {
    setLoading(true)
    const result = await generateQuiz(lectureNotes)
    if (result) {
      setQuiz(result)
    }
    setLoading(false)
    setActiveTab('quiz')
  }

  const handleGenerateFlashcards = async () => {
    setLoading(true)
    const result = await generateFlashcards(lectureNotes)
    if (result) {
      setFlashcards(result)
    }
    setLoading(false)
    setActiveTab('flashcards')
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎓 AI Lecture Companion</h1>
        <p>Powered by Google Gemini AI</p>
      </header>

      <main className="main">
        <div className="input-section">
          <textarea
            className="notes-input"
            placeholder="Paste your lecture notes here..."
            value={lectureNotes}
            onChange={(e) => setLectureNotes(e.target.value)}
            rows="10"
          />
          
          <div className="button-group">
            <button 
              className="btn primary"
              onClick={handleGenerateSummary}
              disabled={loading}
            >
              {loading ? '✨ AI Thinking...' : '🎯 Generate Summary'}
            </button>
            <button 
              className="btn secondary"
              onClick={handleGenerateQuiz}
              disabled={loading || !lectureNotes}
            >
              📝 Generate Quiz
            </button>
            <button 
              className="btn secondary"
              onClick={handleGenerateFlashcards}
              disabled={loading || !lectureNotes}
            >
              🃏 Generate Flashcards
            </button>
            <button 
              className="btn secondary"
              onClick={() => {
                setLectureNotes('')
                setSummary('')
                setQuiz([])
                setFlashcards([])
                setSelectedAnswers({})
              }}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {(summary || quiz.length > 0 || flashcards.length > 0) && (
          <div className="output-section">
            <div className="tab-bar">
              <button 
                className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                📝 Summary
              </button>
              <button 
                className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                ❓ Quiz
              </button>
              <button 
                className={`tab ${activeTab === 'flashcards' ? 'active' : ''}`}
                onClick={() => setActiveTab('flashcards')}
              >
                🃏 Flashcards
              </button>
            </div>

            <div className="content-area">
              {activeTab === 'summary' && summary && (
                <div className="summary-content">
                  <pre>{summary}</pre>
                </div>
              )}
              
              {activeTab === 'quiz' && quiz.length > 0 && (
                <div className="quiz-content">
                  <h3>📋 AI-Generated Quiz</h3>
                  {quiz.map((q, idx) => (
                    <div key={idx} className="quiz-item">
                      <p><strong>Q{idx + 1}:</strong> {q.question}</p>
                      <div className="options">
                        {q.options.map((option, optIdx) => (
                          <label key={optIdx} className="option-label">
                            <input
                              type="radio"
                              name={`q${idx}`}
                              value={optIdx}
                              onChange={() => handleAnswerSelect(idx, optIdx)}
                              checked={selectedAnswers[idx] === optIdx}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                      {selectedAnswers[idx] !== undefined && (
                        <div className={`feedback ${selectedAnswers[idx] === q.correct ? 'correct' : 'incorrect'}`}>
                          {selectedAnswers[idx] === q.correct ? '✅ Correct!' : '❌ Try again!'}
                          <p className="explanation">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'flashcards' && flashcards.length > 0 && (
                <div className="flashcards-content">
                  <div className="flashcard-container">
                    <div 
                      className={`flashcard ${flipped ? 'flipped' : ''}`}
                      onClick={() => setFlipped(!flipped)}
                    >
                      <div className="flashcard-front">
                        <h4>{flashcards[currentCard].term}</h4>
                      </div>
                      <div className="flashcard-back">
                        <p>{flashcards[currentCard].definition}</p>
                      </div>
                    </div>
                    <div className="flashcard-controls">
                      <button 
                        className="btn small"
                        onClick={() => {
                          setCurrentCard(prev => Math.max(0, prev - 1))
                          setFlipped(false)
                        }}
                        disabled={currentCard === 0}
                      >
                        ◀ Previous
                      </button>
                      <span>{currentCard + 1} / {flashcards.length}</span>
                      <button 
                        className="btn small"
                        onClick={() => {
                          setCurrentCard(prev => Math.min(flashcards.length - 1, prev + 1))
                          setFlipped(false)
                        }}
                        disabled={currentCard === flashcards.length - 1}
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with 🧠 using React + Gemini AI</p>
      </footer>
    </div>
  )
}

export default App
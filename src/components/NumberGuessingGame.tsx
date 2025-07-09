import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Trophy, Target, Zap } from 'lucide-react';
import { GameStats } from './GameStats';
import { GameHistory } from './GameHistory';

type GameState = 'playing' | 'won' | 'lost';
type Difficulty = 'easy' | 'medium' | 'hard';

interface GameAttempt {
  guess: number;
  feedback: 'correct' | 'too-low' | 'too-high';
  timestamp: Date;
}

interface GameSession {
  id: string;
  secretNumber: number;
  attempts: GameAttempt[];
  result: 'won' | 'lost';
  difficulty: Difficulty;
  completedAt: Date;
}

const DIFFICULTY_SETTINGS = {
  easy: { range: 10, attempts: 5, points: 10 },
  medium: { range: 50, attempts: 7, points: 25 },
  hard: { range: 100, attempts: 10, points: 50 }
};

export function NumberGuessingGame() {
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<GameAttempt[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState<number>(0);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const currentSettings = DIFFICULTY_SETTINGS[difficulty];
  const attemptsLeft = currentSettings.attempts - attempts.length;

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const generateSecretNumber = () => {
    return Math.floor(Math.random() * currentSettings.range) + 1;
  };

  const startNewGame = () => {
    const newSecretNumber = generateSecretNumber();
    setSecretNumber(newSecretNumber);
    setAttempts([]);
    setGameState('playing');
    setGuess('');
  };

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    
    if (isNaN(numGuess) || numGuess < 1 || numGuess > currentSettings.range) {
      return;
    }

    let feedback: 'correct' | 'too-low' | 'too-high';
    
    if (numGuess === secretNumber) {
      feedback = 'correct';
      setGameState('won');
      const points = Math.max(1, currentSettings.points - attempts.length * 2);
      setScore(prev => prev + points);
    } else if (numGuess < secretNumber) {
      feedback = 'too-low';
    } else {
      feedback = 'too-high';
    }

    const newAttempt: GameAttempt = {
      guess: numGuess,
      feedback,
      timestamp: new Date()
    };

    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);

    if (feedback !== 'correct' && newAttempts.length >= currentSettings.attempts) {
      setGameState('lost');
    }

    // Save game session when game ends
    if (feedback === 'correct' || newAttempts.length >= currentSettings.attempts) {
      const session: GameSession = {
        id: Date.now().toString(),
        secretNumber,
        attempts: newAttempts,
        result: feedback === 'correct' ? 'won' : 'lost',
        difficulty,
        completedAt: new Date()
      };
      setGameHistory(prev => [session, ...prev.slice(0, 9)]); // Keep last 10 games
    }

    setGuess('');
  };

  const getDiceIcon = (number: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[Math.min(number - 1, 5)];
    return <IconComponent className="w-6 h-6" />;
  };

  const getFeedbackColor = (feedback: string) => {
    switch (feedback) {
      case 'correct': return 'text-green-600 bg-green-50 border-green-200';
      case 'too-low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'too-high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFeedbackMessage = (feedback: string) => {
    switch (feedback) {
      case 'correct': return '🎉 Correct!';
      case 'too-low': return '📈 Too low!';
      case 'too-high': return '📉 Too high!';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Number Guessing Game</h1>
                <p className="text-purple-100">Guess the secret number!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-xs text-purple-100">Score</div>
              </div>
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Trophy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Difficulty Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="flex space-x-2">
              {Object.entries(DIFFICULTY_SETTINGS).map(([key, settings]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key as Difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    difficulty === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <span className="block text-xs opacity-75">
                    1-{settings.range} ({settings.attempts} tries)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Range</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">1 - {currentSettings.range}</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Attempts Left</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{attemptsLeft}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Potential Points</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {Math.max(1, currentSettings.points - attempts.length * 2)}
              </div>
            </div>
          </div>

          {/* Game Input */}
          {gameState === 'playing' && (
            <div className="mb-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max={currentSettings.range}
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                    placeholder={`Enter a number between 1 and ${currentSettings.range}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                </div>
                <button
                  onClick={handleGuess}
                  disabled={!guess || isNaN(parseInt(guess))}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Guess
                </button>
              </div>
            </div>
          )}

          {/* Game Result */}
          {gameState !== 'playing' && (
            <div className={`mb-6 p-6 rounded-lg border-2 text-center ${
              gameState === 'won' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="text-4xl mb-2">
                {gameState === 'won' ? '🎉' : '😔'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {gameState === 'won' ? 'Congratulations!' : 'Game Over!'}
              </h2>
              <p className="text-lg mb-4">
                {gameState === 'won' 
                  ? `You guessed it in ${attempts.length} attempt${attempts.length !== 1 ? 's' : ''}!`
                  : `The secret number was ${secretNumber}`
                }
              </p>
              <button
                onClick={startNewGame}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Play Again</span>
              </button>
            </div>
          )}

          {/* Attempts History */}
          {attempts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Attempts</h3>
              <div className="space-y-2">
                {attempts.map((attempt, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${getFeedbackColor(attempt.feedback)}`}
                  >
                    <div className="flex items-center space-x-3">
                      {getDiceIcon(attempt.guess)}
                      <span className="font-medium">Guess #{index + 1}: {attempt.guess}</span>
                    </div>
                    <span className="font-medium">
                      {getFeedbackMessage(attempt.feedback)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={startNewGame}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Game</span>
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Game History
            </button>
          </div>
        </div>
      </div>

      {/* Stats Modal */}
      {showStats && (
        <GameStats
          gameHistory={gameHistory}
          currentScore={score}
          onClose={() => setShowStats(false)}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <GameHistory
          gameHistory={gameHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
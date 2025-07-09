import React from 'react';
import { X, Calendar, Target, Zap, Trophy } from 'lucide-react';
import { format } from 'date-fns';

interface GameSession {
  id: string;
  secretNumber: number;
  attempts: Array<{
    guess: number;
    feedback: 'correct' | 'too-low' | 'too-high';
    timestamp: Date;
  }>;
  result: 'won' | 'lost';
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt: Date;
}

interface GameHistoryProps {
  gameHistory: GameSession[];
  onClose: () => void;
}

export function GameHistory({ gameHistory, onClose }: GameHistoryProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFeedbackIcon = (feedback: string) => {
    switch (feedback) {
      case 'correct': return '✅';
      case 'too-low': return '📈';
      case 'too-high': return '📉';
      default: return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-bold">Game History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {gameHistory.length > 0 ? (
            <div className="space-y-4">
              {gameHistory.map((game) => (
                <div
                  key={game.id}
                  className={`border-2 rounded-lg p-4 ${
                    game.result === 'won' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty.toUpperCase()}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        game.result === 'won' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {game.result === 'won' ? '🏆 WON' : '💔 LOST'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(game.completedAt, 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Secret Number: <strong>{game.secretNumber}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Attempts: <strong>{game.attempts.length}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">
                        Points: <strong>
                          {game.result === 'won' ? Math.max(1, (game.difficulty === 'easy' ? 10 : game.difficulty === 'medium' ? 25 : 50) - game.attempts.length * 2) : 0}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attempt History:</h4>
                    <div className="flex flex-wrap gap-2">
                      {game.attempts.map((attempt, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1 rounded-lg text-sm border ${
                            attempt.feedback === 'correct' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : attempt.feedback === 'too-low'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {getFeedbackIcon(attempt.feedback)} {attempt.guess}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Game History</h3>
              <p>Start playing to build your game history!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
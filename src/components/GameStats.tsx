import React from 'react';
import { X, Trophy, Target, Zap, TrendingUp } from 'lucide-react';

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

interface GameStatsProps {
  gameHistory: GameSession[];
  currentScore: number;
  onClose: () => void;
}

export function GameStats({ gameHistory, currentScore, onClose }: GameStatsProps) {
  const totalGames = gameHistory.length;
  const gamesWon = gameHistory.filter(game => game.result === 'won').length;
  const winRate = totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0;
  
  const averageAttempts = totalGames > 0 
    ? Math.round(gameHistory.reduce((sum, game) => sum + game.attempts.length, 0) / totalGames * 10) / 10
    : 0;

  const difficultyStats = {
    easy: gameHistory.filter(g => g.difficulty === 'easy'),
    medium: gameHistory.filter(g => g.difficulty === 'medium'),
    hard: gameHistory.filter(g => g.difficulty === 'hard')
  };

  const bestStreak = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (const game of gameHistory.reverse()) {
      if (game.result === 'won') {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6" />
            <h2 className="text-xl font-bold">Game Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 text-center">
              <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{currentScore}</div>
              <div className="text-sm text-purple-700">Total Score</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{winRate}%</div>
              <div className="text-sm text-green-700">Win Rate</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{averageAttempts}</div>
              <div className="text-sm text-blue-700">Avg Attempts</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200 text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{bestStreak()}</div>
              <div className="text-sm text-orange-700">Best Streak</div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Performance by Difficulty</h3>
            <div className="space-y-3">
              {Object.entries(difficultyStats).map(([difficulty, games]) => {
                const won = games.filter(g => g.result === 'won').length;
                const total = games.length;
                const rate = total > 0 ? Math.round((won / total) * 100) : 0;
                
                return (
                  <div key={difficulty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        difficulty === 'easy' ? 'bg-green-500' :
                        difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium capitalize">{difficulty}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{won}/{total}</div>
                      <div className="text-sm text-gray-600">{rate}% win rate</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Performance */}
          {gameHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Games</h3>
              <div className="space-y-2">
                {gameHistory.slice(0, 5).map((game, index) => (
                  <div
                    key={game.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      game.result === 'won' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        game.result === 'won' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium capitalize">{game.difficulty}</span>
                      <span className="text-sm text-gray-600">
                        {game.attempts.length} attempts
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        game.result === 'won' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {game.result === 'won' ? 'Won' : 'Lost'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {game.completedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalGames === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No games played yet. Start playing to see your statistics!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
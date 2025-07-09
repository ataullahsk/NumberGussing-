# Java Number Guessing Game

A feature-rich console-based number guessing game implemented in Java with multiple difficulty levels, scoring system, and comprehensive statistics tracking.

## Features

### 🎮 Game Modes
- **Easy**: Guess numbers 1-10 with 5 attempts (10 base points)
- **Medium**: Guess numbers 1-50 with 7 attempts (25 base points)  
- **Hard**: Guess numbers 1-100 with 10 attempts (50 base points)

### 🏆 Scoring System
- Points awarded based on difficulty and performance
- Fewer attempts = higher score
- Minimum 1 point guaranteed for winning
- Cumulative score tracking across sessions

### 📊 Statistics & Analytics
- Win rate calculation
- Average attempts per game
- Performance breakdown by difficulty
- Recent game history
- Comprehensive game session tracking

### 🎯 Enhanced Gameplay
- Input validation and error handling
- Visual feedback with emojis and formatting
- Helpful hints after each incorrect guess
- Detailed game summaries
- Professional console interface

## How to Run

1. **Compile the Java file:**
   ```bash
   javac NumberGuessingGame.java
   ```

2. **Run the game:**
   ```bash
   java NumberGuessingGame
   ```

## Game Rules

1. Choose your difficulty level from the main menu
2. The computer generates a random number within the chosen range
3. You have a limited number of attempts based on difficulty
4. After each guess, you'll receive feedback:
   - 🎉 **CORRECT** - You won!
   - 📈 **TOO LOW** - Guess higher
   - 📉 **TOO HIGH** - Guess lower
5. Points are awarded for winning: `base_points - (attempts_used - 1) * 2`
6. View your statistics and game history anytime

## Code Structure

### Main Classes
- **NumberGuessingGame**: Main game logic and user interface
- **Difficulty**: Enum defining game difficulty settings
- **GameAttempt**: Records individual guess attempts
- **GameSession**: Stores complete game session data

### Key Methods
- `playGame()`: Core game loop for each difficulty
- `showStatistics()`: Comprehensive stats display
- `getValidInput()`: Robust input validation
- `showGameSummary()`: Post-game analysis

## Technical Features

- **Object-Oriented Design**: Clean separation of concerns
- **Error Handling**: Comprehensive input validation
- **Data Persistence**: Session-based game history
- **Enum Usage**: Type-safe difficulty configuration
- **Stream API**: Modern Java features for data processing
- **DateTime Handling**: Timestamp tracking for sessions

## Sample Output

```
🎯 Welcome to the Advanced Number Guessing Game! 🎯
==================================================

🎮 MAIN MENU
Current Score: 0
------------------------------
1. 🟢 Easy (1-10, 5 attempts, 10 points)
2. 🟡 Medium (1-50, 7 attempts, 25 points)
3. 🔴 Hard (1-100, 10 attempts, 50 points)
4. 📊 View Statistics
5. 🚪 Exit
Choose an option (1-5): 
```

This implementation provides a rich, engaging console experience that demonstrates advanced Java programming concepts while maintaining the core fun of the original guessing game.
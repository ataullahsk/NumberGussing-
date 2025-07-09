import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class NumberGuessingGame {
    private static final Scanner scanner = new Scanner(System.in);
    private static final Random random = new Random();
    private static int totalScore = 0;
    private static List<GameSession> gameHistory = new ArrayList<>();
    
    public static void main(String[] args) {
        System.out.println("🎯 Welcome to the Advanced Number Guessing Game! 🎯");
        System.out.println("=" .repeat(50));
        
        boolean playAgain = true;
        while (playAgain) {
            showMainMenu();
            int choice = getValidInput(1, 5);
            
            switch (choice) {
                case 1:
                    playGame(Difficulty.EASY);
                    break;
                case 2:
                    playGame(Difficulty.MEDIUM);
                    break;
                case 3:
                    playGame(Difficulty.HARD);
                    break;
                case 4:
                    showStatistics();
                    break;
                case 5:
                    playAgain = false;
                    System.out.println("Thanks for playing! Final Score: " + totalScore);
                    break;
            }
        }
        scanner.close();
    }
    
    private static void showMainMenu() {
        System.out.println("\n🎮 MAIN MENU");
        System.out.println("Current Score: " + totalScore);
        System.out.println("-".repeat(30));
        System.out.println("1. 🟢 Easy (1-10, 5 attempts, 10 points)");
        System.out.println("2. 🟡 Medium (1-50, 7 attempts, 25 points)");
        System.out.println("3. 🔴 Hard (1-100, 10 attempts, 50 points)");
        System.out.println("4. 📊 View Statistics");
        System.out.println("5. 🚪 Exit");
        System.out.print("Choose an option (1-5): ");
    }
    
    private static void playGame(Difficulty difficulty) {
        System.out.println("\n🎯 Starting " + difficulty.name() + " Game!");
        System.out.println("Range: 1-" + difficulty.range);
        System.out.println("Attempts: " + difficulty.maxAttempts);
        System.out.println("Potential Points: " + difficulty.basePoints);
        System.out.println("-".repeat(40));
        
        int secretNumber = random.nextInt(difficulty.range) + 1;
        List<GameAttempt> attempts = new ArrayList<>();
        boolean won = false;
        
        for (int attemptNum = 1; attemptNum <= difficulty.maxAttempts; attemptNum++) {
            int attemptsLeft = difficulty.maxAttempts - attemptNum + 1;
            System.out.printf("\n📍 Attempt %d/%d (Attempts left: %d)\n", 
                            attemptNum, difficulty.maxAttempts, attemptsLeft);
            System.out.print("Enter your guess (1-" + difficulty.range + "): ");
            
            int guess = getValidInput(1, difficulty.range);
            String feedback;
            String emoji;
            
            if (guess == secretNumber) {
                feedback = "CORRECT";
                emoji = "🎉";
                won = true;
            } else if (guess < secretNumber) {
                feedback = "TOO LOW";
                emoji = "📈";
            } else {
                feedback = "TOO HIGH";
                emoji = "📉";
            }
            
            attempts.add(new GameAttempt(guess, feedback, LocalDateTime.now()));
            System.out.println(emoji + " " + feedback + "!");
            
            if (won) {
                int points = Math.max(1, difficulty.basePoints - (attemptNum - 1) * 2);
                totalScore += points;
                System.out.println("\n🏆 CONGRATULATIONS! You won!");
                System.out.println("✨ Points earned: " + points);
                System.out.println("🎯 Total score: " + totalScore);
                break;
            }
            
            if (attemptNum < difficulty.maxAttempts) {
                System.out.println("💡 Hint: The number is " + 
                    (guess < secretNumber ? "higher" : "lower") + " than " + guess);
            }
        }
        
        if (!won) {
            System.out.println("\n💔 Game Over!");
            System.out.println("🎯 The secret number was: " + secretNumber);
            System.out.println("📊 Total score: " + totalScore);
        }
        
        // Save game session
        GameSession session = new GameSession(
            secretNumber, attempts, won, difficulty, LocalDateTime.now()
        );
        gameHistory.add(session);
        
        showGameSummary(attempts, won, secretNumber);
        
        System.out.print("\nPress Enter to continue...");
        scanner.nextLine();
    }
    
    private static void showGameSummary(List<GameAttempt> attempts, boolean won, int secretNumber) {
        System.out.println("\n📋 GAME SUMMARY");
        System.out.println("-".repeat(30));
        System.out.println("🎯 Secret Number: " + secretNumber);
        System.out.println("🔢 Total Attempts: " + attempts.size());
        System.out.println("🏆 Result: " + (won ? "WON" : "LOST"));
        
        System.out.println("\n📝 Attempt History:");
        for (int i = 0; i < attempts.size(); i++) {
            GameAttempt attempt = attempts.get(i);
            String icon = getAttemptIcon(attempt.feedback);
            System.out.printf("  %d. %s %d - %s\n", 
                i + 1, icon, attempt.guess, attempt.feedback);
        }
    }
    
    private static void showStatistics() {
        System.out.println("\n📊 GAME STATISTICS");
        System.out.println("=".repeat(40));
        
        if (gameHistory.isEmpty()) {
            System.out.println("No games played yet. Start playing to see statistics!");
            return;
        }
        
        // Overall stats
        int totalGames = gameHistory.size();
        int gamesWon = (int) gameHistory.stream().mapToInt(g -> g.won ? 1 : 0).sum();
        double winRate = (double) gamesWon / totalGames * 100;
        double avgAttempts = gameHistory.stream()
            .mapToInt(g -> g.attempts.size())
            .average()
            .orElse(0);
        
        System.out.println("🏆 Total Score: " + totalScore);
        System.out.println("🎮 Games Played: " + totalGames);
        System.out.println("✅ Games Won: " + gamesWon);
        System.out.println("📈 Win Rate: " + String.format("%.1f%%", winRate));
        System.out.println("⚡ Average Attempts: " + String.format("%.1f", avgAttempts));
        
        // Difficulty breakdown
        System.out.println("\n📊 Performance by Difficulty:");
        for (Difficulty diff : Difficulty.values()) {
            List<GameSession> diffGames = gameHistory.stream()
                .filter(g -> g.difficulty == diff)
                .toList();
            
            if (!diffGames.isEmpty()) {
                int diffWon = (int) diffGames.stream().mapToInt(g -> g.won ? 1 : 0).sum();
                double diffWinRate = (double) diffWon / diffGames.size() * 100;
                System.out.printf("  %s %s: %d/%d (%.1f%%)\n", 
                    getDifficultyIcon(diff), diff.name(), 
                    diffWon, diffGames.size(), diffWinRate);
            }
        }
        
        // Recent games
        System.out.println("\n🕒 Recent Games (Last 5):");
        List<GameSession> recentGames = gameHistory.stream()
            .skip(Math.max(0, gameHistory.size() - 5))
            .toList();
        
        for (GameSession game : recentGames) {
            String resultIcon = game.won ? "🏆" : "💔";
            String diffIcon = getDifficultyIcon(game.difficulty);
            System.out.printf("  %s %s %s - %d attempts (%s)\n",
                resultIcon, diffIcon, game.difficulty.name(),
                game.attempts.size(),
                game.completedAt.format(DateTimeFormatter.ofPattern("MMM dd HH:mm")));
        }
        
        System.out.print("\nPress Enter to continue...");
        scanner.nextLine();
    }
    
    private static String getAttemptIcon(String feedback) {
        return switch (feedback) {
            case "CORRECT" -> "✅";
            case "TOO LOW" -> "📈";
            case "TOO HIGH" -> "📉";
            default -> "❓";
        };
    }
    
    private static String getDifficultyIcon(Difficulty difficulty) {
        return switch (difficulty) {
            case EASY -> "🟢";
            case MEDIUM -> "🟡";
            case HARD -> "🔴";
        };
    }
    
    private static int getValidInput(int min, int max) {
        while (true) {
            try {
                int input = scanner.nextInt();
                scanner.nextLine(); // consume newline
                
                if (input >= min && input <= max) {
                    return input;
                } else {
                    System.out.printf("❌ Please enter a number between %d and %d: ", min, max);
                }
            } catch (InputMismatchException e) {
                System.out.print("❌ Invalid input. Please enter a valid number: ");
                scanner.nextLine(); // clear invalid input
            }
        }
    }
}

enum Difficulty {
    EASY(10, 5, 10),
    MEDIUM(50, 7, 25),
    HARD(100, 10, 50);
    
    final int range;
    final int maxAttempts;
    final int basePoints;
    
    Difficulty(int range, int maxAttempts, int basePoints) {
        this.range = range;
        this.maxAttempts = maxAttempts;
        this.basePoints = basePoints;
    }
}

class GameAttempt {
    final int guess;
    final String feedback;
    final LocalDateTime timestamp;
    
    GameAttempt(int guess, String feedback, LocalDateTime timestamp) {
        this.guess = guess;
        this.feedback = feedback;
        this.timestamp = timestamp;
    }
}

class GameSession {
    final int secretNumber;
    final List<GameAttempt> attempts;
    final boolean won;
    final Difficulty difficulty;
    final LocalDateTime completedAt;
    
    GameSession(int secretNumber, List<GameAttempt> attempts, boolean won, 
                Difficulty difficulty, LocalDateTime completedAt) {
        this.secretNumber = secretNumber;
        this.attempts = new ArrayList<>(attempts);
        this.won = won;
        this.difficulty = difficulty;
        this.completedAt = completedAt;
    }
}
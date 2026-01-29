document.addEventListener('DOMContentLoaded', function() {
    // Game Configuration
    const options = ["rock", "paper", "scissors"];
    const winningScore = 5;
    
    // Game State
    let playerScore = 0;
    let computerScore = 0;
    let roundNumber = 1;
    let winStreak = 0;
    let bestStreak = 0;
    let gameHistory = [];
    let totalGames = 0;
    let playerWins = 0;
    let computerWins = 0;
    let autoPlayInterval = null;
    let roundStartTime = 0;
    let roundTimer = null;
    let isGameActive = true;
    
    // Sound Effects (simulated with Web Audio API if available)
    const sounds = {
        win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        lose: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-losing-bleeps-2026.mp3'),
        tie: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-game-emergency-alarm-1000.mp3'),
        click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
        select: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3')
    };
    
    // DOM Elements
    const playerScoreElement = document.getElementById("player-score");
    const computerScoreElement = document.getElementById("computer-score");
    const roundNumberElement = document.getElementById("round-number");
    const resultsMsgElement = document.getElementById("results-msg");
    const winnerMsgElement = document.getElementById("winner-msg");
    const playerChoiceElement = document.getElementById("player-choice");
    const computerChoiceElement = document.getElementById("computer-choice");
    const playerChoiceText = document.getElementById("player-choice-text");
    const computerChoiceText = document.getElementById("computer-choice-text");
    const roundWinnerText = document.getElementById("round-winner");
    const streakCountElement = document.getElementById("streak-count");
    const roundTimeElement = document.getElementById("round-time");
    const totalRoundsElement = document.getElementById("total-rounds");
    const winRateElement = document.getElementById("win-rate");
    const bestStreakElement = document.getElementById("best-streak");
    const historyListElement = document.getElementById("history-list");
    const totalGamesElement = document.getElementById("total-games");
    const playerWinsElement = document.getElementById("player-wins");
    const computerWinsElement = document.getElementById("computer-wins");
    
    // Buttons
    const rockBtn = document.getElementById("rock-btn");
    const paperBtn = document.getElementById("paper-btn");
    const scissorsBtn = document.getElementById("scissors-btn");
    const resetBtn = document.getElementById("reset-btn");
    const autoPlayBtn = document.getElementById("auto-play-btn");
    const hintBtn = document.getElementById("hint-btn");
    const playAgainBtn = document.getElementById("play-again-btn");
    const clearHistoryBtn = document.getElementById("clear-history");
    const soundToggleBtn = document.getElementById("sound-toggle");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const rulesToggleBtn = document.getElementById("rules-toggle");
    
    // Initialize Game
    initGame();
    
    function initGame() {
        // Load saved stats
        loadStats();
        
        // Setup event listeners
        setupEventListeners();
        
        // Start round timer
        startRoundTimer();
        
        // Update UI
        updateScoreDisplay();
        updateStatsDisplay();
        
        // Set initial welcome message
        showWelcomeMessage();
    }
    
    function setupEventListeners() {
        // Choice buttons
        rockBtn.addEventListener("click", () => playRound("rock"));
        paperBtn.addEventListener("click", () => playRound("paper"));
        scissorsBtn.addEventListener("click", () => playRound("scissors"));
        
        // Control buttons
        resetBtn.addEventListener("click", resetGame);
        autoPlayBtn.addEventListener("click", toggleAutoPlay);
        hintBtn.addEventListener("click", showHint);
        playAgainBtn.addEventListener("click", resetGame);
        clearHistoryBtn.addEventListener("click", clearHistory);
        
        // Toggle buttons
        soundToggleBtn.addEventListener("click", toggleSound);
        themeToggleBtn.addEventListener("click", toggleTheme);
        rulesToggleBtn.addEventListener("click", toggleRules);
        
        // View toggle buttons
        document.querySelectorAll(".toggle-btn").forEach(btn => {
            btn.addEventListener("click", () => switchView(btn.dataset.view));
        });
        
        // Choice cards click
        document.querySelectorAll(".choice-card").forEach(card => {
            card.addEventListener("click", function() {
                const choice = this.dataset.choice;
                playRound(choice);
            });
        });
    }
    
    function playRound(playerChoice) {
        if (!isGameActive) return;
        
        // Play click sound
        playSound("click");
        
        // Get computer choice
        const computerChoice = getComputerChoice();
        
        // Determine round result
        const result = determineWinner(playerChoice, computerChoice);
        
        // Update scores
        updateScores(result, playerChoice, computerChoice);
        
        // Update UI
        updateChoiceDisplay(playerChoice, computerChoice);
        updateResultsDisplay(result, playerChoice, computerChoice);
        
        // Add to history
        addToHistory(roundNumber, playerChoice, computerChoice, result);
        
        // Check for game winner
        if (playerScore === winningScore || computerScore === winningScore) {
            endGame();
        } else {
            // Next round
            roundNumber++;
            roundNumberElement.textContent = roundNumber;
            
            // Reset timer for new round
            resetRoundTimer();
        }
        
        // Save stats
        saveStats();
    }
    
    function getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
    }
    
    function determineWinner(player, computer) {
        if (player === computer) return "tie";
        
        const winConditions = {
            rock: "scissors",
            paper: "rock",
            scissors: "paper"
        };
        
        return winConditions[player] === computer ? "win" : "lose";
    }
    
    function updateScores(result, playerChoice, computerChoice) {
        switch(result) {
            case "win":
                playerScore++;
                winStreak++;
                if (winStreak > bestStreak) bestStreak = winStreak;
                playSound("win");
                break;
            case "lose":
                computerScore++;
                winStreak = 0;
                playSound("lose");
                break;
            case "tie":
                playSound("tie");
                break;
        }
        
        updateScoreDisplay();
        updateStreakDisplay();
    }
    
    function updateScoreDisplay() {
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
        
        // Add animation to score that changed
        playerScoreElement.classList.remove("score-update");
        computerScoreElement.classList.remove("score-update");
        
        setTimeout(() => {
            playerScoreElement.classList.add("score-update");
            computerScoreElement.classList.add("score-update");
        }, 10);
    }
    
    function updateChoiceDisplay(playerChoice, computerChoice) {
        // Clear previous choices
        playerChoiceElement.innerHTML = "";
        computerChoiceElement.innerHTML = "";
        
        // Create choice icons
        const playerIcon = createChoiceIcon(playerChoice, "player");
        const computerIcon = createChoiceIcon(computerChoice, "computer");
        
        // Add with animation
        playerChoiceElement.appendChild(playerIcon);
        computerChoiceElement.appendChild(computerIcon);
        
        // Update choice text
        playerChoiceText.textContent = playerChoice.toUpperCase();
        computerChoiceText.textContent = computerChoice.toUpperCase();
        
        // Animate choices
        animateChoice(playerIcon, "player");
        animateChoice(computerIcon, "computer");
    }
    
    function createChoiceIcon(choice, type) {
        const icon = document.createElement("div");
        icon.className = `choice-icon ${choice}`;
        
        const iconMap = {
            rock: "fas fa-hand-rock",
            paper: "fas fa-hand-paper",
            scissors: "fas fa-hand-scissors"
        };
        
        const i = document.createElement("i");
        i.className = iconMap[choice];
        icon.appendChild(i);
        
        return icon;
    }
    
    function animateChoice(element, type) {
        element.style.animation = "none";
        setTimeout(() => {
            element.style.animation = "pulse 0.5s ease";
        }, 10);
        
        // Add special animation for winner
        if (type === "player" && playerScore > parseInt(playerScoreElement.textContent) - 1) {
            element.classList.add("winner-pulse");
            setTimeout(() => {
                element.classList.remove("winner-pulse");
            }, 1000);
        }
    }
    
    function updateResultsDisplay(result, playerChoice, computerChoice) {
        let message = "";
        let roundWinner = "";
        
        switch(result) {
            case "win":
                message = `🎉 You win! ${capitalize(playerChoice)} beats ${computerChoice}`;
                roundWinner = "Player";
                resultsMsgElement.style.color = "var(--success)";
                break;
            case "lose":
                message = `😞 Computer wins! ${capitalize(computerChoice)} beats ${playerChoice}`;
                roundWinner = "Computer";
                resultsMsgElement.style.color = "var(--danger)";
                break;
            case "tie":
                message = `🤝 It's a tie! Both chose ${playerChoice}`;
                roundWinner = "Tie";
                resultsMsgElement.style.color = "var(--warning)";
                break;
        }
        
        resultsMsgElement.innerHTML = `
            <div class="result-animation">
                <i class="fas fa-${result === 'win' ? 'trophy' : result === 'lose' ? 'robot' : 'handshake'}"></i>
                <h3>${message}</h3>
            </div>
        `;
        
        roundWinnerText.textContent = roundWinner;
        roundWinnerText.style.color = result === "win" ? "var(--success)" : 
                                     result === "lose" ? "var(--danger)" : 
                                     "var(--warning)";
    }
    
    function addToHistory(round, player, computer, result) {
        const historyItem = {
            round,
            player,
            computer,
            result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        gameHistory.unshift(historyItem); // Add to beginning
        
        // Update history display
        updateHistoryDisplay();
        
        // Keep only last 20 items
        if (gameHistory.length > 20) {
            gameHistory.pop();
        }
    }
    
    function updateHistoryDisplay() {
        historyListElement.innerHTML = "";
        
        gameHistory.forEach(item => {
            const historyItem = document.createElement("div");
            historyItem.className = "history-item";
            
            const resultClass = {
                win: "win",
                lose: "lose",
                tie: "tie"
            }[item.result];
            
            historyItem.innerHTML = `
                <div class="history-round">Round ${item.round}</div>
                <div class="history-choices">
                    <span class="player-choice">${item.player.toUpperCase()}</span>
                    <i class="fas fa-vs"></i>
                    <span class="computer-choice">${item.computer.toUpperCase()}</span>
                </div>
                <div class="history-result ${resultClass}">
                    ${item.result.toUpperCase()}
                </div>
            `;
            
            historyListElement.appendChild(historyItem);
        });
    }
    
    function clearHistory() {
        if (confirm("Clear all game history?")) {
            gameHistory = [];
            updateHistoryDisplay();
            saveStats();
        }
    }
    
    function showHint() {
        if (!isGameActive) return;
        
        // Simple hint logic: suggest counter to most common computer choice
        const lastComputerChoices = gameHistory.slice(0, 5).map(item => item.computer);
        
        if (lastComputerChoices.length === 0) {
            showMessage("No data yet. Play a few rounds first!", "info");
            return;
        }
        
        // Count frequencies
        const frequency = { rock: 0, paper: 0, scissors: 0 };
        lastComputerChoices.forEach(choice => frequency[choice]++);
        
        // Find most common
        let mostCommon = "rock";
        let maxCount = 0;
        
        for (const [choice, count] of Object.entries(frequency)) {
            if (count > maxCount) {
                mostCommon = choice;
                maxCount = count;
            }
        }
        
        // Suggest counter
        const counters = {
            rock: "paper",
            paper: "scissors",
            scissors: "rock"
        };
        
        const suggestion = counters[mostCommon];
        
        showMessage(`🤔 Hint: Computer often chooses ${mostCommon}. Try ${suggestion.toUpperCase()}!`, "info");
        
        // Highlight suggested choice
        highlightChoice(suggestion);
    }
    
    function highlightChoice(choice) {
        // Remove previous highlights
        document.querySelectorAll(".choice-card").forEach(card => {
            card.classList.remove("suggested");
        });
        
        // Add highlight to suggested choice
        const suggestedCard = document.querySelector(`.choice-card[data-choice="${choice}"]`);
        if (suggestedCard) {
            suggestedCard.classList.add("suggested");
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                suggestedCard.classList.remove("suggested");
            }, 3000);
        }
    }
    
    function showMessage(message, type = "info") {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = message;
        
        // Remove existing messages
        document.querySelectorAll(".message").forEach(msg => msg.remove());
        
        // Add new message
        resultsMsgElement.innerHTML = "";
        resultsMsgElement.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    function showWelcomeMessage() {
        resultsMsgElement.innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-hand-peace"></i>
                <h3>Welcome to the Arena!</h3>
                <p>Choose your weapon to start the battle. First player to ${winningScore} wins takes the crown!</p>
            </div>
        `;
    }
    
    function toggleAutoPlay() {
        if (autoPlayInterval) {
            // Stop auto play
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            autoPlayBtn.classList.remove("active");
            autoPlayBtn.innerHTML = '<i class="fas fa-robot"></i> Auto Play';
            isGameActive = true;
        } else {
            // Start auto play
            autoPlayBtn.classList.add("active");
            autoPlayBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto';
            isGameActive = false;
            
            autoPlayInterval = setInterval(() => {
                if (playerScore < winningScore && computerScore < winningScore) {
                    const randomChoice = options[Math.floor(Math.random() * options.length)];
                    playRound(randomChoice);
                } else {
                    toggleAutoPlay(); // Stop when game ends
                }
            }, 1500);
        }
    }
    
    function endGame() {
        isGameActive = false;
        
        // Determine winner
        const winner = playerScore === winningScore ? "player" : "computer";
        const winnerName = winner === "player" ? "Player" : "Computer";
        
        // Update stats
        totalGames++;
        if (winner === "player") playerWins++;
        else computerWins++;
        
        // Calculate win rate
        const winRate = totalGames > 0 ? Math.round((playerWins / totalGames) * 100) : 0;
        
        // Show winner announcement
        winnerMsgElement.style.display = "block";
        document.getElementById("winner-text").textContent = `${winnerName} Wins the Game!`;
        document.getElementById("winner-details").textContent = 
            winner === "player" 
                ? "Congratulations! You've defeated the computer and claimed the arena crown!" 
                : "The computer has outsmarted you this time. Try again to claim victory!";
        
        // Update winner stats
        totalRoundsElement.textContent = roundNumber - 1;
        winRateElement.textContent = `${winRate}%`;
        bestStreakElement.textContent = bestStreak;
        
        // Play winner sound
        playSound(winner === "player" ? "win" : "lose");
        
        // Update global stats display
        updateStatsDisplay();
        
        // Save stats
        saveStats();
    }
    
    function resetGame() {
        // Reset game state
        playerScore = 0;
        computerScore = 0;
        roundNumber = 1;
        winStreak = 0;
        isGameActive = true;
        
        // Stop auto play if active
        if (autoPlayInterval) {
            toggleAutoPlay();
        }
        
        // Reset UI
        updateScoreDisplay();
        roundNumberElement.textContent = roundNumber;
        winnerMsgElement.style.display = "none";
        
        // Reset choice displays
        playerChoiceElement.innerHTML = '<div class="choice-placeholder">?</div>';
        computerChoiceElement.innerHTML = '<div class="choice-placeholder">?</div>';
        playerChoiceText.textContent = "-";
        computerChoiceText.textContent = "-";
        roundWinnerText.textContent = "-";
        
        // Reset timer
        resetRoundTimer();
        
        // Show welcome message
        showWelcomeMessage();
        
        // Re-enable choice buttons
        document.querySelectorAll(".choice-btn").forEach(btn => {
            btn.disabled = false;
        });
    }
    
    function startRoundTimer() {
        roundStartTime = Date.now();
        roundTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - roundStartTime) / 1000);
            roundTimeElement.textContent = `${elapsed}s`;
        }, 1000);
    }
    
    function resetRoundTimer() {
        clearInterval(roundTimer);
        roundStartTime = Date.now();
        roundTimeElement.textContent = "0s";
        roundTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - roundStartTime) / 1000);
            roundTimeElement.textContent = `${elapsed}s`;
        }, 1000);
    }
    
    function updateStreakDisplay() {
        streakCountElement.textContent = winStreak;
        
        // Add animation for streak increase
        if (winStreak > 0) {
            streakCountElement.classList.add("streak-up");
            setTimeout(() => {
                streakCountElement.classList.remove("streak-up");
            }, 300);
        }
    }
    
    function updateStatsDisplay() {
        totalGamesElement.textContent = totalGames;
        playerWinsElement.textContent = playerWins;
        computerWinsElement.textContent = computerWins;
    }
    
    function switchView(view) {
        // Update toggle buttons
        document.querySelectorAll(".toggle-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.view === view);
        });
        
        // Show/hide views
        document.querySelectorAll(".result-view").forEach(viewElement => {
            viewElement.classList.toggle("active", viewElement.id === `${view}-result`);
        });
    }
    
    function toggleSound() {
        const isMuted = soundToggleBtn.classList.toggle("muted");
        
        if (isMuted) {
            soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Sound';
            // Mute all sounds
            Object.values(sounds).forEach(sound => {
                sound.muted = true;
            });
        } else {
            soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i> Sound';
            // Unmute all sounds
            Object.values(sounds).forEach(sound => {
                sound.muted = false;
            });
        }
    }
    
    function toggleTheme() {
        const isDark = document.body.classList.toggle("light-theme");
        
        if (isDark) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Theme';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Theme';
        }
    }
    
    function toggleRules() {
        const rulesContent = document.getElementById("rules-content");
        const rulesToggle = document.getElementById("rules-toggle");
        
        rulesContent.classList.toggle("active");
        rulesToggle.classList.toggle("active");
        
        // Change icon
        const icon = rulesToggle.querySelector("i");
        icon.className = rulesContent.classList.contains("active") 
            ? "fas fa-chevron-up" 
            : "fas fa-chevron-down";
    }
    
    function playSound(type) {
        // Check if sounds are muted
        if (soundToggleBtn.classList.contains("muted")) return;
        
        const sound = sounds[type];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed:", e));
        }
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Local Storage Functions
    function saveStats() {
        const stats = {
            totalGames,
            playerWins,
            computerWins,
            bestStreak,
            gameHistory,
            lastPlayed: new Date().toISOString()
        };
        
        localStorage.setItem("rpsStats", JSON.stringify(stats));
    }
    
    function loadStats() {
        const savedStats = localStorage.getItem("rpsStats");
        
        if (savedStats) {
            try {
                const stats = JSON.parse(savedStats);
                totalGames = stats.totalGames || 0;
                playerWins = stats.playerWins || 0;
                computerWins = stats.computerWins || 0;
                bestStreak = stats.bestStreak || 0;
                gameHistory = stats.gameHistory || [];
                
                // Update history display
                updateHistoryDisplay();
            } catch (e) {
                console.log("Error loading stats:", e);
            }
        }
    }
    
    // Initialize CSS animations
    function initAnimations() {
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .score-update {
                animation: scorePulse 0.5s ease;
            }
            
            @keyframes scorePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .streak-up {
                animation: streakPulse 0.3s ease;
                color: var(--accent) !important;
            }
            
            @keyframes streakPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
            
            .winner-pulse {
                animation: winnerGlow 1s ease infinite alternate;
            }
            
            @keyframes winnerGlow {
                from { box-shadow: 0 0 10px rgba(0, 184, 148, 0.5); }
                to { box-shadow: 0 0 30px rgba(0, 184, 148, 0.8); }
            }
            
            .choice-card.suggested {
                animation: suggestPulse 1s ease infinite alternate;
                border-color: var(--warning) !important;
            }
            
            @keyframes suggestPulse {
                from { box-shadow: 0 5px 15px rgba(253, 203, 110, 0.3); }
                to { box-shadow: 0 10px 30px rgba(253, 203, 110, 0.6); }
            }
            
            .message {
                padding: 15px;
                border-radius: 10px;
                margin: 10px 0;
                text-align: center;
                animation: slideIn 0.3s ease;
            }
            
            .message.info {
                background: rgba(0, 206, 201, 0.2);
                border: 1px solid var(--secondary);
                color: var(--secondary);
            }
            
            .light-theme {
                --dark: #dfe6e9;
                --dark-alt: #f5f6fa;
                --light: #2d3436;
                --light-alt: #353b48;
                --gray-light: #636e72;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize animations
    initAnimations();
});
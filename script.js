// ============================================
// Kuji Lottery - Production Quality JavaScript
// ============================================

/**
 * Main Kuji Game Controller
 * Handles game logic, animations, and reward management
 */
class KujiGame {
    constructor() {
        // Game state
        this.rewards = [];
        this.isAnimating = false;
        this.isGameOver = false;
        this.currentRewardIndex = -1;

        // DOM elements
        this.card = document.getElementById('card');
        this.cardInner = document.getElementById('card-inner');
        this.cardWrapper = document.getElementById('card-wrapper');
        this.rewardDisplay = document.getElementById('reward-display');
        this.rewardText = document.getElementById('reward-text');
        this.instructions = document.getElementById('instructions');
        this.gameOverContainer = document.getElementById('game-over-container');
        this.restartButton = document.getElementById('restart-button');

        // Audio elements
        this.pageturnAudio = document.getElementById('pageturn-audio');
        this.fireworksAudio = document.getElementById('fireworks-audio');

        // Reward pool configuration
        this.rewardPool = {
            'SSS상': 2,
            'SS상': 2,
            'A상': 8,
            'B상': 2,
            'C상': 16,
            'D상': 16,
            'E상': 16,
            'F상': 16
        };

        // Initialize game
        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        this.createRewardPool();
        this.attachEventListeners();
    }

    /**
     * Create reward pool using Fisher-Yates shuffle algorithm
     */
    createRewardPool() {
        this.rewards = [];

        // Build flat reward array
        for (const [reward, count] of Object.entries(this.rewardPool)) {
            for (let i = 0; i < count; i++) {
                this.rewards.push(reward);
            }
        }

        // Fisher-Yates shuffle algorithm
        for (let i = this.rewards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.rewards[i], this.rewards[j]] = [this.rewards[j], this.rewards[i]];
        }

        console.log('Reward pool created and shuffled:', this.rewards);
        this.resetCardState();
        this.spawnCard();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.cardWrapper.addEventListener('click', () => this.handleCardClick());
        this.restartButton.addEventListener('click', () => this.restart());

        // Prevent double-click during animation
        this.cardWrapper.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Handle card click event
     */
    handleCardClick() {
        // Prevent interaction during animation or when game is over
        if (this.isAnimating || this.isGameOver) {
            return;
        }

        // If card is already flipped, reset for next reward
        if (this.cardInner.classList.contains('flipped')) {
            this.resetCardState();
            return;
        }

        // Flip card to reveal reward
        this.flipCard();
    }

    /**
     * Flip card with animation and reveal reward
     */
    flipCard() {
        this.isAnimating = true;
        this.cardWrapper.classList.add('disabled');

        // Play page turn sound
        this.playSound(this.pageturmAudio);

        // Perform 3D flip animation
        setTimeout(() => {
            this.cardInner.classList.add('flipped');
        }, 50);

        // Reveal reward after flip completes
        setTimeout(() => {
            this.revealReward();
        }, 700);
    }

    /**
     * Reveal reward and show effects
     */
    revealReward() {
        // Check if rewards are exhausted
        if (this.rewards.length === 0) {
            this.endGame();
            this.isAnimating = false;
            this.cardWrapper.classList.remove('disabled');
            return;
        }

        // Get next reward
        this.currentRewardIndex = this.rewards.length - 1;
        const reward = this.rewards.pop();

        // Display reward
        this.rewardText.textContent = reward;

        // Play effects based on reward type
        this.playRewardEffect(reward);

        this.isAnimating = false;
        this.cardWrapper.classList.remove('disabled');
    }

    /**
     * Play reward-specific effects
     */
    playRewardEffect(reward) {
        switch (reward) {
            case 'SSS상':
                this.playRewardEffect_SSS();
                break;
            case 'SS상':
                this.playRewardEffect_SS();
                break;
            case 'A상':
                this.playRewardEffect_A();
                break;
            case 'B상':
                this.playRewardEffect_B();
                break;
            // C, D, E, F have no confetti
            default:
                break;
        }
    }

    /**
     * SSS Reward: Rainbow confetti + Golden glow + Strong pop + Fireworks
     */
    playRewardEffect_SSS() {
        // Add golden glow
        this.rewardDisplay.classList.add('glow-golden');
        this.removeGlowAfterAnimation();

        // Play fireworks sound
        this.playSound(this.fireworksAudio);

        // Rainbow confetti (large)
        const duration = 3000;
        const end = Date.now() + duration;

        const rainbowColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 250,
                angle: Math.random() * 360,
                spread: 160,
                velocity: Math.random() * 50 + 40,
                colors: rainbowColors,
                size: Math.random() * 3 + 2,
                gravity: 1
            });
        }, 50);
    }

    /**
     * SS Reward: Large confetti + Red glow + Fireworks
     */
    playRewardEffect_SS() {
        // Add red glow
        this.rewardDisplay.classList.add('glow-red');
        this.removeGlowAfterAnimation();

        // Play fireworks sound
        this.playSound(this.fireworksAudio);

        // Large confetti
        const duration = 2500;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 2,
                angle: Math.random() * 360,
                spread: 50,
                velocity: Math.random() * 40 + 30,
                colors: ['#ff0000', '#ffff00', '#00ff00'],
                size: Math.random() * 2.5 + 1.5,
                gravity: 1
            });
        }, 70);
    }

    /**
     * A Reward: Medium confetti
     */
    playRewardEffect_A() {
        const duration = 1500;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 1,
                angle: Math.random() * 360,
                spread: 45,
                velocity: Math.random() * 25 + 20,
                colors: ['#667eea', '#764ba2'],
                size: Math.random() * 1.5 + 1,
                gravity: 0.8
            });
        }, 100);
    }

    /**
     * B Reward: Small confetti
     */
    playRewardEffect_B() {
        const duration = 1000;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 1,
                angle: Math.random() * 360,
                spread: 30,
                velocity: Math.random() * 15 + 10,
                colors: ['#667eea', '#764ba2'],
                size: Math.random() * 0.8 + 0.5,
                gravity: 0.5
            });
        }, 150);
    }

    /**
     * Remove glow effect after animation
     */
    removeGlowAfterAnimation() {
        setTimeout(() => {
            this.rewardDisplay.classList.remove('glow-golden');
            this.rewardDisplay.classList.remove('glow-red');
        }, 1500);
    }

    /**
     * Reset card to front state
     */
    resetCardState() {
        this.cardInner.classList.remove('flipped');
        this.rewardText.textContent = '';
        this.rewardDisplay.classList.remove('glow-golden', 'glow-red');

    


    endGame() {
        this.isGameOver = true;
        this.gameOverContainer.style.display = 'block';
        this.instructions.style.display = 'none';
        this.card.style.display = 'none';
        this.restartButton.style.display = 'block';

        console.log('Game Over! All rewards exhausted.');
    }

    /**
     * Restart the game
     */
    restart() {
        // Reset game state
        this.isGameOver = false;
        this.isAnimating = false;
        this.currentRewardIndex = -1;

        // Reset UI
        this.gameOverContainer.style.display = 'none';
        this.instructions.style.display = 'block';
        this.card.style.display = 'block';
        this.restartButton.style.display = 'none';

        // Reset card
        this.resetCardState();

        // Create new reward pool
        this.createRewardPool();

        console.log('Game restarted!');
    }

    /**
     * Play audio with error handling
     */
    playSound(audioElement) {
        if (!audioElement) return;

        // Reset audio to beginning
        audioElement.currentTime = 0;

        // Play with error handling
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn('Audio playback failed:', error);
            });
        }
    }
}

// ============================================
// Initialize Game on DOM Ready
// ============================================

/**
 * Wait for DOM to be fully loaded before initializing
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎰 Kuji Lottery Game Starting...');
    window.kujiGame = new KujiGame();
    console.log('✅ Game initialized successfully!');
});

/**
 * Handle page unload
 */
window.addEventListener('beforeunload', () => {
    console.log('Kuji Lottery Game Closing...');
});

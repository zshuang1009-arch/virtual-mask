class ObstacleSystem {
    constructor() {
        this.obstacles = [];
        this.maxObstacles = 50;
        this.isGameOver = false;
        this.audioContext = null;
        this.enabled = false;
        this.init();
    }

    init() {
        this.addGlobalStyles();
        this.initAudio();
        this.loadObstaclesFromStorage();
        this.setupClickHandler();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioContext.suspend();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playSound(soundName) {
        if (!this.audioContext) return;
        
        const soundPaths = {
            begin: 'sound/begin.mp3',
            click: 'sound/click.mp3',
            obstacle: 'sound/obstacle.wav'
        };
        
        const path = soundPaths[soundName];
        if (!path) return;
        
        fetch(path)
            .then(response => response.arrayBuffer())
            .then(buffer => this.audioContext.decodeAudioData(buffer))
            .then(audioBuffer => {
                const source = this.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.audioContext.destination);
                source.start(0);
            })
            .catch(e => console.warn('Failed to play sound:', e));
    }

    addGlobalStyles() {
        if (document.getElementById('obstacle-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'obstacle-styles';
        style.textContent = `
            .obstacle {
                position: fixed;
                pointer-events: auto;
                cursor: pointer;
                z-index: 1000;
                transition: none;
                will-change: transform;
            }

            .obstacle-entering {
                animation: enterFromEdge 0.8s ease-out forwards;
            }

            .obstacle-floating {
                animation: float 4s ease-in-out infinite;
            }

            .obstacle-exiting {
                animation: exit 0.3s ease-out forwards;
            }

            @keyframes enterFromEdge {
                0% {
                    opacity: 0;
                    transform: scale(0.3);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(10px, -15px) rotate(5deg);
                }
                50% {
                    transform: translate(-5px, -20px) rotate(-3deg);
                }
                75% {
                    transform: translate(15px, -5px) rotate(2deg);
                }
            }

            @keyframes exit {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) rotate(180deg);
                }
            }

            .game-over-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }

            .game-over-text {
                font-size: 48px;
                color: #ff4444;
                font-weight: bold;
                text-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
                animation: pulse 1s ease-in-out infinite;
            }

            .game-over-subtitle {
                font-size: 18px;
                color: #ffffff;
                margin-top: 20px;
                opacity: 0.7;
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.7;
                    transform: scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupClickHandler() {
        document.addEventListener('click', (e) => {
            if (this.isGameOver) return;
            
            this.resumeAudioContext();
            
            if (this.playBeginOnFirstClick) {
                this.playSound('begin');
                this.playBeginOnFirstClick = false;
            }
        });
    }

    addObstacle(fromStorage = false, savedData = null) {
        return;
    }

    startRandomMovement(obstacle) {
        return;
    }

    removeObstacle(obstacle) {
        return;
    }

    saveObstaclesToStorage() {
        localStorage.removeItem('obstacles');
        localStorage.removeItem('obstacleGameOver');
    }

    loadObstaclesFromStorage() {
        try {
            const hasVisited = localStorage.getItem('obstaclesVisited');
            
            if (!hasVisited) {
                localStorage.setItem('obstaclesVisited', 'true');
                this.playBeginOnFirstClick = true;
            }
            
            localStorage.removeItem('obstacles');
            localStorage.removeItem('obstacleGameOver');
        } catch (e) {
            console.error('Failed to load obstacles:', e);
        }
    }

    getRotation(transform) {
        if (!transform) return 0;
        const match = transform.match(/rotate\(([-\d.]+)deg\)/);
        return match ? parseFloat(match[1]) : 0;
    }

    showGameOver() {
        return;
    }

    reset() {
        localStorage.removeItem('obstacles');
        localStorage.removeItem('obstacleGameOver');
    }

    clearAll() {
        localStorage.removeItem('obstacles');
        localStorage.removeItem('obstacleGameOver');
        
        const overlay = document.querySelector('.game-over-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.obstacleSystem = new ObstacleSystem();
});

window.addEventListener('beforeunload', () => {
    if (window.obstacleSystem) {
        window.obstacleSystem.saveObstaclesToStorage();
    }
});

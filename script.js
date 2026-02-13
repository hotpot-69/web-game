// 1. Particle Background System
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#00f2ff' : '#ff00ea';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();

// 2. Digital Clock & Audio Control
function updateClock() {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                    now.getMinutes().toString().padStart(2, '0') + ":" + 
                    now.getSeconds().toString().padStart(2, '0');
    document.getElementById('digital-clock').innerText = timeStr;
}
setInterval(updateClock, 1000);

// Audio control functions
let musicEnabled = localStorage.getItem('wadgamesMusic') !== 'false';

function startArcadeMusic() {
    const arcadeMusic = document.getElementById('arcadeMusic');
    if (arcadeMusic) {
        arcadeMusic.volume = 0.4;
        arcadeMusic.muted = false;
        arcadeMusic.currentTime = 0; // Reset to beginning
        const playPromise = arcadeMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('✓ Audio playing');
            }).catch(error => {
                console.log('✗ Audio playback failed:', error);
            });
        }
    }
}

function stopArcadeMusic() {
    const arcadeMusic = document.getElementById('arcadeMusic');
    if (arcadeMusic) {
        arcadeMusic.pause();
        arcadeMusic.muted = true;
    }
}

// Set up audio controls
document.addEventListener('DOMContentLoaded', () => {
    const audioToggle = document.getElementById('audioToggle');
    const arcadeMusic = document.getElementById('arcadeMusic');
    
    function updateAudioButton() {
        if (audioToggle) {
            audioToggle.textContent = musicEnabled ? '🔊' : '🔇';
        }
    }
    
    updateAudioButton();
    
    // Audio toggle button in header
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            musicEnabled = !musicEnabled;
            localStorage.setItem('wadgamesMusic', musicEnabled);
            updateAudioButton();
            
            if (musicEnabled) {
                startArcadeMusic();
            } else {
                stopArcadeMusic();
            }
        });
    }
    
    // Auto-start music if enabled
    if (musicEnabled) {
        startArcadeMusic();
    }
    
    // Fallback: Let any click on the page start music if it's paused
    let audioStarted = musicEnabled;
    document.addEventListener('click', () => {
        if (!audioStarted && musicEnabled && arcadeMusic && arcadeMusic.paused) {
            startArcadeMusic();
            audioStarted = true;
        }
    });
});

// 3. Arcade Intro Sequence with Background Music
window.addEventListener('load', () => {
    const bootSequence = document.getElementById('boot-sequence');
    const arcadeTitle = document.getElementById('arcade-title');
    const loader = document.getElementById('loader');
    
    // Try to start music if enabled
    if (musicEnabled) {
        startArcadeMusic();
    }
    
    // Simulate boot sequence delay
    setTimeout(() => {
        if (bootSequence) bootSequence.style.display = 'none';
        if (arcadeTitle) arcadeTitle.style.display = 'block';
    }, 2000);
    
    // Fade out loader
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }, 4500);
});

// 4. Console log easter egg
console.log("%c WAD GAMES INITIALIZED ", "background: #00f2ff; color: #000; font-weight: bold;");
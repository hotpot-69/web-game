const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const checkpointElement = document.getElementById('checkpoint');
const modal = document.getElementById('decision-modal');
const studyMessage = document.getElementById('study-message');
const dumpling = document.getElementById('flying-dumpling');
const music = document.getElementById('bg-music');

context.scale(20, 20);

const colors = [null, '#E03C31', '#FFD700', '#00A86B', '#F4C2C2', '#800020', '#FF8C00', '#FFFFFF'];
let arena = createMatrix(12, 20);
let player = { pos: {x: 0, y: 0}, matrix: null, score: 0 };
let currentCheckpoint = 0;
let isPaused = true;
let dropCounter = 0;
let lastTime = 0;

function startGame() {
    document.getElementById('start-overlay').style.display = 'none';
    isPaused = false;
    music.play().catch(() => console.log("Music blocked until interaction"));
    playerReset();
    update();
}

function createMatrix(w, h) {
    const m = [];
    while (h--) m.push(new Array(w).fill(0));
    return m;
}

function createPiece(type) {
    if (type === 'I') return [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
    if (type === 'L') return [[0,2,0],[0,2,0],[0,2,2]];
    if (type === 'J') return [[0,3,0],[0,3,0],[3,3,0]];
    if (type === 'O') return [[4,4],[4,4]];
    if (type === 'Z') return [[5,5,0],[0,5,5],[0,0,0]];
    if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
    if (type === 'T') return [[0,7,0],[7,7,7],[0,0,0]];
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.strokeStyle = '#D4AF37';
                context.lineWidth = 0.05;
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#1a0101';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) return true;
        }
    }
    return false;
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
    dir > 0 ? matrix.forEach(row => row.reverse()) : matrix.reverse();
}

function updateScore(pts) {
    const oldScore = player.score;
    player.score += pts;
    scoreElement.innerText = player.score;
    if (Math.floor(player.score / 50) > Math.floor(oldScore / 50)) {
        currentCheckpoint = Math.floor(player.score / 50) * 50;
        checkpointElement.innerText = currentCheckpoint;
        studyMessage.style.display = 'block';
        setTimeout(() => studyMessage.style.display = 'none', 2000);
        dumpling.classList.remove('throw-animation');
        void dumpling.offsetWidth;
        dumpling.classList.add('throw-animation');
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore(1);
    }
    dropCounter = 0;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }
        arena.unshift(arena.splice(y, 1)[0].fill(0));
        ++y;
        updateScore(rowCount * 20);
        rowCount *= 2;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        isPaused = true;
        modal.style.display = 'block';
    }
}

document.getElementById('btn-continue').onclick = () => {
    arena.forEach(row => row.fill(0));
    player.score = currentCheckpoint;
    scoreElement.innerText = player.score;
    modal.style.display = 'none';
    isPaused = false;
};

document.getElementById('btn-quit').onclick = () => {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    currentCheckpoint = 0;
    scoreElement.innerText = 0;
    checkpointElement.innerText = 0;
    modal.style.display = 'none';
    isPaused = false;
};

function update(time = 0) {
    if (!isPaused) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > 400) playerDrop();
        draw();
        requestAnimationFrame(update);
    }
}

document.addEventListener('keydown', event => {
    if (isPaused) return;
    if (event.keyCode === 37) { player.pos.x--; if(collide(arena, player)) player.pos.x++; }
    if (event.keyCode === 39) { player.pos.x++; if(collide(arena, player)) player.pos.x--; }
    if (event.keyCode === 40) { playerDrop(); updateScore(1); }
    if (event.keyCode === 38) { 
        rotate(player.matrix, 1);
        if(collide(arena, player)) rotate(player.matrix, -1);
    }
    if (event.keyCode === 32) {
        let d = 0;
        while(!collide(arena, player)) { player.pos.y++; d++; }
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore(d * 2);
    }
});
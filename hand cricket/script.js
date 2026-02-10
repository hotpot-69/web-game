let playerRuns = 0, cpuRuns = 0, target = 0;
let isBatting = true, isGameOver = false, canPlay = false;

function flipCoin() {
    const coin = document.getElementById('coin');
    const isHeads = Math.random() < 0.5;
    coin.classList.remove('spin-heads', 'spin-tails');
    setTimeout(() => {
        coin.classList.add(isHeads ? 'spin-heads' : 'spin-tails');
    }, 10);
    
    document.getElementById('commentary').innerText = "The coin is spinning...";
    
    setTimeout(() => {
        document.getElementById('toss-area').style.display = 'none';
        document.getElementById('game-controls').classList.remove('disabled');
        document.getElementById('commentary').innerText = isHeads ? "ENG won! Batting first." : "AUS won! Batting first.";
        canPlay = true;
    }, 2100);
}

function play(pMove) {
    if (!canPlay || isGameOver) return;
    const cpuMove = [1, 2, 3, 4, 6][Math.floor(Math.random() * 5)];
    const comm = document.getElementById('commentary');

    triggerSim(pMove, cpuMove);

    if (isBatting) {
        if (pMove === 'leave') {
            updateUI("🛡️", cpuMove);
            comm.innerText = "Solid leave.";
        } else if (pMove === cpuMove) {
            handleWicket();
        } else {
            playerRuns += pMove;
            updateUI(pMove, cpuMove);
            comm.innerText = pMove === 6 ? "SIXXXX!" : `${pMove} runs.`;
        }
    } else {
        if (pMove === cpuMove) {
            handleWicket();
        } else {
            cpuRuns += cpuMove;
            updateUI(pMove, cpuMove);
            comm.innerText = `CPU scores ${cpuMove}. Target: ${target - cpuRuns}`;
            if (cpuRuns >= target) endGame("AUSTRALIA WIN THE ASHES!");
        }
    }
}

function triggerSim(p, c) {
    if (p === c && p !== 'leave') {
        document.getElementById('stumps').style.transform = "rotate(90deg) translate(5px, -5px)";
        document.getElementById('stumps').style.color = "#d32f2f";
    } else if (typeof p === 'number') {
        document.getElementById('run-text').classList.add('run-active');
        document.getElementById('batter-sim').style.left = "70%";
        document.getElementById('runner-sim').style.right = "70%";
        setTimeout(() => {
            document.getElementById('run-text').classList.remove('run-active');
            document.getElementById('batter-sim').style.left = "10%";
            document.getElementById('runner-sim').style.right = "10%";
        }, 800);
    }
}

function handleWicket() {
    if (isBatting) {
        document.getElementById('commentary').innerText = "OUT!";
        target = playerRuns + 1;
        document.getElementById('target-runs').innerText = target;
        document.getElementById('target-ui').style.opacity = "1";
        document.getElementById('role-tag').innerText = "FINISHED";
        canPlay = false;
        document.getElementById('next-innings-btn').style.display = "block";
    } else {
        endGame("BOWLED HIM! England win the Ashes!");
    }
}

function startSecondInnings() {
    isBatting = false; canPlay = true;
    document.getElementById('next-innings-btn').style.display = "none";
    document.getElementById('role-tag').innerText = "CHASING";
    document.getElementById('runs').innerText = "0";
    document.getElementById('leave-btn').style.display = "none";
    document.getElementById('stumps').style.transform = "none";
    document.getElementById('stumps').style.color = "#fff";
    document.getElementById('commentary').innerText = "England in the field.";
}

function updateUI(p, c) {
    document.getElementById('player-hand').innerText = p === 6 ? "👋" : p;
    document.getElementById('cpu-hand').innerText = c === 6 ? "👋" : c;
    document.getElementById('runs').innerText = isBatting ? playerRuns : cpuRuns;
}

function endGame(msg) {
    isGameOver = true;
    document.getElementById('commentary').innerText = msg;
    
    setTimeout(() => {
        document.getElementById('cert-score').innerText = playerRuns;
        document.getElementById('cert-result').innerText = msg;
        document.getElementById('certificate').style.display = 'flex';
    }, 1500);
}
const itemQueueContainer = document.getElementById('item-queue');
let queuedItems = []; // 초기화 변경
const scoreDisplay = document.getElementById('score');
const playerElement = document.getElementById('player').querySelector('img:first-child');
const swingEffectElement = document.getElementById('swing-effect');
const gameArea = document.getElementById('game-area');
const gameOverUI = document.getElementById('game-over-ui');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const healthDisplay = document.getElementById('health-display');

let score = 0;
let health = 9; // 초기 체력 설정
const possibleItems = [
    { type: 'left', image: 'arrow_left.png' },
    { type: 'up', image: 'arrow_up.png' },
    { type: 'right', image: 'arrow_right.png' }
];
const playerImages = {
    left: 'tung_left.png',
    up: 'tung_up.png',
    right: 'tung_right.png'
};
const swingEffectImages = {
    left: 'effect_swing_left.png',
    up: 'effect_swing_up.png',
    right: 'effect_swing_right.png'
};
let currentQueue = [];
let activeItem = null;
let gameActive = true; // 게임 활성 상태

function updateHealthDisplay() {
    let healthText = '';
    for (let i = 0; i < health; i++) {
        healthText += 'tung ';
    }
    healthDisplay.textContent = healthText;
}

function setupRound() {
    console.log('setupRound() 호출됨');
    score = 0;
    health = 9; // 체력 초기화
    scoreDisplay.textContent = `점수: ${score}`;
    updateHealthDisplay();
    currentQueue = [];
    for (let i = 0; i < 3; i++) {
        addNewItemToQueue();
    }
    updateQueueDisplay();

    gameActive = true; // 게임 활성 상태를 먼저 설정

    // DOM 업데이트 후 활성 아이템 설정
    queuedItems = document.querySelectorAll('.queued-item'); // 업데이트된 DOM 요소 다시 가져오기
    console.log('queuedItems (setupRound):', queuedItems);
    if (queuedItems.length > 0 && currentQueue.length > 0) {
        activateItem(queuedItems[0]);
    } else {
        activeItem = null;
        console.log('활성 아이템 설정 실패 (setupRound)');
    }
    playerElement.src = playerImages.up;
    swingEffectElement.src = '';
    gameOverUI.classList.add('hidden'); // 게임 오버 UI 숨김
    gameArea.focus(); // 게임 영역에 포커스 설정
    console.log('게임 활성 상태:', gameActive);
    console.log('활성 아이템 (setupRound):', activeItem);
}

function addNewItemToQueue() {
    const randomIndex = Math.floor(Math.random() * possibleItems.length);
    currentQueue.push({ ...possibleItems[randomIndex] });
}

function updateQueueDisplay() {
    itemQueueContainer.innerHTML = ''; // 기존 아이템 컨테이너 비우기
    currentQueue.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('queued-item');
        itemDiv.id = `item-${index}`;
        itemDiv.dataset.type = item.type;
        const imgElement = document.createElement('img');
        imgElement.src = item.image;
        itemDiv.appendChild(imgElement);
        itemQueueContainer.appendChild(itemDiv);
    });
    queuedItems = document.querySelectorAll('.queued-item'); // 업데이트된 DOM 요소 다시 가져오기
    console.log('queuedItems (updateQueueDisplay):', queuedItems);
    console.log('currentQueue (updateQueueDisplay):', currentQueue);
    // 활성 아이템을 여기서 설정하지 않습니다. setupRound에서 한 번만 설정합니다.
}

function activateItem(itemDiv) {
    if (itemDiv && gameActive) {
        if (activeItem) {
            activeItem.classList.remove('active'); // 기존 활성 아이템 비활성화
        }
        activeItem = itemDiv;
        activeItem.classList.add('active');
        console.log('활성 아이템 설정:', activeItem);
    } else {
        activeItem = null;
    }
}

function triggerSuccessAnimation(itemElement) {
    if (!itemElement || !gameArea || !gameActive) return;

    const animatedItem = itemElement.cloneNode(true);
    animatedItem.classList.add('animated-item');
    const rect = itemElement.getBoundingClientRect();
    animatedItem.style.left = `${rect.left - gameArea.getBoundingClientRect().left}px`;
    animatedItem.style.top = `${rect.top - gameArea.getBoundingClientRect().top}px`;
    gameArea.appendChild(animatedItem);
    const type = itemElement.dataset.type;
    let translateX = 0;
    let translateY = 0;
    switch (type) {
        case 'left':
            translateX = -300;
            break;
        case 'up':
            translateY = -300;
            break;
        case 'right':
            translateX = 300;
            break;
    }
    void animatedItem.offsetWidth;
    animatedItem.style.transform = `translate(${translateX}px, ${translateY}px)`;
    animatedItem.style.opacity = 0;
    setTimeout(() => {
        animatedItem.remove();
    }, 200);
}

function handleKeyPress(event) {
    if (!activeItem || currentQueue.length === 0 || !gameActive) {
        console.log('키 입력 무시 - 활성 아이템 없음:', activeItem, '큐 길이:', currentQueue.length, '게임 활성:', gameActive);
        return;
    }

    const expectedType = activeItem.dataset.type;
    let pressedDirection = '';

    switch (event.key) {
        case 'ArrowLeft':
            pressedDirection = 'left';
            playerElement.src = playerImages.left;
            swingEffectElement.src = swingEffectImages.left;
            swingEffectElement.style.opacity = 1;
            setTimeout(() => {
                swingEffectElement.style.opacity = 0;
            }, 200);
            break;
        case 'ArrowUp':
            pressedDirection = 'up';
            playerElement.src = playerImages.up;
            swingEffectElement.src = swingEffectImages.up;
            swingEffectElement.style.opacity = 1;
            setTimeout(() => {
                swingEffectElement.style.opacity = 0;
            }, 200);
            break;
        case 'ArrowRight':
            pressedDirection = 'right';
            playerElement.src = playerImages.right;
            swingEffectElement.src = swingEffectImages.right;
            swingEffectElement.style.opacity = 1;
            setTimeout(() => {
                swingEffectElement.style.opacity = 0;
            }, 200);
            break;
    }

    if (pressedDirection && pressedDirection === expectedType) {
        score++;
        scoreDisplay.textContent = `점수: ${score}`;
        triggerSuccessAnimation(activeItem);
        currentQueue.shift();
        addNewItemToQueue();
        updateQueueDisplay();
        if (queuedItems.length > 0) {
            activateItem(queuedItems[0]);
        }
    } else if (pressedDirection) {
        console.log('틀렸습니다! 입력:', pressedDirection, '정답:', expectedType);
        health--;
        updateHealthDisplay();

        // 흔들림 애니메이션 추가
        const playerContainer = document.getElementById('player');
        playerContainer.classList.add('shake-animation');
        setTimeout(() => {
            playerContainer.classList.remove('shake-animation');
        }, 200); // 애니메이션 지속 시간과 동일하게 설정

        if (health <= 0) {
            gameActive = false;
            finalScoreDisplay.textContent = score;
            gameOverUI.classList.remove('hidden');
            console.log('게임 오버! 게임 활성 상태:', gameActive);
        }
    }
}
// 게임 다시 시작
restartButton.addEventListener('click', setupRound);

// DOMContentLoaded 이후 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    setupRound();
    document.addEventListener('keydown', handleKeyPress);
});
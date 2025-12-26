const foods = [
    // Fats, Oil, Salt, Sugar
    { id: 'fat1', name: 'Oil', icon: '🛢️', layer: 'fats' },
    { id: 'fat2', name: 'Salt', icon: '🧂', layer: 'fats' },
    { id: 'fat3', name: 'Sugar', icon: '🍬', layer: 'fats' },

    // Protein (Combined Milk, Meat, etc.)
    { id: 'prot1', name: 'Milk', icon: '🥛', layer: 'protein' },
    { id: 'prot2', name: 'Yogurt', icon: '🥣', layer: 'protein' },
    { id: 'prot3', name: 'Cheese', icon: '🧀', layer: 'protein' },
    { id: 'prot4', name: 'Soy Milk', icon: '🧃', layer: 'protein' },
    { id: 'prot5', name: 'Fish', icon: '🐟', layer: 'protein' },
    { id: 'prot6', name: 'Eggs', icon: '🥚', layer: 'protein' },
    { id: 'prot7', name: 'Nuts', icon: '🥜', layer: 'protein' },
    { id: 'prot8', name: 'Chicken', icon: '🍗', layer: 'protein' },
    { id: 'prot9', name: 'Meat', icon: '🥩', layer: 'protein' },
    { id: 'prot10', name: 'Tofu', icon: '🧊', layer: 'protein' },
    { id: 'prot11', name: 'Lentils', icon: '🫘', layer: 'protein' },

    // Vitamins & Minerals (Combined Veg & Fruits)
    { id: 'veg1', name: 'Broccoli', icon: '🥦', layer: 'vitamins' },
    { id: 'veg2', name: 'Carrot', icon: '🥕', layer: 'vitamins' },
    { id: 'veg3', name: 'Corn', icon: '🌽', layer: 'vitamins' },
    { id: 'veg4', name: 'Tomato', icon: '🍅', layer: 'vitamins' },
    { id: 'veg5', name: 'Eggplant', icon: '🍆', layer: 'vitamins' },
    { id: 'veg6', name: 'Mushroom', icon: '🍄', layer: 'vitamins' },
    { id: 'veg7', name: 'Peas', icon: '🫛', layer: 'vitamins' },
    { id: 'veg8', name: 'Cabbage', icon: '🥬', layer: 'vitamins' },
    { id: 'veg9', name: 'Avocado', icon: '🥑', layer: 'vitamins' }, // Avocado is fruit/veg = vitamins
    { id: 'fruit1', name: 'Apple', icon: '🍎', layer: 'vitamins' },
    { id: 'fruit2', name: 'Banana', icon: '🍌', layer: 'vitamins' },
    { id: 'fruit3', name: 'Grapes', icon: '🍇', layer: 'vitamins' },
    { id: 'fruit4', name: 'Watermelon', icon: '🍉', layer: 'vitamins' },
    { id: 'fruit5', name: 'Pineapple', icon: '🍍', layer: 'vitamins' },
    { id: 'fruit6', name: 'Strawberry', icon: '🍓', layer: 'vitamins' },
    { id: 'fruit7', name: 'Orange', icon: '🍊', layer: 'vitamins' },
    { id: 'fruit8', name: 'Pear', icon: '🍐', layer: 'vitamins' },
    { id: 'fruit9', name: 'Kiwi', icon: '🥝', layer: 'vitamins' },

    // Carbohydrates (Grains)
    { id: 'grain1', name: 'Bread', icon: '🍞', layer: 'carbohydrates' },
    { id: 'grain2', name: 'Rice', icon: '🍚', layer: 'carbohydrates' },
    { id: 'grain3', name: 'Pasta', icon: '🍝', layer: 'carbohydrates' },
    { id: 'grain4', name: 'Oats', icon: '🥣', layer: 'carbohydrates' },
    { id: 'grain5', name: 'Noodles', icon: '🍜', layer: 'carbohydrates' },
    { id: 'grain6', name: 'Cereal', icon: '🥣', layer: 'carbohydrates' },
    { id: 'grain7', name: 'Crackers', icon: '🍘', layer: 'carbohydrates' },
];

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle foods before init
shuffle(foods);

const scoreDisplay = document.getElementById('score-display');
const messageArea = document.getElementById('message-area');
const foodsContainer = document.getElementById('foods-container');
const layers = document.querySelectorAll('.pyramid-layer');

let score = 0;
let totalItems = foods.length; // 10

// Initialize Audio Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'complete') {
        // Victory fanfare
        const now = audioCtx.currentTime;

        // Note 1
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.frequency.value = 523.25; // C5
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc1.start(now);
        osc1.stop(now + 0.4);

        // Note 2
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 659.25; // E5
        gain2.gain.setValueAtTime(0.3, now + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc2.start(now + 0.2);
        osc2.stop(now + 0.6);

        // Note 3
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.connect(gain3);
        gain3.connect(audioCtx.destination);
        osc3.frequency.value = 783.99; // G5
        gain3.gain.setValueAtTime(0.3, now + 0.4);
        gain3.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc3.start(now + 0.4);
        osc3.stop(now + 1.2);
    }
}

function initGame() {
    foods.forEach(food => {
        const el = document.createElement('div');
        el.classList.add('food-item');
        el.setAttribute('draggable', true);
        el.setAttribute('data-id', food.id);
        el.setAttribute('data-target', food.layer);

        el.innerHTML = `
            <span class="food-icon">${food.icon}</span>
            <span class="food-name">${food.name}</span>
        `;

        el.addEventListener('dragstart', handleDragStart);
        foodsContainer.appendChild(el);
    });

    layers.forEach(layer => {
        layer.addEventListener('dragover', handleDragOver);
        layer.addEventListener('dragleave', handleDragLeave);
        layer.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    e.target.closest('.pyramid-layer').style.transform = 'scale(1.05)';
}

function handleDragLeave(e) {
    e.target.closest('.pyramid-layer').style.transform = 'scale(1)';
}

function handleDrop(e) {
    e.preventDefault();
    const layer = e.target.closest('.pyramid-layer');
    layer.style.transform = 'scale(1)';

    const foodId = e.dataTransfer.getData('text/plain');
    const foodEl = document.querySelector(`.food-item[data-id="${foodId}"]`);

    if (!foodEl) return;

    const correctLayer = foodEl.getAttribute('data-target');
    const droppedLayer = layer.getAttribute('data-layer');

    if (correctLayer === droppedLayer) {
        // Correct!
        handleCorrectDrop(foodEl, layer);
    } else {
        // Incorrect
        handleIncorrectDrop(layer);
    }

    foodEl.classList.remove('dragging');
}

function handleCorrectDrop(foodEl, layer) {
    playSound('success');
    score++;
    scoreDisplay.innerText = `Score: ${score} / ${totalItems}`;

    // Create visualization of success
    const rect = layer.getBoundingClientRect();
    const check = document.createElement('div');
    check.classList.add('checkmark');
    check.innerHTML = '✅';
    check.style.left = `${rect.width / 2 - 20}px`;
    check.style.top = `${rect.height / 2 - 20}px`;
    layer.appendChild(check);

    // Trigger animation
    setTimeout(() => check.classList.add('show-check'), 10);
    setTimeout(() => check.remove(), 1000); // Cleanup

    // Disable dragging for this item and move it visually to the layer (optional, or just remove)
    // For this game, let's remove it from the list to clear clutter, or attach it to the pyramid?
    // Attaching to pyramid might break the clip-path visuals or look messy. 
    // Let's just make it disappear or "consumed" into the pyramid.
    foodEl.style.visibility = 'hidden';

    if (score === totalItems) {
        endGame();
    }
}

function handleIncorrectDrop(layer) {
    playSound('error');
    layer.classList.add('incorrect-shake');
    setTimeout(() => layer.classList.remove('incorrect-shake'), 500);
}

function endGame() {
    playSound('complete');
    messageArea.classList.remove('hidden');

    if (score === totalItems) {
        messageArea.innerText = `Congratulations for scoring ${score}/${totalItems}!`;
        messageArea.style.color = "gold";
        messageArea.style.textShadow = "1px 1px 2px black";
    } else {
        messageArea.innerText = `Well done! You scored ${score}/${totalItems}`;
    }
}

// Start
initGame();

const board = document.querySelector('.board');

const dom = {

    start: null, // Location of the knight

    target: null, // Location of the pawn

    createBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;
                board.appendChild(square);

                // Add event listeners
                square.addEventListener('dragover', dom.onDragOver);
                square.addEventListener('drop', dom.onDrop);
            }
        }
    },

    createPawn() {
        const pawn = document.createElement('img');
        pawn.id='pawn';
        pawn.src = '../media/pawn.png';
        pawn.alt = 'Pawn';
        pawn.draggable = true;
        pawn.classList.add('piece');
        pawn.addEventListener('dragstart', dom.onDragStart);
        return pawn
    },

    createKnight() {
        const knight = document.createElement('img');
        knight.id='knight';
        knight.src = '../media/knight.png';
        knight.alt = 'Knight';
        knight.draggable = true;
        knight.classList.add('piece');
        knight.addEventListener('dragstart', dom.onDragStart);
        return knight
    },

    getRandomSquare() {
        const squares = document.querySelectorAll('.square');
        const randomIndex = Math.floor(Math.random() * squares.length);
        return squares[randomIndex];
    },

    initializePieces() {
        // Get random squares
        const pawnSquare = dom.getRandomSquare();
        const knightSquare = dom.getRandomSquare();

        // Avoid clashes with squares
        while (knightSquare === pawnSquare) {
            knightSquare = dom.getRandomSquare();
        }

        // Get pieces
        const pawn = dom.createPawn();
        const knight = dom.createKnight();

        // Add event listeners
        pawn.addEventListener('dragstart', dom.onDragStart);
        knight.addEventListener('dragstart', dom.onDragStart);

        // Add pieces to squares
        pawnSquare.appendChild(pawn);
        knightSquare.appendChild(knight);

        // Set start and target
        dom.updatePosition('knight', knightSquare);
        dom.updatePosition('pawn', pawnSquare);
    },

    onDragStart(event) {
        // Make the pieces draggable from one square to another
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => {
            //event.target.style.visibility = 'hidden';
        }, 0);
    },

    onDragOver(event) {
        event.preventDefault();
    },
    
    onDrop(event) {
        // Drag the piece onto a square and
        // set a new position for the piece

        const id = event.dataTransfer.getData('text/plain');
        const piece = document.getElementById(id);
        event.preventDefault();

        // Clear the current square and append image
        const square = event.target;
        square.innerHTML = '';
        square.appendChild(piece);

        // Update the current positions
        dom.updatePosition(id, square);
    },

    updatePosition(piece, square) {
        if (piece === 'knight') {
            dom.start = [parseInt(square.dataset.row), parseInt(square.dataset.col)];
        } else {
            dom.target = [parseInt(square.dataset.row), parseInt(square.dataset.col)];
        }
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async moveKnight(path) {
        dom.disableClicking(); // Disable start button click
        const knight = document.getElementById('knight');
        knight.style.borderColor = 'green';

        // For every move, animate the knight with a delay
        for (let i = 1; i < path.length; i++) {
            const offset = dom.getOffset(path[0], path[i]);
            knight.style.transform = `translate(${offset[0]}px, ${offset[1]-40}px)`;
            await dom.delay(1000);
        }

        // Reset the knight
        await dom.delay(2000);
        dom.resetKnight();
        await dom.delay(2000);
        dom.enableClicking(); // Re-enable start button click
        knight.style.borderColor = 'red';
    },

    disableClicking() {
        const startBtn = document.getElementById('start');
        startBtn.classList.add('disabled');

        const board = document.querySelector('.board');
        board.classList.add('disabled');
    },

    enableClicking() {
        const startBtn = document.getElementById('start');
        startBtn.classList.remove('disabled');

        const board = document.querySelector('.board');
        board.classList.remove('disabled');
    },

    resetKnight() {
        const knight = document.getElementById('knight');
        knight.style.transform = 'translate(0px, -40px)';
    },

    getOffset(start,target) {
        let width = (target[1] - start[1]) * 75;
        let height = (target[0] - start[0]) * 60;
        return [width, height];
    }
}

export { dom }
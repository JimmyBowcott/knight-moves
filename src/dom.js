const board = document.querySelector('.board');

const dom = {

    start: null, // Location of the knight

    target: null, // Location of the pawn

    draggedPiece: null, // For dragging

    lastSquare: null,

    pieces: [],

    createBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;
                board.appendChild(square);
            }
        }
        dom.lastSquare = dom.getRandomSquare();
    },

    createPiece(piece) {
        const p = document.createElement('img');
        p.id= piece;
        p.src = './media/' + piece + '.png';
        p.alt = piece;
        p.draggable = false;
        p.classList.add('piece');
        p.addEventListener('mousedown', dom.startDrag);
        p.addEventListener('dragstart', event => event.preventDefault()); // Prevent default drag behavior
        dom.pieces.push(p);
        return p
    },

    getRandomSquare() {
        const squares = document.querySelectorAll('.square');
        let randomIndex = Math.floor(Math.random() * squares.length);
        while (squares[randomIndex].children.length === 1) {
            randomIndex = Math.floor(Math.random() * squares.length);
        }
        return squares[randomIndex];
    },

    initializePieces() {
        // Create pieces
        dom.createPiece('pawn');
        dom.createPiece('knight');

        dom.pieces.forEach(piece => {
            const square = dom.getRandomSquare();
            square.appendChild(piece);
            dom.updatePosition(piece.id, square)
        })
    },

    startDrag(event) {
        dom.draggedPiece = event.target;

        // Remove transition
        dom.draggedPiece.style.transition = 'none';

        // Add event listeners
        document.addEventListener('mousemove', dom.dragPiece);
        document.addEventListener('mouseup', dom.dropPiece);
        document.addEventListener('mouseleave', dom.cancelDrag);
    },

    dragPiece(event) {
        if (!dom.draggedPiece) return;
        // Update piece appearance
        dom.draggedPiece.style.transform = `translate(${event.pageX-dom.draggedPiece.x-25}px,${event.pageY-dom.draggedPiece.y-80}px)`
        const targetSquare = dom.getTargetSquare(event);
        if (targetSquare) {
            if (targetSquare.classList.contains('light')) {
                dom.lastSquare.classList.remove('lightdrag');
                dom.lastSquare.classList.remove('darkdrag');
                targetSquare.classList.add('lightdrag');
                dom.lastSquare = targetSquare;
            } else if (targetSquare.classList.contains('dark')) {
                dom.lastSquare.classList.remove('lightdrag');
                dom.lastSquare.classList.remove('darkdrag');
                targetSquare.classList.add('darkdrag');
                dom.lastSquare = targetSquare;
            }
        }
    },

    async dropPiece(event) {
        if (!dom.draggedPiece) return;
        document.removeEventListener('mousemove', dom.dragPiece);
        document.removeEventListener('mouseup', dom.dropPiece);
        document.removeEventListener('mouseleave', dom.cancelDrag);

        const targetSquare = dom.getTargetSquare(event);

        // Cancel if the piece is outside of the board
        const board = document.querySelector('.board');
        if (!targetSquare || !board.contains(targetSquare) || targetSquare.children.length === 1) {
            dom.cancelDrag();
            return
        }

        if (targetSquare) {
            // Update piece position
            targetSquare.appendChild(dom.draggedPiece);

            // Add transition back and set position
            dom.draggedPiece.style.transform = `translate(${event.pageX-dom.draggedPiece.x-25}px,${event.pageY-dom.draggedPiece.y-40}px)`
            dom.draggedPiece.style.transform = `translate(0,-40px)`;
            dom.updatePosition(dom.draggedPiece.id, targetSquare);
            await dom.delay(100); // Delay transition until piece is placed correctly
            dom.draggedPiece.style.transition =  'transform 0.35s ease-in-out';
            
        }

        dom.draggedPiece = null;
        dom.lastSquare.classList.remove('lightdrag');
        dom.lastSquare.classList.remove('darkdrag');
    },

    cancelDrag() {
        if (!dom.draggedPiece) return;

        // Reset dragged piece
        dom.draggedPiece.style.transform = `translate(0,-40px)`;
        dom.draggedPiece.style.transition =  'transform 0.35s ease-in-out';
        dom.draggedPiece = null;

        // Reset listeners
        document.removeEventListener('mousemove', dom.dragPiece);
        document.removeEventListener('mouseup', dom.dropPiece);
        document.removeEventListener('mouseleave', dom.cancelDrag);

        // Reset last square
        dom.lastSquare.classList.remove('lightdrag');
        dom.lastSquare.classList.remove('darkdrag');
    },

    getTargetSquare(event) {
        dom.draggedPiece.style.display = 'none';
        let targetSquare = document.elementFromPoint(event.clientX, event.clientY)
        if (!targetSquare) {
            dom.draggedPiece.style.display = ''
            return;
        }
            
        targetSquare = targetSquare.closest('.square');
        dom.draggedPiece.style.display = '';
        return targetSquare
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
        let offset = [0,-40]; // Initialise offset

        // For every move, animate the knight with a delay
        for (let i = 1; i < path.length; i++) {
            const newOffset = dom.getOffset(path[i-1], path[i]);
            offset[0] += newOffset[0] // Add first offset
            knight.style.transform = `translate(${offset[0]}px, ${offset[1]}px)`;
            await dom.delay(350);
            offset[1] += newOffset[1] // Add second offset
            knight.style.transform = `translate(${offset[0]}px, ${offset[1]}px)`;
            await dom.delay(250);
            if (i === path.length - 1) dom.hidePiece('pawn'); // Trigger knight fade-out animation
            await dom.delay(250);
        }

        // Reset the knight
        await dom.delay(2000);
        dom.resetPiece('knight');
        dom.resetPiece('pawn');
        await dom.delay(1000);
        dom.enableClicking(); // Re-enable start button click
    },

    hidePiece(piece) {
        piece = document.getElementById(piece)
        piece.classList.add('taken');
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

    resetPiece(piece) {
        piece = document.getElementById(piece);
        piece.classList.remove('taken');
        piece.style.transform = 'translate(0px, -40px)';
    },

    getOffset(start,target) {
        let width = (target[1] - start[1]) * 75;
        let height = (target[0] - start[0]) * 60;
        return [width, height];
    }
}

export { dom }
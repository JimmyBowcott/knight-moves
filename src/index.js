import { dom } from './dom.js';
import { knightMoves } from './knightMoves.js';

dom.createBoard();
dom.initializePieces();

// Add an event listener for the button
let startBtn = document.getElementById('start')

startBtn.addEventListener('click', () => {
    const path = knightMoves(dom.start, dom.target);
    dom.moveKnight(path);
});
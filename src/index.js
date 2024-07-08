import { dom } from './dom.js';

const imgSrc = '../../media/knight.png';

dom.createBoard();

function onDragStart(event) {
    console.log('drag start');
    event.dataTransfer.setData('text/plain', event.target.src);
    setTimeout(() => {
        event.target.style.visibility = 'hidden';
    }, 0);
}

function onDragOver(event) {
    console.log('over');
    event.preventDefault();
}

function onDrop(event) {
    console.log('dropped');
    event.preventDefault();
    const imgSrc = event.dataTransfer.getData('text/plain');
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Knight';
    img.draggable = true;
    img.addEventListener('dragstart', onDragStart);
    
    // Clear the current square and append the new image
    const square = event.target;
    square.innerHTML = '';
    square.appendChild(img);
}
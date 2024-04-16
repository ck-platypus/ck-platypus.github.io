document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#game');
    const width = 20;
    let score = 0;
    let pacmanCurrentIndex = 38; // 假設 Pac-Man 的初始位置

    // Layout of the grid (1 is wall, 0 is dot, 9 is Pac-Man)
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,1,
        1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,1,1,0,1,
        1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,1,1,
        1,0,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,
        1,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,
        1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,
        1,9,1,0,1,1,0,1,1,1,1,0,1,0,1,0,0,0,1,1,
        1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,1,
        1,0,0,0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    // Create the game board
    const squares = [];

    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');
            grid.appendChild(square);
            squares.push(square);

            // Add layout to the board
            if (layout[i] === 1) {
                square.classList.add('wall');
            } else if (layout[i] === 0) {
                square.classList.add('dot');
                square.innerHTML = '•';
            }
        }
        squares[pacmanCurrentIndex].classList.add('pacman');
    }

    createBoard();

    // Move Pac-Man
    function movePacman(e) {
        squares[pacmanCurrentIndex].classList.remove('pacman');
        switch(e.keyCode) {
            case 37: // left arrow
                if (pacmanCurrentIndex % width !== 0 && !squares[pacmanCurrentIndex - 1].classList.contains('wall')) {
                    pacmanCurrentIndex -= 1;
                }
                break;
            case 38: // up arrow
                if (pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex - width].classList.contains('wall')) {
                    pacmanCurrentIndex -= width;
                }
                break;
            case 39: // right arrow
                if (pacmanCurrentIndex % width < width - 1 && !squares[pacmanCurrentIndex + 1].classList.contains('wall')) {
                    pacmanCurrentIndex += 1;
                }
                break;
            case 40: // down arrow
                if (pacmanCurrentIndex + width < width * width && !squares[pacmanCurrentIndex + width].classList.contains('wall')) {
                    pacmanCurrentIndex += width;
                }
                break;
        }
        squares[pacmanCurrentIndex].classList.add('pacman');
        eatDot();
    }

    function eatDot() {
        if (squares[pacmanCurrentIndex].classList.contains('dot')) {
            score++;
            squares[pacmanCurrentIndex].innerHTML = ''; // Remove the dot
            squares[pacmanCurrentIndex].classList.remove('dot');
            updateScore();
        }
    }

    function updateScore() {
        console.log(`Score: ${score}`);
    }

    document.addEventListener('keyup', movePacman);
});

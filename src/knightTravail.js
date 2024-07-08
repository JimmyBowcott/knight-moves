const KNIGHT_MOVES = [[1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1], [-2,1], [-1,2]];

class Square {
    constructor(position, path=false) {
        this.position = position;   // Position of square
        this.path = this.pass(path);   // Path taken to get there
    }

    pass(path) {
        if (!path) {
            return [this.position];
        } else {
            return path;
        }
    }

    getMoves() {
        let moves = [];
        for (let move of KNIGHT_MOVES) {
            let position = [this.position[0] + move[0], this.position[1] + move[1]];
            if (position[0] >= 0 && position[0] <= 7 && position[1] >= 0 && position[1] <= 7) {
                moves.push(position);
            }
        }
        return moves;
    }
}

// BF Traverse the tree, getting each child as well as the path to that child
// If end square is reached, return the path
function knightTravail(start, end) {

    var q = [new Square(start)];
    var n = q.shift();

    while(n.position[0] !== end[0] || n.position[1] !== end[1]) {
    
        moves = n.getMoves();
        for (var i = 0; i < moves.length; i++) {
            q.push(new Square(moves[i], n.path.concat([moves[i]])));
        }
        n = q.shift();
      }
    
    return n.path;
}

console.log(knightTravail([1,0],[6,2])); 
const canvas = document.getElementById("canvas");
const rertyBtn = document.getElementById("retry");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let highScore = 0;
//za SetInterval
let intervalID = 0;
//velicina zmije
const scale = 10;
//mreža
const rows = canvas.height / scale;
const cols = canvas.width / scale;

function showEndMenu(){
    let end_game_score = document.getElementById('end-game-score');
    document.getElementById('end-game-menu').style.display = 'block';
    end_game_score.innerHTML = scoreEl.innerHTML;

    if(highScore < end_game_score.innerHTML){
        highScore = end_game_score.innerHTML;
    }

    document.getElementById('high-score').innerHTML = highScore;

    snake.total = 0;
    snake.tail = [];

}


function hideEndMenu(){
    document.getElementById('end-game-menu').style.display = 'none';
}

function loop(){
    //prvo postavimo voće negdje random
    fruit.pickLocation();

    intervalID = setInterval(()=> {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.update()
        snake.draw();
        fruit.draw();

        if(snake.eat(fruit)){
            fruit.pickLocation();
            updateScore();
            snake.draw();
        }
        snake.checkCollision();
    }, 120)

}

function updateScore(){
    scoreEl.innerHTML = snake.total;

}

class Snake{
    constructor(){
        this.x = 0;
        this.y = 0;
        // dvije varijable za brzinu
        this.xSpeed = scale;
        this.ySpeed = 0;
        //broj voćkica  koje je zmija pojela
        this.total = 0;
        this.tail = [];
    }

    //ovdje se crta zmija:
    draw() {
        ctx.fillStyle = '#00FF00';

        for(let i = 0; i < this.tail.length; i++){
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    }

    //funkcija za update da bi se postepeno mijenjala pozicija zmije
    update() {
        for(let i = 0; i < this.tail.length - 1; i++){
            this.tail[i] = this.tail[i+1];
        }

        this.tail[this.total-1] = { x: this.x, y: this.y}

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if(this.x > canvas.width -scale){
            this.x = 0;
        }

        if(this.x < 0){
            this.x = canvas.width - scale;
        }
        if(this.y > canvas.height - scale){
            this.y = 0;
        }
        if( this.y < 0){
            this.y = canvas.height - scale;
        }

    }

    //promjena pravca
    changeDirection(direction) {
        switch(direction){
            case 'up':
                this.xSpeed = 0;
                this.ySpeed = -scale;
                break;
            case 'down':
                this.xSpeed = 0;
                this.ySpeed = scale;
                break;
            case 'left':
                this.xSpeed = -scale;
                this.ySpeed = 0;
                break;
            case 'right':
                this.xSpeed = scale;
                this.ySpeed = 0;
                break;
        }

    }

    //kad zmija pojede voće
    eat(fruit) {
        if(this.x === fruit.x && this.y === fruit.y){
            this.total++;
            return true;
        } else{
            return false;
        }

    }

    checkCollision(){
        for(let i = 0; i < this.tail.length; i++){
            if(this.x === this.tail[i].x && this.y === this.tail[i].y){
                showEndMenu();
                this.total = 0;
                this.tail = [];
                updateScore();
                clearInterval(intervalID);
            }
        }

    }
}

class Fruit {
    constructor(){
        this.x;
        this.y;
    }

    //funkcija koja ce postaviti voće negdje random, zato je gore this.x i this.y 
    //odnosno (x,y) koordinate gdje će voće biti postavljeno
    pickLocation(){
        this.x = (Math.floor(Math.random() * cols)) * scale;
        this.y = (Math.floor(Math.random() * rows)) * scale
    }

    draw() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale)
    }
    
}

function addListeners_() {
    //kretanje
    document.addEventListener('keydown', (event) => {
        switch(event.code){
            case 'ArrowUp':
                 snake.changeDirection('up');
                    break;
            case 'ArrowDown': 
                snake.changeDirection('down');
                    break;
            case 'ArrowLeft':
                snake.changeDirection('left');
                    break;
            case 'ArrowRight':
                snake.changeDirection('right');
                    break;
        }
    });

    rertyBtn.addEventListener('click', () => {
        hideEndMenu()
        loop();
    });

    
}

let snake = new Snake();
let fruit = new Fruit();
addListeners_();

//kad se učita stranica poziva funkciju loop()
window.onload = () => {
    loop();
}
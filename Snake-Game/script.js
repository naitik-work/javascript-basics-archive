const board= document.querySelector('.board');
const blockHeight=50;
const blockWidth=50;

const rows= Math.floor(board.clientHeight / blockHeight);
const cols= Math.floor(board.clientWidth / blockWidth);

const startBtn= document.querySelector('.btn-start');
const modal= document.querySelector('.modal');
const startGameModal= document.querySelector('.start-game');
const gameOverModal= document.querySelector('.game-over');
const restartBtn= document.querySelector('.btn-restart');

const highScoreElement= document.querySelector('#HighScore');
const scoreElement= document.querySelector('#Score');
const timeElement= document.querySelector('#time');

let score=0;
let highScore=localStorage.getItem('highScore') || 0;
let time=`00-00`;
highScoreElement.innerText= highScore;

startBtn.addEventListener('click', ()=>{
    modal.style.display='none';
    intervalId= setInterval(()=>{
        render();   }, 200);

    timeIntervalId= setInterval(()=>{
        let [mins, secs]= time.split('-').map(Number);
        secs+=1;
        if(secs===59){
            mins+=1;
            secs=0;
        }
        time=`${mins}-${secs}`;
        timeElement.innerText= time;
    }, 1000);

});

let intervalId= null;
let timeIntervalId= null;
const blocks= [];

// for(let i =0; i<rows*cols; i++){
//     const block= document.createElement('div');
//     block.classList.add('block');
//     board.appendChild(block);
// }

let snake= [{
  x:1, y:3
}]

let direction= 'right';

let food= {
    x: Math.floor(Math.random()*rows),
    y: Math.floor(Math.random()*cols)
};



for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block= document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}, ${col}`]=block;
    }
}

function render(){
    let head=null;

    blocks[`${food.x}, ${food.y}`].classList.add('food');
    if(direction==='left'){
        head={x: snake[0].x, y: snake[0].y -1};
    }
    else if(direction==='right'){
        head={x: snake[0].x, y: snake[0].y +1};
    }
    else if(direction==='up'){
        head={x: snake[0].x -1, y: snake[0].y};
    }
    else if(direction==='down'){
        head={x: snake[0].x +1, y: snake[0].y};
    }

    //wall collision logic
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);
        modal.style.display='flex';
        startGameModal.style.display='none';
        gameOverModal.style.display='flex';
        return;
    }
    for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
        clearInterval(intervalId);
        clearInterval(timeIntervalId);
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return;
    }
}

    snake.forEach(segment=>{
        blocks[`${segment.x}, ${segment.y}`].classList.remove('fill');
    })
    snake.unshift(head);
    snake.pop();

    //food collision logic
    if(head.x===food.x && head.y===food.y){
        blocks[`${food.x}, ${food.y}`].classList.remove('food');
        food={x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
        blocks[`${food.x}, ${food.y}`].classList.add('food');
        snake.unshift(head);
        score+=10;
        scoreElement.innerText= score;
        if(score>highScore){
            highScore=score;

            localStorage.setItem('highScore', highScore.toString());
            // highScoreElement.innerText= highScore;
        }
        
    }


    snake.forEach(segment=>{
        blocks[`${segment.x}, ${segment.y}`].classList.add('fill');
    })
}

// intervalId=setInterval(()=>{
//     render(); 

// },200);

function restartGame(){
    score=0;
    scoreElement.innerText= score;
    time=`00-00`;
    timeElement.innerText= time;
    direction='right';
    blocks[`${food.x}, ${food.y}`].classList.remove('food');
    snake.forEach(segment=>{
        blocks[`${segment.x}, ${segment.y}`].classList.remove('fill');
    });
    modal.style.display='none';
    snake=[{
        x:1, y:3
    }];
    food= {
        x: Math.floor(Math.random()*rows),
        y: Math.floor(Math.random()*cols)
    };
    intervalId=setInterval(()=>{
        render(); 
    },200);
}

addEventListener('keydown', e=>{
    if(e.key==='ArrowLeft'){
        direction='left';
    }
    else if(e.key==='ArrowRight'){
        direction='right';
    }
    else if(e.key==='ArrowUp'){
        direction='up';
    }
    else if(e.key==='ArrowDown'){
        direction='down';
    }
});

restartBtn.addEventListener('click', restartGame);
const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");
const tile = 16; // Tamanho de cada tile em px

let snake;
let direction;
let nextDirection;
let comida;

let jogo;
let pause = false;

// Começa o jogo
function reset() {
  if (pause) {
    jogo = setTimeout(jogoTick, 100);
    pause = false;
    return;
  }
  clearTimeout(jogo);
  
  snake = [
    {
      x: 10*tile,
      y: 8*tile,
    },
    {
      x: 9*tile,
      y: 8*tile
    },
    {
      x: 8*tile,
      y: 8*tile
    },
  ];

  direction = "right";
  nextDirection = "right";

  comida = {
    x: Math.floor(Math.random() * 31 + 1) * tile,
    y: Math.floor(Math.random() * 31 + 1) * tile,
  }

  canvas.style.filter = "";

  criarBG();
  criarComida();
  criarCobra();

  jogo = setTimeout(jogoTick, 1000);
}

function criarBG() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, 32*tile, 32*tile);
}

function criarCobra() {
  ctx.beginPath();

  // Vai pro meio do quadrado da cabeça
  ctx.moveTo(snake[0].x+tile/2, snake[0].y+tile/2)

  ctx.lineWidth = 12;
  ctx.strokeStyle = 'green';
  ctx.fillStyle = 'green';
  
  for (let i = 0; i < snake.length; i++) {
    const cell = snake[i];

    // Põe o stroke no meio do quadrado
    const destino = [cell.x+tile/2, cell.y+tile/2]
    
    // Animação de comer
    if (cell.comeu) {
      ctx.fillRect(cell.x, cell.y, tile, tile);
    }

    // Faz o stroke parar de desenhar durante o warp
    if (cell.wrap) {
      ctx.moveTo(...destino);
      continue;
    }

    ctx.lineTo(...destino);
  }

  ctx.stroke();
}

function criarComida() {
  ctx.fillStyle = "red";
  ctx.fillRect(comida.x, comida.y, tile, tile);
}

function jogoTick() {
  direction = nextDirection;

  // Movimento da cobra
  let x = snake[0].x;
  let y = snake[0].y

  if (direction == "up") y -= tile;
  if (direction == "down") y += tile;
  if (direction == "left") x -= tile;
  if (direction == "right") x += tile;

  // Põe a cobra do lado oposto da tela se ultrapassar
  if ((x > canvas.width - 1) || (x < 0) || (y > canvas.height - 1) || (y < 0)) snake[0].wrap = true;
  if (x > canvas.width - 1) x = 0;
  if (x < 0) x = canvas.width - tile;
  if (y > canvas.height - 1) y = 0;
  if (y < 0) y = canvas.height - tile;

  // Come a comida
  if (comida.x == snake[0].x && comida.y == snake[0].y) {
    snake[0].comeu = true;
    comida = {
      x: Math.floor(Math.random() * 31 + 1) * tile,
      y: Math.floor(Math.random() * 31 + 1) * tile,
    }
  } else {
    snake.pop();
  }

  snake.unshift({x, y})

  // Colisão com o corpo
  let time = 100;

  criarBG();
  criarComida();
  criarCobra();

  for (let i = 1; i < snake.length; i++) {
    const head = snake[0];
    const body = snake[i];

    // Delayzinho pra dar tempo de escapar do game over
    if ((head.x + tile == body.x && head.y == body.y && direction == "right") ||
        (head.x - tile == body.x && head.y == body.y && direction == "left") ||
        (head.y + tile == body.y && head.x == body.x && direction == "down") ||
        (head.y - tile == body.y && head.x == body.x && direction == "up")) {
      time = 300;
    }

    if (head.x == body.x && head.y == body.y) {
      canvas.style.filter = "saturate(0%)";
      return;
    }
  }

  // Próximo tick
  if (!pause) jogo = setTimeout(jogoTick, time);
}

// Controles
document.addEventListener("keydown", update);

function update(event) {
  if (event.defaultPrevented) return;

  event.preventDefault();

  // A direção só é mudada depois do próximo frame, quando direction = nextDirection
  if (event.key == "ArrowLeft" && direction != "right") nextDirection = "left";
  if (event.key == "ArrowRight" && direction != "left") nextDirection = "right";
  if (event.key == "ArrowUp" && direction != "down") nextDirection = "up";
  if (event.key == "ArrowDown" && direction != "up") nextDirection = "down";
}
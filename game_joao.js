// Inimigo móvel no segundo mapa
let enemy = {
  x: 25,
  y: 13,
  dir: 1, // 1 = direita, -1 = esquerda
  minX: 22,
  maxX: 32,
  speed: 0.018 // Mais lento
};

// Desenha o inimigo (um quadrado vermelho)
function drawEnemy() {
  if (inLabyrinth && !marianaFound) {
    const drawX = enemy.x * tileSize - camera.x;
    const drawY = enemy.y * tileSize - camera.y;
    ctx.save();
    ctx.fillStyle = '#e74c3c';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(drawX + tileSize/2, drawY + tileSize/2, tileSize/2.2, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

const sunflowerImg = new Image();
sunflowerImg.src = 'assets/sunflower.png';

const joao3Img = new Image();
joao3Img.src = 'assets/joao3.png';
// Desenha os girassóis no mapa topdown
function drawFlowers() {
  flowers.forEach(flower => {
    if (!flower.collected) {
      const cx = flower.x * tileSize;
      const cy = flower.y * tileSize;
      ctx.save();
      if (sunflowerImg.complete && sunflowerImg.naturalWidth > 0) {
        ctx.drawImage(sunflowerImg, cx, cy, tileSize, tileSize);
      } else {
        // fallback: círculo amarelo
        ctx.beginPath();
        ctx.arc(cx + tileSize/2, cy + tileSize/2, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + tileSize/2, cy + tileSize/2, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#8B4513';
        ctx.fill();
      }
      ctx.restore();
    }
  });
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
tileSize = 32;
const mapWidth = 30;
const mapHeight = 20;


// Carrega imagem pixelada do João
const joaoImgs = [
  new Image(),
  new Image()
];
joaoImgs[0].src = 'assets/joao1.png';
joaoImgs[1].src = 'assets/joao2.png';

const marianaImgs = [
  new Image(),
  new Image()
];
marianaImgs[0].src = 'assets/mariana1.png'; // Adicione os arquivos na pasta assets
marianaImgs[1].src = 'assets/mariana2.png';


let marianaPos;



// Estado do jogo
// Mapa principal/topdown: 0 = livre, 1 = parede
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let joao = { x: 1, y: 1, flowers: 0, frame: 0 };

let flowers = [];
let possiblePositions = [];
for (let y = 1; y < mapHeight - 1; y++) {
  for (let x = 1; x < mapWidth - 1; x++) {
    // Considera posição livre se não for parede
    if (typeof map !== 'undefined' && map[y] && map[y][x] === 0) {
      possiblePositions.push({ x, y });
    }
  }
}
for (let i = 0; i < 8; i++) {
  const idx = Math.floor(Math.random() * possiblePositions.length);
  flowers.push({ ...possiblePositions[idx], collected: false });
  possiblePositions.splice(idx, 1);
}

let gameOver = false;
let showGoToDoorMsg = false;
let showPlatformIntroMsg = false;
let showMarianaMessage = false;
let marianaMessageTimer = 0;

let doorPosList = [];
for (let y = 1; y < map.length - 1; y++) {
  for (let x = 1; x < map[0].length - 1; x++) {
    if (map[y][x] === 0) {
      doorPosList.push({ x, y });
    }
  }
}
const doorIdx = Math.floor(Math.random() * doorPosList.length);
let door = { x: doorPosList[doorIdx].x, y: doorPosList[doorIdx].y, open: false };
let inLabyrinth = false;
let marianaFound = false;

let zooming = false;
let zoomStartTime = 0;
let zoomDuration = 2200; // ms (mais lento)
let tileSizeAnim = 32;

const forestBg = new Image();
forestBg.src = 'assets/forest.png';

const platformMapWidth = 60; // Mapa mais largo
const platformMapHeight = 20;


const platformMap = [];
for (let y = 0; y < platformMapHeight; y++) {
  platformMap[y] = [];
  for (let x = 0; x < platformMapWidth; x++) {
    platformMap[y][x] = 0; // Inicializa tudo como vazio
  }
}

// Chão principal
for (let y = 14; y < platformMapHeight; y++) {
  for (let x = 0; x < platformMapWidth; x++) {
    platformMap[y][x] = 1;
  }
}

// Obstáculos e plataformas suspensas
// Primeira seção
platformMap[12][5] = 3; platformMap[12][6] = 3; platformMap[12][7] = 3;
platformMap[10][10] = 3; platformMap[10][11] = 3; platformMap[10][12] = 3;
platformMap[8][15] = 3; platformMap[8][16] = 3;

// Escada de blocos (tipo degraus)
platformMap[13][18] = 2;
platformMap[12][19] = 2;
platformMap[11][20] = 2;
platformMap[10][21] = 2;
platformMap[9][22] = 2;

// Segunda seção
platformMap[11][20] = 3; platformMap[11][21] = 3; platformMap[11][22] = 3;
platformMap[9][25] = 3; platformMap[9][26] = 3;
platformMap[13][28] = 2; platformMap[13][29] = 2;

// Terceira seção
platformMap[10][35] = 3; platformMap[10][36] = 3; platformMap[10][37] = 3;
platformMap[8][40] = 3; platformMap[8][41] = 3;
platformMap[12][43] = 3; platformMap[12][44] = 3; platformMap[12][45] = 3;

// Quarta seção - desafio final
platformMap[11][50] = 3; platformMap[11][51] = 3;
platformMap[9][53] = 3; platformMap[9][54] = 3;
platformMap[7][56] = 3; platformMap[7][57] = 3; platformMap[7][58] = 3;

// Alguns blocos decorativos
platformMap[13][33] = 2; platformMap[13][34] = 2;
platformMap[13][48] = 2; platformMap[13][49] = 2;


let joaoPlatform = { x: 1, y: 13, vx: 0, vy: 0, onGround: false };
marianaPos = { x: platformMapWidth - 3, y: 13 };

let camera = { x: 0, y: 0 };

function resetJoaoPlatform() {
  joaoPlatform.x = 1;
  joaoPlatform.y = 13;
  joaoPlatform.vx = 0;
  joaoPlatform.vy = 0;
  joaoPlatform.onGround = false;
  camera.x = 0;
  camera.y = 0;
}

// Física melhorada e mais responsiva
const gravity = 0.2;
const jumpPower = -5;
const moveSpeed = 1.0;
const friction = 0.3;
const acceleration = 0.6;

function updateCamera() {
  if (inLabyrinth) {
    if (zooming) {
      // Animação de zoom
      const elapsed = Date.now() - zoomStartTime;
      const t = Math.min(1, elapsed / zoomDuration);
      tileSizeAnim = 32 + (64 - 32) * t;
      tileSize = tileSizeAnim;
      // Foco já ajustado para Mariana
      const centerX = marianaPos.x * tileSize - canvas.width / 2;
      const verticalOffset = tileSize * 1.5;
      let centerY = marianaPos.y * tileSize - canvas.height / 2 + verticalOffset;
      camera.x = centerX;
      camera.x = Math.max(0, Math.min(camera.x, platformMapWidth * tileSize - canvas.width));
      camera.y = Math.max(0, Math.min(centerY, platformMapHeight * tileSize - canvas.height));
      if (t >= 1) {
        zooming = false;
        tileSize = 64;
      }
    } else if (marianaFound) {
      tileSize = 64;
      const centerX = marianaPos.x * tileSize - canvas.width / 2;
      const verticalOffset = tileSize * 1.5;
      let centerY = marianaPos.y * tileSize - canvas.height / 2 + verticalOffset;
      camera.x = centerX;
      camera.x = Math.max(0, Math.min(camera.x, platformMapWidth * tileSize - canvas.width));
      camera.y = Math.max(0, Math.min(centerY, platformMapHeight * tileSize - canvas.height));
    } else {
      tileSize = 32;
      // A câmera segue o personagem horizontalmente
      const targetCameraX = joaoPlatform.x * tileSize - canvas.width / 2;
      camera.x += (targetCameraX - camera.x) * 0.1;
      camera.x = Math.max(0, Math.min(camera.x, platformMapWidth * tileSize - canvas.width));
      camera.y = 0;
    }
  }
}

function drawMap() {
  if (inLabyrinth) {
    // Visual sombrio até encontrar Mariana
    if (!marianaFound) {
      // Fundo escuro, opressor
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#18181c'); // Preto azulado
      gradient.addColorStop(0.7, '#23232a');
      gradient.addColorStop(1, '#222');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Névoa
      ctx.save();
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc((i * 180 - camera.x * 0.13) % (canvas.width + 120), 80 + Math.sin(i) * 30, 80, 0, Math.PI * 2);
        ctx.fillStyle = '#22242a';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    } else {
      // Visual bonito e agradável ao encontrar Mariana
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB'); // Azul céu claro
      gradient.addColorStop(0.7, '#98D8E8'); // Azul céu médio
      gradient.addColorStop(1, '#B0E0E6'); // Azul céu mais claro no horizonte
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Nuvens
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 5; i++) {
        const cloudX = (i * 200 - camera.x * 0.1) % (canvas.width + 100);
        const cloudY = 50 + Math.sin(i) * 20;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 30, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, cloudY, 35, 0, Math.PI * 2);
        ctx.arc(cloudX + 50, cloudY, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    
    // Calcula quais tiles estão visíveis na tela
    const startX = Math.floor(camera.x / tileSize);
    const endX = Math.min(startX + Math.ceil(canvas.width / tileSize) + 1, platformMapWidth);
    const startY = Math.floor(camera.y / tileSize);
    const endY = Math.min(startY + Math.ceil(canvas.height / tileSize) + 1, platformMapHeight);
    
    // Renderiza apenas os tiles visíveis
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (platformMap[y] && platformMap[y][x]) {
          const drawX = x * tileSize - camera.x;
          const drawY = y * tileSize - camera.y;
          
          if (platformMap[y][x] === 1) {
            // Chão com textura de grama
            ctx.fillStyle = '#2b2b2bff';
            ctx.fillRect(drawX, drawY, tileSize, tileSize);
            ctx.fillStyle = '#3d3d3dff';
            ctx.fillRect(drawX, drawY, tileSize, 8);
            // Adiciona alguns detalhes de grama
            ctx.fillStyle = '#414141ff';
            for (let i = 0; i < 3; i++) {
              ctx.fillRect(drawX + i * 10 + 2, drawY + 2, 2, 6);
            }
          } else if (platformMap[y][x] === 2) {
            // Bloco decorativo com textura de pedra
            ctx.fillStyle = '#696969';
            ctx.fillRect(drawX, drawY, tileSize, tileSize);
            ctx.fillStyle = '#A9A9A9';
            ctx.fillRect(drawX + 4, drawY + 4, tileSize - 8, tileSize - 8);
            ctx.strokeStyle = '#2F4F4F';
            ctx.lineWidth = 2;
            ctx.strokeRect(drawX, drawY, tileSize, tileSize);
          } else if (platformMap[y][x] === 3) {
            // Plataforma suspensa como bloco inteiro
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(drawX, drawY, tileSize, tileSize);
            ctx.fillStyle = '#D2691E';
            ctx.fillRect(drawX + 4, drawY + 4, tileSize - 8, tileSize - 8);
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(drawX, drawY, tileSize, tileSize);
          }
        }
      }
    }
  } else {
    // Renderiza o mapa topdown (map)
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === 1) {
          ctx.fillStyle = '#222';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else {
          ctx.fillStyle = '#F5F5DC';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }
  }
}

// Função para desenhar o personagem principal

function drawJoao() {
  if (inLabyrinth) {
    const drawX = joaoPlatform.x * tileSize - camera.x;
    const drawY = joaoPlatform.y * tileSize - camera.y;
    // Se encontrou a Mariana, usa joao3.png
    if (marianaFound && joao3Img.complete && joao3Img.naturalWidth > 0) {
      ctx.drawImage(joao3Img, drawX, drawY, tileSize, tileSize);
    } else {
      // Animação do João: alterna frame a cada 12 frames do jogo
      const frame = Math.floor(Date.now() / 120) % 2;
      ctx.drawImage(joaoImgs[frame], drawX, drawY, tileSize, tileSize);
    }
    // Desenha Mariana animada
    const marianaFrame = Math.floor(Date.now() / 120) % 2;
    ctx.drawImage(marianaImgs[marianaFrame], marianaPos.x * tileSize - camera.x, marianaPos.y * tileSize - camera.y, tileSize, tileSize);
  } else {
    ctx.drawImage(joaoImgs[joao.frame % 2], joao.x * tileSize, joao.y * tileSize, tileSize, tileSize);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateCamera();
  drawMap();
  // Efeito sombrio do mapa topdown desenhado APÓS o mapa, mas ANTES do personagem/flores
  if (!inLabyrinth) {
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createRadialGradient(
      joao.x * tileSize + tileSize/2,
      joao.y * tileSize + tileSize/2,
      tileSize * 0.5,
      joao.x * tileSize + tileSize/2,
      joao.y * tileSize + tileSize/2,
      tileSize * 3.5
    );
    grad.addColorStop(0, 'rgba(255,255,180,0.45)');
    grad.addColorStop(0.3, 'rgba(255,220,120,0.25)');
    grad.addColorStop(0.7, 'rgba(255,200,80,0.12)');
    grad.addColorStop(1, 'rgba(255,255,220,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(
      joao.x * tileSize - tileSize * 3.5,
      joao.y * tileSize - tileSize * 3.5,
      tileSize * 7,
      tileSize * 7
    );
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }
  if (!inLabyrinth) drawFlowers();
  drawEnemy();
  drawJoao();
  
  // HUD
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, 200, 32);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.font = '16px pixel, monospace';
  ctx.fillText(`Girassóis: ${joao.flowers}/${flowers.length}`, 10, 22);
  ctx.restore();
  
  // Porta bonita
  if (!inLabyrinth && joao.flowers === flowers.length) {
    ctx.save();
    const px = door.x * tileSize + tileSize/2;
    const py = door.y * tileSize + tileSize/2;
    // Corpo da porta
    ctx.beginPath();
    ctx.ellipse(px, py, 12, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#fff8dc';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Borda
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#8B4513';
    ctx.stroke();
    // Detalhe dourado
    ctx.beginPath();
    ctx.arc(px, py+6, 4, 0, Math.PI*2);
    ctx.fillStyle = '#fffbe6';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
    // Brilho
    ctx.beginPath();
    ctx.arc(px-5, py-8, 3, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();
    ctx.restore();
  }
  
  // Mensagem após coletar todos os girassóis
  if (showGoToDoorMsg) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#222';
    ctx.fillRect(canvas.width/2-120, 40, 240, 40);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#9df0ffff';
    ctx.font = '22px pixel, monospace';
    ctx.fillText('Vá para a porta!', canvas.width/2-90, 70);
    ctx.restore();
  }
  
  // Mensagem de introdução ao segundo mapa/plataforma
  if (showPlatformIntroMsg) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#222';
    ctx.fillRect(canvas.width/2-140, 40, 280, 40);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#9df0ffff';
    ctx.font = '20px pixel, monospace';
    ctx.fillText('Vá até o fim do mapa para o tesouro!', canvas.width/2-120, 70);
    ctx.restore();
  }

  // Mensagem fofa centralizada ao encontrar Mariana
  if (showMarianaMessage) {
    ctx.save();
    ctx.globalAlpha = 0.95;
    const boxWidth = 700;
    const boxHeight = 180;
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2;
    ctx.fillStyle = '#fffbe6';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#9df0ffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#222';
    ctx.font = '28px pixel, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Você encontrou o tesouro!', boxX + boxWidth/2, boxY + 45);
    ctx.font = '20px pixel, monospace';
    ctx.fillText('Minha linda, contigo o mundo fica mais bonito', boxX + boxWidth/2, boxY + 85);
    ctx.fillText('Você é meu Sol, e eu sou o girassol, com olhos somente pra ti.', boxX + boxWidth/2, boxY + 115);
    ctx.fillText('Te amo!', boxX + boxWidth/2, boxY + 150);
    ctx.textAlign = 'left';
    ctx.restore();
    // Some após 6 segundos
    if (Date.now() - marianaMessageTimer > 6000) {
      showMarianaMessage = false;
    }
  }

  if (gameOver) {
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = '#fffbe6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#9df0ffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, canvas.width-80, canvas.height-80);

    ctx.fillStyle = '#222';
    ctx.font = '38px pixel, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Fim da Jornada!', canvas.width/2, 110);

    ctx.font = '26px pixel, monospace';
    ctx.fillText(`Girassóis coletados: ${joao.flowers} / ${flowers.length}`, canvas.width/2, 180);

    // Tesouro: animação da Mariana
    const marianaFrame = Math.floor(Date.now() / 220) % 2;
    if (marianaImgs[marianaFrame].complete && marianaImgs[marianaFrame].naturalWidth > 0) {
      ctx.drawImage(marianaImgs[marianaFrame], canvas.width/2 - 64, 220, 128, 128);
    } else {
      ctx.beginPath();
      ctx.arc(canvas.width/2, 284, 60, 0, Math.PI*2);
      ctx.fillStyle = '#f9d5e5';
      ctx.fill();
    }

    ctx.font = '24px pixel, monospace';
    ctx.fillStyle = '#8B4513';
    ctx.fillText('Tesouro encontrado!', canvas.width/2, 390);

    ctx.font = '18px pixel, monospace';
    ctx.fillStyle = '#222';
    ctx.fillText('Obrigado por jogar!', canvas.width/2, canvas.height-60);
    ctx.textAlign = 'left';
    ctx.restore();
  }
}



// Controle de teclas pressionadas para movimento contínuo
let keysDown = {};
let prevJumpPressed = false;

// Suporte ao joystick virtual (mobile)
function setupJoystick() {
  const btnLeft = document.getElementById('btnLeft');
  const btnRight = document.getElementById('btnRight');
  const btnJump = document.getElementById('btnJump');
  if (!btnLeft || !btnRight || !btnJump) return;

  // Helper para eventos touch
  function pressKey(key) { keysDown[key] = true; }
  function releaseKey(key) { keysDown[key] = false; }

  // Esquerda
  btnLeft.addEventListener('touchstart', e => { e.preventDefault(); pressKey('arrowleft'); }, {passive:false});
  btnLeft.addEventListener('touchend', e => { e.preventDefault(); releaseKey('arrowleft'); }, {passive:false});
  btnLeft.addEventListener('touchcancel', e => { e.preventDefault(); releaseKey('arrowleft'); }, {passive:false});

  // Direita
  btnRight.addEventListener('touchstart', e => { e.preventDefault(); pressKey('arrowright'); }, {passive:false});
  btnRight.addEventListener('touchend', e => { e.preventDefault(); releaseKey('arrowright'); }, {passive:false});
  btnRight.addEventListener('touchcancel', e => { e.preventDefault(); releaseKey('arrowright'); }, {passive:false});

  // Pulo
  btnJump.addEventListener('touchstart', e => { e.preventDefault(); pressKey(' '); }, {passive:false});
  btnJump.addEventListener('touchend', e => { e.preventDefault(); releaseKey(' '); }, {passive:false});
  btnJump.addEventListener('touchcancel', e => { e.preventDefault(); releaseKey(' '); }, {passive:false});
}

// Inicializa joystick se existir (após DOM pronto)
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', setupJoystick);
}

window.addEventListener('keydown', e => {
  keysDown[e.key.toLowerCase()] = true;
  
  // Atalho para acessar o segundo mapa (plataforma) instantaneamente
  if (e.key.toLowerCase() === 'm') {
    inLabyrinth = true;
    resetJoaoPlatform();
    showPlatformIntroMsg = true;
    setTimeout(() => { showPlatformIntroMsg = false; draw(); }, 3500);
    draw();
    return;
  }
  
  if (!inLabyrinth) {
    let nx = joao.x;
    let ny = joao.y;
    let currentMap = map;
    let moved = false;
    
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') { ny--; moved = true; }
    else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') { ny++; moved = true; }
    else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') { nx--; moved = true; }
    else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { nx++; moved = true; }
    
    if (currentMap[ny] && currentMap[ny][nx] === 0) {
      joao.x = nx;
      joao.y = ny;
      if (moved) joao.frame = (joao.frame + 1) % 2;
    }
    
    flowers.forEach(flower => {
      if (!flower.collected && joao.x === flower.x && joao.y === flower.y) {
        flower.collected = true;
        joao.flowers++;
        // Se coletou todos os girassóis, mostra mensagem
        if (joao.flowers === flowers.length) {
          showGoToDoorMsg = true;
          setTimeout(() => { showGoToDoorMsg = false; draw(); }, 3000);
        }
      }
    });
    
    // Se coletou todos os girassóis e está na porta, troca para o mapa de plataforma
    if (joao.flowers === flowers.length && joao.x === door.x && joao.y === door.y) {
      inLabyrinth = true;
      resetJoaoPlatform();
      showPlatformIntroMsg = true;
      setTimeout(() => { showPlatformIntroMsg = false; draw(); }, 3500);
      draw();
      return;
    }
  }
  // draw() removido aqui, pois o loop principal já faz o desenho
});

window.addEventListener('keyup', e => {
  keysDown[e.key.toLowerCase()] = false;
});

// Loop de física melhorado e mais responsivo para plataforma
function platformPhysics() {
    // Pulo processado no loop de física para permitir andar e pular juntos
    let jumpPressed = keysDown[' '] || keysDown['arrowup'] || keysDown['w'];
    if (jumpPressed && !prevJumpPressed && joaoPlatform.onGround) {
      joaoPlatform.vy = jumpPower;
      joaoPlatform.onGround = false;
    }
  prevJumpPressed = jumpPressed;
  if (inLabyrinth) {
    // Movimento do inimigo
    if (!marianaFound) {
      enemy.x += enemy.dir * enemy.speed * (tileSize/2);
      if (enemy.x > enemy.maxX) { enemy.x = enemy.maxX; enemy.dir = -1; }
      if (enemy.x < enemy.minX) { enemy.x = enemy.minX; enemy.dir = 1; }
    }

    // Movimento horizontal com aceleração suave
    if (keysDown['arrowleft'] || keysDown['a']) {
      joaoPlatform.vx = Math.max(joaoPlatform.vx - acceleration, -moveSpeed);
    } else if (keysDown['arrowright'] || keysDown['d']) {
      joaoPlatform.vx = Math.min(joaoPlatform.vx + acceleration, moveSpeed);
    } else {
      // Aplica atrito quando não há input
      joaoPlatform.vx *= friction;
      if (Math.abs(joaoPlatform.vx) < 0.05) joaoPlatform.vx = 0;
    }
    
    // Aplica gravidade
    joaoPlatform.vy += gravity;
    
    // Limita velocidade de queda
    if (joaoPlatform.vy > 15) joaoPlatform.vy = 15;
    
    // Salva posição anterior para detecção de colisão
    const prevX = joaoPlatform.x;
    const prevY = joaoPlatform.y;
    
    // Movimento horizontal
    joaoPlatform.x += joaoPlatform.vx * 0.08;
    
    // Verifica colisão horizontal
    let px = Math.floor(joaoPlatform.x);
    let py = Math.floor(joaoPlatform.y);
    
    // Colisão com paredes laterais (melhorada)
    if (joaoPlatform.vx < 0) { // Movendo para esquerda
      let leftPx = Math.floor(joaoPlatform.x - 0.1);
      if (platformMap[py] && ([1,2,3].includes(platformMap[py][leftPx]))) {
        joaoPlatform.x = leftPx + 1.01;
        joaoPlatform.vx = 0;
      }
    } else if (joaoPlatform.vx > 0) { // Movendo para direita
      let rightPx = Math.floor(joaoPlatform.x + 0.9);
      if (platformMap[py] && ([1,2,3].includes(platformMap[py][rightPx]))) {
        joaoPlatform.x = rightPx - 0.9;
        joaoPlatform.vx = 0;
      }
    }
    
    // Movimento vertical
    joaoPlatform.y += joaoPlatform.vy * 0.08;
    
    // Atualiza posição para verificação de colisão vertical
    px = Math.floor(joaoPlatform.x);
    py = Math.floor(joaoPlatform.y);
    
    // Colisão com o chão (corrigida e aprimorada para plataformas suspensas)
    if (joaoPlatform.vy >= 0) { // Caindo
      let nextPy = Math.floor(joaoPlatform.y + 1);
      if (platformMap[nextPy]) {
        let tile = platformMap[nextPy][px];
        // Para plataforma suspensa (3): só colide se estava acima do tile na iteração anterior (prevY + 1 <= nextPy)
        if (tile === 1 || tile === 2 || (tile === 3 && prevY + 1 <= nextPy && joaoPlatform.y + 1 > nextPy)) {
          // Ajuste: alinhar base do personagem exatamente sobre a plataforma (valor exato)
          joaoPlatform.y = nextPy - 1;
          joaoPlatform.vy = 0;
          joaoPlatform.onGround = true;
        } else {
          joaoPlatform.onGround = false;
        }
      } else {
        joaoPlatform.onGround = false;
      }
    }
    
    // Colisão com teto (melhorada)
    if (joaoPlatform.vy < 0) { // Subindo
      let upPy = Math.floor(joaoPlatform.y - 0.1);
      if (platformMap[upPy] && ([1,2,3].includes(platformMap[upPy][px]))) {
        joaoPlatform.y = upPy + 1.01;
        joaoPlatform.vy = 0;
      }
    }
    
    // Limites do mapa
    if (joaoPlatform.x < 0) {
      joaoPlatform.x = 0;
      joaoPlatform.vx = 0;
    }
    if (joaoPlatform.x > platformMapWidth - 1) {
      joaoPlatform.x = platformMapWidth - 1;
      joaoPlatform.vx = 0;
    }
    
    // Reset se cair muito
    if (joaoPlatform.y > platformMapHeight + 5) {
      resetJoaoPlatform();
    }
    
    // Verifica colisão com Mariana (precisa tocar na sprite dela)
    if (!marianaFound) {
      const dx = Math.abs(joaoPlatform.x - marianaPos.x);
      const dy = Math.abs(joaoPlatform.y - marianaPos.y);
      if (dx < 0.7 && dy < 1) {
        marianaFound = true;
        // Inicia animação de zoom
        zooming = true;
        zoomStartTime = Date.now();
        setTimeout(() => {
          showMarianaMessage = true;
          marianaMessageTimer = Date.now();
          // Exibe tela final 2s após sumir a placa
          setTimeout(() => {
            setTimeout(() => { gameOver = true; }, 2000);
          }, 6000);
        }, zoomDuration - 100); // Mensagem aparece quase junto do fim do zoom
      }
      // Colisão com inimigo
      const dxE = Math.abs(joaoPlatform.x - enemy.x);
      const dyE = Math.abs(joaoPlatform.y - enemy.y);
      if (dxE < 0.7 && dyE < 0.9) {
        resetJoaoPlatform();
      }
    }
  }
}

// Loop principal do jogo

function gameLoop() {
  platformPhysics();
  draw();
  requestAnimationFrame(gameLoop);
}

// Inicia o loop do jogo ao carregar o script
gameLoop();

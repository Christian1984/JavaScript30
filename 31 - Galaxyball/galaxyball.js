let canDie = false;
var ups = 3;

function gameOver() {
  document.querySelector('.gameover').classList.add('gameover--active');
}

function getPixelSize(elem, prop) {
  return parseInt(window.getComputedStyle(elem, null)
    .getPropertyValue(prop).slice(0, -2));
}

function moveElem(elem, pos, velocity, canvas) {
    let cSize = { 
      width: getPixelSize(canvas, 'width'), 
      height: getPixelSize(canvas, 'height')
    };

    if (pos.x + velocity.x > cSize.width || pos.x + velocity.x < 0) {
      velocity.x *= -1;
    }

    if (pos.y + velocity.y < 0) {
      velocity.y *= -1;
    }
    else if (pos.y + velocity.y > cSize.height) {
      if (ups-1 < 1) {
        gameOver();
        return;
      }

      ups--;

      pos.x = getPixelSize(canvas, 'width') / 2;
      pos.y = getPixelSize(canvas, 'height') / 2;

      if (velocity.y > 0) {
        velocity.y *= -1;
      }
    }

    pos.x += velocity.x;
    pos.y += velocity.y;

    elem.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
}

function isColliding(e1Pos, e1Size, e2Pos, e2Size) {
  let r1 = {
    l: e1Pos.x,
    t: e1Pos.y,
    r: e1Pos.x + e1Size.width,
    b: e1Pos.y + e1Size.height
  };
  
  let r2 = {
    l: e2Pos.x,
    t: e2Pos.y,
    r: e2Pos.x + e2Size.width,
    b: e2Pos.y + e2Size.height
  };

  if (r1.r > r2.l && r1.l < r2.r && r1.b > r2.t && r1.t < r2.b) {
    return true;
  }

  return false;
}

function updateScoreboard(scoreDisplay, score, upDisplay, ups) {
  scoreDisplay.innerHTML = `Score: ${score}`;
  upDisplay.innerHTML = `Ups: ${ups}`;
}

(function() {
  let framerate = 60;
  var score = 0;

  let ball = document.querySelector('.ball');
  let canvas = document.querySelector('.canvas');
  let paddle = document.querySelector('.paddle');
  let scoreDisplay = document.querySelector('.score-display');
  let upDisplay = document.querySelector('.up-display');

  let defaultBVelocity = 5;
  let bVelocity = {x: defaultBVelocity, y: - defaultBVelocity};
  let bPos = {x: getPixelSize(canvas, 'width') / 2, y: getPixelSize(canvas, 'height') / 2};

  let defaultPVelocity = 10;
  var pVelocity = 0;
  let pPos = {x: (getPixelSize(canvas, 'width') - getPixelSize(paddle, 'width')) / 2, y: getPixelSize(canvas, 'height') - 3 * getPixelSize(paddle, 'height')}

  let blocks = [];
  moveElem(paddle, pPos, {x: 0, y: 0}, canvas);
  moveElem(ball, bPos, {x: 0, y: 0}, canvas);

  let blockRows = 5;
  let blockCols = 10;

  let blockWidth = 40;
  let blockHeight = 12;

  var blockXOffset = (getPixelSize(canvas, 'width') - blockCols * blockWidth) / 2;
  var blockX = blockXOffset;
  var blockY = 100;

  for (var row = 0; row < blockRows; row++) {
    for (var col = 0; col < 10; col++) {
      let block = document.createElement('div');
      block.className = 'block';
      canvas.appendChild(block);
      blocks.push({ block, blockX, blockY });

      block.style.transform = `translate(${blockX}px, ${blockY}px)`;
      blockX += blockWidth;
    }
    blockY += blockHeight;
    blockX = blockXOffset;
  }

  updateScoreboard(scoreDisplay, score, upDisplay, ups);

  window.setInterval(() => {
    moveElem(paddle, pPos, {x: pVelocity, y: 0}, canvas);
    moveElem(ball, bPos, bVelocity, canvas);

    if (isColliding(
      pPos, {width: getPixelSize(paddle, 'width'), height: getPixelSize(paddle, 'height')}, 
      bPos, {width: getPixelSize(ball, 'width'), height: getPixelSize(ball, 'height')})) 
      {
        bVelocity.y *= -1;
        moveElem(ball, bPos, bVelocity, canvas);
        score += 50;
      }
    
    blocks.forEach(block => {
      //console.log(block.className);
      if (block.block.className !== 'block--hidden' && isColliding(
        bPos, {width: getPixelSize(ball, 'width'), height: getPixelSize(ball, 'height')}, 
        {x: block.blockX, y:block.blockY}, {width: blockWidth, height: blockHeight}
      )) {
        block.block.className='block--hidden';
        bVelocity.y *= -1;
        score += 1000;
      }
    });

    updateScoreboard(scoreDisplay, score, upDisplay, ups);
  }, 1000 / framerate);

  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
      pVelocity = -defaultPVelocity;
    }
    else if (e.keyCode === 39) {
      pVelocity = defaultPVelocity
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.keyCode === 37 || e.keyCode === 39) {
      pVelocity = 0;
    }
  });
})();
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

    if (pos.y + velocity.y > cSize.height || pos.y + velocity.y < 0) {
      velocity.y *= -1;
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

(function() {
  let framerate = 60;

  let ball = document.querySelector('.ball');
  let canvas = document.querySelector('.canvas');
  let paddle = document.querySelector('.paddle');

  let defaultBVelocity = 5;
  let bVelocity = {x: defaultBVelocity, y: - defaultBVelocity};
  let bPos = {x: getPixelSize(canvas, 'width') / 2, y: getPixelSize(canvas, 'height') / 2};

  let defaultPVelocity = 10;
  var pVelocity = 0;
  let pPos = {x: (getPixelSize(canvas, 'width') - getPixelSize(paddle, 'width')) / 2, y: getPixelSize(canvas, 'height') - 3 * getPixelSize(paddle, 'height')}

  moveElem(paddle, pPos, {x: 0, y: 0}, canvas);
  moveElem(ball, bPos, {x: 0, y: 0}, canvas);

  window.setInterval(() => {
    moveElem(paddle, pPos, {x: pVelocity, y: 0}, canvas);
    moveElem(ball, bPos, bVelocity, canvas);

    if (isColliding(
      pPos, {width: getPixelSize(paddle, 'width'), height: getPixelSize(paddle, 'height')}, 
      bPos, {width: getPixelSize(ball, 'width'), height: getPixelSize(ball, 'height')})) 
      {
        bVelocity.y *= -1;
        moveElem(ball, bPos, bVelocity, canvas);
      }
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
document.addEventListener("DOMContentLoaded", () => {
  const claw = document.getElementById("claw");
  const gameArea = document.getElementById("gameArea");
  const speed = 2;
  let position = { top: 0, left: 10 };
  let activeKeys = {};
  let grabbedToy = null;

  const toyDropY = gameArea.offsetHeight - (claw.offsetHeight / 2);

  function moveClaw() {
    let newTop = position.top;
    let newLeft = position.left;

    if (activeKeys["ArrowUp"]) {
      newTop = Math.max(0, position.top - speed);
    }
    if (activeKeys["ArrowDown"]) {
      const gameAreaHeight = gameArea.offsetHeight;
      const clawHeight = claw.offsetHeight;
      newTop = Math.min(gameAreaHeight - clawHeight, position.top + speed);
    }
    if (activeKeys["ArrowLeft"]) {
      newLeft = Math.max(0, position.left - speed);
    }
    if (activeKeys["ArrowRight"]) {
      const gameAreaWidth = gameArea.offsetWidth;
      const clawWidth = claw.offsetWidth;
      newLeft = Math.min(gameAreaWidth - clawWidth, position.left + speed);
    }

    position.top = newTop;
    position.left = newLeft;

    claw.style.top = position.top + "px";
    claw.style.left = position.left + "px";

    if (grabbedToy) {
      grabbedToy.style.top = claw.style.top;
      grabbedToy.style.left = claw.style.left;
    }
  }

  function gameLoop() {
    moveClaw();
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", (e) => {
    activeKeys[e.key] = true;

    if (e.key === "g" || e.key === "G") {
      if (!e.repeat) {
        if (grabbedToy) {
          releaseToy();
        } else {
          grabToy();
        }
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    delete activeKeys[e.key];
  });

  gameLoop();

  function grabToy() {
    if (grabbedToy) {
      return;
    }

    const toys = document.querySelectorAll(".toy");
    const clawRect = claw.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    for (let toy of toys) {
      if (toy.classList.contains("falling")) {
          continue;
      }

      const toyRect = toy.getBoundingClientRect();

      const isTouching =
        clawRect.left < toyRect.right &&
        clawRect.right > toyRect.left &&
        clawRect.top < toyRect.bottom &&
        clawRect.bottom > toyRect.top;

      if (isTouching) {
        toy.classList.remove("falling");

        toy.style.position = "absolute";

        if (toy.parentNode !== gameArea) {
            toy.parentNode.removeChild(toy);
            gameArea.appendChild(toy);
        }

        toy.style.left = claw.style.left;
        toy.style.top = claw.style.top;

        grabbedToy = toy;
        // console.log("Peluche attrapée :", grabbedToy.textContent);
        // return;
      }
    }
  }

  function releaseToy() {
    if (!grabbedToy) {
      return;
    }

    const toyToRelease = grabbedToy;

    toyToRelease.classList.add("falling");

    toyToRelease.style.top = toyDropY + "px"; 

    toyToRelease.addEventListener("transitionend", function handler() {
        toyToRelease.classList.remove("falling");
    
        toyToRelease.removeEventListener("transitionend", handler);
    });

    console.log("Peluche relâchée :", toyToRelease.textContent);
    grabbedToy = null;
  }
});
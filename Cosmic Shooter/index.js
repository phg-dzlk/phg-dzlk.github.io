class Node {
    constructor(element) {
        this.element = element;
        this.next = null
    }
}
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    add(element) {
        var node = new Node(element);
        var current;
        if (this.head == null) this.head = node;
        else {
            current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.size++;
    }

    removeFrom(index) {
        if (index >= 0 && index < this.size) {
            var curr, prev, it = 0;
            curr = this.head;
            prev = curr;

            if (index === 0) {
                this.head = curr.next;
            } else {
                while (it < index) {
                    it++;
                    prev = curr;
                    curr = curr.next;
                }
                prev.next = curr.next;
            }
            this.size--;
        }
    }

    getAsArray() {
        var arr = Array(this.size);
        var curr = this.head;
        var i = 0;
        while (curr) {
            arr[i++] = curr.element;
            curr = curr.next;
        }
        return arr;
    }
}

class Sound {
    constructor(src, volume = 1, toggleOff = false) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.volume = volume;
        this.available = true;
        this.toggleOff = toggleOff;
        document.head.appendChild(this.sound);
        this.play = function () {
            if (this.available && !this.toggleOff) {
                this.sound.play();
            }
        };
        this.stop = function () {
            this.sound.pause();
        };
    }
}

// ================ \\
// vars initialization

const minAngle = 0;
const maxAngle = 30;
const bulletSpeed = 420;
const maxBullets = 30;
const evilHitbox = 30;

const colors = {
    Black: "#000000",
    White: "#ffffff",
    Red: "#ff0000",
    Orange: "#ff9900",
    Yellow: "#ffff00",
    LightBlue: "#66d9ff",
    Blue: "#1237ff",
    DarkBlue: "#0000cc",
    Purple: "#cc00cc",
    PurpleGray: "#52527a"
}

const stars = Array(20);
for (let i = 0; i < stars.length; i++) {
    stars[i] = Array(3);
}

const bullets = new LinkedList();

const evil = [300, -100]; // just a regular bad & evil creature which of course you can find anywhere in space

playState = false;
currentGunIsLeft = true;
gunCooldown = 0;
evilSpeed = 60;
curAngle = 15;
score = 0;

// sounds initialization
// // SFX
sJoystickPull = new Sound("resources/sounds/joystick_pull.mp3");
sJoystickRelease = new Sound("resources/sounds/joystick_release.mp3");
sButtonPush = new Sound("resources/sounds/button_push.mp3");
sButtonRelease = new Sound("resources/sounds/button_release.mp3");
gameSounds = [
    sResetYaw = new Sound("resources/sounds/reset_yaw.mp3", volume = 0.4, toggleOff = true),
    sFire = new Sound("resources/sounds/fire.mp3", volume = 0.4, toggleOff = true),
    sHit = new Sound("resources/sounds/hit.mp3", volume = 0.6, toggleOff = true),
    sDeath = new Sound("resources/sounds/death.mp3", volume = 0.6, toggleOff = true),
    sTenKills = new Sound("resources/sounds/ten_kills.mp3", volume = 0.6, toggleOff = true)
];

musicOn = true;
soundOn = true;

// =======================================|
tssc = 0; // thruster sprite shift counter |
// =======================================|

function rotateShip(angle) {
    if (angle > 0) {
        if (curAngle + angle <= maxAngle) {
            curAngle += angle;
        }
    } else {
        if (curAngle + angle >= minAngle) {
            curAngle += angle;
        }
    }
}

function fire() {
    // starting the game here bc I'm the dumbass shitcode god
    if (!playState) {
        playState = !playState;
        document.getElementById("bg_theme").play();
        document.getElementById("thruster_ambient").play();
        for (let i = 0; i < gameSounds.length; i++) {
            gameSounds[i].toggleOff = false;
        }
        return
    }
    bx = 0;
    by = 315
    if (currentGunIsLeft) {
        bx = 215;
    } else {
        bx = 385;
    }
    currentGunIsLeft = !currentGunIsLeft;
    let bullet = [bx, by, curAngle];
    bullets.add(bullet);
    if (bullets.size > maxBullets) {
        bullets.removeFrom(0);
    }
    sFire.play();
    gunCooldown = 25;
}

function resetYaw() {
    curAngle = 15;
    sResetYaw.play();
    sResetYaw.available = false;
}

// ========|
// DRAWING |
// ========|

function drawStartHint(context) {
    context.font = "30px Arial";
    context.fillStyle = colors.Red;
    context.fillText("Press fire (up)\nto start the game", 56, 204);
    context.fillStyle = colors.Yellow;
    context.fillText("Press fire (up)\nto start the game", 50, 200);
}

function drawShip(context) {
    // arm
    context.beginPath();
    context.rect(210, 340, 180, 25);
    context.fillStyle = colors.DarkBlue;
    context.fill();

    //guns
    context.fillStyle = colors.Yellow;
    // // left
    context.beginPath();
    context.rect(200, 330, 30, 45);
    context.fill();
    context.beginPath();
    context.rect(210, 315, 10, 20);
    context.fill();
    // // right
    context.beginPath();
    context.rect(370, 330, 30, 45);
    context.fill();
    context.beginPath();
    context.rect(380, 315, 10, 20);
    context.fill();

    // thrusters
    tssc = tssc >= 2 ? 0 : tssc + 1;

    context.strokeStyle = colors.Red;
    context.lineWidth = 20;
    context.beginPath();

    context.moveTo(290 - tssc * 3, 400);
    context.lineTo(300, 390);
    context.lineTo(310 + tssc * 4, 400);
    context.stroke();


    context.strokeStyle = colors.Orange;
    context.lineWidth = 12;
    context.beginPath();

    context.moveTo(290 - tssc * 2, 400);
    context.lineTo(300, 392);
    context.lineTo(310 + tssc * 3, 400);
    context.stroke();


    context.strokeStyle = colors.Yellow;
    context.lineWidth = 9;
    context.beginPath();

    context.moveTo(295 - tssc, 400);
    context.lineTo(300, 395);
    context.lineTo(305 + tssc * 2, 400);
    context.stroke();

    // body
    context.beginPath();
    context.rect(260, 320, 80, 65);
    context.fillStyle = colors.Blue;
    context.fill();
    context.beginPath();
    context.rect(275, 310, 50, 10);
    context.fill();
    context.beginPath();
    context.rect(290, 270, 20, 40);
    context.fill();
    context.beginPath();
    context.arc(300, 265, 17, 0, 2 * Math.PI);
    context.fillStyle = colors.Red;
    context.fill();

    // body window
    context.beginPath();
    context.rect(275, 330, 50, 15);
    context.fillStyle = colors.LightBlue;
    context.fill();
    // // glass glare
    context.strokeStyle = colors.White;
    context.lineWidth = 1;
    // // // upper
    context.beginPath();
    context.moveTo(277, 334);
    context.lineTo(279, 332);
    context.stroke();
    context.beginPath();
    context.moveTo(277, 339);
    context.lineTo(284, 332);
    context.stroke();
    context.beginPath();
    context.moveTo(277, 344);
    context.lineTo(289, 332);
    context.stroke();
    // // // lower
    context.beginPath();
    context.moveTo(315, 343);
    context.lineTo(323, 335);
    context.stroke();
    context.beginPath();
    context.moveTo(319, 343);
    context.lineTo(323, 339);
    context.stroke();
}

function drawArrow(context) {
    x = 560;
    y = 340;
    cx = 560;
    cy = 380;

    [nx, ny] = rotate(cx, cy, x, y, -(curAngle - 15) * 2);

    context.fillStyle = colors.PurpleGray;
    context.beginPath();

    context.rect(520, 320, 80, 80);
    context.fill();


    context.strokeStyle = colors.Red;
    context.lineWidth = 5;
    context.beginPath();

    context.moveTo(cx, cy);
    context.lineTo(nx, ny);
    context.stroke();

    context.beginPath();
    context.moveTo(540, 380);
    context.lineTo(580, 380);
    context.stroke();
}

function drawStars(context) {
    context.fillStyle = colors.White;
    for (let i = 0; i < stars.length; i++) {
        star = stars[i];

        context.beginPath();

        x = star[0];
        y = star[1];
        r = star[2];
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fill();
    }
}

function drawEvil(context) {
    x = evil[0];
    y = evil[1];
    context.fillStyle = colors.Purple;

    // body
    context.beginPath();
    context.arc(x, y, 30, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = colors.Black;

    // left eyehole
    context.beginPath();
    context.moveTo(x - 3, y - 5);
    context.lineTo(x - 10, y - 20);
    context.lineTo(x - 18, y - 15);
    context.lineTo(x - 20, y - 5);
    context.closePath();
    context.fill();

    // right eyehole
    context.beginPath();
    context.moveTo(x + 3, y - 5);
    context.lineTo(x + 10, y - 20);
    context.lineTo(x + 18, y - 15);
    context.lineTo(x + 20, y - 5);
    context.closePath();
    context.fill();

    context.fillStyle = colors.Red;

    // left eyeball
    context.beginPath();
    context.arc(x - 10, y - 9, 6, 0, 2 * Math.PI);
    context.fill();

    // right eyeball
    context.beginPath();
    context.arc(x + 10, y - 9, 6, 0, 2 * Math.PI);
    context.fill();

    context.fillStyle = colors.White;

    // mouth
    context.beginPath();
    context.moveTo(x - 20, y + 8);
    context.lineTo(x - 10, y + 19);
    context.lineTo(x, y + 21);
    context.lineTo(x + 10, y + 19);
    context.lineTo(x + 20, y + 8);
    context.lineTo(x + 13, y + 12);
    context.lineTo(x - 13, y + 12);
    context.closePath();
    context.fill();

    context.strokeStyle = colors.Black;
    context.lineWidth = 1;

    // teeth
    context.beginPath();
    context.moveTo(x - 15, y + 13);
    context.lineTo(x - 13, y + 12);
    context.lineTo(x - 11, y + 18);
    context.lineTo(x - 8, y + 12);
    context.lineTo(x - 4, y + 20);
    context.lineTo(x, y + 12);
    context.lineTo(x + 3, y + 20);
    context.lineTo(x + 8, y + 12);
    context.lineTo(x + 11, y + 18);
    context.lineTo(x + 13, y + 12);
    context.lineTo(x + 15, y + 13);
    context.stroke();
}

function drawBullets(context) {
    context.fillStyle = colors.Orange;
    let bulletsArray = bullets.getAsArray();
    for (let i = 0; i < bulletsArray.length; i++) {
        let bullet = bulletsArray[i];
        x = bullet[0];
        y = bullet[1];
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fill();

        // drawing blasts from new bullets
        if (gunCooldown) {
            x = currentGunIsLeft ? 385 : 215;
            y = 310;

            context.strokeStyle = colors.Red;
            context.lineWidth = 10;

            context.beginPath();
            context.moveTo(x - 2, y + 3);
            context.lineTo(x, y - 2);
            context.lineTo(x + 2, y + 3);
            context.lineTo(x - 3, y - 1);
            context.lineTo(x + 3, y - 1);
            context.closePath();
            context.stroke();

            gunCooldown--;
        }
    }
}

function drawScore(context) {
    let msg = "SCORE: " + score;
    context.fillStyle = score > 0 ? colors.White : colors.Red;
    context.font = "20px Arial";
    context.fillText(msg, 20, 30);
}

function draw(context) {
    context.clearRect(0, 0, 600, 400);
    switch (playState) {
        case false:
            drawStars(context);
            drawStartHint(context);
            break;
        case true:
            drawStars(context);
            drawShip(context);
            drawBullets(context);
            drawEvil(context);
            drawArrow(context);
            drawScore(context);
            break;
    }
}

// =======|
// UPDATE |
// =======|

function update(timePassed, speed) {
    if (!playState) {
        for (let i = 0; i < stars.length; i++) {
            star = stars[i];
            x = star[0]
            y = star[1] + timePassed * speed;

            randomShift = Math.random() * 0.20 - 0.10;
            if (x > 610) {
                x = -5;
            } else if (x < -10) {
                x = 605;
            }
            if (y > 410) {
                y = -5;
            } else if (y < -10) {
                y = 405;
            }

            star[0] = x + randomShift;
            star[1] = y + randomShift;
        }
        return
    }

    shipX = 300;
    shipY = 320;

    // update stars
    for (let i = 0; i < stars.length; i++) {
        star = stars[i];
        x = star[0];
        y = star[1] + timePassed * speed;
        [nx, ny] = rotate(shipX, shipY, x, y, (curAngle - 15) / 5);

        randomShift = Math.random() * 0.20 - 0.10;
        if (nx > 610) {
            nx = -5;
        } else if (nx < -10) {
            nx = 605;
        }
        if (ny > 410) {
            ny = -5;
        } else if (ny < -10) {
            ny = 405;
        }

        star[0] = nx + randomShift;
        star[1] = ny + randomShift;
    }

    // update evil
    // // move to the player
    cx = evil[0];
    cy = evil[1];
    x = evil[0];
    y = evil[1] + timePassed * evilSpeed;
    angle = getAngleDeg(cx, cy, x, y, shipX, shipY);
    [nx, ny] = rotate(cx, cy, x, y, -angle + 15);

    // // rotate coordinates relative to the ship
    [nx, ny] = rotate(shipX, shipY, nx, ny, (curAngle - 15) / 5);

    evil[0] = nx;
    evil[1] = ny;

    // // if the evil hit the player
    if (evil[0] >= 250 && evil[0] <= 340) {
        if (evil[1] >= 300 && evil[1] <= 420) {
            replaceEvil();
            score = 0;
            sDeath.play();
        }
    }


    // update bullets
    let bulletsArray = bullets.getAsArray();
    for (let i = 0; i < bulletsArray.length; i++) {
        bullet = bulletsArray[i];
        // rotating bullet vectors
        bullet[2] += (curAngle - 15) / 5;

        // calculating new bullet positions
        // // move by vector direction
        distance = timePassed * bulletSpeed;
        cx = bullet[0];
        cy = bullet[1];
        x = bullet[0];
        y = bullet[1] - distance;
        angle = bullet[2] - 15;
        [nx, ny] = rotate(cx, cy, x, y, angle);

        // // rotate coordinates relative to the ship
        x = nx
        y = ny + timePassed * speed;
        [nx, ny] = rotate(shipX, shipY, nx, ny, (curAngle - 15) / 5);

        bullet[0] = nx;
        bullet[1] = ny;
    }

    if (bulletHitTheEvil()) {
        replaceEvil();
        score++;
        sHit.play();
        evilSpeed += 2.5;
        if (score % 10 == 0) {
            sTenKills.play();
        }
    }
}

// ===================|
// OTHER MISC METHODS |
// ===================|

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle;
    cos = Math.cos(radians);
    sin = Math.sin(radians);
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

function bulletHitTheEvil() {
    let bulletsArray = bullets.getAsArray();
    for (let i = 0; i < bulletsArray.length; i++) {
        let bullet = bulletsArray[i];

        // if bullet is between evil's left and right hitbox borders
        if (bullet[0] >= evil[0] - evilHitbox && bullet[0] <= evil[0] + evilHitbox) {
            // same for top & bottom borders
            if (bullet[1] >= evil[1] - evilHitbox && bullet[1] <= evil[1] + evilHitbox) {
                bullets.removeFrom(i);
                return true;
            }
        }
    }
    return false;
}

function replaceEvil() {
    evil[0] = (Math.random() * 1000) - 200;
    evil[1] = (Math.random() * 100) - 135;
}

function getAngleDeg(cx, cy, dx, dy, x, y) { // FIXME: it works very strange probably bc i'm dumb at geometry but it's ok...
    cx += 1000;
    cy += 1000;
    dx += 1000;
    dy += 1000;
    x += 1000;
    y += 1000;
    vx = x - cx;
    vy = y - cy;
    vectorProduct = dx * vy - dy * vx;
    scalarProduct = dx * vx + dy * vy;
    angleRad = Math.atan2(vectorProduct, scalarProduct);
    angleDeg = angleRad * (180 / Math.PI);
    return angleDeg;
}

function switchMusic() {
    music = document.getElementById("bg_theme");
    musicIcon = document.getElementById("toggle_music_img");
    if (musicOn) {
        music.pause();
        musicIcon.src = "resources/images/music_off.png";
    } else {
        music.play();
        musicIcon.src = "resources/images/music_on.png";
    }
    musicOn = !musicOn;
}

function switchSound() {
    thruster = document.getElementById("thruster_ambient");
    soundIcon = document.getElementById("toggle_sound_img");
    if (soundOn) {
        thruster.pause();
        for (let i = 0; i < gameSounds.length; i++) {
            gameSounds[i].toggleOff = true;
        }
        soundIcon.src = "resources/images/sound_off.png";
    } else {
        thruster.play();
        for (let i = 0; i < gameSounds.length; i++) {
            gameSounds[i].toggleOff = false;
        }
        soundIcon.src = "resources/images/sound_on.png";
    }
    soundOn = !soundOn;
}

// =======|
// UI etc |
// =======|

window.onload = function () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    joystick = document.getElementById("joystick");
    btnFire = document.getElementById("button_fire");
    btnDown = document.getElementById("button_down");

    document.getElementById("bg_theme").volume = 0.6;
    document.getElementById("thruster_ambient").volume = 0.6;

    // initializing stars start positions
    for (let i = 0; i < stars.length; i++) {
        star = stars[i];
        star[0] = Math.floor(Math.random() * 600); // x
        star[1] = Math.floor(Math.random() * 400); // y
        star[2] = Math.floor(Math.random() * 10); // star size
        stars[i] = star;
    }

    var t = Date.now();
    let speed = 50;

    function gameLoop() {
        var timePassed = (Date.now() - t) / 1000;
        t = Date.now();

        update(timePassed, speed);
        draw(context);

        window.requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

/*
could use "keypress" here, but for Mozilla Firefox, as of Firefox 65,
the keypress event is no longer fired for non-printable keys.
*/
fired = false;
window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
        e.preventDefault();
        rotateShip(2);
        joystick.style.transform = 'rotate(2deg)';
        sJoystickPull.play();
        sJoystickPull.available = false;
    }
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (fired) {
            return;
        } else {
            fire();
            fired = true;
            btnFire.style.transform = 'translateY(32%)';
            sButtonPush.play();
            sButtonPush.available = false;
        }
    }
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        rotateShip(-2);
        joystick.style.transform = 'rotate(-2deg)';
        sJoystickPull.play();
        sJoystickPull.available = false;
    }
    if (e.key === "ArrowDown") {
        e.preventDefault();
        resetYaw();
        btnDown.style.transform = 'translateY(32%)';
        sButtonPush.play();
        sButtonPush.available = false;
    }
});

window.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        joystick.style.transform = 'rotate(' + 0 + 'deg)';
        sJoystickRelease.play();
        sJoystickPull.available = true;
    }
    if (e.key === "ArrowUp") {
        fired = false;
        btnFire.style.transform = 'translateY(0)';
        sButtonRelease.play();
        sButtonPush.available = true;
    }
    if (e.key === "ArrowDown") {
        e.preventDefault();
        btnDown.style.transform = 'translateY(0)';
        sButtonRelease.play();
        sButtonPush.available = true;
        sResetYaw.available = true;
    }
});

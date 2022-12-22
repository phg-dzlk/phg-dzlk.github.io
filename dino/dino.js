window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    var t = Date.now();
    var grndHeight = 300;
    var x = 100, y = 280;
    var sx = 30, sy = 30;
    var dy = 0;
    var cactus = false;
    var cactusX;
    var cactusY = 300;
    var cactusHeight;
    var gameSpeed = 1;
    var pts = 0;
    var highscore = 0;
    var dino = document.getElementById("dinoPic");
    window.onkeydown = function() {
        if (y >= grndHeight - sy) dy = -350;
    }
    window.ontouchstart = function() {
        if (y >= grndHeight - sy) dy = -350;
    }
    window.onclick = function() {
        if (y >= grndHeight - sy) dy = -350;
    }
    function mainLoop() {
        var tPassed = (Date.now() - t) / 1000;
        t = Date.now();
        y += dy * tPassed;
        if (y >= grndHeight - sy) {
            dy = 0;
            y = grndHeight - sy;
        }
        else if (y <= 180) dy = 200;
        ctx.clearRect(0, 0, 600, 400);
        drawPts();
        pts += gameSpeed * tPassed;
        if (pts / 50 >= gameSpeed) gameSpeed += 1;
        drawHighscore();
        drawBG();
        drawDino();
        drawObstacles();
        collisionCheck();
        window.requestAnimationFrame(mainLoop);
    }
    function drawPts() {
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.font = "50px Arial";
        ctx.fillText(Math.round(pts), 300, 100);
    }
    function drawHighscore() {
        if (highscore > 0) {
            ctx.fillStyle = "#000000";
            ctx.font = "20px Arial";
            ctx.fillText("Highscore: " + highscore, 20, 40);
        }
    }
    function drawBG() {
        ctx.beginPath();
        ctx.fillStyle = "#6c3b0f";
        ctx.rect(0, 300, 600, 100);
        ctx.fill();
    }
    function drawDino() {
        ctx.beginPath();
        ctx.drawImage(dino, x, y, sx, sy);
    }
    function drawObstacles() {
        if (!cactus) {
            cactus = !cactus;
            cactusX = 800 + (Math.random() * 1000);
            cactusHeight = Math.round(Math.random() * 30 + 30);
        }
        else {
            if (cactusX < -100) cactus = !cactus;
            else cactusX -= gameSpeed * 2 + 4;
        }
        ctx.beginPath();
        ctx.fillStyle = "#00ff00";
        ctx.rect(cactusX, cactusY - cactusHeight, 25, cactusHeight);
        ctx.fill();
    }
    function collisionCheck() {
        if (x + sx >= cactusX && x <= cactusX + 25) {
            if (y + sy >= cactusY - cactusHeight) {
                var score = Math.round(pts);
                pts = 0;
                gameSpeed = 1;
                if (score > highscore) highscore = score;
            }
        }
    }
    mainLoop();
}

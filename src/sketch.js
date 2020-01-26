var players = [];
var game = false;
let scoreToWin = 3;
var mode = 0;
var winner = 0;
var surv = new survival();
var currentBackground = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    surv.getUpgrades();
}

function draw() {
    switch (mode) {
        case 0:
            drawMenu();
            break;
        case 1:
            pvp();
            break;
        case 2:
            pve();
            break;
        case 3:
            survivalCucle();
            break;
    }
}

function drawMenu() {
    background(0, 0, 255);
    textSize(width / 15);
    text("H A R D C O R E  T R A I N S", width / 25, height / 5);
    textSize(width / 15);
    fill("pink");
    ellipse(width / 5, height / 2, width / 5, width / 5);
    ellipse(width / 5 * 4, height / 2, width / 5, width / 5);
    ellipse(width / 2, height / 2, width / 3, width / 3);
    fill("red");
    text("pvp", width / 6.6, height / 1.97);
    text("pve", width / 5.3 * 4, height / 1.97);
    text("survival", width / 2.55, height / 1.97);
}

function startSurvival() {
    mode = 3;
    currentBackground = int(random(0, backgrounds.length - 0.1));
    players.push(new player(38, 40, 32, width / 10 * 9 - 50, width / 10 * 9 - 100));
}

function survivalCucle() {
    if (game) {
        image(backgrounds[currentBackground], 0, 0, width, height);
        surv.moveDrawMobs();
        drawPlayers();
        movePlayers();
        textSize(25);
        text("bank: " + surv.bank + "$", 10, 30);
        text("hp: " + surv.hp, width / 2 - 30, 30);
        text("level: " + surv.level, 10, 60);
        surv.drawUpgrades();
        surv.collision(players[0].bullets);
        surv.levelUp();
        if (surv.hp == 0) {
            winner = 3;
            game = false;
            restartSurvival();
        }
    } else {
        gameOver(winner);
    }
}

function restartSurvival() {
    stop();
    surv.level = 0;
    surv.hp = surv.startHp;
    surv.bank = surv.startBank;
    currentBackground = int(random(0, backgrounds.length - 0.1));
    surv.mobs.splice(0, surv.mobs.length);
    players.push(new player(38, 40, 32, width / 10 * 9 - 50, width / 10 * 9 - 100));
}

function startPve() {
    mode = 2;
    currentBackground = int(random(0, backgrounds.length - 0.1));
    players.push(new player(0, 0, 0, width / 10, width / 10 + 100));
    players.push(new player(38, 40, 32, width / 10 * 9 - 50, width / 10 * 9 - 100));
}

function pve() {
    if (game) {
        image(backgrounds[currentBackground], 0, 0, width, height);
        if (players[0].hp <= 0 && players[1].hp <= 0) {
            reload();
        } else if (players[0].hp <= 0) {
            players[1].score++;
            reload();
            return;
        } else if (players[1].hp <= 0) {
            players[0].score++;
            reload();
            return;
        }
        players[0].botMove(players[1]);
        players[1].move();
        drawPlayers();
        players[0].collision(players[1].bullets);
        players[1].collision(players[0].bullets);
        textSize(35);
        text(players[0].score, 10, 30);
        text(players[1].score, width - 30, 30);
        if (players[0].score == scoreToWin) {
            game = false;
            winner = 3;
        } else if (players[1].score == scoreToWin) {
            game = false;
            winner = 4;
        }
    } else {
        gameOver(winner);
    }
}

function startPvp() {
    mode = 1;
    currentBackground = int(random(0, backgrounds.length - 0.1));
    players.push(new player(87, 83, 68, width / 10, width / 10 + 100));
    players.push(new player(38, 40, 32, width / 10 * 9 - 50, width / 10 * 9 - 100));
}

function stop() {
    players.splice(0, players.length);
}

function pvp() {
    if (game) {
        image(backgrounds[currentBackground], 0, 0, width, height);
        if (players[0].hp <= 0 && players[1].hp <= 0) {
            reload();
        } else if (players[0].hp <= 0) {
            players[1].score++;
            reload();
            return;
        } else if (players[1].hp <= 0) {
            players[0].score++;
            reload();
            return;
        }
        movePlayers();
        drawPlayers();
        players[0].collision(players[1].bullets);
        players[1].collision(players[0].bullets);
        textSize(35);
        text(players[0].score, 10, 30);
        text(players[1].score, width - 30, 30);
        if (players[0].score == scoreToWin) {
            game = false;
            winner = 1;
        } else if (players[1].score == scoreToWin) {
            game = false;
            winner = 2;
        }
    } else {
        gameOver(winner);
    }
}

function movePlayers() {
    for (a in players)
        players[a].move();
}

function drawPlayers() {
    for (a in players)
        players[a].draw();
}

function reload() {
    players[0].bullets.splice(0, players[0].bullets.length);
    players[1].bullets.splice(0, players[1].bullets.length);
    players[0].hp = players[0].maxHp;
    players[1].hp = players[1].maxHp;
    players[0].y = height / 2 - players[0].height / 2;
    players[0].targetY = players[0].y + players[0].height / 2;
    players[1].y = height / 2 - players[1].height / 2;
    players[1].targetY = players[1].y + players[1].height / 2;
}

function mousePressed() {
    switch (mode) {
        case 0:
            if (dist(width / 5, height / 2, mouseX, mouseY) <= width / 10) {
                startPvp();
            } else if (dist(width / 5 * 4, height / 2, mouseX, mouseY) <= width / 10) {
                startPve();
            } else if (dist(width / 2, height / 2, mouseX, mouseY) <= width / 6) {
                startSurvival();
            }
            break;
        case 1:
            if (!game && dist(width / 2, height / 2, mouseX, mouseY) <= width / 10) {
                game = true;
                reload();
                players[0].score = 0;
                players[1].score = 0;
            } else if (!game && dist(width / 9, height / 9, mouseX, mouseY) <= width / 20) {
                stop();
                mode = 0;
                winner = 0;
            }
            break;
        case 2:
            if (!game && dist(width / 2, height / 2, mouseX, mouseY) <= width / 10) {
                game = true;
                reload();
                players[0].score = 0;
                players[1].score = 0;
            } else if (!game && dist(width / 9, height / 9, mouseX, mouseY) <= width / 20) {
                stop();
                mode = 0;
                winner = 0;
            }
            break;
        case 3:
            if (!game && dist(width / 2, height / 2, mouseX, mouseY) <= width / 10) {
                game = true;
                players[0].score = 0;
                players[0].hp = players[0].maxHp;
                players[0].y = height / 2 - players[0].height / 2;
                players[0].targetY = players[0].y + players[0].height / 2;
                players[0].bullets.splice(0, players[0].bullets.length);
            } else if (!game && dist(width / 9, height / 9, mouseX, mouseY) <= width / 20) {
                stop();
                mode = 0;
                winner = 0;
            }  else if (game) {
                for (var i = surv.upgrades.length - 1; i >= 0; i--) {
                    if (mouseX > surv.upgrades[i].x && mouseX < surv.upgrades[i].x + surv.upgrades[i].width && mouseY > surv.upgrades[i].y && mouseY < surv.upgrades[i].y + surv.upgrades[i].height && surv.bank >= surv.upgrades[i].price) {
                        surv.upgrades[i].func(players[0]);
                        surv.bank -= surv.upgrades[i].price;
                        break;
                    }
                }
            }
            break;
    }
}

function gameOver(winner) {
    background(0, 0, 255);
    fill('green');
    switch (winner) {
    	case 1:
    		text("left player is victorious", width / 2 - 150, height / 4);
    		break;
    	case 2:
    		text("right player is victorious", width / 2 - 150, height / 4);
    		break;
    	case 3:
    		text("you lost!", width / 2 - 55, height / 4);
    		break;
    	case 4:
    		text("you won!", width / 2 - 60, height / 4);
    		break;
    }
    fill("red");
    ellipse(width / 2, height / 2, width / 5, width / 5);
    ellipse(width / 9, height / 9, width / 10, width / 10);
    fill("blue");
    textSize(width / 15);
    text("start", width / 2.3, height / 1.95);
    textSize(width / 30);
    text("back", width / 13, height / 8.5);
}
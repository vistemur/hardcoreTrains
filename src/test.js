var players = [];
let button;

function setup() {
    createCanvas(windowWidth, windowHeight);
    players.push(new player(87, 83, 68, width / 10, width / 10 + 100));
    players.push(new player(38, 40, 32, width / 10 * 9 - 50, width / 10 * 9 - 100));
    button = createButton('add vagon');
    button.position = (0, 0);
    button.mousePressed(addVagon);
}

function draw() {
    background(0);
    players[0].botMove(players[1]);
    players[0].draw();
    players[0].collision(players[1].bullets);
    players[1].botMove(players[0]);
    players[1].draw();
    players[1].collision(players[0].bullets);
}

function addVagon() {
    players[0].addVagon();
}
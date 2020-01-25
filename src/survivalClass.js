class upgrade {

    constructor(name, price, func) {
        this.name = name;
        this.price = price;
        this.func = func;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.textSize = 0;
        this.priceTextSize = 0;
    }
}

class mob {

    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y
        this.maxHp = 10;
        this.hp = this.maxHp;
        this.speed = 1;
        this.size = 100;
        this.prize = 1;
    }

    draw() {
        fill('purple');
        ellipse(this.x, this.y, this.size, this.size);
        fill('red');
        rect(this.x - this.hp * (this.size / 2 / this.maxHp), this.y - this.size / 1.5, this.hp * (this.size / 2 / this.maxHp), this.size / 10);
        rect(this.x, this.y - this.size / 1.5, this.hp * (this.size / 2 / this.maxHp), this.size / 10);
    }

    move() {
        this.x += this.speed;
    }

    collision(bullets) {
        for (var i = bullets.length - 1; i >= 0; i--) {
            if (dist(this.x, this.y, bullets[i].x, bullets[i].y) <= (this.size + bullets[i].size) / 2) {
                bullets.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}

class survival {

	constructor() {
        this.startBank = 0;
        this.startHp = 3;
        this.hp = this.startHp;
        this.bank = this.startBank;
		this.level = 0;
        this.mobs = [];
        this.upgrades = [];

        this.upgrades.push(new upgrade("new vagon", 10, 
            function(player) { player.addVagon(0) }));
        this.upgrades.push(new upgrade("hp", 1, 
            function(player) { surv.hp += 1}));
        this.upgrades.push(new upgrade("speed", 1, 
            function(player) { player.speed += 1 }));
    }

    getUpgrades() {
        var priceLen, price;

        for (var i = 0; i < this.upgrades.length; i++) {
            priceLen = 0;
            price = this.upgrades[i].price;
            while (price > 0) {
                priceLen += 1;
                price = int(price / 10);
            }
            this.upgrades[i].x = width * 0.9;
            this.upgrades[i].width = width / 20;
            if (this.upgrades.length < 20) {
                this.upgrades[i].height = height / 20;
            } else {
                this.upgrades[i].height = height / this.upgrades.length;
            }
            this.upgrades[i].y = height / (this.upgrades.length + 1) * (i + 1) - this.upgrades[i].height / 2;
            this.upgrades[i].textSize = this.upgrades[i].height / (this.upgrades[i].name.length * 0.3 + 3);
            this.upgrades[i].priceTextSize = this.upgrades[i].height / (priceLen * 0.3 + 2);
        }
    }

    levelUp() {
        if (this.mobs.length == 0) {
            this.level++;
            for (var i =  random(this.level * 10 + 3); i >= 0; i--) {
                this.mobs.push(new mob(0, random(-300 + this.level * -10, 0), random(50, height - 50)))
            }
        }
    }

    moveDrawMobs() {
        for (var i = this.mobs.length - 1; i >= 0; i--) {
            this.mobs[i].draw();
            if (this.mobs[i].x < width + this.mobs[i].size) {
                this.mobs[i].move();
            } else {
                this.mobs.splice(i, 1);
                this.hp--;
            }
        }
    }

    collision(bullets) {
        for (var i = this.mobs.length - 1; i >= 0; i--) {
            if (this.mobs[i].collision(bullets)) {
                this.mobs[i].hp--;
                if (this.mobs[i].hp == 0) {
                    this.bank += this.mobs[i].prize;
                    this.mobs.splice(i, 1);
                }
            }
        }
    }

    drawUpgrades() {
        for (var i = this.upgrades.length - 1; i >= 0; i--) {
            fill('white');
            stroke(1);
            rect(this.upgrades[i].x, this.upgrades[i].y, this.upgrades[i].width, this.upgrades[i].height);
            fill('black');
            noStroke();
            textSize(this.upgrades[i].textSize);
            text(this.upgrades[i].name, this.upgrades[i].x + this.upgrades[i].width * 0.1, this.upgrades[i].y + this.upgrades[i].height * 0.2);
            textSize(this.upgrades[i].priceTextSize);
            text(this.upgrades[i].price + "$", this.upgrades[i].x + this.upgrades[i].width * 0.1, this.upgrades[i].y + this.upgrades[i].height * 0.7);
        }
        noStroke();
    }
}
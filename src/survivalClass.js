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

    draw() {
        fill('white');
        stroke(1);
        rect(this.x, this.y, this.width, this.height);
        fill('black');            
        noStroke();
        textSize(this.textSize);
        text(this.name, this.x + this.width * 0.1, this.y + this.height * 0.2);
        textSize(this.priceTextSize);
        text(this.price + "$", this.x + this.width * 0.1, this.y + this.height * 0.7);
    }

    tap() {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height && surv.bank >= this.price) {
            this.func(players[0]);
            surv.bank -= this.price;
        }
    }
}

class vagonUpgrade {

    constructor(vagonNumber) {
        this.vagonNumber = vagonNumber;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.upgrades = [];
    }

    draw() {
        stroke(1);
        fill('white');
        rect(this.x, this.y, this.width, this.height);
        for (var i = this.upgrades.length - 1; i >= 0; i--) {
            this.upgrades[i].draw();
        }
        noStroke();
    }

    fillUpgrades() {
        var price, priceLen;
        let vagNum = this.vagonNumber;

        switch (players[0].vagons[this.vagonNumber].cannon.type) {
            case 0:
                this.upgrades.push(new upgrade("damage", 1, 
                    function(player) { player.vagons[vagNum].cannon.damage += 1 }));
                this.upgrades.push(new upgrade("reload", 1, 
                    function(player) {
                        if (player.vagons[vagNum].cannon.reloadTime > 0) {
                            player.vagons[vagNum].cannon.reloadTime -= 1;
                            surv.vagonUpgrades[surv.vagonUpgrades.length - 1 - vagNum].upgrades[1].price += 1;
                        } else {
                            surv.bank += surv.vagonUpgrades[surv.vagonUpgrades.length - 1 - vagNum].upgrades[1].price;
                        }
                    }));
                break;
        }
        for (var i = this.upgrades.length - 1; i > -1; i--) {
            priceLen = 0;
            price = this.upgrades[i].price;
            while (price > 0) {
                priceLen += 1;
                price = int(price / 10);
            }
            this.upgrades[i].x = this.x;
            this.upgrades[i].y = this.y + this.height / this.upgrades.length * i;
            this.upgrades[i].width = this.width;
            this.upgrades[i].height = this.height / this.upgrades.length;
            this.upgrades[i].textSize = this.upgrades[i].height / (this.upgrades[i].name.length * 0.3 + 3);
            this.upgrades[i].priceTextSize = this.upgrades[i].height / (priceLen * 0.3 + 2);
        }
    }

    updateUpgradesPosition() {
        var price, priceLen;

        for (var i = this.upgrades.length - 1; i > -1; i--) {
            priceLen = 0;
            price = this.upgrades[i].price;
            while (price > 0) {
                priceLen += 1;
                price = int(price / 10);
            }
            this.upgrades[i].x = this.x;
            this.upgrades[i].y = this.y + this.height / this.upgrades.length * i;
            this.upgrades[i].width = this.width;
            this.upgrades[i].height = this.height / this.upgrades.length;
            this.upgrades[i].textSize = this.upgrades[i].height / (this.upgrades[i].name.length * 0.3 + 3);
            this.upgrades[i].priceTextSize = this.upgrades[i].height / (priceLen * 0.3 + 2);
        }
    }

    tap() {
        if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
            for (var i = this.upgrades.length - 1; i >= 0; i--) {
                this.upgrades[i].tap();
            }
        }
    }
}

class mob {

    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
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
                this.hp -= bullets[i].damage;
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
        this.vagonUpgrades = [];

        this.vagonUpgrades.push(new vagonUpgrade(0));

        this.upgrades.push(new upgrade("new vagon", 10, 
            function(player) {
                player.addVagon(0);
                surv.vagonUpgrades.unshift(new vagonUpgrade(player.vagons.length - 1));
                surv.getVagonUpgrades();
                surv.upgradeVagonUpgradesPositions();
                }));
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
            this.upgrades[i].width = width / 25;
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

    getVagonUpgrades() {
        this.vagonUpgrades[0].x = width * 0.95;
        this.vagonUpgrades[0].height = height / 10;
        this.vagonUpgrades[0].width = width / 22;
        this.vagonUpgrades[0].y = height / 2 - this.vagonUpgrades[0].height / 2;
        this.vagonUpgrades[0].fillUpgrades();
    }

    upgradeVagonUpgradesPositions() {
        for (var i = 0; i < this.vagonUpgrades.length; i++) {
            this.vagonUpgrades[i].x = width * 0.95;
            this.vagonUpgrades[i].width = width / 22;
            if (this.vagonUpgrades.length < 10) {
                this.vagonUpgrades[i].height = height / 10;
            } else {
                this.vagonUpgrades[i].height = height / this.vagonUpgrades.length;
            }
            this.vagonUpgrades[i].y = height / (this.vagonUpgrades.length + 1) * (i + 1) - this.vagonUpgrades[i].height / 2;
            this.vagonUpgrades[i].updateUpgradesPosition();
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
                if (this.mobs[i].hp <= 0) {
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

    drawVagonUpgrades() {
        for (var i = this.vagonUpgrades.length - 1; i >= 0; i--) {
            this.vagonUpgrades[i].draw();
        }
    }
}
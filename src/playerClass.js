class cannon {

	constructor(type, x, y, w, h, side) {
		this.x = x;
		this.y = y + h / 2;
		this.width = w;
		this.height = h;
		this.type = type;
		this.side = side;
        this.reloadTime = 15;
        this.reload = this.reloadTime;
        this.bulletSpeed = 5;
        this.bulletSize = 10;
		this.targetY = this.y + this.height / 2;
		if (this.side == 1) {
			this.x -= this.width / 2;
			this.targetX = this.x + this.width;
		} else {
			this.targetX = this.x - this.width / 2;
		}
	}

	shoot(bullets) {
		bullets.push(new Bullet(this.targetX, this.targetY, this.targetX + this.side, this.targetY, this.bulletSpeed, this.bulletSize));
	}

	move(x, y) {
		this.y = y + this.height / 2;
		this.targetY = this.y + this.height / 2;
		if (this.side == 1) {
			this.x = x;
			this.targetX = this.x + this.width;
		} else {
			this.x = x - this.width / 2;
			this.targetX = this.x;
		}
	}

	draw() {
		if (this.side == 1) {
			image(imageCannons[this.type], this.x, this.y, this.width, this.height);
		} else {
			translate(this.x + this.width, this.y + this.height);
        	rotate(PI);
			image(imageCannons[this.type], 0, 0, this.width, this.height);
			rotate(PI);
        	translate(-this.x - this.width, -this.y - this.height);
		}
	}
}

class vagon {

	constructor(type, x, y, w, h) {
		this.type = type;
		this.width = w;
		this.height = h;
    	this.maxHp = 10;
        this.hp = this.maxHp;
        this.x = x;
        this.y = y;
        this.cannon = new cannon(0, this.x, this.y, this.width * 2, this.height / 2, ((this.x > width / 2) ? -1 : 1));
    }

    move(x, y) {
    	this.x = x;
    	this.y = y;
    	this.cannon.move(x, y);
    }

    draw() {
    	image(imageVagons[this.type], this.x, this.y + this.height / 20, this.width, this.height - this.height / 10);
    	this.cannon.draw();
    }
}

class player {
    
    constructor(up, down, shoot, x, targetX) {
    	this.width = 25;
    	this.height = 100;
    	this.targetX = targetX;
        this.targetY = this.y + this.width / 2;
    	this.vagons = [];
    	this.minY = 0;
    	this.maxY = height;
    	this.maxHp = 10;
        this.hp = this.maxHp;
        this.up = up;
        this.down = down;
        this.shoot = shoot;
        this.x = x;
        this.y = height / 2 - this.height / 2;
        this.score = 0;
        this.bullets = [];
        this.score = 0;
        this.autoFire = true;
        this.speed = 10;

        this.railsStart = random(15);
        this.vagons.push(new vagon(0, this.x, this.y, this.width, this.height / 3));
    }
    
    move() {
        var u = keyIsDown(this.up);
        var d = keyIsDown(this.down);
        var counter = this.height / (this.vagons.length + 2);
        
        if (u && !d && this.y > this.minY) {
            if (this.y - this.speed > this.minY) {
        		this.y -= this.speed;
        	} else {
        		this.y = this.minY;
        	}
        }
        if (d && !u && this.y < this.maxY - this.height) {
            if (this.y + this.speed < this.maxY - this.height) {
        		this.y += this.speed;
        	} else {
        		this.y = this.maxY - this.height;
        	}
        }

        for (var i = 0; i < this.vagons.length; i++) {
        	if ((keyIsDown(this.shoot) || this.autoFire) && !this.vagons[i].cannon.reload) {
        	    this.vagons[i].cannon.shoot(this.bullets);
        	    this.vagons[i].cannon.reload = this.vagons[i].cannon.reloadTime;
      	 	}
       	 	if (this.vagons[i].cannon.reload) {
        	    this.vagons[i].cannon.reload -= 1;
        	}
        	counter += this.vagons[i].height;
        }

        for (var a = 0; a < this.bullets.length; a++) {
           	if (this.bullets[a].x < -this.bullets[a].size / 2 || this.bullets[a].x > width + this.bullets[a].size / 2 || this.bullets[a].y < -this.bullets[a].size / 2 || this.bullets[a].y > height + this.bullets[a].size / 2) {
               	this.bullets.splice(a, 1);
        	 } else {
          	    this.bullets[a].move();
          	 }
        }
        this.moveVagons();
    }

    botMove(enemy) {
        var move = 0;
        var counter = this.height / (this.vagons.length + 2);

        if (enemy.y < this.y) {
        	move = 1;
        } else if (enemy.y > this.y) {
        	move = -1;
        }

        for (var i = enemy.bullets.length - 1; i >= 0; i--) {
        	if (enemy.bullets[i].y > this.y - enemy.bullets[i].size / 2 - this.speed && enemy.bullets[i].y < this.y + enemy.bullets[i].size / 2 + this.height + this.speed) {
        		if (enemy.bullets[i].x > this.x) {
        			if (enemy.bullets[i].x - this.x < this.width * 5) {
        				move -= ((this.y - enemy.bullets[i].y) * 20) / ((enemy.bullets[i].x - this.x) * 5) + random(100) / 1000;
        			}
        		} else {
        			if (this.x - enemy.bullets[i].x < this.width * 5) {
        				move -= ((this.y - enemy.bullets[i].y) * 20) / ((this.x - enemy.bullets[i].x) * 5) + random(100) / 1000;
        			}
        		}
        		if (this.y - this.height <= this.minY) {
       				move -= 1;
       			}
        		if (this.y + this.height * 2 >= this.maxY) {
        			move += 1;
        		}
       		}
        }

        if (move > 0 && this.y > this.minY) {
        	if (this.y - this.speed > this.minY) {
        		this.y -= this.speed;
        	} else {
        		this.y = this.minY;
        	}
        } else if (move < 0 && this.y < this.maxY - this.height) {
            if (this.y + this.speed < this.maxY - this.height) {
        		this.y += this.speed;
        	} else {
        		this.y = this.maxY - this.height;
        	}
        }

        for (var i = 0; i < this.vagons.length; i++) {
        	if (!this.vagons[i].cannon.reload) {
        	    this.vagons[i].cannon.shoot(this.bullets);
        	    this.vagons[i].cannon.reload = this.vagons[i].cannon.reloadTime;
      	 	}
       	 	if (this.vagons[i].cannon.reload) {
        	    this.vagons[i].cannon.reload -= 1;
        	}
        	counter += this.vagons[i].height;
        }

        for (var a = 0; a < this.bullets.length; a++) {
           	if (this.bullets[a].x < -this.bullets[a].size / 2 || this.bullets[a].x > width + this.bullets[a].size / 2 || this.bullets[a].y < -this.bullets[a].size / 2 || this.bullets[a].y > height + this.bullets[a].size / 2) {
               	this.bullets.splice(a, 1);
        	 } else {
          	    this.bullets[a].move();
          	 }
        }
        this.moveVagons();
    }

    collision(bullets) {
        for (var a in bullets) {
            if (bullets[a].x < this.x + bullets[a].size / 2 + this.width && bullets[a].x > this.x - bullets[a].size / 2 && bullets[a].y > this.y - bullets[a].size / 2 && bullets[a].y < this.y + bullets[a].size / 2 + this.height) {
                bullets.splice(a, 1);
                this.hp--;
            }
        }
    }

    addVagon(type) {
        this.vagons.push(new vagon(0, this.x, this.y, this.width, this.height / (this.vagons.length + 2)));
        this.height += this.vagons[this.vagons.length - 1].height;
    }
    
    draw() {
    	var counter = this.height / (this.vagons.length + 2);

    	noStroke();
    	fill('grey');
        for (var railsCounter = this.railsStart; railsCounter < height; railsCounter += 15) {
            rect(this.x + this.width / 10 * 2, railsCounter, this.width / 10 * 6, 2);
        }
    	rect(this.x + this.width / 10 * 2, 0, this.width / 10, height);
    	rect(this.x + this.width / 10 * 7, 0, this.width / 10, height);
        rect(this.x, this.y - this.height / 10 * 3, this.width, this.height / 10);
        fill('red');
        rect(this.x + this.width / 2 - this.hp * (this.width / 2 / this.maxHp), this.y - this.height / 10 * 3, this.hp * (this.width / 2 / this.maxHp), this.height / 10);
        rect(this.x + this.width / 2, this.y - this.height / 10 * 3, this.hp * (this.width / 2 / this.maxHp), this.height / 10);
       	fill('white');
    	rect(this.x + this.width / 2 - this.width / 10, this.y, this.width / 5, this.height)
        image(imageVagonHeads[0], this.x, this.y, this.width, counter - this.vagons[0].height / 20);
        translate(this.x, this.y + counter * (this.vagons.length + 1) + this.vagons[this.vagons.length - 1].height / 20);
        rotate(PI);
        image(imageVagonHeads[0], -this.width, -counter + this.vagons[this.vagons.length - 1].height / 20, this.width, counter - this.vagons[this.vagons.length - 1].height / 20);
        rotate(PI);
        translate(-this.x, -this.y - counter * (this.vagons.length + 1) - this.vagons[this.vagons.length - 1].height / 20);
    	for (var i = this.vagons.length - 1; i >= 0; i--) {
    		this.vagons[i].draw();
    	}
        fill('red');
        for (var a = 0; a < this.bullets.length; a++) {
            this.bullets[a].draw();
        }
    }

    moveVagons() {
    	var counter = this.height / (this.vagons.length + 2);

    	for (var i = this.vagons.length - 1; i >= 0; i--) {
    		this.vagons[i].move(this.x, this.y + counter);
            counter += this.vagons[i].height;
    	}
    }
}

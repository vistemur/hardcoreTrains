class Bullet {
    constructor(startX, startY, targetX, targetY, speed, damage, size) {
        this.y = startY
        this.x = startX
        this.size = size
        this.damage = damage
        
        var minusingY = 1
        var minusing = 1
        var n = 0
        var xx = 0
        
        if (targetY - startY != 0 && targetX - startX != 0) {
            n = (targetY - startY) / (targetX - startX)
            xx = speed / sqrt(n * n + 1)
        }
        if (targetX < startX)
            minusing = -1
            
        this.step = {
            x: xx * minusing,
            y: xx * n * minusing
        }

        if (targetY < startY)
            minusingY = -1
        if (targetY - startY == 0 && targetX - startX != 0)
            this.step.x = speed * minusing
        else if (targetX - startX == 0 && targetY - startY != 0)
            this.step.y = speed * minusingY
    }
    
    move() {
        this.x += this.step.x
        this.y += this.step.y
    }
    
    draw() {
        ellipse(this.x, this.y, this.size, this.size)
    }
}

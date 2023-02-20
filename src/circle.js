

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }

  contains(movel) {
    let distX = (this.x - movel.loc.x + wScreen/2).mod(wScreen) - wScreen/2;
    let distY = (this.y - movel.loc.y + height/2).mod(height) - height/2;
    let dist = sqrt((distX * distX) + (distY * distY));
    if (dist < this.r) {
      return true;
    }
    return false;
  }

  display() {
    stroke(0, 255, 0);
    noFill();
    strokeWeight(1);
    circle(this.x, this.y, 2 * this.r);
  }
}
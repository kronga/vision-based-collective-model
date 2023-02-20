class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.movels = [];
    this.divided = false;
  }
  
  clear(){
    this.divided = false;
    this.movels = [];
  }

  insert(movel) {
    if (!this.boundary.contains(movel)) {
      return false;
    }

    if (this.divided) {
      if (this.topLeft.insert(movel)) {
        return true;
      } else if (this.topRight.insert(movel)) {
        return true;
      } else if (this.botLeft.insert(movel)) {
        return true;
      } else if (this.botRight.insert(movel)) {
        return true;
      }
    } 
    else if (!this.divided) {
      this.movels.push(movel);
      if (this.movels.length > this.capacity) {
        this.subdivide();

        for (let m of this.movels) {
          if (this.topLeft.insert(m)) {
            continue;
          } else if (this.topRight.insert(m)) {
            continue;
          } else if (this.botLeft.insert(m)) {
            continue;
          } else if (this.botRight.insert(m)) {
            continue;
          }
        }
        this.movels = [];
        return true;
      }
    }
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;

    // rectangle coordinates define its center!!!
    let rectTL = new Rectangle(x - w / 4, y - h / 4, w / 2, h / 2);
    this.topLeft = new QuadTree(rectTL, this.capacity);

    let rectTR = new Rectangle(x + w / 4, y - h / 4, w / 2, h / 2);
    this.topRight = new QuadTree(rectTR, this.capacity);

    let rectBL = new Rectangle(x - w / 4, y + h / 4, w / 2, h / 2);
    this.botLeft = new QuadTree(rectBL, this.capacity);

    let rectBR = new Rectangle(x + w / 4, y + h / 4, w / 2, h / 2);
    this.botRight = new QuadTree(rectBR, this.capacity);

    this.divided = true;
  }

  query(area, highlight, is_root) {
    let found = [];
    this.highlighted = false;
    
    if (this.boundary.intersects(area) || is_root) {
      if (this.divided) {
        let foundTL = this.topLeft.query(area, highlight, false);
        let foundTR = this.topRight.query(area, highlight, false);
        let foundBL = this.botLeft.query(area, highlight, false);
        let foundBR = this.botRight.query(area, highlight, false);
        found = found.concat(foundTL, foundTR, foundBL, foundBR);
      }
      else {        
        if(highlight){
          this.highlighted = true;
        }
        for (let m of this.movels) {
          if (area.contains(m)) {
            found.push(m);
          }
        }
      }
    }
    return found;
  }

  display() {
    if (this.divided) {
      this.topLeft.display();
      this.topRight.display();
      this.botLeft.display();
      this.botRight.display();
    } 
    else {
      rectMode(CENTER);
      noFill();
      if(this.highlighted == true){
        fill(0, 255, 0, 30);
      }
      if(displayUnits){
        stroke(255,40);
      } else {
        stroke(255, 150);
      }
      strokeWeight(1);
      rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    }
  }
}
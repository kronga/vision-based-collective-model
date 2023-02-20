Number.prototype.mod = function(n) {
return ((this%n)+n) % n;
}

class Rectangle {
  constructor(x, y, w, h) {
    // X and Y define the Center!!!
    this.x = x;
    this.y = y; 
    this.w = w;    
    this.h = h;    
  }
  
  contains(element){
     return(element.loc.x >= this.x - this.w/2 &&
            element.loc.x <= this.x + this.w/2 &&
            element.loc.y >= this.y - this.h/2 &&
            element.loc.y <= this.y + this.h/2)      
  }
  
  intersects(circ){
    // collision detection: http://jeffreythompson.org/collision-detection/circle-rect.php
    
    let testX = circ.x;
    let testY = circ.y;
    let distX = 0;
    let distY = 0;
    let left = this.x-this.w/2;
    let right = this.x+this.w/2;
    let top = this.y-this.h/2;
    let bottom = this.y+this.h/2;

    if(circ.x < left)
    {
      distX = min(left - circ.x, (circ.x + wScreen) - right);
    }    
    else if(circ.x > right)
    {
      distX = min(circ.x - right, (left + wScreen) - circ.x);
    }
    else if (left <= circ.x <= right)
      distX = 0;

    if(circ.y < top)
    {
      distY = min(top - circ.y, (circ.y + height) - bottom);
    }    
    else if(circ.y > bottom)
    {
      distY = min(circ.y - bottom, (top + height) - circ.y);
    }
    else if (top <= circ.y <= bottom)
      distY = 0;    

    let dist = sqrt((distX*distX) + (distY*distY));
    
    if(dist <= circ.r){
      return true;
    }
    return false;
  }
}
//Clusters version

Number.prototype.mod = function(n) {
return ((this%n)+n) % n;
}

avg = 0;
vaveg = 0; 
vaveg_ex = 0;
ratio_factor = 1;

function compare(a, b) {
  if ( a[1] < b[1] ){
    return -1;
  }
  else if (a[1] > b[1] ){
    return 1;
  }
  else {
    return 0;
  }
}

function polar2cart(radius, theta) {

    let x = radius * Math.cos(theta);
    let y = -radius* Math.sin(theta);
    return createVector(x, y);
  }

function cart2polar(x , y) {
    return createVector(Math.sqrt(x*x + y*y), Math.atan2(x, -y));
  }


class Movel {

  constructor() {
    this.maxSpeed = 1;
    this.len = sliderHeight.value();
    this.wid = sliderWidth.value();
    this.d = Math.sqrt(Math.pow(this.len, 2) + Math.pow(this.wid, 2));
    if (arena_type == "circ") {
      this.radius = (Math.random() * (r_big - r_small + 1)) + r_small;
      this.theta = Math.random() * 2*Math.PI;
      this.center = createVector(wScreen / 2, height / 2);
    }


    this.loc = createVector(random(wScreen), random(height));
    if (arena_type == "circ") {
      this.loc = polar2cart(this.radius, this.theta).add(this.center);
    }
    this.vel = createVector(random(-this.maxSpeed, this.maxSpeed), random(-this.maxSpeed, this.maxSpeed));
    this.acc = createVector();
    this.deltaVel = createVector();
    this.corners = this.calc_corners();
    //this.corners = [ [random(wScreen), random(height)], [random(wScreen), random(height)], [random(wScreen), random(height)], [random(wScreen), random(height)] ];

    this.vision = new Circle(this.loc.x, this.loc.y, sliderFlockVision.value());
    this.influence = sliderInfluence.value();
    
    this.neighbors = [];
    this.alphas = [];
    this.prev_alphas = [];

    this.prevLoc = createVector(random(wScreen), random(height));
    this.prevVel = createVector(random(-this.maxSpeed, this.maxSpeed), random(-this.maxSpeed, this.maxSpeed));
    this.prevCorners = [ [random(wScreen), random(height)], [random(wScreen), random(height)], [random(wScreen), random(height)], [random(wScreen), random(height)] ];

    if (arena_type == "circ") {
      this.bounce_zone_range = 20;
      this.center = createVector(wScreen / 2, height / 2);
    }

    this.pair_correlations = []
  }



  update() {
    this.found = false; // for visualization
    this.len =  sliderHeight.value();
    this.wid = sliderWidth.value();
    this.d = Math.sqrt(this.len*this.len + this.wid*this.wid);
    this.influence = sliderInfluence.value();
    if (arena_type == "circ") {
      let effective_coor = this.loc.copy().sub(this.center)
      let polarVec = cart2polar(effective_coor.x, effective_coor.y);
      this.radius = polarVec.x;
      this.theta = polarVec.y;
    }
    
    this.perceive();
    this.flock();
    this.updateLoc();
    this.vision.update(this.loc.x, this.loc.y);
  }

  perceive() {
    this.vision.r = sliderFlockVision.value();
    if(displayHighlight && this.highlighted){
      this.neighbors = qt.query(this.vision, true, true);
    } 
    else {
      this.neighbors = qt.query(this.vision, false, true);
    }
    if (displayHighlight && this.highlighted) {
      for (let n of this.neighbors) {
        n.found = true; // for visualization
      }
      this.found = false;
    }
  }


  dist_2p_squared (a, b) {
    return dist =  Math.pow((a[0]-b[0]), 2) + Math.pow((a[1]-b[1]), 2);
  }

  periodSub(v2, v1) {
    let x = (v2.x - v1.x + wScreen/2).mod(wScreen) - wScreen/2;
    let y = (v2.y - v1.y + height/2).mod(height) - height/2;
    let v = createVector(x, y);
    return v;
  }

  calc_corners() {
    let v = this.vel.copy().normalize();
    let l = this.len;
    let w = this.wid;
    let a = createVector(l*v.x - w*v.y , l*v.y + w*v.x).mult(0.5);
    let b = createVector(l*v.x + w*v.y , l*v.y - w*v.x).mult(0.5);
    let c = createVector(-l*v.x + w*v.y , -l*v.y - w*v.x).mult(0.5);  
    let d = createVector(-l*v.x - w*v.y , -l*v.y + w*v.x).mult(0.5);
  
    let corners = [a, b, c, d];
    for (let corner of corners){
      corner.add(this.loc);
    }
    return corners;
  }


  //Returns the substanded angle given a neighbor
 subst_angle_old(n , time) {

  let corns = n.corners;
  if (!time) { //check if calculation for now or for prev
    corns = n.prevCorners; 
  }
    let dist_arr = [];
    for (const corner of corns) {
      let v_corner = createVector().set(corner);
      let r = p5.Vector.sub(v_corner, this.loc);
    dist_arr.push(r.magSq());
    }
  let min_index = dist_arr.indexOf(Math.min.apply(Math, dist_arr));
  let corner1 = corns[(min_index - 1).mod(4)];
  let corner2 = corns[(min_index + 1).mod(4)];

  //Translating the corners relative to the point of perspective
  let v1 = createVector( corner1[0] - this.loc.x, corner1[1] - this.loc.y );
  let v2 = createVector( corner2[0] - this.loc.x, corner2[1] - this.loc.y );
  let angle =  v1.angleBetween(v2);

  //console.log(angle);
  return angle;
  }

  subst_angle(n , time) {
    let corners = n.corners;
    let los = this.periodSub(n.loc, this.loc);
    if(!time){
      corners = n.prevCorners;
      los = this.periodSub(n.prevLoc, this.prevLoc);
    }
    
    let diagonal1 = this.periodSub(corners[0], corners[2]);
    let diagonal2 = this.periodSub(corners[1], corners[3]);
    let v1, v2;

    if ( Math.abs(diagonal1.angleBetween(los)) > Math.abs(diagonal2.angleBetween(los)) ) {
      v1 = this.periodSub(corners[0], this.loc);
      v2 = this.periodSub(corners[2], this.loc);
    }
    else {
      v1 = this.periodSub(corners[1], this.loc);
      v2 = this.periodSub(corners[3], this.loc);
    }
    return Math.abs(v1.angleBetween(v2));
  }

  alpha_edges(n , time) {
    let corners = n.corners;
    let los = this.periodSub(n.loc, this.loc);
    if(!time){
      corners = n.prevCorners;
      los = this.periodSub(n.prevLoc, this.prevLoc);
    }
    
    let diagonal1 = this.periodSub(corners[0], corners[2]);
    let diagonal2 = this.periodSub(corners[1], corners[3]);
    let v1, v2;

    if ( Math.abs(diagonal1.angleBetween(los)) > Math.abs(diagonal2.angleBetween(los)) ) {
      v1 = this.periodSub(corners[0], this.loc);
      v2 = this.periodSub(corners[2], this.loc);
    }
    else {
      v1 = this.periodSub(corners[1], this.loc);
      v2 = this.periodSub(corners[3], this.loc);
    }
    let edge1 = v1.heading();
    let edge2 = v2.heading();
    if (edge1 < edge2){
      return [edge1, edge2];
    }
    else {
      return [edge2, edge1];
    }
  }


// // Alternative method for substanded angle calculation
// subst_angle2(n, time) {
//   let corns = this.corners;
//   if (!time){ //check if calculation for now or for prev
//     corns = this.prevCorners; 
//   }
//   let p = [n.loc.x, n.loc.y];
//     let dist_arr = [];
//     for (const corner of corns) {
//     dist_arr.push(this.dist_2p_squared(p, corner));
//     }
//   let min_index = dist_arr.indexOf(Math.min.apply(Math, dist_arr));
//   let corner1 = corns[(min_index - 1).mod(4)];
//   let corner2 = corns[(min_index + 1).mod(4)];
//   let v1 = createVector( corner1[0] - this.loc.x, corner1[1] - this.loc.y );
//   let v2 = createVector( corner2[0] - this.loc.x, corner2[1] - this.loc.y );

//   let sina = Math.abs( (v1.x*v2.y - v1.y*v2.x) / (v1.mag() * v2.mag()) );
//   return Math.asin(sina);
// }

// returns the alpha dot aprroximation
delta_sub_angle(n) {
  return this.subst_angle(n, true) - this.subst_angle(n, false);
}

//Calculates the bearing angle from neighbor n perspective - JUMP WHEN BEHIND
 bearing(n) {
  let los  = this.periodSub(n.loc, this.loc);
  return this.vel.angleBetween(los) * Math.sign(this.vel.cross(los).z || 1);  
 }

// JUMP WHEN BEHIND
 delta_bearing(n) {
  let prevLos  = this.periodSub(n.prevLoc, this.prevLoc) ;
  let prevBearing = this.prevVel.angleBetween(prevLos) * Math.sign(this.prevVel.cross(prevLos).z || 1) ; 
  let beta_now = this.bearing(n);
  let delta = beta_now - prevBearing;
  let tuned = delta - Math.PI*2 * Math.round(delta / Math.PI*2);
  if (tuned > 0.5){
    return 0
  }
  return tuned;
 }


//Returns the r vecotor as precieved by neighbor at x,y
visual_r(n, effective_alpha) {
  let exact_r = this.periodSub(n.loc, this.loc);
  let comp_dist = 0.5*this.d / Math.tan(effective_alpha);
  return exact_r.setMag(comp_dist);
 }



 visual_vel(n, curr_a, prev_a) {
  //First we calculate the radial velcoity of neighbor 'n'
  let exact_r = this.periodSub(n.loc, this.loc);
  let exact_r_mag = exact_r.mag();
  let exact_r_prev = this.periodSub(n.prevLoc, this.prevLoc);
  const degF = 180 / Math.PI;

  // let alpha = this.subst_angle(n, true) / 2;
  // let alpha_debug = alpha * degF;
  // let alpha_dot = this.delta_sub_angle(n) / 2;
  // let alpha_dot_debug = alpha_dot * degF;

  let occluded_alpha = curr_a / 2;
  let occluded_alpha_dot = (curr_a - prev_a) / 2;


  let beta = this.bearing(n);
  let beta_debug = beta * degF;
  let beta_dot = this.delta_bearing(n);
  let beta_dot_debug = beta_dot * degF;

  let r = this.visual_r(n, occluded_alpha);  
  let r_mag = r.mag();
  let r_dir = r.copy().normalize();


  let vr_factor = -2 * occluded_alpha_dot / Math.sin(2*occluded_alpha);
  let vr_ex = exact_r.copy().mult(vr_factor);
  let vt_ex = createVector(exact_r.y, -exact_r.x).mult(-beta_dot) ;

  let vr = r.copy().mult(-2 * occluded_alpha_dot / Math.sin(2*occluded_alpha) );

  // Positive beta dot is clockwise rotation so the cross product yields (b, -a)
  let vt = createVector(r.y, -r.x).mult(-beta_dot) ;
  
  let v_total = vr.add(vt);
  let v_total_ex = vr_ex.add(vt_ex);

  if (this.highlighted) {
    //console.log("a: " + alpha_debug + " a_dot: " + alpha_dot*degF + " b: " + beta*degF + " b_dot: " + beta_dot*degF); 
    //console.log("vr: " + vr.mag() + " vt: " + vt.mag() );
    //console.log("r: " + exact_r.mag())
    // let r_ratio = r.mag() / exact_r.mag();
    // let v_ratio = v_total.mag() / n.vel.mag();
    // let v_ratio_ex = v_total_ex.mag() / n.vel.mag();
    // vaveg = 0.99 * vaveg + 0.01 * Math.log(v_ratio);
    // vaveg_ex = 0.99 * vaveg + 0.01 * Math.log(v_ratio_ex);
    // let num_neigh = this.neighbors.length - 1;
    // console.log("R ratio: " + r_ratio);
    // console.log("Visual: " + v_ratio + " withR_exact: " + v_ratio_ex + " N.neighbors: " + num_neigh);
    //console.log("visual: " + vaveg + " exact: " + vaveg_ex);
  } 
  return v_total;
 }

 exactlyR(n){
  let exact_r = this.periodSub(n.loc, this.loc);
  return exact_r.mag();
 }  

  
  deflect(avgRelVel, influence){
    //avgRelVel.normalize();
    avgRelVel.limit(this.maxSpeed);
    this.deltaVel = avgRelVel.mult(influence);
    //this.deltaVel = avgRelVel;
  }


  updateLoc() {
    this.prevLoc = this.loc.copy();
    this.prevVel = this.vel.copy();
    this.prevCorners = this.corners;
    //this.vel = p5.Vector.add(this.vel.mult(0.99) , this.deltaVel);

    this.vel.add(this.deltaVel);
    this.vel.limit(this.maxSpeed);

    if (arena_type == "road")
      this.bounce_walls();
    else if (arena_type == "circ")
      this.bounce_circular();
    else if (arena_type == "toro")
      this.checkEdges();

    //this.vel.normalize();
    this.loc.add(this.vel);
    this.corners = this.calc_corners();
    this.deltaVel.mult(0);
    this.alphas = [];
    this.prev_alphas = [];
    //this.acc.mult(0);
  }



  // avoidEdges() {
  //   let buffer = sliderEdgeVision.value();
  //   let desiredHeading = this.vel.copy();
  //   let nearEdge = false;

  //   if (this.loc.x < buffer) {
  //     desiredHeading.x = this.maxSpeed;
  //     nearEdge = true;
  //   } 
  //   else if (this.loc.x > wScreen - buffer) {
  //     desiredHeading.x = -this.maxSpeed;
  //     nearEdge = true;
  //   }

  //   if (this.loc.y < buffer) {
  //     desiredHeading.y = this.maxSpeed;
  //     nearEdge = true;
  //   } 
  //   else if (this.loc.y > height - buffer) {
  //     desiredHeading.y = -this.maxSpeed;
  //     nearEdge = true;
  //   }
  //   if (!nearEdge) return;
    
  //   this.steer(desiredHeading, sliderEdgeClear.value());
  // }

  // avoidSides() {
  //   let buffer = sliderEdgeVision.value();
  //   let desiredHeading = this.vel.copy();
  //   let nearEdge = false;

  //   if (this.loc.x < buffer) {
  //     desiredHeading.x = this.maxSpeed;
  //     nearEdge = true;
  //   } 
  //   else if (this.loc.x > wScreen - buffer) {
  //     desiredHeading.x = -this.maxSpeed;
  //     nearEdge = true;
  //   }

  //   if (!nearEdge) return;
    
  //   this.steer(desiredHeading, sliderEdgeClear.value());
  // }
  
  checkEdges(){
    if(this.loc.x < 0) this.loc.x = wScreen;
    else if (this.loc.x > wScreen) this.loc.x = 0;
    
    if(this.loc.y < 0) this.loc.y = height;
    else if(this.loc.y > height) this.loc.y = 0;
  }

  bounce_walls() {

    if ((this.loc.x < edge_buffer && this.vel.x < 0 ) || (this.loc.x > wScreen - edge_buffer && this.vel.x > 0))
    {
      //Mirroring the velcoity direction
      this.vel.x *= Math.tanh(abs(this.vel.x) / edgeBounceFactor) - 1;
      // this.vel.x += 0.2*Math.sign(this.vel.x);
    }

    if(this.loc.y < 0) this.loc.y = height;
    else if(this.loc.y > height) this.loc.y = 0;
  }

    bounce_circular() 
    {
      if ((this.radius > r_big - this.bounce_zone_range) || (this.radius < r_small + this.bounce_zone_range))
      {
        //Finding the radial unit vector
        let vecRadius = this.loc.copy().sub(this.center);
        let unitRadius = vecRadius.copy().normalize();
        let vel_radial_scalar = this.vel.copy().dot(unitRadius);
        let v_radial = unitRadius.copy().mult(vel_radial_scalar);
        let v_tang = this.vel.copy().sub(v_radial);
        let v_radial_unit = v_radial.copy().normalize();

        // if (((this.radius > r_big - BOUNCE_ZONE || this.radius < r_small + BOUNCE_ZONE)  && abs(vel_radial_scalar) < 0.01)) {
        //   return;
        // }
        if (this.radius > r_big - circular_buffer && vel_radial_scalar > 0) {
          // v_radial.add(unitRadius.copy().mult(-1 * abs(v_radial.mag())));
          v_radial.add(v_radial_unit.mult(-0.02));
        }
        else if (this.radius < r_small + circular_buffer) {
          v_radial.add(unitRadius.copy().mult(0.1));
        }
        //v_radial *= Math.tanh(abs(vel_radial_scalar/ this.bounceFactor)) - 1;
        this.vel = v_radial.add(v_tang) ;

    }
  }

  percieve_by_r(radius)
  {
    this.vision.r = radius;
    this.neighbors = qt.query(this.vision);
  }

  get_pair_correlations()
  {
    let integral_on_corrs = [];
    for (let rad = 0; rad <= 250; rad += 3) {
      this.percieve_by_r(rad);
      let sum = 0;
      for (let n of this.neighbors)
      {
          if (n != this) 
          {
            let n_vel = n.vel.copy().normalize();
            let my_heading = this.vel.copy().normalize();
            sum += my_heading.dot(n_vel);
          }     
      }
      if(this.neighbors.length >= 2){
        let avg_correlation = sum / (this.neighbors.length-1);
        integral_on_corrs.push(avg_correlation);
      }
      else{
        integral_on_corrs.push(0);
      }

    }
    for (let j=1; j< integral_on_corrs.length; j++)
    {
      let der = integral_on_corrs[j] - integral_on_corrs[j-1];
      this.pair_correlations.push(der);
    }
  }


  display() {
    noStroke();
    fill(255);
    if (displayHighlight && this.found) {
      fill(0, 255, 0);
    }
    
    push();
    translate(this.loc.x, this.loc.y);
    rotate(this.vel.heading());
    
    if(displayHighlight && this.highlighted){
      //triangle(4,0, -4,3, -4,-3);
      stroke(150, 0, 200);
      fill(230,0,240);
      rect(-this.len/2, -this.wid/2, this.len, this.wid);
    }else {
      //triangle(3, 0, -3, 2, -3, -2);
      rect(-this.len/2, -this.wid/2, this.len, this.wid);
    }
    pop();

    if (displayHighlight && this.highlighted) {
      // A vision (flock vision)
      noFill();
      stroke(0, 255, 0);
      strokeWeight(1);
      ellipse(this.loc.x, this.loc.y, 2 * this.vision.r);
      
      // C vision (edge vision)
      stroke(255, 150);

    }
  }
}
//No Occlusion - AOI - main branch

class Individual extends Movel {
	constructor() {
		super() ;
	}

	visual_vel(n) {
	 	//First we'll calculate the radial velcoity of neoghbor 'n'
	 	let exact_r = this.periodSub(n.loc, this.loc);
	 	let exact_r_mag = exact_r.mag();
	 	let exact_r_prev = this.periodSub(n.prevLoc, this.prevLoc);
	    const degF = 180 / Math.PI;

	 	let alpha = this.subst_angle(n, true) / 2;
	 	let alpha_debug = alpha * degF;
	    let alpha_dot = this.delta_sub_angle(n) / 2;
	    let alpha_dot_debug = alpha_dot * degF;
	    let beta = this.bearing(n);
	    let beta_debug = beta * degF;
	    let beta_dot = this.delta_bearing(n);
	    let beta_dot_debug = beta_dot * degF;
	 	let r = this.visual_r(n, alpha);
	 	let r_mag = r.mag();
	 	let r_dir = r.copy().normalize();
	  	let vr_factor = -2 * alpha_dot / Math.sin(2*alpha);
	 	let vr_ex = exact_r.copy().mult(vr_factor);
	 	let vt_ex = createVector(exact_r.y, -exact_r.x).mult(-beta_dot) ;

	 	let vr = r.copy().mult(-2 * alpha_dot / Math.sin(2*alpha));
	 	// Positive beta dot is clockwise rotation so the cross product yields (b, -a)
	 	let vt = createVector(r.y, -r.x).mult(-beta_dot) ;
	 	
	 	let v_total = vr.add(vt);
	 	let v_total_ex = vr_ex.add(vt_ex);
	 	return v_total;
	}


	flock(){
	    if (this.neighbors.length <= 1) return; // -1 because not counting itself
	    
	    // alignment 
	    let sumVel = createVector();
	    let avgRelativeVelocity = createVector(0, 0);

	    for (let n of this.neighbors) {
	      if (n != this) {
	      	let velo = this.visual_vel(n);
	        sumVel.add(velo);  //Accumulation of relative neighbor velocities  
	      }
	    }
	    
	    // alignment
	    avgRelativeVelocity = sumVel.div(this.neighbors.length - 1); // -1 because not counting itself
	    this.deflect(avgRelativeVelocity, initInfluence);
	  }
  	
}
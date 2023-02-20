// Ignore occluded - AOI

class Ignore extends Movel {
	constructor() {
		super();
	}

	alpha_update(edges, time=true)
	{
		let alpha_array = this.alphas;
		if (!time)
			alpha_array = this.prev_alphas;
	    if (Math.abs(edges[1] - edges[0]) > 1.5*Math.PI)
	    { 
	      var left_edge_hagav = [-Math.PI, edges[0]];
	      var right_edge_hagav = [edges[1], Math.PI];
	      var alpha_left =  this.alpha_update(left_edge_hagav, time);
	      var alpha_right = this.alpha_update(right_edge_hagav, time);
	      var sum_alphas = 0;
	      if (alpha_left > 0) sum_alphas += alpha_left;
	      if (alpha_left < 0) return -1;
	      if (alpha_right > 0) sum_alphas += alpha_right;
	      if (alpha_right < 0) return -1;
	      if (sum_alphas > 0) {
	        return sum_alphas;
	      }
	      else {
	        return -1;
	      }
	    }
	    if (alpha_array.length == 0)
	    {
	      alpha_array.push(edges);
	    //   if (this.highlighted)
	    //   	console.log("1 first edge to push") ;
	      return edges[1] - edges[0];
	    }
	    alpha_array.sort(function(a, b){return a[0] - b[0]}); // Sorting by their start angle;
	    if ((edges[1] < alpha_array[0][0]) || (edges[0] > alpha_array[alpha_array.length -1][1]))
	    { //If the new angle edges are smaller\bigger than all the others and no overlap
	      alpha_array.push(edges);
	    //   if (this.highlighted)
	    //   	console.log("2");
	      return edges[1] - edges[0];
	    }
	    for (let i = 0; i < alpha_array.length; i++)
	    {	
	    	//Check if right/left edge is inside one of the alphas
	    	if ( ( alpha_array[i][0] < edges[0] && edges[0] < alpha_array[i][1]) 
	    		|| (alpha_array[i][0] < edges[1] && edges[1] < alpha_array[i][1]))
	    		return -1;
	    	else
	    		continue;
	    }
	    //edges are not overlapping any existing alphas
	   	alpha_array.push(edges);
	    if (this.highlighted)
	            console.log("6 in between");
	    return edges[1] - edges[0];
	}



	flock(){
	    if (this.neighbors.length <= 1) return; // -1 because not counting itself
	    
	    // alignment and cohesion
	    let sumVel = createVector();
	    let avgLoc = createVector();
	    
	    let desiredHeadingSeparation = createVector(0, 0);
	    let avgRelativeVelocity = createVector(0, 0);
	    let distance;

	    let neighborsWithDists = [];
	    for (let neigh of this.neighbors) {
	      neighborsWithDists.push([neigh, this.exactlyR(neigh)]);
	    }
	    neighborsWithDists.sort(compare);
	    this.neighbors = [];
	    for (let neigh of neighborsWithDists) {
	      this.neighbors.push(neigh[0]);
	    }
	    let effective_neighbors_num = 0
	    for (let n of this.neighbors) { 
	      if (n != this) {

	        //let r = this.visual_r(n);
	        let n_edges_current  = this.alpha_edges(n, true);
	        let n_edges_prev = this.alpha_edges(n, false);
	        let current_alpha = this.alpha_update(n_edges_current, true);
	        let prev_alpha = this.alpha_update(n_edges_prev, false);
	        if (current_alpha < 0 || prev_alpha < 0) { // neighbor is fully occluded or was fully occluded
	          continue;
	        }
	        let velo = this.visual_vel(n, current_alpha, prev_alpha);
	        effective_neighbors_num++;
	        sumVel.add(velo);  //Accumulation of relative neighbor velocities  
	        //sumVel.add(createVector(random(-this.maxSpeed, this.maxSpeed), random(-this.maxSpeed, this.maxSpeed)));

	      } 
	    }  
	    // alignment
	    if (effective_neighbors_num > 0){
	    	avgRelativeVelocity = sumVel.div(effective_neighbors_num); 
	    	this.deflect(avgRelativeVelocity, initInfluence);
	    }
	
	  }

}
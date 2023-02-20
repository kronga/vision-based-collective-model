//OPI MODEL - CLUSTERS 


class Cluster extends Movel{
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
	      if (alpha_right > 0) sum_alphas += alpha_right;
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
	      // if (this.highlighted)
	      	// console.log("1 first edge to push") ;
	      return edges[1] - edges[0];
	    }
	    alpha_array.sort(function(a, b){return a[0] - b[0]}); // Sorting by their start angle;
	    if ((edges[1] < alpha_array[0][0]) || (edges[0] > alpha_array[alpha_array.length -1][1]))
	    { //If the new angle edges are smaller\bigger than all the others and no overlap
	      alpha_array.push(edges);
	      // if (this.highlighted)
	      // console.log("2");
	      return edges[1] - edges[0];
	    }
	    for (let i = 0; i < alpha_array.length; i++)
	    {
	    	if (edges[0] > alpha_array[i][0]  && edges[1] < alpha_array[i][1] ) 
	      		{
		      	//Neighbor is fully occluded 
		      	// if (this.highlighted)
		      		// console.log("fully occluded neighbor" + edges) ;
		      	return -1 ;
	    		}
	    	else if (alpha_array[i][0] < edges[0] && edges[0] < alpha_array[i][1])
	    	{
	    		if ( i < (alpha_array.length - 1)  && alpha_array[i][1] < edges[1] )
	    		{
	    			if (edges[1] < alpha_array[i+1][0])
	    			{ // Check if candidate ends before the next interval starts
	        			let occluded_alpha = edges[1] - alpha_array[i][1];
	        			alpha_array[i][1] = edges[1]; // Merging the two, partially overlapping, intervals
	        			// if (this.highlighted)
	        			// 	console.log("3");	
	        			return occluded_alpha;
	          		}
			        else 
			        { // In this case candidate partially overlaps with two consecutive intervals
			            let occluded_alpha = alpha_array[i+1][0] - alpha_array[i][1]; //Returns the remaing space between the two intervals
			            alpha_array[i][1] = alpha_array[i+1][1];
			            alpha_array.splice(i+1, 1); //Merging all 3 intervals into one big interval from start[i] to end[i+1]
			            // if (this.highlighted)
			            // 	console.log("4");
			            return occluded_alpha;
			        }
	    		}
	    		else if ( alpha_array[i][1] < edges[1] ) // i == alpha_arry.length
	    		{
						let occluded_alpha = edges[1] - alpha_array[i][1];
	        			alpha_array[i][1] = edges[1]; // Merging the two, partially overlapping, intervals
	        			// if (this.highlighted)
	        			// 	console.log("3_last");
	        			return occluded_alpha;
	    		}
	    		else
	    			return -1 ;
	    	}
	    	else
	    		continue ;
	    }
	    //edges are not overlapping any existing alphas
	   	alpha_array.push(edges);
	    // if (this.highlighted)
	    //         console.log("6 in between");
	    return edges[1] - edges[0];
	}



    flock(){
	    if (this.neighbors.length <= 1) return; // -1 because not counting itself
	    
	    // alignment and cohesion
	    let sumVel = createVector();
	    let avgLoc = createVector();
	    
	    let avgRelativeVelocity = createVector(0, 0);

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
	    avgRelativeVelocity = sumVel.div(effective_neighbors_num); 
	    this.deflect(avgRelativeVelocity, initInfluence);
	  }

}
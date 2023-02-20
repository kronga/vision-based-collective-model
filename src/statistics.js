let download_already = true;
let download_already2;


class Statistics
{
	constructor()
	{
		this.angles = [];
		this.stds = [];
		this.vars = [];
		this.correlations = [];
		this.polarization = [];
		this.bins = [];
		this.arr_x = [];
		this.arr_y = [];
		this.r;
		this.avg_distance = [];
		this.pair_correlations = [];
	}

	get_angles(movels = [])
	{
		this.angles = [];
		this.arr_x = [];
		this.arr_y = [];
		for (let m of movels)
		{
			let angle = m.vel.heading();
			this.arr_x.push(Math.cos(angle));
			this.arr_y.push(Math.sin(angle));
			this.angles.push(angle);
		}
	}


	get_polarization(movels = [])
	{
		let sum = createVector(0,0);
		for (let m of movels)
		{
			let v_i = m.vel.normalize(0);
			sum.add(v_i);
			// if (v_i > 1)
			// 	console.log(v_i);
		}
		this.polarization.push(sum.mag() / movels.length);
	}

	periodSub(v2, v1) 
	{
		let x = (v2.x - v1.x + wScreen/2).mod(wScreen) - wScreen/2;
		let y = (v2.y - v1.y + height/2).mod(height) - height/2;
		let v = createVector(x, y);
		return v;
	}

	get_avg_distance(movels = [])
	{
		let sum_dist = 0;
		let pair_counter = 0;
		for (const[i, m] of movels.entries())
		{
			let loc_1 = m.loc.copy();
			for (let j=0; j<i; j++)
			{
				let loc_2 = movels[j].loc.copy();
				let dist = this.periodSub(loc_1, loc_2).mag();
				sum_dist += dist;
				pair_counter++;
			}
		}
		this.avg_distance.push(sum_dist / pair_counter);
	}

	add_std()
	{
		const sum_x = this.arr_x.reduce((a, b) => a + b, 0);
		const sum_y = this.arr_y.reduce((a, b) => a + b, 0);
		const avg_x = (sum_x / this.arr_x.length) || 0;
		const avg_y = (sum_y / this.arr_y.length) || 0;
		let r_mean = createVector(avg_x, avg_y).mag();
		this.vars.push(1 - r_mean);
		let std = Math.sqrt(-2*Math.log(r_mean));
		this.stds.push(std);
	}

	get_correlation(movels = [])
	{
		let sum_corr = 0;
		for (let m of movels)
		{
			let vec_rad = m.loc.copy().sub(m.center);
			vec_rad.normalize();
			let vec_azimut = vec_rad.rotate(HALF_PI);
			let correlation = m.vel.dot(vec_azimut);
			sum_corr += correlation;
		}
		let avg_correlation = sum_corr / movels.length;
		this.correlations.push(abs(avg_correlation));
	}

	avg_pair_correlations(movels = [])
	{
		for (let m of movels)
		{
			m.get_pair_correlations();
		}
		var array_length = movels[0].pair_correlations.length;
		for(var i = 0; i < array_length; i++){
		  var sum = 0;
		  //still assuming all arrays have the same amount of numbers
		  for(let m of movels){ 
		    sum += m.pair_correlations[i];
		  }
		  this.pair_correlations.push(sum / movels.length);
		}

		//Clean the movels pair_correlatiosn arraays
		for (let m of movels){
			m.pair_correlations = [];
		}
	}

	download(text, name, type) {
	  var a = document.createElement('a');
	  var file = new Blob([text], {type: type});
	  a.href = URL.createObjectURL(file);
	  a.download = name;
	}

	download_file(data, filename, type) {
		var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
        	url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
	}



	download_stds(agent_type = "default", num_units, max_ticks=6000)
	{
		if (this.stds.length == max_ticks)
		{
			this.download_file('Exp is done', 'done.txt', 'text/plain');

			var element = document.createElement('a');
			element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.stds)));
			element.setAttribute('download', "stds_" + agent_type +"_" + num_units + ".json");	
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();	
			document.body.removeChild(element);

			
		}
		
	}


	download_avg_dist(agent_type = "default", num_units, max_ticks=6000)
	{
		if (this.avg_distance.length == max_ticks)
		{
			this.download_file('Exp is done', 'done.txt', 'text/plain');

			var element = document.createElement('a');
			element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.avg_distance)));
			element.setAttribute('download', "avg_dists_" + agent_type +"_" + num_units + ".json");	
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();	
			document.body.removeChild(element);

			
		}	
	}

	download_correlations(agent_type = "default", num_units, max_ticks=6000)
	{
		if (this.correlations.length == max_ticks)
		{
			this.download_file('Exp is done', 'done.txt', 'text/plain');

			var element = document.createElement('a');
			element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.correlations)));
			element.setAttribute('download', "corrs_" + agent_type + "_" + num_units + ".json");	
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();	
			document.body.removeChild(element);

			// setTimout(window.open('','_self').close(), 1);
			// window.open('','_self').close() ;
			// window.location.reload();
		}
	}


	download_order_params(agent_type = "default", num_units, max_ticks=6000)
	{
		if (this.correlations.length == max_ticks)
		{
			var element = document.createElement('a');
			element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.order_stats)));
			element.setAttribute('download', "order_param_" + agent_type + "_" + num_units + ".json");	
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();	
			document.body.removeChild(element);
		}
	}


	download_data(data, agent_type = "default", num_units, frame_count, extra_txt = "", reset_flag = false)
	{
		if (reset_flag ==true){
			this.download_file('Exp is done', 'done.txt', 'text/plain');
		}	
		var element = document.createElement('a');
		element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)));
		element.setAttribute('download', frame_count + "data_" +
							agent_type +extra_txt+ "_" + num_units +"r_" + vision_radius+"i_" + initInfluence+ extra_txt + ".json");		
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();	
		document.body.removeChild(element);
		
	}




		download_vars()
	{
		if (!download_already2 && this.vars.length == 3000)
		{
			var element = document.createElement('a');
			element.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.vars)));
			element.setAttribute('download', "vars.json");	
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();	
			document.body.removeChild(element);
			
			download_already2 = true;
			setTimeout(function()
			{ 
				download_already2 = false;
			}, 3000);
		}
		
	}

}
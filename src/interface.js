function setupUserInterface(){
  logFrameRate = [];
  avgFrameRate = frameRate();
  
  sliderUnitCount = createSlider(1, 300 , units_num, 1) ;
  sliderCapacity = createSlider(1, 50, 15, 1) ;
  
  sliderInfluence = createSlider(0, 1, initInfluence, 0.01) ;

  sliderFlockVision = createSlider(1, 300, vision_radius, 1) ;
  
  sliderHeight = createSlider(1, 200, agent_length, 0.1) ;
  sliderWidth = createSlider(0.5, 200, 10, 0.1) ;
  
  sliderEdgeClear = createSlider(0, 2, 0.5, 0.05) ;
  sliderEdgeVision = createSlider(1, 120, 60, 1) ;

  sliderBoxes.push(new SliderBox(sliderUnitCount, "unit count", width-wSettingsArea+5, 5, "red"));
  sliderBoxes.push(new SliderBox(sliderCapacity, "capacity", width-wSettingsArea+5, 60, "red"));
  
  sliderBoxes.push(new SliderBox(sliderInfluence, "influence", width-wSettingsArea+5, 115, "yellow"));
  
  // sliderBoxes.push(new SliderBox(sliderAlignment, "alignment", width-wSettingsArea+5, 170, "green"));
  // sliderBoxes.push(new SliderBox(sliderCohesion, "cohesion", width-wSettingsArea+5, 225, "green"));
  // sliderBoxes.push(new SliderBox(sliderSeparation, "separation", width-wSettingsArea+5, 280, "green"));

  sliderBoxes.push(new SliderBox(sliderFlockVision, "Flock vision", width-wSettingsArea+5, 335, "green"));

  sliderBoxes.push(new SliderBox(sliderHeight, "height", width-wSettingsArea+5, 390, "blue"));
  sliderBoxes.push(new SliderBox(sliderWidth, "width", width-wSettingsArea+5, 445, "blue"));

  sliderBoxes.push(new SliderBox(sliderEdgeClear, "containment", width-wSettingsArea+5, 500, "violet"));
  sliderBoxes.push(new SliderBox(sliderEdgeVision, "Edge vision", width-wSettingsArea+5, 555, "violet"));
}

function updateFrameRate() {
  let lArray = 30;
  if (logFrameRate.length >= lArray) {
    logFrameRate.splice(0, 1);
  }
  logFrameRate.push(frameRate());
  let avg = 0;
  for (let i = 0; i < logFrameRate.length; i++) {
    avg += logFrameRate[i];
  }
  avgFrameRate = avg / logFrameRate.length;
}

function displayFrameRate(tint) {
  let str = parseInt(avgFrameRate) + " fps";

  if (tint == "white") {
    let notRed = map(avgFrameRate, 30, 55, 0, 255);
    fill(255, notRed, notRed, 200);
  } else if (tint == "black") {
    var red = map(avgFrameRate, 30, 55, 255, 0);
    fill(red, 0, 0);
  }

  textAlign(RIGHT);
  textSize(14);
  noStroke();
  text(str, width-wSettingsArea-5, 18);
}

class SliderBox {
  constructor(slider, label, x, y, clr) {
    this.label = label;
    this.slider = slider;

    this.x = x;
    this.y = y;
    this.w = 120;
    this.h = 50;
    this.p = 5;

    this.slider.style('width', this.w - 2 * this.p - 3 +'px')
    this.slider.position(this.x + this.p, this.y + this.p / 2);
    
    this.clr = clr;
  }
  
  display() {
    let opac = 40;
    rectMode(CORNER);
    if(this.clr == "red"){
      fill(255, 0, 0, opac);
    }
    else if(this.clr == "yellow"){
      fill(255, 255, 0, opac);
    }
    else if(this.clr == "green"){
      fill(0, 255, 0, opac);
    }
    else if(this.clr == "blue"){
      fill(0, 0, 255, opac);
    }
    else if(this.clr == "violet"){
      fill(255, 0, 255, opac);
    }
    stroke(255);
    strokeWeight(1);
    rect(this.x, this.y, this.w, this.h);

    fill(255);
    noStroke();
    textSize(14);
    textAlign(LEFT, BOTTOM);
    var label = this.label + ":";
    text(label, this.x + this.p, this.y + this.h - this.p);
    textAlign(RIGHT, BOTTOM);
    text(this.slider.value(), this.x + this.w - this.p, this.y + this.h - this.p);
  }
}
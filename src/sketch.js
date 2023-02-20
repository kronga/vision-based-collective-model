
var movels = [];
var sliderBoxes = [];
var stats;
var r_big = 150;
var r_small = 50;
var thickness = r_big - r_small;
var frameCounter = 0;


// screen settings
var wScreen = 570;
var wSettingsArea = 130;

function setup() {
  createCanvas(700, 600);
  setupUserInterface();

  stats = new Statistics();
  let boundary = new Rectangle(wScreen / 2, height / 2, wScreen, height) ;
  qt = new QuadTree(boundary, sliderCapacity.value()) ;

  for (let i = 0; i < sliderUnitCount.value(); i++) {
    let movel = new AgentFactory(type) ;
    movels.push(movel) ;
  }
  movels[movels.length - 1].highlighted = true; // needs to be the last element
  for (let m of movels) {
    qt.insert(m);
  }
}

function draw() {
  if (need_visuals) {
    background(0);
  }
  if (arena_type == "circ") {
    stroke(0, 0, 255);
    noFill();
    strokeWeight(3);
    ellipse(wScreen / 2, height / 2, 2 * r_big);
    ellipse(wScreen / 2, height / 2, 2 * r_small);
  }

  updateUnitCount();

  qt.capacity = sliderCapacity.value();
  qt.clear();

  for (let m of movels) {
    qt.insert(m);
  }

  for (let m of movels) {
    m.update();
  }
  if (isStats) {

    if (arena_type == "circ") {
      stats.get_correlation(movels);
      if (frameCounter == expLength)
      {
        stats.download_data(stats.correlations, type, units_num, frameCounter, "", true)
      }
    }
    else
    {
      stats.get_polarization(movels);
      if(frameCounter == expLength)
      {
        stats.download_data(stats.polarization, type, units_num,frameCounter, "", true);
      }
      // stats.get_angles(movels);
      // stats.add_std();
      // stats.download_stds(type, units_num, expLength);  
    }


    // // stats.get_avg_distance(movels);
    // // stats.download_avg_dist(type, units_num, expLength);


    // if (frameCounter == 500)
    // {
    //   stats.avg_pair_correlations(movels);
    //   stats.download_data(stats.pair_correlations, type, units_num, frameCounter, "500PC");
    //   stats.pair_correlations = [];
    // }

    // if (frameCounter == 1000)
    // {
    //   stats.avg_pair_correlations(movels);
    //   stats.download_data(stats.pair_correlations, type, units_num, frameCounter, "1000PC")
    //   stats.pair_correlations = [];
    // }

    // if (frameCounter == 2000)
    // {
    //   stats.avg_pair_correlations(movels);
    //   stats.download_data(stats.pair_correlations, type, units_num, frameCounter,"2000PC");
    //   stats.pair_correlations = [];
    // }

    // if (frameCounter == expLength)
    // {
    //   stats.avg_pair_correlations(movels);
    //   stats.download_data(stats.pair_correlations, type, units_num, frameCounter,"3000PC", true);
    //   stats.pair_correlations = [];
    // }


  }

  

  updateFrameRate();
  frameCounter++;

  // console.log(frameCount);

  if (need_visuals) {
    displayAll();
  }

  
}

function displayAll() {
  if (displayQuadtree) qt.display();

  if (displayUnits) {
    for (let m of movels) {
      m.display();
    }
  }

  displayFrameRate("white");

  displaySettingsArea();

  for (let b of sliderBoxes) {
    b.display();
  }
}

function displaySettingsArea() {
  fill(0);
  noStroke();
  rectMode(CORNER);
  rect(width - wSettingsArea, 0, wSettingsArea, height);

  strokeWeight(1);
  stroke(255, 150);
  line(wScreen, 0, wScreen, height);
}

function updateUnitCount() {
  let diff;
  if (movels.length > sliderUnitCount.value()) {
    diff = movels.length - sliderUnitCount.value();
    movels.splice(0, diff);
  } else if (movels.length < sliderUnitCount.value()) {
    diff = sliderUnitCount.value() - movels.length;
    for (let i = 0; i < diff; i++) {
      movels.unshift(new Cluster());
    }
  }
}

function downloadSvg()
{
    let svgElement = document.getElementsByTagName('svg')[0];
    let svg = svgElement.outerHTML;
    let file = new Blob([svg], { type: 'plain/text' });
    let a = document.createElement("a"), url = URL.createObjectURL(file);

    a.href = url;
    a.download = 'exported.svg';    
    document.body.appendChild(a);
    a.click();

    setTimeout(function() 
    {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}
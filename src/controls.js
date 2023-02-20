function keyPressed() {
  if (key == 'p' || key == 'P') {
    paused = !paused;
    if (paused) noLoop();
    else loop();
  }

  if (key == '1') {
    displayQuadtree = !displayQuadtree;
  }
  
  if (key == '2') {
    displayUnits = !displayUnits;
  }
  
  if (key == '3') {
    displayHighlight = !displayHighlight;
  }
  
  // if (key == '5') {
  //   pred = !pred;
  // }
  
  // if (key == '6') {
  //   edges = !edges;
  // }

  // if (key == '7') {
  //   sides = !sides;
  // }



}
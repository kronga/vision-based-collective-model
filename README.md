# Vision Based Collective Motion Model: 
## A Locust Inspired Reductionist Approach

Repository of the Vision-based collective motion model.

- `src`: code files of the 2D simulator and the vision-based model
- `plots`: code used for running the simulation and plotting the figures
- `simData`: raw output datafiles from the simulations


## Running the simulation 

After cloning the repo enter the **src** folder and double click the **index.html** file.
This will run the simulation on your default browser.

### Changing the simulation parameters
Some simulation paramters can be changed during run-time via the slide-bars on the right side of the window.
All the parameters can also be changed via the **config.js** file.
The occlusion method is set by the `type` variable:
- `indi`: The principal model without occlusions
- `igno`: OMID - ignoring partially occluded neihgbors
- `extr`: COMPLID - completing (extrapolating) partially occluded neihgbors
- `clus`: PARTID - treating each cluster of pixels as a neighbors

In order to simulate in different arena types:
- `toro`: Toroidal arena
- `road`: Infinite corridor arena
- `circ`: Ring arena (circular)

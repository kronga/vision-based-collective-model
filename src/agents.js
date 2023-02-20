//Abstract layer class

class AgentFactory {
  constructor(type) {
    if(type === "indi")
      return new Individual();
    if(type === "clus")
      return new Cluster();
    if(type === "extr")
      return new Extrap();
   	if(type === "igno")
      return new Ignore();
  }
};
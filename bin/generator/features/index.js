import { featureRegistry } from "./registry.js";


export async function setupFeatures(config){

  for(
    const setupFeature of featureRegistry
  ){

    await setupFeature(config);

  }

}
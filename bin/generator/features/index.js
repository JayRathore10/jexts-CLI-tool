import { featureRegistry } from "./registry.js";


export async function setupFeatures(config){

  await featureRegistry(config);

}
import fs from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import mongoose from "mongoose"
import { fileURLToPath } from 'url'
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)
function toTitleCase(str:string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });     
}

export async function seedDatabase(runSaveMiddleware:boolean, seedDir:string) {
  const dir = await readdir(seedDir);
  const seedFiles = dir.filter((f) => f.endsWith('.seed.js'));

  const modelPromises = seedFiles.map(async (file) => {
    const fileName = file.split('.seed.js')[0];

    const modelName = toTitleCase(fileName);
    const model = mongoose.models[modelName];

    if (!model) {
      throw new Error(`Cannot find Model '${modelName}'`);
    }
 

    const fileContents = await import(path.join(seedDir, file));

    return runSaveMiddleware
      ? model.create(fileContents.default)
      : model.insertMany(fileContents.default);
  });

 await Promise.all(modelPromises);

}
// It returns an array of promises promise that resolves with an array of inserted document instances. use await Promise.all() to get the returned array
// runSave middleware is a boolean
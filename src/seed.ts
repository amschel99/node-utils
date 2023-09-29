import fs from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import mongoose from "mongoose"

const __dirname = path.dirname(new URL(import.meta.url).pathname);

function toTitleCase(str:string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export async function seedDatabase(runSaveMiddleware:boolean) {
  const dir = await readdir(__dirname);
  const seedFiles = dir.filter((f) => f.endsWith('.seed.js'));

  const modelPromises = seedFiles.map(async (file) => {
    const fileName = file.split('.seed.js')[0];

    const modelName = toTitleCase(fileName);
    const model = mongoose.models[modelName];

    if (!model) {
      throw new Error(`Cannot find Model '${modelName}'`);
    }
 

    const fileContents = await import(path.join(__dirname, file));

    return runSaveMiddleware
      ? model.create(fileContents.default)
      : model.insertMany(fileContents.default);
  });
  return modelPromises;

}
// It returns a promise that resolves with an array of inserted document instances. use await Promise.all() to get the returned array
// runSave middleware is a boolean
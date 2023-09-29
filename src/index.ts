import mongoose, {ConnectOptions} from 'mongoose'
import { seedDatabase } from './seed'

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error: any) {
  
      if (error.message === 'ns not found') return
   
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
    }
  }
}


  export function setupDB (databaseName:string, runSaveMiddleware:boolean,connection_url:string) {
    // Connect to Mongoose
    beforeAll(async () => {
      const url = `${connection_url}/${databaseName}`
      await mongoose.connect(url, { useNewUrlParser: true }as ConnectOptions)
    })
 // Seed Data 
 beforeEach(async () => {

    await seedDatabase(runSaveMiddleware)
  },30000)

    // Cleans up database between each test
    afterEach(async () => {
      await removeAllCollections()
    })

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections()
      await mongoose.connection.close()
    })
  }
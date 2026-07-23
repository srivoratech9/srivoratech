// MongoDB Atlas Database Client Helper for SriVoraTech
import { MongoClient } from 'mongodb'

const DB_NAME = 'srivoratech'

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    return { client: null, db: null }
  }

  try {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 3000,
      serverSelectionTimeoutMS: 3000
    })

    await client.connect()
    const db = client.db(DB_NAME)

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.warn('MongoDB Atlas connection skipped:', error.message)
    return { client: null, db: null }
  }
}


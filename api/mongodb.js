// MongoDB Atlas Database Client Helper for SriVoraTech
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'srivoratech'

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // If no env MONGODB_URI is provided, skip immediately (0ms delay) to fast server storage
  if (!MONGODB_URI) {
    return { client: null, db: null }
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 1500,
      serverSelectionTimeoutMS: 1500
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

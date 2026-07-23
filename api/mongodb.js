// MongoDB Atlas Database Client Helper for SriVoraTech
import { MongoClient } from 'mongodb'

// Default fallback MongoDB Atlas connection string (or process.env.MONGODB_URI)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://srivoratech_user:SriVoraTech2026SecurePass@cluster0.srivoratech.mongodb.net/srivoratech?retryWrites=true&w=majority'
const DB_NAME = 'srivoratech'

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    })

    await client.connect()
    const db = client.db(DB_NAME)

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.warn('MongoDB Atlas connection skipped (using file/memory storage fallback):', error.message)
    return { client: null, db: null }
  }
}

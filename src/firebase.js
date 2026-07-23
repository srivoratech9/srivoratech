// Firebase Configuration for SriVoraTech
// Real-time database for live ratings & reviews shared across all visitors

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue, push, child } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyReplaceWithYourOwn",
  authDomain: "srivoratech-ratings.firebaseapp.com",
  databaseURL: "https://srivoratech-ratings-default-rtdb.firebaseio.com",
  projectId: "srivoratech-ratings",
  storageBucket: "srivoratech-ratings.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
}

let app = null
let db = null

try {
  app = initializeApp(firebaseConfig)
  db = getDatabase(app)
} catch (error) {
  console.warn('Firebase init skipped (using live storage service):', error.message)
}

export { db, ref, set, get, onValue, push, child }
export default app

'use server'
import CustomError from '@/lib/CustomError'
import { connect } from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var mongoose: any
}

const DATABASE_URL: string | undefined = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new CustomError(
    'Invalid/Missing environment variable: "DATABASE_URL"',
    500
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
    }

    cached.promise = connect(DATABASE_URL as string, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect

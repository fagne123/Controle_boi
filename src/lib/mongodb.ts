import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@206.183.130.252:27017/boicontrolefagne1?authSource=admin';

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Conexão global para evitar múltiplas conexões em ambiente de desenvolvimento.
 */
const cached: CachedConnection = (global as { mongoose?: CachedConnection }).mongoose || { conn: null, promise: null };

if (!(global as { mongoose?: CachedConnection }).mongoose) {
  (global as { mongoose?: CachedConnection }).mongoose = cached;
}

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
} 
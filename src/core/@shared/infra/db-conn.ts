import { AuthenticationCreds } from 'baileys';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI as string;

export async function connectDB() {
  try {
    await mongoose.connect(uri, {
      dbName: 'jcwppapi',
    });
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB', err);
    process.exit(1);
  }
}

interface AuthDocument extends Document {
  _id: string;
  creds?: AuthenticationCreds;
}

async function connectToMongoDB() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('jcwppapi');
  const collection = db.collection<AuthDocument>('sessions');
  return { client, collection };
}

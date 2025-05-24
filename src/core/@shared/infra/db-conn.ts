import { AuthenticationCreds } from 'baileys';
import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI as string;

interface AuthDocument extends Document {
  _id: string;
  creds?: AuthenticationCreds;
}

export async function connectToMongoDB() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('jcwppapi');
  const collection = db.collection<AuthDocument>('sessions');
  return { client, collection };
}

import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis Client
const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // Required for Upstash Redis
    rejectUnauthorized: false,
  },
});

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();

export default client;

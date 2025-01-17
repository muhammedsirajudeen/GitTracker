import { createClient } from 'redis';

/**
 * Creates and connects a Redis client.
 * @returns The Redis client instance.
 */
async function createRedisClient() {
  const client = createClient({
    url: 'redis://redis:6379', // Update with your Redis server URL if needed
  });

  client.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  await client.connect();
  
  console.log('Connected to Redis');
  return client;
}

export async function RedisOtpHelper(email: string, otp: number | string, type?: string) {
  const client = await createRedisClient()
  try {
    //dont forget to set expiry here
    client.set(`${type ? type : 'otp'}-${email}`, otp)
    console.log(`OTP ADDED TO CACHE ${otp}`)
    return true
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function RedisOtpGetter(email: string, type?: string) {
  const client = await createRedisClient()
  try {
    const otp = await client.get(`${type ? type : 'otp'}-${email}`)
    return otp ?? null
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function RedisGenericRemover(email:string,type:string){
  const client=await createRedisClient()
  try {
      await client.del(`${type}-${email}`)
      return true
  } catch (error) {
    console.log(error)
    return null
  }
}


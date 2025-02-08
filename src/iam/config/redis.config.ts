import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  const host = process.env.REDIS_HOST;
  if (!host) {
    throw new Error('Missing environment variable: REDIS_HOST');
  }

  const port = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : NaN;
  if (isNaN(port)) {
    throw new Error('Invalid or missing environment variable: REDIS_PORT');
  }

  const password = process.env.REDIS_PASSWORD;
  if (!password) {
    throw new Error('Missing environment variable: REDIS_PASSWORD');
  }

  return { host, port, password };
});

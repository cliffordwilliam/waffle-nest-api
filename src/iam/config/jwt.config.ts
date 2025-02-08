import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  // Ensure essential variables are set, otherwise throw an error
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing');
  }

  const audience = process.env.JWT_TOKEN_AUDIENCE;
  if (!audience) {
    throw new Error('JWT_TOKEN_AUDIENCE environment variable is missing');
  }

  const issuer = process.env.JWT_TOKEN_ISSUER;
  if (!issuer) {
    throw new Error('JWT_TOKEN_ISSUER environment variable is missing');
  }

  const accessTokenTtl = Number(process.env.JWT_ACCESS_TOKEN_TTL) || 3600; // Default to 3600 seconds (1 hour)

  return {
    secret,
    audience,
    issuer,
    accessTokenTtl,
  };
});

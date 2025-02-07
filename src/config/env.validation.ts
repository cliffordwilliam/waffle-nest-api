import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  DATABASE_TYPE: Joi.string()
    .valid('postgres', 'mysql', 'mariadb', 'sqlite', 'mssql')
    .required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().integer().default(5432),
  DATABASE_HOST: Joi.string().hostname().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),

  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().integer().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),

  BCRYPT_SALT: Joi.number().integer().min(1).max(20).default(10),

  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),

  FRONTEND_URL: Joi.string().uri().required(),

  STRIPE_SECRET: Joi.string().required(),
});

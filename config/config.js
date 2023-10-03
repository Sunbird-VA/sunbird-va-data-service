/**
 * express-validation exposes a version of Joi as a hard dependency,
 * in order to avoid compatibility issues with other versions of Joi.
 */
import { Joi } from 'express-validation';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number()
    .default(4000),
  API_VERSION: Joi.string()
    .default('1.0')
    .description('API Version'),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  UNIQUE_NAME_PG_DB: Joi.string()
    .default('api')
    .description('Postgres database name'),
  UNIQUE_NAME_PG_TEST_DB: Joi.string()
    .default('api-test')
    .description('Postgres database for tests'),
  UNIQUE_NAME_PG_PORT: Joi.number()
    .default(5432),
  UNIQUE_NAME_PG_HOST: Joi.string()
    .default('localhost'),
  UNIQUE_NAME_PG_USER: Joi.string().required()
    .default('postgres')
    .description('Postgres username'),
  UNIQUE_NAME_PG_PASSWD: Joi.string().required('')
    .default('password')
    .description('Postgres password'),
  UNIQUE_NAME_PG_SSL: Joi.bool()
    .default(false)
    .description('Enable SSL connection to PostgreSQL'),
  UNIQUE_NAME_PG_CERT_CA: Joi.string()
    .description('SSL certificate CA'), // Certificate itself, not a filename
  PG_USER: Joi.string()
    .description('PG_USER'),
  PG_HOST: Joi.string()
    .description('PG host'),
  PG_DATABASE:Joi.string()
    .description('PG database'),
  PG_PASSWORD:Joi.string()
   .description('PG password'),
  PG_PORT: Joi.number(),
  IS_MIGRATED: Joi.bool()
  .default(true)
}).unknown().required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// if test, use test database
const isTestEnvironment = envVars.NODE_ENV === 'test';

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apiVersion: envVars.API_VERSION,
  jwtSecret: envVars.JWT_SECRET,
  postgres: {
    db: isTestEnvironment ? envVars.UNIQUE_NAME_PG_TEST_DB : envVars.UNIQUE_NAME_PG_DB,
    port: envVars.UNIQUE_NAME_PG_PORT,
    host: envVars.UNIQUE_NAME_PG_HOST,
    user: envVars.UNIQUE_NAME_PG_USER,
    passwd: envVars.UNIQUE_NAME_PG_PASSWD,
    ssl: envVars.UNIQUE_NAME_PG_SSL,
    ssl_ca_cert: envVars.UNIQUE_NAME_PG_CERT_CA,
  },
  telemetry: {
    db: envVars.PG_DATABASE,
    port: envVars.PG_PORT,
    host: envVars.PG_HOST,
    user: envVars.PG_USER,
    passwd: envVars.PG_PASSWORD,
  },
  AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME: envVars.AWS_BUCKET_NAME,
  AWS_REGION: envVars.AWS_REGION,
  AUDIO_URL: envVars.AUDIO_URL,
  FILE_URL: envVars.FILE_URL,
  STATUS_URL: envVars.STATUS_URL,
  IS_MIGRATED: envVars.IS_MIGRATED
};

export default config;

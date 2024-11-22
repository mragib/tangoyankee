import { registerAs } from '@nestjs/config';

export default registerAs('app_config', () => ({
  BACKEND_PORT: parseInt(process.env.BACKEND_PORT, 10),
  FRONTEND_URL: process.env.FRONTEND_URL,
  SECRETKEY: process.env.JWT_SECRET,
  ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC:
    process.env.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC,
  REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC:
    process.env.REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC,
}));

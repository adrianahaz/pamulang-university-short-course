import dotenv from 'dotenv';

dotenv.config();

export const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY || '';
export const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || '';

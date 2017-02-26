let env = process.env;
import AuthService from './AuthService';
const auth = new AuthService(env.AUTH0_CLIENT_ID, env.AUTH0_DOMAIN);
export default auth;
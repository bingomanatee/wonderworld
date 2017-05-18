let env = process.env;
import AuthService from './AuthService';
const auth = new AuthService('lRuQkIG0mlrNRziqtBnKejWq3-GX09mi', 'wonderlandabs.auth0.com',
  {
    auth: {
      redirectUrl: 'http://wonderlandlabs.com/#/login'
    }
  }

);
export default auth;
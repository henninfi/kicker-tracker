import { Fief, FiefUserInfo } from '@fief/fief';
import { FiefAuth, IUserInfoCache } from '@fief/fief/nextjs';

export const SESSION_COOKIE_NAME = "user_session";  

export const fiefClient = new Fief({  
  baseURL: 'https://rank-it-fief-prod-feifdb.fief.dev',
  clientId: '0w7YQcNlCiHiqljhSUrM5lKKLGwUyaG2rceXB0IElD8',
  clientSecret: 'EdVIx28qzWzViyAGPaw9Z_peAz3u6-RgDOgkMIbJ0jY',
});

class MemoryUserInfoCache implements IUserInfoCache {  
  private storage: Record<string, any>;

  constructor() {
    this.storage = {};
  }

  async get(id: string): Promise<FiefUserInfo | null> {
    const userinfo = this.storage[id];
    if (userinfo) {
      return userinfo;
    }
    return null;
  }

  async set(id: string, userinfo: FiefUserInfo): Promise<void> {
    this.storage[id] = userinfo;
  }

  async remove(id: string): Promise<void> {
    this.storage[id] = undefined;
  }

  async clear(): Promise<void> {
    this.storage = {};
  }
}

export const fiefAuth = new FiefAuth({  
  client: fiefClient,  
  sessionCookieName: SESSION_COOKIE_NAME,  
  redirectURI: 'http://localhost:3001/auth-callback',  
  logoutRedirectURI: 'http://localhost:3001',  
  userInfoCache: new MemoryUserInfoCache(),  
});

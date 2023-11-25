import { Fief, FiefUserInfo } from '@fief/fief';
import { FiefAuth, IUserInfoCache } from '@fief/fief/nextjs';

export const SESSION_COOKIE_NAME = "user_session";  

export const fiefClient = new Fief({  
  baseURL: 'https://rank-it.fief.dev',
  clientId: '23S-mZE4dCuZTBfT3XmDB3TktP3UyI_ucchcpuR-OEU',
  clientSecret: 'UE6fWYnWb9hilpij0zyBOWh5dZKobWwpU_spRZOD2wE',
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
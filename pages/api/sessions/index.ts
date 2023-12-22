import { SessionCreateData, SessionOut, SessionResponse} from './sessiontypes'
import axios from 'axios';
import { useAuthInfo } from "@propelauth/react";

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

async function createSession(sessionData: SessionCreateData, accessToken: string | null | undefined): Promise<SessionResponse> {
    if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
    }

    console.log(JSON.stringify(sessionData));

    try {
        if (!accessToken) {
          throw new Error("Access token is missing");
        }
        
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.post(`${NEXT_PUBLIC_API}/sessions/`, sessionData, {headers});
        return response.data as SessionResponse;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error: ${error.response?.status}`);
        } else {
            // Handle non-Axios errors
            throw new Error("An unexpected error occurred");
        }
    }
}

export { createSession };




async function getSession(id: string): Promise<SessionOut> {
    if (!NEXT_PUBLIC_API) {
      throw new Error("API URL is not defined");
    }
  
    const authInfo = useAuthInfo();
    console.log('headers', authInfo.accessToken)
  
    try {
      if (!authInfo || !authInfo.accessToken) {
        throw new Error("Access token is missing");
      }
  
      const headers = {
        Authorization: `Bearer ${authInfo.accessToken}`,
      };
  
      const response = await axios.get(`${NEXT_PUBLIC_API}/sessions/${id}`, { headers });
      return response.data as SessionOut;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Error: ${error.response?.status}`);
      } else {
        // Handle non-Axios errors
        throw new Error("An unexpected error occurred");
      }
    }
  }
  
  export { getSession };


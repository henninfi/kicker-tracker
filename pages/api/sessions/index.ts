import { SessionCreateData, SessionOut, SessionResponse} from './sessiontypes'
import axios from 'axios';

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;



export async function createSession(sessionData: SessionCreateData): Promise<SessionResponse> {
    if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
    }

    console.log(JSON.stringify(sessionData));

    try {
        const config = {
            withCredentials: true,  // This tells axios to send cookies along with the request
          };
        const response = await axios.post(`${NEXT_PUBLIC_API}/sessions/`, sessionData, config);
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


export async function getSession(id: string): Promise<SessionOut> {
    if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
    }

    try {
        const config = {
            withCredentials: true,  // This tells axios to send cookies along with the request
          };
        const response = await axios.get(`${NEXT_PUBLIC_API}/sessions/${id}`, config);
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



import { SessionCreateData, SessionOut, SessionResponse} from './sessiontypes'

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

export async function createSession(sessionData: SessionCreateData): Promise<SessionResponse> {
    if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
    }
    console.log(JSON.stringify(sessionData))
    const response = await fetch(`${NEXT_PUBLIC_API}/sessions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
    });

    

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    return await response.json() as SessionResponse;
}


export async function getSession(id: string): Promise<SessionOut> {
    if (!NEXT_PUBLIC_API) {
        throw new Error("API URL is not defined");
    }

    const response = await fetch(`${NEXT_PUBLIC_API}/sessions/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    return await response.json() as SessionOut;
}



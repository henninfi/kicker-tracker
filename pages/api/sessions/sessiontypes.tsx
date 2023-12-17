export type SessionCreateData = {
    name: string;
    description: string; 
    session_type: string;
    end_date?: string; // ISO date string or undefined
};

export type SessionOut = {
    name: string;
    description: string; 
    session_type: string;
    end_date?: string; // ISO date string or undefined
    id: string;
};

export type SessionResponse = {
    id: string; // Assuming the UUID is returned as a string
};

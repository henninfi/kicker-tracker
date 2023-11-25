export type SessionCreateData = {
    session_type: string;
    end_date?: string; // ISO date string or undefined
};

export type SessionOut = {
    session_type: string;
    end_date?: string; // ISO date string or undefined
    id: string;
};

export type SessionResponse = {
    id: string; // Assuming the UUID is returned as a string
};

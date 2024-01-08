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
    admin_ids?: string[]; // Add this line
    user_ids?: string[];  // And this line
};

export type SessionResponse = {
    id: string; // Assuming the UUID is returned as a string
};

export type SessionListType = 'admin_ids' | 'user_ids';

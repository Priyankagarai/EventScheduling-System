import React, { createContext, useState, ReactNode } from 'react';

// Define the context type
interface UserContextType {
    user: string | null;
    setUser: (user: string | null) => void;
}

// Create the UserContext with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a Provider component
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null); // Initialize user as null (logged out state)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

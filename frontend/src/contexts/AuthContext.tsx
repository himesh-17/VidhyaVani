"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api";
import { User } from "@/types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (name: string, email: string, password: string, role?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const initRef = useRef(false);

    const refreshUser = useCallback(async () => {
        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                console.log("AuthDebug: No token found");
                setUser(null);
                return;
            }

            console.log("AuthDebug: Refreshing user with token");
            const response = await authApi.getMe();
            console.log("AuthDebug: User refreshed successfully", response.data.data.user.role);
            setUser(response.data.data.user);
        } catch (error) {
            console.error("AuthDebug: Failed to refresh user", error);
            setUser(null);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
        }
    }, []);

    useEffect(() => {
        // Prevent double initialization in React Strict Mode
        if (initRef.current) return;
        initRef.current = true;

        const initAuth = async () => {
            const token = Cookies.get("accessToken");
            // Skip API call if no token - faster initial load
            if (!token) {
                setIsLoading(false);
                return;
            }

            await refreshUser();
            setIsLoading(false);
        };

        initAuth();
    }, [refreshUser]);

    const login = async (email: string, password: string): Promise<User> => {
        console.time("AuthContext: login API call");
        const response = await authApi.login(email, password);
        const { user: userData, accessToken, refreshToken } = response.data.data;
        console.timeEnd("AuthContext: login API call");

        // Store tokens in cookies
        Cookies.set("accessToken", accessToken, { expires: 1 / 96 }); // 15 minutes
        Cookies.set("refreshToken", refreshToken, { expires: 7 });

        setUser(userData);
        return userData;
    };

    const register = async (name: string, email: string, password: string, role?: string) => {
        const response = await authApi.register({ name, email, password, role });
        const { user: userData, accessToken, refreshToken } = response.data.data;

        Cookies.set("accessToken", accessToken, { expires: 1 / 96 });
        Cookies.set("refreshToken", refreshToken, { expires: 7 });

        setUser(userData);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            // Continue with local logout even if API fails
        } finally {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

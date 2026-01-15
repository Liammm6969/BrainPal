import api from "../api/api";

export interface LoginResponse {
    _id: string,
    name: string,
    email: string,
    token: string,
}

export interface SignupResponse {
    _id: string,
    name: string,
    email: string,
    message: string,
}

export const login = async (
    email: string, 
    password: string
): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/login", {
        email, 
        password
    });
    return res.data;
}   

export const signup = async (
    name: string,
    email: string,
    password: string
): Promise<SignupResponse> => {
    const res = await api.post<SignupResponse>("/auth/signup", {
        name,
        email,
        password
    });
    return res.data;
}

export const verifyOTP = async (
    userId: string,
    otp: string
): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>("/auth/verify-otp", {
        userId,
        otp
    });
    return res.data;
}

export const resendOTP = async (
    userId: string
): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>("/auth/resend-otp", {
        userId
    });
    return res.data;
}

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>("/auth/forgot-password", {
        email
    });
    return res.data;
}

export const resetPassword = async (
    token: string,
    newPassword: string
): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(`/auth/reset-password/${token}`, {
        newPassword
    });
    return res.data;
}
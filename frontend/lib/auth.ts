const USER_TOKEN_KEY = "snapwre_user_token";

export function generateUserToken(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

export function getUserToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let token = localStorage.getItem(USER_TOKEN_KEY);
  
  if (!token) {
    token = generateUserToken();
    localStorage.setItem(USER_TOKEN_KEY, token);
  }
  
  return token;
}

export function clearUserToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_TOKEN_KEY);
  }
}

export function setUserToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_TOKEN_KEY, token);
  }
}

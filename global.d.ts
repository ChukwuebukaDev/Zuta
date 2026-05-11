declare module '*.css';
export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "user";
    };
  }
}
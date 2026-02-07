declare module 'jsonwebtoken' {
  interface SignOptions {
    expiresIn?: string | number;
  }
}

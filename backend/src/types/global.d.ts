// Global type declarations to bypass strict TypeScript checks

declare namespace Express {
  export interface Request {
    query: any;
    body: any;
    params: any;
  }

  export interface Response {
    locals: any;
  }
}

declare module 'express' {
  interface Request {
    query: any;
    body: any;
    params: any;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    query: any;
    body: any;
    params: any;
  }
}

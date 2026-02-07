declare module 'jsonwebtoken' {
  interface JwtPayload {
    [key: string]: any;
  }

  interface SignOptions {
    expiresIn?: string | number;
    notBefore?: string | number;
    algorithm?: string;
    keyid?: string;
    mutatePayload?: boolean;
    audience?: string | string[];
    issuer?: string;
    subject?: string;
    header?: {
        [key: string]: any;
    };
  }

  function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions
  ): string;

  function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: {
        complete?: boolean;
        ignoreExpiration?: boolean;
        maxAge?: string | number;
    }
  ): any;

  function decode(
    token: string,
    options?: {
        complete?: boolean;
        json?: boolean;
    }
  ): any;
}

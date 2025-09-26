/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type UserId = string;
type Role = 'MANAGER' | 'OPERATOR';

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
    role: Role;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId;
      role: Role;
    };
  }

  interface User extends User {
    role: Role;
  }
}

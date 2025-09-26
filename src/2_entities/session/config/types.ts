export interface Session {
  telephone: string;
  receivingMethod: ReceivingMethod | null;
  idStore?: number;
}

export enum ReceivingMethod {
  ON_THE_PLATE = "on-the-plate",
  IN_A_BAG = "in-a-bag",
}

export interface SessionStore {
  session: Session | null;
  setSession: (session: Partial<Session>) => void;
  clearSession: () => void;
  clearUserData: () => void;
}

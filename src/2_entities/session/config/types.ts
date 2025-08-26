export interface Session {
  telephone: string;
  receivingMethod: ReceivingMethod | null;
}

export enum ReceivingMethod {
  ON_THE_PLATE = "on-the-plate",
  IN_A_BAG = "in-a-bag",
}

export interface SessionStore {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

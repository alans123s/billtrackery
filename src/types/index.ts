
export interface LoginResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  protocol: {
    protocol: string;
    protocolId: string;
    userBusinessPartner: string;
    type: string;
    document: string;
    email: string;
    phone: string;
    name: string;
    segment: string;
    ficticious: boolean;
    birthDate: string;
    deathDate: string | null;
    pId: string;
  };
  user: {
    document: string;
    name: string;
    email: string;
    phone: string;
    profilePhoto: string | null;
    id: string;
    status: string;
    documentIsValid: boolean;
  };
}

export interface Site {
  id: string;
  clientNumber: string;
  siteNumber: string;
  address: string;
  status: string;
  owner: boolean;
  contract: string;
  contractAccount: string;
}

export interface Bill {
  billIdentifier: string;
  status: string;
  value: number;
  referenceMonth: string;
  site: {
    id: string;
    contract: string;
  };
  dueDate: string;
  consumption: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  protocol: string | null;
  protocolId: string | null;
  pId: string | null;
  userName: string | null;
  userEmail: string | null;
}

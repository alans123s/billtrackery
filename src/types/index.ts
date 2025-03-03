
/**
 * Type Definitions
 * 
 * This file contains TypeScript interfaces for the application's data structures.
 * These interfaces define the shape of data returned from the API and used throughout the app.
 */

/**
 * Response structure from the login API endpoint
 * Contains user authentication tokens, protocol information, and user details
 */
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

/**
 * Site/Installation information
 * Contains details about a physical energy installation location
 */
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

/**
 * Energy bill information
 * Contains details about a specific energy bill including amount, dates, and consumption
 */
export interface Bill {
  billIdentifier: string;
  status: string;
  value: number;
  referenceMonth: string;
  site: {
    id: string;
    contract: string;
    // siteNumber might not be available in all API responses
    siteNumber?: string;
  };
  dueDate: string;
  consumption: number;
}

/**
 * Authentication state stored in context
 * Tracks user login status and authentication details
 */
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

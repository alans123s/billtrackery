
import axios, { AxiosError } from 'axios';
import { LoginResponse, Site, Bill } from '@/types';

const API_URL = "https://www.atendimento.cemig.com.br/graphql";
const API_KEY = "fcad2ef3-49b7-4ac8-bcdb-d78c0fa6e0b6";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'api-key': API_KEY,
    'channel': 'App',
  }
});

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error('API Error:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message
    });
    
    // Improve error messages based on status code
    if (axiosError.response?.status === 401) {
      throw new Error('Credenciais inválidas ou sessão expirada');
    } else if (axiosError.response?.status === 403) {
      throw new Error('Acesso não autorizado');
    } else if (axiosError.response?.status === 429) {
      throw new Error('Muitas requisições. Tente novamente em alguns minutos');
    } else if (axiosError.response?.status >= 500) {
      throw new Error('Erro no servidor. Tente novamente mais tarde');
    }
  }
  
  console.error('Unknown error:', error);
  throw new Error('Ocorreu um erro inesperado. Tente novamente');
};

// Type for authentication headers
interface AuthHeaders {
  headers: {
    'authorization': string;
    'p-id': string;
    'protocol': string;
    'protocol-id': string;
    'protocol-type': string;
    'channel'?: string;
  }
}

// Create authentication headers helper
const createAuthHeaders = (authToken: string, protocol: string, protocolId: string, pId: string): AuthHeaders => {
  return {
    headers: {
      'authorization': `Bearer ${authToken}`,
      'p-id': pId,
      'protocol': protocol,
      'protocol-id': protocolId,
      'protocol-type': 'PF',
      'channel': 'App',
    }
  };
};

// Login function
export const login = async (document: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('', {
      operationName: "Login",
      variables: {
        loginDTO: {
          document,
          password
        }
      },
      query: `mutation Login($loginDTO: LoginInputDTO!) {
        login(input: $loginDTO) {
          token {
            accessToken
            refreshToken
          }
          protocol {
            protocol
            protocolId
            userBusinessPartner
            type
            document
            email
            phone
            name
            segment
            ficticious
            birthDate
            deathDate
            pId
          }
          user {
            document
            name
            email
            phone
            profilePhoto
            id
            status
            documentIsValid
          }
        }
      }`
    });
    
    if (!response.data.data?.login) {
      throw new Error('Resposta da API inválida');
    }
    
    return response.data.data.login;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get sites list
export const getSitesList = async (authToken: string, protocol: string, protocolId: string, pId: string): Promise<Site[]> => {
  try {
    const authHeaders = createAuthHeaders(authToken, protocol, protocolId, pId);
    
    const response = await api.post('', {
      operationName: "SiteListByBusinessPartnerV2",
      variables: {
        input: {}
      },
      query: `query SiteListByBusinessPartnerV2($input: SiteListByBusinessPartnerV2InputDTO!) {
        siteListByBusinessPartnerV2(input: $input) {
          sites {
            id
            clientNumber
            siteNumber
            address
            status
            owner
            contract
            contractAccount
          }
        }
      }`
    }, authHeaders);
    
    if (!response.data.data?.siteListByBusinessPartnerV2?.sites) {
      throw new Error('Resposta da API inválida');
    }
    
    return response.data.data.siteListByBusinessPartnerV2.sites;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get bills history
export const getBillsHistory = async (authToken: string, protocol: string, protocolId: string, pId: string, siteId: string): Promise<Bill[]> => {
  try {
    const authHeaders = createAuthHeaders(authToken, protocol, protocolId, pId);
    
    const response = await api.post('', {
      operationName: "BillsHistory",
      variables: {
        billsHistoryInput: {
          siteId
        }
      },
      query: `query BillsHistory($billsHistoryInput: BillsHistoryInputDTO!) {
        billsHistory(input: $billsHistoryInput) {
          bills {
            billIdentifier
            status
            value
            referenceMonth
            site {
              id
              contract
            }
            dueDate
            consumption
          }
        }
      }`
    }, authHeaders);
    
    if (!response.data.data?.billsHistory?.bills) {
      throw new Error('Resposta da API inválida');
    }
    
    return response.data.data.billsHistory.bills;
  } catch (error) {
    return handleApiError(error);
  }
};

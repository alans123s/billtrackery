
import axios from 'axios';

const API_URL = "https://www.atendimento.cemig.com.br/graphql";
const API_KEY = "fcad2ef3-49b7-4ac8-bcdb-d78c0fa6e0b6";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'api-key': API_KEY,
    'channel': 'App',
  }
});

// Login function
export const login = async (document: string, password: string) => {
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
    
    return response.data.data.login;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get sites list
export const getSitesList = async (authToken: string, protocol: string, protocolId: string, pId: string) => {
  try {
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
    }, {
      headers: {
        'authorization': `Bearer ${authToken}`,
        'p-id': pId,
        'protocol': protocol,
        'protocol-id': protocolId,
        'protocol-type': 'PF',
      }
    });
    
    return response.data.data.siteListByBusinessPartnerV2.sites;
  } catch (error) {
    console.error('Get sites error:', error);
    throw error;
  }
};

// Get bills history
export const getBillsHistory = async (authToken: string, protocol: string, protocolId: string, pId: string, siteId: string) => {
  try {
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
    }, {
      headers: {
        'authorization': `Bearer ${authToken}`,
        'p-id': pId,
        'protocol': protocol,
        'protocol-id': protocolId,
        'protocol-type': 'PF',
        'channel': 'App',
      }
    });
    
    return response.data.data.billsHistory.bills;
  } catch (error) {
    console.error('Get bills history error:', error);
    throw error;
  }
};

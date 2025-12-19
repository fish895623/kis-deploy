import client from "./openapi-client";

export interface KISAccount {
  id: number;
  account_number: string;
  account_id: string;
  app_key: string;
  sec_key: string;
  created_at: string;
  updated_at: string;
}

export interface KISAccountList {
  id: number;
  account_number: string;
  account_id: string;
  created_at: string;
  updated_at: string;
}

export interface KISAccountCreate {
  account_number: string;
  account_id: string;
  app_key: string;
  sec_key: string;
}

export const getKISAccounts = async (): Promise<KISAccountList[]> => {
  const { data, error } = await client.GET("/api/kis/accounts/");

  if (error || !data) {
    throw new Error("Failed to fetch KIS accounts");
  }

  return data as KISAccountList[];
};

export const getKISAccount = async (id: number): Promise<KISAccount> => {
  const { data, error } = await client.GET("/api/kis/accounts/{id}/", {
    params: {
      path: { id: String(id) },
    },
  });

  if (error || !data) {
    throw new Error("Failed to fetch KIS account");
  }

  return data as KISAccount;
};

export const createKISAccount = async (
  accountData: KISAccountCreate
): Promise<KISAccount> => {
  const { data, error } = await client.POST("/api/kis/accounts/", {
    body: accountData,
  });

  if (error || !data) {
    throw new Error("Failed to create KIS account");
  }

  return data as KISAccount;
};

export const updateKISAccount = async (
  id: number,
  accountData: Partial<KISAccountCreate>
): Promise<KISAccount> => {
  const { data, error } = await client.PATCH("/api/kis/accounts/{id}/", {
    params: {
      path: { id: String(id) },
    },
    body: accountData,
  });

  if (error || !data) {
    throw new Error("Failed to update KIS account");
  }

  return data as KISAccount;
};

export const deleteKISAccount = async (id: number): Promise<void> => {
  const { error } = await client.DELETE("/api/kis/accounts/{id}/", {
    params: {
      path: { id: String(id) },
    },
  });

  if (error) {
    throw new Error("Failed to delete KIS account");
  }
};

export const checkKISAccountExists = async (): Promise<{
  exists: boolean;
  count: number;
}> => {
  const { data, error } = await client.GET("/api/kis/accounts/check_exists/");

  if (error || !data) {
    throw new Error("Failed to check KIS account existence");
  }

  return data as { exists: boolean; count: number };
};

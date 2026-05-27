import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "kombinado_access_token";
const REFRESH_TOKEN_KEY = "kombinado_refresh_token";
const USER_DATA_KEY = "kombinado_user_data";

export interface UserData {
  name: string;
  isDriver: boolean;
}

export const tokenStorage = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error("Erro ao salvar tokens no SecureStore:", error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Erro ao recuperar accessToken do SecureStore:", error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Erro ao recuperar refreshToken do SecureStore:", error);
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Erro ao limpar tokens do SecureStore:", error);
    }
  },

  async saveUserData(userData: UserData): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao salvar dados do usuário no SecureStore:", error);
    }
  },

  async getUserData(): Promise<UserData | null> {
    try {
      const data = await SecureStore.getItemAsync(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao recuperar dados do usuário do SecureStore:", error);
      return null;
    }
  },

  async clearUserData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
    } catch (error) {
      console.error("Erro ao limpar dados do usuário do SecureStore:", error);
    }
  },

  async clearAll(): Promise<void> {
    await this.clearTokens();
    await this.clearUserData();
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/auth';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export async function storeAuthData(
    token: string,
    user: User
) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getUser(): Promise<User | null> {
  const userStr = await AsyncStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export async function clearAuthData() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function updateStoredUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}
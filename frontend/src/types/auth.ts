export interface User {
  _id?: string;
  firebaseUid: string;
  name?: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentUser {
  userId: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface AuthLoginResponse {
  user: User;
}

export interface AuthLoginRequest {
  token: string;
}


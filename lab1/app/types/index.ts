export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  category?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags?: string[];
  dateAdded?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegistrationData extends AuthCredentials {
  email: string;
  name: string;
}

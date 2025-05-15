export interface SignupFormValues {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  country: string;
}

export type UserProfile = {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  image?: string;
};

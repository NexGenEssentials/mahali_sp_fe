export interface SignupFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export type UserProfile = {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  image?: string;
};

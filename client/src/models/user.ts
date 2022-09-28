export type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  birthDate: Date | null;
};

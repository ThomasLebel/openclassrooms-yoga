import { User } from '../../src/app/interfaces/user.interface';

export const mockUserInfos: User = {
  id: 1,
  email: 'john@gmail.com',
  lastName: 'Doe',
  firstName: 'John',
  admin: true,
  password: 'password123',
  createdAt: new Date('2025-09-01T10:00:00'),
  updatedAt: new Date('2025-09-10T12:00:00'),
};

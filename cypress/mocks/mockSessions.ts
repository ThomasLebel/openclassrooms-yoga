import { Session } from '../../src/app/features/sessions/interfaces/session.interface';

export const mockSessions: Session[] = [
  {
    id: 1,
    name: 'Hatha Yoga',
    description: 'Séance relaxante de Hatha Yoga pour débutants',
    date: new Date('2025-10-15T09:00:00'),
    teacher_id: 1,
    users: [1, 2, 3, 4],
    createdAt: new Date('2025-09-01T10:00:00'),
    updatedAt: new Date('2025-09-10T12:00:00'),
  },
  {
    id: 2,
    name: 'Vinyasa Flow',
    description: 'Séance dynamique de Vinyasa Flow pour tonifier le corps',
    date: new Date('2025-10-16T18:00:00'),
    teacher_id: 2,
    users: [],
    createdAt: new Date('2025-09-05T09:30:00'),
    updatedAt: new Date('2025-09-12T11:20:00'),
  },
  {
    id: 3,
    name: 'Yin Yoga',
    description:
      'Séance douce de Yin Yoga pour étirer et relâcher les tensions',
    date: new Date('2025-10-17T14:00:00'),
    teacher_id: 3,
    users: [],
    createdAt: new Date('2025-09-08T08:45:00'),
    updatedAt: new Date('2025-09-15T10:15:00'),
  },
  {
    id: 4,
    name: 'Power Yoga',
    description: 'Séance intense de Power Yoga pour brûler des calories',
    date: new Date('2025-10-19T19:00:00'),
    teacher_id: 2,
    users: [],
    createdAt: new Date('2025-09-12T12:30:00'),
    updatedAt: new Date('2025-09-22T14:00:00'),
  },
];

export type UserRole = 'student' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  subtitle: string;
}

export const SEEDED_STUDENT_ACCOUNTS: UserAccount[] = [
  {
    id: '#STU-4819',
    name: 'Alex Doe',
    initials: 'AD',
    role: 'student',
    subtitle: 'CS Undergrad · Enrolled: CS101 Distributed Systems',
  },
  {
    id: '#STU-9921',
    name: 'Liam Chen',
    initials: 'LC',
    role: 'student',
    subtitle: 'CS Undergrad · Enrolled: CS101 Distributed Systems',
  },
  {
    id: '#STU-8153',
    name: 'Maya Patel',
    initials: 'MP',
    role: 'student',
    subtitle: 'CS Undergrad · Honors Track',
  },
  {
    id: '#STU-7862',
    name: 'Lucas Romero',
    initials: 'LR',
    role: 'student',
    subtitle: 'CS Undergrad · Regular Standing',
  },
  {
    id: '#STU-9104',
    name: 'Zoe Washington',
    initials: 'ZW',
    role: 'student',
    subtitle: 'CS Undergrad · Regular Standing',
  },
];

export const SEEDED_ADMIN_ACCOUNTS: UserAccount[] = [
  {
    id: '#FAC-08821',
    name: 'Prof. Sarah Jenkins',
    initials: 'SJ',
    role: 'admin',
    subtitle: 'Lead Instructor · CS101 Distributed Systems',
  },
  {
    id: '#FAC-04192',
    name: 'Prof. Marcus Vance',
    initials: 'MV',
    role: 'admin',
    subtitle: 'Associate Professor · CS101 Distributed Systems',
  },
];


import type { UserProfile } from '@/lib/types';

export const MOCK_STUDENTS: UserProfile[] = [
  {
    id: 'abc123xyz456',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    photoURL: 'https://picsum.photos/seed/person-1/100/100',
    username: 'jane.doe@123',
    onboardingStatus: 'active',
    mobileNumber: '9876543210',
    alternateMobileNumber: '9876543211',
    motherName: 'JANE DOE SR',
    fatherName: 'JOHN DOE',
    alternateEmail: 'jane.doe.alt@gmail.com'
  },
  {
    id: 'def456uvw789',
    email: 'john.smith@example.com',
    name: 'John Smith',
    photoURL: 'https://picsum.photos/seed/person-2/100/100',
    username: 'john.smith@456',
    onboardingStatus: 'active',
    mobileNumber: '8765432109',
    alternateMobileNumber: '',
    motherName: 'MARY SMITH',
    fatherName: 'ROBERT SMITH',
    alternateEmail: 'john.smith.alt@gmail.com'
  },
  {
    id: 'ghi789rst123',
    email: 'susan.b@example.com',
    name: 'Susan B',
    photoURL: 'https://picsum.photos/seed/person-3/100/100',
    username: 'susan.b@789',
    onboardingStatus: 'username_complete',
    mobileNumber: '',
    alternateMobileNumber: '',
    motherName: '',
    fatherName: '',
    alternateEmail: ''
  }
];

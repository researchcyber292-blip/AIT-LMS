
export type UserProfile = {
  id: string; // Firebase UID
  email: string;
  name: string;
  photoURL?: string;
  username?: string;
  onboardingStatus: 'new' | 'profile_complete' | 'username_complete' | 'active';
  mobileNumber?: string;
  alternateMobileNumber?: string;
  motherName?: string;
  fatherName?: string;
  alternateEmail?: string;
  enrolledCourseIds?: string[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  imageHint: string;
  instructor: Instructor;
  learningObjectives: string[];
  curriculum: { title: string; content: string }[];
  category: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type Instructor = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  imageHint: string;
};

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  image: string;
  imageHint: string;
};

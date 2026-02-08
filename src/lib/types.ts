
export type InstructorStub = {
  name: string;
  avatar?: string;
};

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
  instructorId: string;
  learningObjectives: string[];
  curriculum: { title: string; content: string }[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Highly Advanced';
  category: string;
  priceType: 'paid' | 'free';
  paymentMethod?: 'direct' | 'templates';
  subscriptionTiers?: {
    gold: { price: string, description: string, features: string[], videos: string[] },
    platinum: { price: string, description: string, features: string[], videos: string[] },
    silver: { price: string, description: string, features: string[], videos: string[] },
  } | null,
  videos?: string[];
  duration: string;
  liveSessionsEnabled: boolean;
  resourcesEnabled: boolean;
  createdAt: any; // serverTimestamp

  // For card display
  rating?: number;
  reviews?: number;
  lessons?: number;
  students?: number;
  instructor?: InstructorStub;
};

export type Instructor = {
  id: string; // Firebase UID
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  accountStatus: 'pending' | 'active' | 'rejected' | 'banned';
  photoURL?: string;

  // Optional details
  motherName?: string;
  fatherName?: string;
  age?: number;
  alternateEmail?: string;
  mobileNumber?: string;
  alternateMobileNumber?: string;
  
  // Public profile details
  title?: string;
  bio?: string;
  qualifications?: string;
  image?: string;
  imageHint?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  image: string;
  imageHint: string;
};

export type Enrollment = {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string; // ISO string
  purchaseDate: string; // ISO string
  price: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
};

export type Wallet = {
  id: string; // Corresponds to instructor UID
  currentBalance: number;
  totalEarned: number;
  pendingWithdrawal: number;
}

export type PayoutRequest = {
  id: string;
  instructorId: string;
  amount: number;
  requestDate: string; // ISO string
  status: 'pending' | 'paid' | 'rejected';
  paidDate?: string; // ISO string
  rejectionReason?: string;
}

export type ContactSubmission = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  companySize?: string;
  message: string;
  scheduleDemo: boolean;
  submittedAt: { seconds: number; nanoseconds: number; } | null;
};

export type ChatMessage = {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  timestamp: any; // Firestore Server Timestamp
  isInstructor?: boolean;
  isRead?: boolean;
};

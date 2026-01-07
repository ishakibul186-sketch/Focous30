
export interface UserProfile {
  name: string;
  age?: number;
  goal: string;
  startDate: string;
}

export interface DailyLog {
  // Morning
  brush: boolean;
  personalHygiene: boolean;
  exercise: boolean;
  breakfast: boolean;
  // Daytime
  lunch: boolean;
  studyWorkHours: number;
  energySave: boolean;
  // Evening
  eveningSnacks: boolean;
  socialMediaTime: number; // in minutes
  negativeSiteVisit: boolean;
  // Night
  nightStudy: boolean;
  phoneUseAfter11: boolean;
  sleepTime: number; // in hours

  // Calculated
  dailyScore: number;
  habitCompletion: number; // percentage
  date: string;
}

export interface InstructorRecentActivityDto {
  activityType: string;
  description: string;
  timestamp: string;
}

export interface InstructorDashboardDto {
  myCourses: number;
  totalStudents: number;
  pendingSubmissions: number;
  totalAssignments: number;
  averageCourseGrade: number;
  lateSubmissions: number;
  recentActivity: InstructorRecentActivityDto[];
  submissionAssignments: InstructorAssignmentSubmissionsDto[];
}

export interface InstructorAssignmentSubmissionsDto {
  assignmentId: number;
  title: string;
  courseId: number;
  courseName: string;
  pendingSubmissions: number;
}

export interface UpcomingAssignmentDto {
  assignmentId: number;
  title: string;
  courseId: number;
  courseName: string;
  deadline: string;
  remainingTime: string;
  status: string;
}

export interface RecentGradeDto {
  assignmentId: number;
  assignmentTitle: string;
  courseId: number;
  courseName: string;
  grade: number;
  gradedAt: string | null;
}

export interface StudentDashboardDto {
  myCourses: number;
  pendingAssignments: number;
  dueTomorrow: number;
  averageGrade: number;
  upcomingDeadlines: UpcomingAssignmentDto[];
  recentGrades: RecentGradeDto[];
}

export interface CourseAnnouncement {
  id: number;
  courseId: number;
  message: string;
  createdAt: string;
}

export interface CreateCourseAnnouncement {
  message: string;
}

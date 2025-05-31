export interface Course {
  id: string;
  name: string;
  description: string;
  department: string;
  faculty_id: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
}

export interface Material {
  id: string;
  course_id: string;
  title: string;
  file_path: string;
  uploaded_by: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  course_id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  course_id: string;
  title: string;
  content: string;
  posted_by: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  course_id: string;
  student_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Users, FileText, Calendar, Bell, Settings, Upload, BarChart3 } from 'lucide-react';
import CreateCourseDialog from '@/components/faculty/CreateCourseDialog';
import CreateAssignmentDialog from '@/components/faculty/CreateAssignmentDialog';
import CreateAnnouncementDialog from '@/components/faculty/CreateAnnouncementDialog';

interface Course {
  id: string;
  name: string;
  department: string;
  description: string;
  created_at: string;
}

interface Student {
  id: string;
  full_name: string;
  student_id: string;
  department: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  course_id: string;
  course: {
    name: string;
  };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  course: {
    name: string;
  };
}

interface AttendanceData {
  course_name: string;
  present: number;
  absent: number;
  total: number;
}

const FacultyDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Department theme colors
  const departmentThemes = {
    'Computer Engineering': {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    'AI & Machine Learning': {
      primary: 'bg-purple-600',
      secondary: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    'Data Science': {
      primary: 'bg-orange-600',
      secondary: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200'
    }
  };

  const currentTheme = profile?.department ? departmentThemes[profile.department as keyof typeof departmentThemes] : departmentThemes['Computer Engineering'];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchFacultyData = async () => {
      try {
        // Fetch faculty profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .eq('faculty_id', user.id)
          .order('created_at', { ascending: false });

        if (coursesError) throw coursesError;
        setCourses(coursesData || []);

        // Fetch assignments with course info
        if (coursesData?.length) {
          const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('assignments')
            .select(`
              *,
              course:courses(name)
            `)
            .in('course_id', coursesData.map(c => c.id))
            .order('due_date', { ascending: true });

          if (assignmentsError) throw assignmentsError;
          setAssignments(assignmentsData || []);

          // Fetch announcements with course info
          const { data: announcementsData, error: announcementsError } = await supabase
            .from('announcements')
            .select(`
              *,
              course:courses(name)
            `)
            .in('course_id', coursesData.map(c => c.id))
            .order('created_at', { ascending: false })
            .limit(10);

          if (announcementsError) throw announcementsError;
          setAnnouncements(announcementsData || []);

          // Fetch enrolled students
          const { data: enrollmentsData, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select(`
              student:profiles(*)
            `)
            .in('course_id', coursesData.map(c => c.id));

          if (enrollmentsError) throw enrollmentsError;
          const studentsData = enrollmentsData?.map(e => e.student).filter(Boolean) || [];
          setStudents(studentsData);

          // Generate sample attendance data for analytics
          const sampleAttendance = coursesData.map(course => ({
            course_name: course.name,
            present: Math.floor(Math.random() * 30) + 20,
            absent: Math.floor(Math.random() * 10) + 2,
            total: 50
          }));
          setAttendanceData(sampleAttendance);
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching faculty data:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleFileUpload = async (courseId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${courseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: materialError } = await supabase
        .from('materials')
        .insert([{
          course_id: courseId,
          title: file.name,
          file_path: filePath,
          uploaded_by: user?.id
        }]);

      if (materialError) throw materialError;

      toast({
        title: "Success",
        description: "Material uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-background">
      <header className={`${currentTheme.primary} text-white shadow-lg`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback>{profile?.full_name?.charAt(0) || 'F'}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
                <p className="text-sm opacity-90">{profile?.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{profile?.full_name}</span>
              <Button variant="outline" onClick={handleSignOut} className="text-white border-white">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <CreateCourseDialog onCourseCreated={refreshData} />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className={`hover:shadow-lg transition-shadow ${currentTheme.border}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {course.name}
                      <Badge variant="secondary" className={currentTheme.text}>
                        {course.department}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CreateAssignmentDialog 
                      courseId={course.id} 
                      onAssignmentCreated={refreshData} 
                    />
                    <CreateAnnouncementDialog 
                      courseId={course.id} 
                      onAnnouncementCreated={refreshData} 
                    />
                    <div className="pt-2">
                      <Label htmlFor={`file-${course.id}`} className="cursor-pointer">
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Material
                        </Button>
                      </Label>
                      <Input
                        id={`file-${course.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(course.id, file);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">All Assignments</h2>
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {assignment.title}
                        <Badge variant="outline">
                          {assignment.course.name}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{assignment.description}</p>
                      <Button size="sm">View Submissions</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Enrolled Students</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <Card key={student.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{student.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.full_name}</p>
                          <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Department: {student.department}</p>
                      <div className="mt-2 space-x-2">
                        <Button size="sm" variant="outline">View Profile</Button>
                        <Button size="sm" variant="outline">Mark Attendance</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Course Materials</h2>
              <p className="text-muted-foreground">Materials management interface will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Recent Announcements</h2>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {announcement.title}
                        <Badge variant="secondary">
                          {announcement.course.name}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Posted on {new Date(announcement.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Student Analytics</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="course_name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="present" fill="#4ade80" />
                        <Bar dataKey="absent" fill="#f87171" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={courses.map((course, index) => ({
                            name: course.name,
                            value: Math.floor(Math.random() * 50) + 10
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {courses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FacultyDashboard;

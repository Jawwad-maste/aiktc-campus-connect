
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { BookOpen, FileText, Calendar, Bell, User } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  faculty: {
    full_name: string;
  };
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
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

interface Material {
  id: string;
  title: string;
  file_path: string;
  course: {
    name: string;
  };
}

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchStudentData = async () => {
      try {
        // Fetch student profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch enrolled courses
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            course:courses(
              id,
              name,
              description,
              faculty:profiles(full_name)
            )
          `)
          .eq('student_id', user.id);

        if (enrollmentsError) throw enrollmentsError;
        const coursesData = enrollmentsData?.map(d => d.course).filter(Boolean) || [];
        setCourses(coursesData);

        if (coursesData.length > 0) {
          const courseIds = coursesData.map(c => c.id);

          // Fetch assignments
          const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('assignments')
            .select(`
              *,
              course:courses(name)
            `)
            .in('course_id', courseIds)
            .order('due_date', { ascending: true });

          if (assignmentsError) throw assignmentsError;
          setAssignments(assignmentsData || []);

          // Fetch announcements
          const { data: announcementsData, error: announcementsError } = await supabase
            .from('announcements')
            .select(`
              *,
              course:courses(name)
            `)
            .in('course_id', courseIds)
            .order('created_at', { ascending: false })
            .limit(10);

          if (announcementsError) throw announcementsError;
          setAnnouncements(announcementsData || []);

          // Fetch materials
          const { data: materialsData, error: materialsError } = await supabase
            .from('materials')
            .select(`
              *,
              course:courses(name)
            `)
            .in('course_id', courseIds)
            .order('created_at', { ascending: false });

          if (materialsError) throw materialsError;
          setMaterials(materialsData || []);
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching student data:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-aiktc-black text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback>{profile?.full_name?.charAt(0) || 'S'}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
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
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignments.filter(a => new Date(a.due_date) > new Date()).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Materials</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materials.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Faculty: {course.faculty.full_name}
                    </p>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full" variant="outline">
                        View Course Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Assignments</h2>
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {assignment.title}
                        <div className="flex items-center gap-2">
                          <Badge variant={new Date(assignment.due_date) > new Date() ? 'default' : 'destructive'}>
                            {new Date(assignment.due_date) > new Date() ? 'Active' : 'Overdue'}
                          </Badge>
                          <Badge variant="outline">
                            {assignment.course.name}
                          </Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{assignment.description}</p>
                      <Button size="sm">Submit Assignment</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Course Materials</h2>
              <div className="grid gap-4">
                {materials.map((material) => (
                  <Card key={material.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {material.title}
                        <Badge variant="outline">
                          {material.course.name}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

          <TabsContent value="profile">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">My Profile</h2>
              <Card className="max-w-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">
                        {profile?.full_name?.charAt(0) || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl">{profile?.full_name}</h3>
                      <p className="text-muted-foreground">{profile?.role}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Department</h4>
                    <p className="text-muted-foreground">{profile?.department}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Student ID</h4>
                    <p className="text-muted-foreground">{profile?.student_id || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button className="mt-4">Edit Profile</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;

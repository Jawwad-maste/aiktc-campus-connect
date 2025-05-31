import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface Course {
  id: string;
  name: string;
  department: string;
  description: string;
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
}

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Theme colors based on department
  const themeColors = {
    'Computer Engineering': 'bg-department-ce',
    'AI & Machine Learning': 'bg-department-aiml',
    'Data Science': 'bg-department-ds'
  };

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
          .eq('faculty_id', user.id);

        if (coursesError) throw coursesError;
        setCourses(coursesData || []);

        // Fetch students for all courses
        if (coursesData?.length) {
          const { data: studentsData, error: studentsError } = await supabase
            .from('enrollments')
            .select(`
              students:profiles(*)
            `)
            .in('course_id', coursesData.map(c => c.id));

          if (studentsError) throw studentsError;
          setStudents(studentsData?.map(d => d.students) || []);
        }

        setLoading(false);
      } catch (error: any) {
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

  const handleCreateAssignment = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([
          {
            course_id: courseId,
            title: 'New Assignment',
            description: 'Assignment description',
            due_date: new Date().toISOString(),
          }
        ])
        .select();

      if (error) throw error;

      setAssignments([...assignments, data[0]]);
      toast({
        title: "Success",
        description: "Assignment created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUploadMaterial = async (courseId: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from('course-materials')
        .upload(`${courseId}/${file.name}`, file);

      if (error) throw error;

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className={`${themeColors[profile?.department]} text-white shadow-lg`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
              <p className="text-sm opacity-90">{profile?.department}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span>{profile?.full_name}</span>
              <Button variant="outline" onClick={() => navigate('/')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="courses">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleCreateAssignment(course.id)}
                        className="w-full"
                      >
                        Create Assignment
                      </Button>
                      <label className="block">
                        <span className="sr-only">Upload Course Material</span>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadMaterial(course.id, file);
                          }}
                          className="w-full"
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-4">
              {students.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <CardTitle>{student.full_name}</CardTitle>
                    <CardDescription>Student ID: {student.student_id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Department: {student.department}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>Due: {new Date(assignment.due_date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea defaultValue={assignment.description} />
                    <Button className="mt-4">Update Assignment</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials">
            {/* Materials management UI */}
          </TabsContent>

          <TabsContent value="analytics">
            {/* Analytics dashboard */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FacultyDashboard;
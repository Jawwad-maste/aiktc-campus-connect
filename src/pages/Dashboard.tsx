
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  full_name: string;
  department: string;
  role: string;
  student_id: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-aiktc-ivory flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-aiktc-black mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aiktc-ivory">
      <header className="bg-aiktc-black text-aiktc-ivory shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold">AIKTC Dashboard</h1>
              <span className="text-aiktc-yellow text-lg">Welcome, {profile.full_name}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-aiktc-yellow text-aiktc-yellow hover:bg-aiktc-yellow hover:text-aiktc-black"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-aiktc-black mb-2">
            {profile.role === 'student' ? 'Student' : 'Faculty'} Dashboard
          </h2>
          <p className="text-gray-600">Department: {profile.department}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.role === 'student' ? (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">My Courses</CardTitle>
                  <CardDescription>View enrolled courses and materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    View Courses
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">Assignments</CardTitle>
                  <CardDescription>Check and submit assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    View Assignments
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">Attendance</CardTitle>
                  <CardDescription>Track your attendance record</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    View Attendance
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">Feedback</CardTitle>
                  <CardDescription>Provide course and faculty feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    Give Feedback
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">Profile</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">My Courses</CardTitle>
                  <CardDescription>Manage your teaching courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    Manage Courses
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">Upload Materials</CardTitle>
                  <CardDescription>Share course materials with students</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    Upload Materials
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">Assignments</CardTitle>
                  <CardDescription>Create and grade assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    Manage Assignments
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">Attendance</CardTitle>
                  <CardDescription>Mark and track student attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    Mark Attendance
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl text-aiktc-black">View Feedback</CardTitle>
                  <CardDescription>Review student feedback and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-aiktc-coral hover:bg-red-600 text-white">
                    View Feedback
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

const DepartmentInfo = () => {
  const { department } = useParams();

  const departmentData = {
    'computer-engineering': {
      name: 'Computer Engineering',
      description: 'Building the digital future with cutting-edge software and hardware solutions',
      color: 'from-blue-500 to-blue-700',
      features: ['Software Development', 'System Architecture', 'Network Security', 'Database Management'],
      announcements: [
        'New AI Lab inaugurated with state-of-the-art equipment',
        'Industry partnership announced with leading tech companies',
        'Student hackathon scheduled for next month'
      ]
    },
    'ai-ml': {
      name: 'AI & Machine Learning',
      description: 'Pioneering intelligent systems and revolutionary machine learning applications',
      color: 'from-purple-500 to-purple-700',
      features: ['Deep Learning', 'Neural Networks', 'Computer Vision', 'Natural Language Processing'],
      announcements: [
        'Research collaboration with leading AI institutes',
        'New GPU cluster installed for deep learning projects',
        'Guest lecture series on emerging AI technologies'
      ]
    },
    'data-science': {
      name: 'Data Science',
      description: 'Transforming raw data into actionable insights and strategic decisions',
      color: 'from-orange-500 to-orange-700',
      features: ['Big Data Analytics', 'Statistical Modeling', 'Data Visualization', 'Predictive Analytics'],
      announcements: [
        'New data visualization lab equipped with latest tools',
        'Industry internship opportunities with data companies',
        'Annual data science symposium announced'
      ]
    }
  };

  const dept = departmentData[department as keyof typeof departmentData];

  if (!dept) {
    return (
      <div className="min-h-screen bg-aiktc-ivory flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-aiktc-black mb-4">Department not found</h2>
          <Link to="/">
            <Button className="bg-aiktc-coral hover:bg-red-600 text-white">
              Go Home
            </Button>
          </Link>
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
              <Link to="/">
                <Button variant="ghost" className="text-aiktc-ivory hover:text-aiktc-yellow">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">AIKTC</h1>
              <span className="text-aiktc-yellow text-lg">{dept.name}</span>
            </div>
            <div className="flex space-x-3">
              <Link to="/auth">
                <Button variant="outline" className="border-aiktc-yellow text-aiktc-yellow hover:bg-aiktc-yellow hover:text-aiktc-black">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-aiktc-coral hover:bg-red-600 text-white">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className={`w-full h-32 bg-gradient-to-r ${dept.color} rounded-lg mb-6 flex items-center justify-center`}>
            <h2 className="text-4xl font-bold text-white">{dept.name}</h2>
          </div>
          <p className="text-xl text-gray-700 mb-8">{dept.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-aiktc-black">Core Subjects</CardTitle>
              <CardDescription>Key areas of study in this department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {dept.features.map((feature, index) => (
                  <div key={index} className="bg-aiktc-gold/20 text-aiktc-black px-3 py-2 rounded-md text-sm">
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-aiktc-black">Recent Announcements</CardTitle>
              <CardDescription>Latest updates from the department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dept.announcements.map((announcement, index) => (
                  <div key={index} className="p-3 bg-aiktc-yellow/10 rounded-md border border-aiktc-gold/30">
                    <p className="text-sm text-gray-700">{announcement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/auth">
            <Button className="bg-aiktc-coral hover:bg-red-600 text-white text-lg px-8 py-3">
              Join {dept.name} Department
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DepartmentInfo;

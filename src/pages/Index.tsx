import InteractiveHero from "@/components/ui/hero-section-nexus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  const departments = [
    {
      name: "Computer Engineering",
      description: "Building the digital future with cutting-edge software and hardware solutions",
      color: "department-ce",
      features: ["Software Development", "System Architecture", "Network Security", "Database Management"],
      gradient: "from-blue-500 to-blue-700",
      slug: "computer-engineering"
    },
    {
      name: "AI & Machine Learning",
      description: "Pioneering intelligent systems and revolutionary machine learning applications",
      color: "department-aiml", 
      features: ["Deep Learning", "Neural Networks", "Computer Vision", "Natural Language Processing"],
      gradient: "from-purple-500 to-purple-700",
      slug: "ai-ml"
    },
    {
      name: "Data Science",
      description: "Transforming raw data into actionable insights and strategic decisions",
      color: "department-ds",
      features: ["Big Data Analytics", "Statistical Modeling", "Data Visualization", "Predictive Analytics"],
      gradient: "from-orange-500 to-orange-700",
      slug: "data-science"
    }
  ];

  return (
    <div className="min-h-screen bg-aiktc-ivory">
      {/* Interactive Hero Section */}
      <InteractiveHero />

      {/* Departments Section */}
      <section id="departments" className="py-16 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-aiktc-black mb-4">Our Departments</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our specialized programs designed to shape the future of technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <Card 
                key={index}
                className="department-card group cursor-pointer border-2 border-aiktc-gold/30 hover:border-aiktc-coral/50 bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${dept.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <CardTitle className="text-2xl font-bold text-aiktc-black relative z-10">
                    {dept.name}
                  </CardTitle>
                  <CardDescription className="text-gray-700 relative z-10 text-base">
                    {dept.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {dept.features.map((feature, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary"
                        className="bg-aiktc-gold/20 text-aiktc-black hover:bg-aiktc-gold/30 text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Link to={`/department/${dept.slug}`}>
                    <Button 
                      className="w-full bg-aiktc-coral hover:bg-red-600 text-white font-semibold py-2 mt-4 transition-all duration-300 group-hover:shadow-lg"
                    >
                      Explore Department →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-aiktc-yellow/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-aiktc-black">500+</h4>
              <p className="text-gray-700 font-medium">Students Enrolled</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-aiktc-black">50+</h4>
              <p className="text-gray-700 font-medium">Expert Faculty</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-aiktc-black">95%</h4>
              <p className="text-gray-700 font-medium">Placement Rate</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-aiktc-black">20+</h4>
              <p className="text-gray-700 font-medium">Industry Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-aiktc-black mb-12">Quick Access</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Student Portal", description: "Access courses and assignments", icon: "📚", link: user ? "/dashboard" : "/auth" },
              { title: "Faculty Dashboard", description: "Manage classes and materials", icon: "👨‍🏫", link: user ? "/dashboard" : "/auth" },
              { title: "Admissions", description: "Apply for our programs", icon: "📝", link: "/auth" },
              { title: "Library", description: "Digital resources and books", icon: "📖", link: "#" }
            ].map((item, index) => (
              <Link key={index} to={item.link}>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer border border-aiktc-gold/30 bg-white/80 h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h4 className="text-xl font-semibold text-aiktc-black mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-aiktc-black text-aiktc-ivory py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-2xl font-bold mb-4 text-aiktc-yellow">AIKTC</h5>
              <p className="text-gray-300 leading-relaxed">
                Advancing Innovation in Knowledge, Technology & Computing through 
                excellence in education and research.
              </p>
            </div>
            <div>
              <h6 className="text-lg font-semibold mb-4 text-aiktc-yellow">Quick Links</h6>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-aiktc-yellow transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-aiktc-yellow transition-colors">Admissions</a></li>
                <li><a href="#" className="hover:text-aiktc-yellow transition-colors">Academic Calendar</a></li>
                <li><a href="#" className="hover:text-aiktc-yellow transition-colors">Career Services</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-lg font-semibold mb-4 text-aiktc-yellow">Contact Info</h6>
              <div className="space-y-2 text-gray-300">
                <p>📍 Panvel, Navi Mumbai</p>
                <p>📞 +91 22 2745 0000</p>
                <p>✉️ info@aiktc.ac.in</p>
              </div>
            </div>
          </div>
          <div className="border-t border-aiktc-gold/30 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AIKTC Engineering College. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

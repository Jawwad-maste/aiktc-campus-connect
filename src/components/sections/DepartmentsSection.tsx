
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DepartmentsSection = () => {
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
  );
};

export default DepartmentsSection;

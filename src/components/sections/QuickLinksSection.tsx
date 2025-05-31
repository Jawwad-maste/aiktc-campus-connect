
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const QuickLinksSection = () => {
  const { user } = useAuth();

  return (
    <section className="py-16 px-6 bg-white">
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
  );
};

export default QuickLinksSection;


import { useAuth } from "@/hooks/useAuth";
import FacultyDashboard from "./FacultyDashboard";
import StudentDashboard from "./StudentDashboard";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-aiktc-ivory flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-aiktc-coral border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-aiktc-ivory flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-aiktc-black mb-4">Setting up your profile...</h2>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-aiktc-coral border-t-transparent rounded-full mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  return profile.role === 'faculty' ? <FacultyDashboard /> : <StudentDashboard />;
};

export default Dashboard;

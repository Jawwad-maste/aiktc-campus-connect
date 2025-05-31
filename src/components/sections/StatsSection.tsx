
const StatsSection = () => {
  return (
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
  );
};

export default StatsSection;

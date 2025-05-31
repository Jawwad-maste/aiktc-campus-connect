
const FooterSection = () => {
  return (
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
  );
};

export default FooterSection;

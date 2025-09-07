import { Link } from "wouter";
import { Building, Factory, Phone, Mail, MapPin, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Industries", href: "/industries" },
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = "918329925318";
    const message = "Hi Vinay, I'm interested in your web development services!";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-cinzel text-xl font-bold text-white mb-4">RECKONIX</h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              We "Reckonix" are Manufacturer of Calibration System, Testing System, Measuring System and many more. 
              Serving customers across India with precision equipment and reliable support.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-all"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Office */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Corporate Office
            </h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>
                Gera's Imperium Gateway, office A-205, opp. Bhosari Metro Station, Nashik Phata,<br />
                Pune, Maharashtra 411034
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                9175240313, 8767431725
              </p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                sales@reckonix.co.in, sales@reckonix.in
              </p>
              <p className="text-xs">
                GST No.: 27ABGFR0875B1ZA
              </p>
              <button
                className="text-maroon-400 hover:text-maroon-300 text-sm mt-2 flex items-center"
                onClick={() => window.open('https://maps.app.goo.gl/3Qw2Qw2Qw2Qw2Qw2A', '_blank')}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Get Directions
              </button>
            </div>
          </div>
          {/* Manufacturing Facility */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <Factory className="h-5 w-5 mr-2" />
              Manufacturing Unit
            </h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>
                PLOT NO, BG/PAP3, MIDC, MIDC Rd, Bhosari,<br />
                Pune, Maharashtra 411026
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                9175240313, 8767431725
              </p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                sales@reckonix.co.in, sales@reckonix.in
              </p>
              <p className="text-xs">
              </p>
              <button
                className="text-maroon-400 hover:text-maroon-300 text-sm mt-2 flex items-center"
                onClick={() => window.open('https://maps.app.goo.gl/g7b7fjFM8Wb4Ynrc8', '_blank')}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Maps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-800">
          <div>
            <h5 className="font-semibold text-white mb-3">Corporate Office Location</h5>
            <div className="bg-gray-800 h-48 rounded-lg flex items-center justify-center mt-4">
              <iframe
                title="Corporate Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.176837774971!2d73.8149058710421!3d18.611114227750015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9dfa87ebe4d%3A0xe95a3ca7b090d08a!2sReckonix%20(%20Corporate%20office%20)!5e0!3m2!1sen!2sin!4v1752172357866!5m2!1sen!2sin"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-3">Manufacturing Facility Location</h5>
            <div className="bg-gray-800 h-48 rounded-lg flex items-center justify-center mt-4">
              <iframe
                title="Manufacturing Facility Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.9394956883684!2d73.82740987417216!3d18.62179096607656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e5c1527d61%3A0x22027655dc385965!2sReckonix%20(%20Manufacturing%20)!5e0!3m2!1sen!2sin!4v1752174210521!5m2!1sen!2sin"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Reckonix. All rights reserved. | Privacy Policy | Terms of Service
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Designed and Developed by{" "}
            <button
              onClick={handleWhatsAppClick}
              className="text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer transition-colors"
              title="Click to chat on WhatsApp"
            >
              Vinay Sawarkar
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}

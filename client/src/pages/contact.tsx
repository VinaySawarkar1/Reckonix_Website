import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Factory, Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SEO from "../components/seo";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const { toast } = useToast();

  const submitMessage = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/messages", data),
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: (error: any) => {
      let description = "Failed to send message. Please try again.";
      if (error instanceof Error) {
        try {
          // Try to parse the error message for backend details
          const errObj = JSON.parse(error.message.split(": ").slice(1).join(": "));
          if (errObj.details) {
            description = errObj.details;
          } else if (errObj.message) {
            description = errObj.message;
          }
        } catch {
          // fallback to default
        }
      }
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  });

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (formData.name.trim().length < 2) {
      toast({
        title: "Invalid Name",
        description: "Name must be at least 2 characters.",
        variant: "destructive",
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (formData.subject.trim().length < 2) {
      toast({
        title: "Invalid Subject",
        description: "Subject must be at least 2 characters.",
        variant: "destructive",
      });
      return;
    }
    if (formData.message.trim().length < 10) {
      toast({
        title: "Message Too Short",
        description: "Message must be at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    submitMessage.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SEO 
        title="Contact Reckonix - Get in Touch"
        description="Contact Reckonix for precision calibration, testing, and measuring systems. Get expert support, quotes, and technical assistance for your industrial metrology needs."
        keywords="contact reckonix, calibration support, technical assistance, quote request, customer service, industrial metrology support"
        url="/contact"
      />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[#800000] text-white py-6 overflow-hidden">
        {/* Geometric Line Pattern Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" width="100%" height="100%" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="white" stroke-width="2" opacity="0.5">
            <polyline points="0,100 300,100 400,200 700,200" />
            <polyline points="200,0 500,0 600,100 900,100" />
            <polyline points="400,200 700,200 800,300 1100,300" />
            <polyline points="600,100 900,100 1000,200 1300,200" />
            <polyline points="800,300 1100,300 1200,400 1440,400" />
            <polyline points="1000,200 1300,200 1400,300 1440,300" />
            <polyline points="100,50 400,50 500,150 800,150" />
            <polyline points="300,150 600,150 700,250 1000,250" />
            <polyline points="500,250 800,250 900,350 1200,350" />
            <polyline points="700,50 1000,50 1100,150 1400,150" />
            <polyline points="900,150 1200,150 1300,250 1440,250" />
            <polyline points="1100,250 1400,250 1440,350 1440,350" />
            <polyline points="0,200 200,200 300,300 500,300" />
            <polyline points="200,300 400,300 500,400 700,400" />
            <polyline points="600,350 900,350 1000,400 1200,400" />
          </g>
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold mb-6 heading-white">Get In Touch</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Ready to discuss your calibration and testing needs? We're here to help you find the perfect solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                {/* Corporate Office */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-maroon-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Corporate Office</h3>
                    <p className="text-gray-600 mb-2">
                      Gera's Imperium Gateway, office A-205, opp. Bhosari Metro Station, Nashik Phata,<br />
                      Pune, Maharashtra 411034
                    </p>
                    <p className="text-gray-600"><Phone className="inline h-4 w-4 mr-1" /> 9175240313, 8767431725</p>
                    <p className="text-gray-600"><Mail className="inline h-4 w-4 mr-1" /> sales@reckonix.co.in, sales@reckonix.in</p>
                    <p className="text-gray-600 mb-2"><strong>GST No.:</strong> 27ABGFR0875B1ZA</p>
                    <a
                      href="https://maps.app.goo.gl/3Qw2Qw2Qw2Qw2Qw2A" // Update with correct Google Maps link if available
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-500 hover:underline text-sm flex items-center mt-2"
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Get Directions
                    </a>
                  </div>
                </div>
                {/* Manufacturing Facility */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <Factory className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Manufacturing Unit</h3>
                    <p className="text-gray-600 mb-2">
                      PLOT NO, BG/PAP3, MIDC, MIDC Chowk, Bhosari,<br />
                      Pune, Maharashtra 411026
                    </p>
                    <p className="text-gray-600"><Phone className="inline h-4 w-4 mr-1" /> 9175240313, 8767431725</p>
                    <p className="text-gray-600"><Mail className="inline h-4 w-4 mr-1" /> sales@reckonix.co.in, sales@reckonix.in</p>
                    <a
                      href="https://maps.app.goo.gl/g7b7fjFM8Wb4Ynrc8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-500 hover:underline text-sm flex items-center mt-2"
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Get Directions
                    </a>
                  </div>
                </div>
                {/* General Contact Info */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Contact Information</h3>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> 9175240313, 8767431725<br />
                      <strong>Email:</strong> marketing@reckonix.co.in<br />
                      <strong>Sales:</strong> sales@reckonix.co.in<br />
                      <strong>Support:</strong> support@reckonix.co.in<br />
                      <strong>General:</strong> info@reckonix.co.in<br />
                      
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Our Locations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Corporate Office Map */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Corporate Office</h4>
                    <iframe
                      title="Corporate Office Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.176837774971!2d73.8149058710421!3d18.611114227750015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9dfa87ebe4d%3A0xe95a3ca7b090d08a!2sReckonix%20(%20Corporate%20office%20)!5e0!3m2!1sen!2sin!4v1752172357866!5m2!1sen!2sin"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                    ></iframe>
                    <a
                      href="https://maps.app.goo.gl/3Qw2Qw2Qw2Qw2Qw2A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-500 hover:underline text-sm flex items-center mt-2"
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Get Directions
                    </a>
                  </div>
                  {/* Workshop Map */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Manufacturing Unit</h4>
                    <iframe
                      title="Manufacturing Facility Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.9394956883684!2d73.82740987417216!3d18.62179096607656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e5c1527d61%3A0x22027655dc385965!2sReckonix%20(%20Manufacturing%20)!5e0!3m2!1sen!2sin!4v1752174210521!5m2!1sen!2sin"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <a
                      href="https://maps.app.goo.gl/g7b7fjFM8Wb4Ynrc8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-500 hover:underline text-sm flex items-center mt-2"
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                          Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="h-12 focus:ring-maroon-500 focus:border-maroon-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@company.com"
                          className="h-12 focus:ring-maroon-500 focus:border-maroon-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Subject"
                        minLength={2}
                        maxLength={200}
                        className="h-12 focus:ring-maroon-500 focus:border-maroon-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="h-12 focus:ring-maroon-500 focus:border-maroon-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your requirements..."
                        className="focus:ring-maroon-500 focus:border-maroon-500"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#800000] text-white px-6 py-3 h-12 hover:bg-[#6b0000] transition-all transform hover:scale-[1.02]"
                      disabled={submitMessage.isPending}
                    >
                      {submitMessage.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

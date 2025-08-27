import React, { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Award, MapPin, Clock, Building, ArrowRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  experience: string;
  description: string;
  type?: string;
  department?: string;
}

const whyJoinUs = [
  {
    icon: <Award className="w-8 h-8 text-maroon-500 mb-2" />, 
    title: 'Culture of Excellence',
    desc: 'Work with industry leaders and passionate innovators.'
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-maroon-500 mb-2" />, 
    title: 'Growth & Learning',
    desc: 'Continuous learning, mentorship, and career advancement.'
  },
  {
    icon: <Users className="w-8 h-8 text-maroon-500 mb-2" />, 
    title: 'Team Spirit',
    desc: 'Collaborative, supportive, and diverse work environment.'
  },
  {
    icon: <Briefcase className="w-8 h-8 text-maroon-500 mb-2" />, 
    title: 'Benefits',
    desc: 'Competitive pay, health insurance, and flexible policies.'
  },
];

const Career: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    resume: null as File | null,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(setJobs);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, resume: e.target.files ? e.target.files[0] : null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('phone', form.phone);
    data.append('location', form.location);
    data.append('experience', form.experience);
    if (form.resume) data.append('resume', form.resume);
    data.append('jobId', selectedJob.id);
    const res = await fetch('/api/apply', { method: 'POST', body: data });
    if (res.ok) setMessage('Application submitted successfully!');
    else setMessage('Submission failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-maroon-600 to-maroon-800 text-white py-20 overflow-hidden">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join Reckonix
            <span className="block text-2xl md:text-3xl font-light mt-2">Shape the Future of Precision</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-maroon-100 leading-relaxed">
            We believe in empowering talent, fostering innovation, and building a better tomorrow. 
            Explore your next career move with us in precision calibration and measurement technology!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-maroon-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              View Open Positions
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Decorative Wave */}
        <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 100 16" preserveAspectRatio="none">
          <path d="M0,16 Q25,8 50,16 T100,16 L100,16 L0,16 Z" fill="#f9fafb" />
        </svg>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-maroon-600 mb-4">Why Join Reckonix?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Be part of a team that's revolutionizing precision measurement and calibration technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyJoinUs.map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-maroon-100 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-maroon-600 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-maroon-600 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">
              Join our dynamic team and contribute to the future of precision technology
            </p>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Open Positions</h3>
                <p className="text-gray-500">We don't have any open positions at the moment, but we're always looking for talented individuals to join our team.</p>
                <p className="text-sm text-gray-400 mt-4">Please check back later or send us your resume for future opportunities.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-maroon-600 mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{job.experience}</span>
                              </div>
                              {job.type && (
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  <span>{job.type}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedJob(job)}
                            className="bg-maroon-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-maroon-700 transition-all flex items-center gap-2 whitespace-nowrap"
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="prose prose-gray max-w-none">
                          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: job.description }} />
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-maroon-100 text-maroon-700 px-3 py-1 rounded-full text-sm font-medium">
                              Precision Technology
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              Innovation
                            </span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              Growth Opportunity
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Form Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-maroon-600">Apply for Position</h3>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-lg text-maroon-600 mb-2">{selectedJob.title}</h4>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedJob.experience}
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      required 
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Location *</label>
                    <input 
                      name="location" 
                      value={form.location} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                  <input 
                    name="experience" 
                    value={form.experience} 
                    onChange={handleChange} 
                    required 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    placeholder="e.g., 3-5 years"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV *</label>
                  <input 
                    name="resume" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFile} 
                    required 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-maroon-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maroon-50 file:text-maroon-700 hover:file:bg-maroon-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-maroon-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-maroon-700 transition-all"
                  >
                    Submit Application
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedJob(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
                
                {message && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    message.includes('successfully') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Career; 
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Calendar, MapPin, Clock, Users, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "../components/seo";

export default function EventDetail() {
  const [, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  const { data: event, isLoading, error } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      return response.json();
    },
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation('/')} className="bg-maroon-500 hover:bg-maroon-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${event.title} - Reckonix Events`}
        description={event.description}
        keywords={`event, ${event.title}, reckonix, calibration, testing`}
        url={`/event-detail?id=${event.id}`}
        type="article"
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
              <Button 
                onClick={() => setLocation('/')}
                variant="ghost" 
                className="text-white hover:bg-white/20 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
              <h1 className="font-cinzel text-3xl md:text-4xl font-bold mb-4 heading-white">{event.title}</h1>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">{event.description}</p>
              
              {/* Event Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center justify-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="text-sm">{new Date(event.eventDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                {event.location && (
                  <div className="flex items-center justify-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
                {event.duration && (
                  <div className="flex items-center justify-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="text-sm">{event.duration}</span>
                  </div>
                )}
                {event.attendees && (
                  <div className="flex items-center justify-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="text-sm">{event.attendees}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Event Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="mb-8">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  )}

                  {/* Event Content */}
                  {event.content ? (
                    <div className="prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: event.content }} />
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-8 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
                      <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>
                      <p className="text-gray-600">
                        More details about this event will be available soon. Please check back later or contact us for more information.
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.split(',').map((tag: string, index: number) => (
                          <span 
                            key={index}
                            className="bg-maroon-100 text-maroon-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-maroon-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Date & Time</p>
                          <p className="text-gray-600">{new Date(event.eventDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                          <p className="text-gray-600">{new Date(event.eventDate).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</p>
                        </div>
                      </div>

                      {event.location && (
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-maroon-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Location</p>
                            <p className="text-gray-600">{event.location}</p>
                          </div>
                        </div>
                      )}

                      {event.duration && (
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-maroon-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Duration</p>
                            <p className="text-gray-600">{event.duration}</p>
                          </div>
                        </div>
                      )}

                      {event.attendees && (
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-maroon-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Expected Attendees</p>
                            <p className="text-gray-600">{event.attendees}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Registration Button */}
                    {event.registrationUrl && (
                      <div className="mt-6">
                        <Button 
                          className="w-full bg-maroon-500 hover:bg-maroon-600"
                          onClick={() => window.open(event.registrationUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Register Now
                        </Button>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        For more information about this event, please contact us:
                      </p>
                      <div className="text-sm text-gray-600">
                        <p>📧 sales@reckonix.co.in</p>
                        <p>📞 9175240313, 9823081155</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 
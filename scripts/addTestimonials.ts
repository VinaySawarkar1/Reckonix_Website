import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testimonials = [
  {
    name: "Shrikrushna Todmal",
    role: "Senior Calibration Engineer",
    company: "Precision Calibration Services",
    content: "Reckonix has been our trusted partner for calibration equipment. Their multifunction calibrators and precision instruments have significantly improved our measurement accuracy. The technical support and after-sales service are exceptional. We highly recommend their products for any calibration laboratory.",
    rating: 5,
    featured: true
  },
  {
    name: "Pratima Shinde",
    role: "Quality Manager",
    company: "Advanced Manufacturing Solutions",
    content: "The vision measuring machines from Reckonix have revolutionized our quality control process. The accuracy and reliability of their equipment have helped us maintain the highest standards in our manufacturing operations. Their team's expertise and commitment to customer satisfaction is outstanding.",
    rating: 5,
    featured: true
  },
  {
    name: "Vikram Patil",
    role: "Technical Director",
    company: "Industrial Testing & Calibration",
    content: "We've been using Reckonix calibration systems for over two years now. Their electrical and mechanical calibrators are top-notch, providing the precision we need for our aerospace clients. The equipment is robust, user-friendly, and meets all international standards. Reckonix is definitely our go-to partner for calibration solutions.",
    rating: 5,
    featured: true
  }
];

async function addTestimonials() {
  console.log('💬 Adding testimonials to the database...\n');

  try {
    for (const testimonial of testimonials) {
      const createdTestimonial = await prisma.testimonial.create({
        data: testimonial
      });
      console.log(`✅ Added testimonial: ${createdTestimonial.name} from ${createdTestimonial.company}`);
    }

    console.log('\n🎉 All testimonials added successfully!');
    
    // Verify the testimonials were added
    const allTestimonials = await prisma.testimonial.findMany();
    console.log(`\n📊 Total testimonials in database: ${allTestimonials.length}`);
    
    allTestimonials.forEach(testimonial => {
      console.log(`- ${testimonial.name} (${testimonial.company}) - ${testimonial.rating}⭐`);
    });

  } catch (error) {
    console.error('❌ Error adding testimonials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestimonials()
  .then(() => {
    console.log('\n✅ Testimonial addition completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Testimonial addition failed:', error);
    process.exit(1);
  }); 
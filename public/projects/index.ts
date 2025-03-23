export type Project = {
  name: string;
  description: string;
  logo: string;
  url: string;
  github: string;
  technologies: string[];
  productJourney: ProductJourney[];
};

export type ProductJourney = {
  title: string;
  description: string;
  image: string;
  alt: string;
};
export const projects: Project[] = [
  {
    name: 'Beili Photographer',
    description: 'A photography portfolio website built for showcasing professional photography work with image galleries and categories',
    logo: 'projects/logos/beili-photographer.png',
    url: 'https://beili-photographer.vercel.app',
    github: 'https://github.com/WebyCreatorsTeam/beili-photographer',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Mongoose', 'Cloudinary', 'NextAuth', 'bcrypt'],
    productJourney: [
      {
        title: 'Photography Portfolio',
        description: 'A modern, responsive photography portfolio website with image galleries organized by categories',
        image: 'projects/productJourney/beili-photographer/1.png',
        alt: 'Beili Photographer portfolio website screenshot'
      }
    ]
  },
  {
    name: 'Ofektive',
    description: 'A fitness trainer portfolio website showcasing client transformations and training services',
    logo: 'projects/logos/ofektive.png',
    url: 'https://ofektive.com',
    github: 'https://github.com/WebyCreatorsTeam/ofektive',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Sharp'],
    productJourney: [
      {
        title: 'Fitness Trainer Portfolio',
        description: 'A responsive website for a fitness trainer showcasing client transformations and training services',
        image: 'projects/productJourney/ofektive/1.png',
        alt: 'Ofektive fitness trainer website screenshot'
      }
    ]
  },
  {
    name: 'Sharon Fitness',
    description: 'Personal trainer website designed to showcase fitness services, training programs, and client testimonials',
    logo: 'projects/logos/sharon-fitness.png',
    url: 'https://sharon-fitness.vercel.app',
    github: 'https://github.com/WebyCreatorsTeam/sharon-fitness',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'React Idle Timer', 'Sharp'],
    productJourney: [
      {
        title: 'Personal Trainer Website',
        description: 'A modern, responsive website for a personal trainer featuring fitness services and training programs',
        image: 'projects/productJourney/sharon-fitness/1.png',
        alt: 'Sharon Fitness personal trainer website screenshot'
      }
    ]
  },
  {
    name: 'Mayart Candles',
    description: 'An e-commerce website for handcrafted candles with product catalog, shopping cart, and secure checkout',
    logo: 'projects/logos/mayart-candles.png',
    url: 'https://mayart-candles.vercel.app',
    github: 'https://github.com/WebyCreatorsTeam/mayart-candles',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Material UI', 'Express', 'Node.js', 'MongoDB', 'Mongoose', 'Cloudinary', 'Nodemailer'],
    productJourney: [
      {
        title: 'Candle E-commerce Store',
        description: 'A full-stack e-commerce platform for handcrafted candles with product catalog, shopping cart, and secure checkout',
        image: 'projects/productJourney/mayart-candles/1.png',
        alt: 'Mayart Candles e-commerce website screenshot'
      }
    ]
  },
  {
    name: 'Casona diez diez',
    description: 'A multilingual website for Casona Diez Diez, a charming hostel located in San Telmo, Argentina, featuring room booking, contact forms, and interactive maps',
    logo: 'projects/logos/casona-diez-diez.png',
    url: 'https://casonadiezdiez.com',
    github: 'https://github.com/EtanHey/casona_diez_diez',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'MongoDB', 'Google Maps API', 'Mailgun', 'UploadThing', 'i18n'],
    productJourney: [
      {
        title: 'Hostel Website',
        description: 'A multilingual website for a hostel in Argentina with room booking functionality, contact forms, and interactive location maps',
        image: 'projects/productJourney/casona-diez-diez/1.png',
        alt: 'Casona Diez Diez hostel website screenshot'
      }
    ]
  }
];

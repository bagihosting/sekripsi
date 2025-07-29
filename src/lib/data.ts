export interface Template {
    id: number;
    name: string;
    category: string;
    style: string;
    price: number;
    imageUrl: string;
    shortDescription: string;
    features: string[];
    liveDemoUrl: string;
    trending: boolean;
    aiHint: string;
  }
  
  const templates: Template[] = [
    {
      id: 1,
      name: "Ethereal Portfolio",
      category: "Portfolio",
      style: "Minimalist",
      price: 49,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "minimalist portfolio",
      shortDescription: "A clean and elegant portfolio for creatives to showcase their work.",
      features: ["Responsive Design", "Filterable Gallery", "Contact Form"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
      id: 2,
      name: "Artisan Shop",
      category: "eCommerce",
      style: "Modern",
      price: 79,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "modern ecommerce",
      shortDescription: "A stylish and robust theme for online stores and boutiques.",
      features: ["Product Quick View", "Shopping Cart", "Stripe Integration"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
      id: 3,
      name: "Chronicle Blog",
      category: "Blog",
      style: "Classic",
      price: 39,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "classic blog",
      shortDescription: "A timeless, content-focused design for writers and journalists.",
      features: ["Markdown Support", "Comment System", "Social Sharing"],
      liveDemoUrl: "#",
      trending: false,
    },
    {
      id: 4,
      name: "Corporate Hub",
      category: "Business",
      style: "Corporate",
      price: 69,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "corporate business",
      shortDescription: "A professional and feature-rich template for company websites.",
      features: ["Services Pages", "Team Showcase", "Testimonials Slider"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
      id: 5,
      name: "Visionary Startup",
      category: "Landing Page",
      style: "Modern",
      price: 29,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "modern startup",
      shortDescription: "A sleek landing page for startups and tech companies.",
      features: ["Pricing Tables", "FAQ Accordion", "Lead-gen Form"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
        id: 6,
        name: "Odyssey Travel",
        category: "Blog",
        style: "Adventurous",
        price: 45,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "travel blog",
        shortDescription: "A visually stunning blog for travel writers and photographers.",
        features: ["Interactive Maps", "Photo Essays", "Video Support"],
        liveDemoUrl: "#",
        trending: false,
    },
    {
        id: 7,
        name: "Zenith Wellness",
        category: "Business",
        style: "Calm",
        price: 55,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "wellness spa",
        shortDescription: "A calm and soothing template for spas, yoga studios, and wellness coaches.",
        features: ["Booking System", "Class Schedules", "Service Menus"],
        liveDemoUrl: "#",
        trending: false,
    },
    {
        id: 8,
        name: "Gourmet Eatery",
        category: "eCommerce",
        style: "Elegant",
        price: 89,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "gourmet food",
        shortDescription: "A sophisticated template for restaurants and gourmet food shops.",
        features: ["Online Reservations", "Menu Display", "Customer Reviews"],
        liveDemoUrl: "#",
        trending: false,
    },
    {
        id: 9,
        name: "SaaS Dashboard",
        category: "Application",
        style: "Modern",
        price: 129,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "saas dashboard",
        shortDescription: "A comprehensive analytics dashboard for your next SaaS project.",
        features: ["User Management", "Analytics", "Subscription Settings"],
        liveDemoUrl: "#",
        trending: true,
    },
    {
        id: 10,
        name: "E-Learning Platform",
        category: "Application",
        style: "Clean",
        price: 249,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "elearning platform",
        shortDescription: "A feature-rich platform for creating and selling online courses.",
        features: ["Course Management", "Student Progress", "Payment Gateway"],
        liveDemoUrl: "#",
        trending: false,
    }
  ];
  
  export const getTemplates = (): Template[] => {
    return templates;
  };
  
  export const getTemplateById = (id: number): Template | undefined => {
    return templates.find(t => t.id === id);
  };

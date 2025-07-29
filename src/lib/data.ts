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
      name: "Portofolio Ethereal",
      category: "Portofolio",
      style: "Minimalist",
      price: 49.99,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "minimalist portfolio",
      shortDescription: "Portofolio yang bersih dan elegan bagi para kreatif untuk memamerkan karya mereka.",
      features: ["Responsive Design", "Filterable Gallery", "Contact Form"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
      id: 2,
      name: "Toko Artisan",
      category: "eCommerce",
      style: "Modern",
      price: 79.99,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "modern ecommerce",
      shortDescription: "Tema yang gaya dan kuat untuk toko online dan butik.",
      features: ["Product Quick View", "Shopping Cart", "Stripe Integration"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
      id: 3,
      name: "Blog Kronik",
      category: "Blog",
      style: "Classic",
      price: 39.99,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "classic blog",
      shortDescription: "Desain abadi yang berfokus pada konten untuk penulis dan jurnalis.",
      features: ["Markdown Support", "Comment System", "Social Sharing"],
      liveDemoUrl: "#",
      trending: false,
    },
    {
      id: 4,
      name: "Pusat Korporat",
      category: "Bisnis",
      style: "Corporate",
      price: 69.99,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "corporate business",
      shortDescription: "Template profesional dan kaya fitur untuk situs web perusahaan.",
      features: ["Services Pages", "Team Showcase", "Testimonials Slider"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
      id: 5,
      name: "Startup Visioner",
      category: "Bisnis",
      style: "Modern",
      price: 59.99,
      imageUrl: "https://placehold.co/600x400.png",
      aiHint: "modern startup",
      shortDescription: "Template yang berani dan bersemangat untuk startup dan perusahaan teknologi.",
      features: ["Pricing Tables", "FAQ Accordion", "Lead-gen Form"],
      liveDemoUrl: "#",
      trending: true,
    },
    {
        id: 6,
        name: "Perjalanan Odyssey",
        category: "Blog",
        style: "Adventurous",
        price: 45.99,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "travel blog",
        shortDescription: "Blog yang memukau secara visual untuk penulis perjalanan dan fotografer.",
        features: ["Interactive Maps", "Photo Essays", "Video Support"],
        liveDemoUrl: "#",
        trending: false,
    },
    {
        id: 7,
        name: "Kebugaran Zenith",
        category: "Bisnis",
        style: "Calm",
        price: 55.99,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "wellness spa",
        shortDescription: "Template yang tenang dan menenangkan untuk spa, studio yoga, dan pelatih kebugaran.",
        features: ["Booking System", "Class Schedules", "Service Menus"],
        liveDemoUrl: "#",
        trending: false,
    },
    {
        id: 8,
        name: "Santapan Gourmet",
        category: "eCommerce",
        style: "Elegant",
        price: 89.99,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "gourmet food",
        shortDescription: "Template canggih untuk restoran dan toko makanan gourmet.",
        features: ["Online Reservations", "Menu Display", "Customer Reviews"],
        liveDemoUrl: "#",
        trending: false,
    },
    {
        id: 9,
        name: "Dasbor SaaS",
        category: "Aplikasi Web",
        style: "Modern",
        price: 129.99,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "saas dashboard",
        shortDescription: "Dasbor analitik yang komprehensif untuk proyek SaaS Anda berikutnya.",
        features: ["Manajemen Pengguna", "Analitik", "Pengaturan Langganan"],
        liveDemoUrl: "#",
        trending: true,
    },
    {
        id: 10,
        name: "Platform E-Learning",
        category: "Aplikasi Web",
        style: "Clean",
        price: 149.99,
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "elearning platform",
        shortDescription: "Platform kaya fitur untuk membuat dan menjual kursus online.",
        features: ["Manajemen Kursus", "Progres Siswa", "Gateway Pembayaran"],
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
  

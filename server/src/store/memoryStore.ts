import bcrypt from 'bcryptjs';

export interface InMemoryEvent {
  _id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar' | 'Hackathon' | 'Other';
  club: string;
  posterUrl?: string;
  capacity?: number | null;
  featured: boolean;
  registeredCount?: number;
  isSoldOut?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InMemoryRegistration {
  _id: string;
  event: string;
  name: string;
  email: string;
  collegeName: string;
  year: '1st' | '2nd' | '3rd' | '4th';
  phone: string;
  ticketId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InMemoryAdmin {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
}

class MemoryStore {
  public admins: InMemoryAdmin[] = [];
  public events: InMemoryEvent[] = [];
  public registrations: InMemoryRegistration[] = [];

  constructor() {
    this.seedDefaults();
  }

  public async seedDefaults() {
    // 1. Default Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);
    this.admins = [
      {
        _id: 'admin-001',
        email: 'admin@abes.ac.in',
        passwordHash,
        name: 'ABES Event Coordinator',
        role: 'superadmin',
      },
    ];

    // 2. Sample Events
    const now = new Date();
    const daysFromNow = (days: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d.toISOString();
    };

    this.events = [
      {
        _id: 'ev-001',
        name: 'NexusHacks 2026: 36-Hour National Hackathon',
        description:
          'Flagship 36-hour hackathon organized by GDG & GFG at ABES EC. Build AI agents, distributed Web3 architectures, and scalable cloud solutions with ₹2,50,000+ prize pool and venture funding opportunities.',
        date: daysFromNow(8),
        venue: 'Central Computing Facility (CCF), Ramanujan Block',
        category: 'Hackathon',
        club: 'GDG',
        posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        capacity: 350,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-002',
        name: 'CodeArena: Grand Algorithmic Showdown',
        description:
          'Fast-paced speed programming contest on HackerRank featuring dynamic programming, graph traversal, and greedy algorithms. Live editorial solutions by alumni engineers from Google and Microsoft.',
        date: daysFromNow(4),
        venue: 'Lab 5 & 6, Computer Science Department',
        category: 'Technical',
        club: 'Codechef',
        posterUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        capacity: 200,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-003',
        name: 'AeroStrike: Combat Drone & Robotics Championship',
        description:
          'High-octane autonomous drone obstacle navigation and 15kg/30kg combat robotics arena championship. Custom battle enclosure with pneumatic flippers and hazard pits.',
        date: daysFromNow(14),
        venue: 'Mechanical Workshop Courtyard, ABES EC',
        category: 'Technical',
        club: 'Drone and Robotics',
        posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        capacity: 400,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-004',
        name: 'ImmerseX: Spatial Computing & AR/VR Workshop',
        description:
          'Hands-on development bootcamp building immersive applications for Apple Vision Pro and Meta Quest 3 with Unity 3D and WebXR.',
        date: daysFromNow(6),
        venue: 'AR/VR Innovation Lab, Kalpana Chawla Block',
        category: 'Workshop',
        club: 'Arcade-AR/VR',
        posterUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
        capacity: 100,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-005',
        name: 'Full-Stack GenAI & LLM Architecture Summit',
        description:
          'Master LangChain, Pinecone vector indexing, Retrieval Augmented Generation (RAG), and production deployment of autonomous LLM reasoning agents with FastAPI and React.',
        date: daysFromNow(10),
        venue: 'Seminar Hall 2, Kalpana Chawla Block',
        category: 'Workshop',
        club: 'ACM',
        posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        capacity: 150,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-006',
        name: 'E-Summit 2026: Pitch Tank & Venture Showcase',
        description:
          'Annual student startup conclave where student founders pitch before Delhi NCR angel investors and venture capitalists. Seed grant pool of ₹3,00,000.',
        date: daysFromNow(18),
        venue: 'Bhabha Auditorium, Block C, ABES EC',
        category: 'Seminar',
        club: 'E-Cell',
        posterUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
        capacity: 350,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-007',
        name: 'Grandmaster Gambit: Open Chess Championship',
        description:
          'FIDE rated rapid Swiss-system chess tournament. 5 rounds of strategic battle with digital clocks across classical and blitz formats.',
        date: daysFromNow(12),
        venue: 'Student Activity Lounge, Aryabhata Block',
        category: 'Sports',
        club: 'En Passant',
        posterUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
        capacity: 128,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-008',
        name: 'Nukkad Natak & Street Play Festival',
        description:
          'Electrifying street play competition bringing social issues and youth perspectives to life with powerful vocals, dhols, and theatre performance.',
        date: daysFromNow(16),
        venue: 'Main College Amphitheatre, ABES EC Campus',
        category: 'Cultural',
        club: 'Samvad',
        posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        capacity: 800,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'ev-009',
        name: 'GFG Data Structures & System Design Bootcamp',
        description:
          'Intensive 3-day deep dive into high-level system design, distributed caching, rate limiters, and FAANG coding interview problem sets.',
        date: daysFromNow(7),
        venue: 'Aryabhata Conference Hall, Block A',
        category: 'Workshop',
        club: 'GFG',
        posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        capacity: 180,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // 3. Sample Registrations
    this.registrations = [
      {
        _id: 'reg-001',
        event: 'ev-001',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '3rd',
        phone: '9810123456',
        ticketId: 'ABES-2026-TED01',
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'reg-002',
        event: 'ev-001',
        name: 'Priya Verma',
        email: 'priya.v@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '2nd',
        phone: '9871234567',
        ticketId: 'ABES-2026-TED02',
        createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'reg-003',
        event: 'ev-002',
        name: 'Rohan Gupta',
        email: 'rohan.gupta@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '4th',
        phone: '9899123456',
        ticketId: 'ABES-2026-GEN01',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'reg-004',
        event: 'ev-003',
        name: 'Devansh Tiwari',
        email: 'devansh.t@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '3rd',
        phone: '9876501234',
        ticketId: 'ABES-2026-HCK01',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'reg-005',
        event: 'ev-004',
        name: 'Vikram Rajput',
        email: 'vikram.r@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '2nd',
        phone: '9811443322',
        ticketId: 'ABES-2026-UTS01',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'reg-006',
        event: 'ev-005',
        name: 'Sneha Chawla',
        email: 'sneha.chawla@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '4th',
        phone: '9899776655',
        ticketId: 'ABES-2026-WKP01',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

export const memoryStore = new MemoryStore();

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from '../config/db';
import { Admin } from '../models/Admin';
import { Event } from '../models/Event';
import { Registration } from '../models/Registration';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding for ABES Club Connect...');
    await connectDB();

    // 1. Clear existing collections
    await Admin.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('🧹 Cleaned existing database collections');

    // 2. Create Default Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@abes.ac.in').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = await Admin.create({
      email: adminEmail,
      passwordHash,
      name: 'ABES Event Coordinator',
      role: 'superadmin',
    });
    console.log(`👤 Admin created: ${admin.email} (Password: ${adminPassword})`);

    // 3. Create Sample Events
    const now = new Date();
    const daysFromNow = (days: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d;
    };

    const sampleEvents = [
      {
        name: 'TEDxABESEC: Catalyst of Tomorrow',
        description:
          'TEDxABESEC brings together visionary speakers, thought leaders, innovators, and changemakers to share transformative ideas worth spreading. Experience 8 captivating talks, interactive networking lounges, live musical interludes, and exclusive TEDx merchandise.',
        date: daysFromNow(12),
        venue: 'Bhabha Auditorium, Block C, ABES EC Campus',
        category: 'Seminar',
        club: 'TEDx ABES',
        posterUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
        capacity: 350,
        featured: true,
      },
      {
        name: "Genero '26 - Annual Mega Cultural Fest",
        description:
          "The biggest cultural extravaganza in Delhi NCR is back! 3 electrifying days of Battle of Bands, Street Play (Nukkad Natak), Western & Classical Dance Wars, Fashion Gala, Star Night concert featuring renowned artists, food trucks, and carnival games.",
        date: daysFromNow(20),
        venue: 'Main College Grounds & Amphitheatre, ABES EC',
        category: 'Cultural',
        club: 'Genero',
        posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        capacity: 2500,
        featured: true,
      },
      {
        name: 'TechFest 2026: Apex 36-Hour Hackathon',
        description:
          'ABES flagship national hackathon inviting student innovators across India to build real-world solutions in AI/ML, Web3, FinTech, Healthcare, and Sustainable Tech. ₹2,00,000+ prize pool, sponsored API credits, mentorship from top tech leaders, and direct interview opportunities.',
        date: daysFromNow(8),
        venue: 'Central Computing Facility (CCF), Ramanujan Block',
        category: 'Hackathon',
        club: 'TechFest',
        posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        capacity: 300,
        featured: true,
      },
      {
        name: 'Utsaah 2026: Inter-College Sports Carnival',
        description:
          'Unleash the spirit of athletic excellence! Competitions in Football, Basketball, Cricket, Badminton, Table Tennis, Volleyball, and Chess. Open to both collegiate teams and individual participants. Trophies, medals, and cash awards for champions.',
        date: daysFromNow(15),
        venue: 'ABES Sports Complex & Floodlit Courts',
        category: 'Sports',
        club: 'Utsaah',
        posterUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        capacity: 600,
        featured: false,
      },
      {
        name: 'Full-Stack GenAI & LLM Architecture Workshop',
        description:
          'A rigorous hands-on technical boot camp covering LangChain, Vector Databases (Pinecone/Milvus), Retrieval Augmented Generation (RAG), and deploying scalable LLM agents with FastAPI and React. Laptop with Node.js and Python 3.10+ required.',
        date: daysFromNow(5),
        venue: 'Seminar Hall 2, Kalpana Chawla Block',
        category: 'Workshop',
        club: 'ACM ABES',
        posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        capacity: 120,
        featured: false,
      },
      {
        name: 'RoboWars 2026: Heavyweight Arena Battle',
        description:
          'Witness the clash of titanium and sparks! 15kg and 30kg combat robotics tournament. Custom battle arena with pneumatic flippers, spinning saws, and hazard pits. Team participation with dynamic scoring rounds.',
        date: daysFromNow(25),
        venue: 'Mechanical Workshop Courtyard, ABES EC',
        category: 'Technical',
        club: 'TechFest',
        posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        capacity: 400,
        featured: false,
      },
      {
        name: 'CodeCraft 4.0: Speed Algorithmic Contest',
        description:
          'Fast-paced competitive programming showdown featuring problems ranging from greedy algorithms, graph theory to dynamic programming. Hosted on HackerRank with live editorial breakdown by alumni working at Google & Microsoft.',
        date: daysFromNow(3),
        venue: 'Lab 5 & 6, Computer Science Department',
        category: 'Technical',
        club: 'CodeChef Campus Chapter',
        posterUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        capacity: 150,
        featured: false,
      },
      {
        name: 'Vani: Youth Parliament & Policy Conclave',
        description:
          'Simulate parliamentary deliberations on technology governance, digital privacy, and national innovation policies. Sharpen your public speaking, diplomacy, and critical thinking skills in front of veteran adjudicators.',
        date: daysFromNow(18),
        venue: 'Aryabhata Conference Hall, Block A',
        category: 'Seminar',
        club: 'Genero',
        posterUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
        capacity: 180,
        featured: false,
      },
    ];

    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`🎉 Created ${createdEvents.length} sample events across ABES clubs!`);

    // 4. Create Sample Registrations
    const sampleRegistrations = [
      {
        event: createdEvents[0]._id, // TEDx
        name: 'Aarav Sharma',
        email: 'aarav.sharma@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '3rd',
        phone: '9810123456',
        ticketId: 'ABES-2026-TED01',
      },
      {
        event: createdEvents[0]._id, // TEDx
        name: 'Priya Verma',
        email: 'priya.v@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '2nd',
        phone: '9871234567',
        ticketId: 'ABES-2026-TED02',
      },
      {
        event: createdEvents[1]._id, // Genero
        name: 'Rohan Gupta',
        email: 'rohan.gupta@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '4th',
        phone: '9899123456',
        ticketId: 'ABES-2026-GEN01',
      },
      {
        event: createdEvents[1]._id, // Genero
        name: 'Ananya Singh',
        email: 'ananya.singh@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '1st',
        phone: '9818987654',
        ticketId: 'ABES-2026-GEN02',
      },
      {
        event: createdEvents[2]._id, // Hackathon
        name: 'Devansh Tiwari',
        email: 'devansh.t@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '3rd',
        phone: '9876501234',
        ticketId: 'ABES-2026-HCK01',
      },
      {
        event: createdEvents[2]._id, // Hackathon
        name: 'Ishita Patel',
        email: 'ishita.patel@kiet.edu',
        collegeName: 'KIET Group of Institutions',
        year: '3rd',
        phone: '9958012345',
        ticketId: 'ABES-2026-HCK02',
      },
      {
        event: createdEvents[3]._id, // Utsaah Sports
        name: 'Vikram Rajput',
        email: 'vikram.r@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '2nd',
        phone: '9811443322',
        ticketId: 'ABES-2026-UTS01',
      },
      {
        event: createdEvents[4]._id, // GenAI Workshop
        name: 'Sneha Chawla',
        email: 'sneha.chawla@abes.ac.in',
        collegeName: 'ABES Engineering College',
        year: '4th',
        phone: '9899776655',
        ticketId: 'ABES-2026-WKP01',
      },
    ];

    const createdRegistrations = await Registration.insertMany(sampleRegistrations);
    console.log(`🎟️ Created ${createdRegistrations.length} sample registrations!`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log(`🔐 Admin Login: ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
    console.log('--------------------------------------------------\n');

    await closeDB();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Globe, 
  BookOpen, 
  Users, 
  ArrowRight,
  Menu,
  X,
  Shield,
  PenTool 
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "#features", label: "Features", icon: BookOpen },
    { href: "#mission", label: "Our Mission", icon: Globe },
    { href: "#about", label: "About", icon: Users },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black relative text-gray-100">
      {/* Desktop Navigation */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center relative z-50">
        <div className="flex items-center">
          <Globe size={40} className="text-emerald-500 mr-2" />
          <h1 className="text-2xl font-bold text-emerald-400">DIID</h1>
        </div>
        
        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-gray-300 hover:text-emerald-400 transition flex items-center"
            >
              <item.icon className="mr-2" size={20} />
              {item.label}
            </Link>
          ))}
          <Link 
            href="/auth" 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center"
          >
            Join Now <ArrowRight className="ml-2" size={20} />
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu} 
            className="text-gray-300 hover:text-emerald-400"
          >
            {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center">
          <nav className="space-y-6 text-center">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={toggleMobileMenu}
                className="text-gray-100 text-2xl hover:text-emerald-400 transition flex items-center justify-center"
              >
                <item.icon className="mr-4" size={30} />
                {item.label}
              </Link>
            ))}
            <Link 
              href="/auth" 
              onClick={toggleMobileMenu}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition inline-flex items-center justify-center"
            >
              Join Now <ArrowRight className="ml-2" size={24} />
            </Link>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <h2 className="text-5xl font-extrabold text-emerald-400 mb-6 leading-tight">
            Bridging Digital Divides, Empowering Communities
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            A transformative platform connecting refugees, indigenous communities, 
            and the digital world through innovative technology and inclusive design.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/auth" 
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-emerald-700 transition inline-flex items-center"
            >
              Get Involved <ArrowRight className="ml-2" size={24} />
            </Link>
            <Link 
              href="#mission"
              className="border-2 border-emerald-600 text-emerald-400 px-6 py-3 rounded-xl text-lg hover:bg-emerald-900/30 transition inline-flex items-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl transform hover:scale-105 transition">
            <Users size={40} className="text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Community Empowerment</h3>
            <p className="text-gray-300">
              Tailored support for marginalized digital inclusion
            </p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl transform hover:scale-105 transition">
            <BookOpen size={40} className="text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Digital Literacy</h3>
            <p className="text-gray-300">
              Comprehensive learning resources
            </p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl transform hover:scale-105 transition col-span-2">
            <Globe size={40} className="text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Global Connectivity</h3>
            <p className="text-gray-300">
              Breaking barriers for refugees and indigenous communities
            </p>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16 bg-zinc-900 bg-opacity-50">
        <h2 className="text-4xl font-bold text-center text-emerald-400 mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-800 p-6 rounded-xl text-center">
            <Shield size={50} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-4 text-emerald-400">Secure Access</h3>
            <p className="text-gray-300">
              Inclusive authentication and privacy protection
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-xl text-center">
            <PenTool size={50} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-4 text-emerald-400">Cultural Collaboration</h3>
            <p className="text-gray-300">
              Interactive platforms respecting diverse backgrounds
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-xl text-center">
            <BookOpen size={50} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-4 text-emerald-400">Resource Accessibility</h3>
            <p className="text-gray-300">
              Multilingual and culturally sensitive content
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-8 border-t border-zinc-800">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-4 text-emerald-400">DIID</h4>
            <p>Connecting marginalized communities to the digital world</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-400">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/auth" className="hover:text-emerald-400">Join</Link>
              <Link href="#features" className="hover:text-emerald-400">Features</Link>
              <Link href="#mission" className="hover:text-emerald-400">Our Mission</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-400">Contact</h4>
            <p>connect@diid.org</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-zinc-800 pt-4">
          <p>&copy; 2025 DIID. Bridging Digital Divides.</p>
        </div>
      </footer>
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'API', href: '#api' },
  { label: 'Pricing', href: '#pricing' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16 border-b border-gray-200 bg-white/85 backdrop-blur-[12px]">
      <div className="flex h-full items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-brand-black">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-brand-black">RagFloe</span>
        </Link>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-500 transition-colors duration-150 hover:text-brand-black"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-gray-400"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center rounded-md bg-brand-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800"
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-brand-black"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-3"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link to="/login" className="text-sm text-gray-600">Sign In</Link>
              <Link to="/register" className="text-sm font-semibold text-brand-black">Get Started →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

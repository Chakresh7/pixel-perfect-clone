import { Link } from 'react-router-dom';

const footerLinks = ['Features', 'How it Works', 'API', 'Contact'];

const Footer = () => (
  <footer className="bg-dark-bg border-t border-[#18181B] py-8 px-6 md:px-12">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1100px] mx-auto">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-white">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#09090B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-white">RagFloe</span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        {footerLinks.map((l) => (
          <a key={l} href="#" className="text-[13px] text-gray-600 transition-colors hover:text-gray-400">
            {l}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <span className="font-mono text-xs text-gray-700">© 2026 RagFloe. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;

import Link from 'next/link';
import { FaHome, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const navLinks = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: <FaHome className="mr-3 text-lg" />,
  },
  {
    href: '/dashboard/meetings',
    label: 'Meetings',
    icon: <FaCalendarAlt className="mr-3 text-lg" />,
  },
  {
    href: '/dashboard/customers',
    label: 'Customers',
    icon: <FaUsers className="mr-3 text-lg" />,
  },
  // Uncomment below to add more links
  // {
  //   href: '/dashboard/slots',
  //   label: 'Slots',
  //   icon: <FaClock className="mr-3 text-lg" />,
  // },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-[#43A3A3] to-[#2B6F6F] text-white flex flex-col shadow-xl">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="bg-white/20 rounded-full p-2">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.15" />
            <path d="M10 22V12l6-4 6 4v10" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            <rect x="13" y="16" width="6" height="6" rx="1" fill="#fff" fillOpacity="0.2" />
          </svg>
        </div>
        <span className="text-2xl font-extrabold tracking-wide">Consultancy</span>
      </div>
      <nav className="flex flex-col gap-1 mt-6 px-2">
        {navLinks.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center px-5 py-3 rounded-lg transition-all duration-200 font-medium hover:bg-white/10 hover:text-[#B0D8D2] focus:bg-white/20 focus:outline-none group"
          >
            <span className="transition-colors duration-200 group-hover:text-[#B0D8D2]">{icon}</span>
            <span className="text-base">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-6 py-6 border-t border-white/10 text-xs text-white/60">
        &copy; {new Date().getFullYear()} Alchemy Consultancy
      </div>
    </aside>
  );
};

export default Sidebar;

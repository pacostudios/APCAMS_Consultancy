import { FaUsers, FaCalendarAlt, FaRegCalendarCheck, FaClock } from "react-icons/fa";

const stats = [
  {
    label: "Total Customers",
    value: "1,234",
    icon: <FaUsers className="text-3xl text-[#43A3A3]" />,
    bg: "from-[#D6EBE2] to-[#B0D8D2]",
  },
  {
    label: "Total Meetings",
    value: "567",
    icon: <FaCalendarAlt className="text-3xl text-[#43A3A3]" />,
    bg: "from-[#D6EBE2] to-[#B0D8D2]",
  },
  {
    label: "Upcoming Meetings",
    value: "8",
    icon: <FaRegCalendarCheck className="text-3xl text-[#43A3A3]" />,
    bg: "from-[#D6EBE2] to-[#B0D8D2]",
  },
  {
    label: "Available Slots",
    value: "12",
    icon: <FaClock className="text-3xl text-[#43A3A3]" />,
    bg: "from-[#D6EBE2] to-[#B0D8D2]",
  },
];

const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#2B6F6F] mb-10 tracking-tight">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-[#D6EBE2] to-[#F9FCFB] rounded-2xl shadow-lg p-7 flex flex-col items-start hover:shadow-xl transition-shadow duration-200 border border-[#E6F2F0]"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow mb-4">
              {stat.icon}
            </div>
            <div className="mt-1">
              <h2 className="text-lg font-medium text-[#2B6F6F] mb-1">{stat.label}</h2>
              <p className="text-3xl font-bold text-[#43A3A3] tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

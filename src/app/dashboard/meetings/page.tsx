"use client";
import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaUserCircle,
  FaUserMd,
  FaClock,
  FaVideo,
  FaCheckCircle,
  FaHourglassHalf,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

interface Meeting {
  id: number | null;
  title: string;
  customer: string;
  host: string;
  startTime: string;
  duration: number;
  status: string;
  notes: string;
  zoomId: string | null;
  zoomUrl: string | null;
}

interface MeetingWithId {
  id: number;
  title: string;
  customer: string;
  host: string;
  startTime: string;
  duration: number;
  status: string;
  notes: string;
  zoomId: string | null;
  zoomUrl: string | null;
}

const statusStyles: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700 border-green-300",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

const defaultMeeting = {
  id: null,
  title: "",
  customer: "",
  host: "",
  startTime: "",
  duration: 30,
  status: "Pending",
  notes: "",
  zoomId: "",
  zoomUrl: "",
};

function MeetingModal({
  open,
  onClose,
  onSave,
  initialData,
  isEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (meeting: Meeting) => void;
  initialData: Meeting | null;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<Meeting>(initialData || defaultMeeting);

  React.useEffect(() => {
    setForm(initialData || defaultMeeting);
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev: Meeting) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Make the modal scrollable by:
  // 1. Removing fixed height from the modal box.
  // 2. Setting max-h-[90vh] and overflow-y-auto on the modal box.
  // 3. Ensuring the modal content (form) does not have its own overflow-y-auto/flex-1.

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      style={{ width: "100vw", left: 0, right: 0 }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Heading */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b">
          <h2 className="text-2xl font-bold text-[#2B6F6F] flex items-center gap-2">
            <FaCalendarAlt className="text-[#43A3A3]" />
            {isEdit ? "Edit Meeting" : "Schedule Meeting"}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <FaTimes size={20} />
          </button>
        </div>
        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-4 space-y-4"
          id="modal-form"
          autoComplete="off"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Customer</label>
            <input
              name="customer"
              type="text"
              value={form.customer}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Host</label>
            <input
              name="host"
              type="text"
              value={form.host}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Start Time
              </label>
              <input
                name="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
                autoComplete="off"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Duration (mins)
              </label>
              <input
                name="duration"
                type="number"
                min={1}
                value={form.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Zoom Link</label>
            <input
              name="zoomUrl"
              type="url"
              value={form.zoomUrl || ""}
              onChange={handleChange}
              placeholder="https://zoom.us/j/..."
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
        </form>
        {/* Buttons */}
        <div className="flex justify-end gap-2 px-8 py-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-[#B0D8D2] text-[#2B6F6F] font-semibold hover:bg-[#F3FAF9] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="modal-form"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#43A3A3] to-[#B0D8D2] text-white font-semibold shadow hover:scale-105 transition-transform duration-200"
          >
            {isEdit ? "Save Changes" : "Add Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}

const initialMeetings = [
  {
    id: 1,
    title: "Initial Consultation",
    customer: "John Doe",
    host: "Dr. Smith",
    startTime: "2024-07-10T10:00:00",
    duration: 60,
    status: "Confirmed",
    notes: "Discuss project requirements.",
    zoomId: "123456789",
    zoomUrl: "https://zoom.us/j/123456789",
  },
  {
    id: 2,
    title: "Follow-up",
    customer: "Jane Roe",
    host: "Dr. Jones",
    startTime: "2024-07-11T14:00:00",
    duration: 30,
    status: "Pending",
    notes: "Review progress.",
    zoomId: null,
    zoomUrl: null,
  },
];

const MeetingsPage = () => {
  // Use useState with initial value to avoid hydration mismatch
  const [meetings, setMeetings] = useState<MeetingWithId[]>(initialMeetings);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);

  // For search/filter (not implemented, just UI)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleAdd = () => {
    setEditMeeting(null);
    setModalOpen(true);
  };

  const handleEdit = (meeting: Meeting) => {
    setEditMeeting(meeting);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditMeeting(null);
  };

  const handleModalSave = (meeting: Meeting) => {
    if (meeting.id) {
      // Edit
      setMeetings((prev) =>
        prev.map((m) => (m.id === meeting.id ? { ...meeting, id: meeting.id } : m))
      );
    } else {
      // Add
      // Use a deterministic id to avoid hydration mismatch
      const maxId = meetings.reduce((max, m) => Math.max(max, m.id || 0), 0);
      setMeetings((prev) => [
        ...prev,
        { ...meeting, id: maxId + 1 },
      ]);
    }
  };

  // Filtered meetings (search and status)
  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      search.trim() === "" ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.customer.toLowerCase().includes(search.toLowerCase()) ||
      m.host.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      !statusFilter || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Use toLocaleString with fixed locale and options to avoid hydration mismatch
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-2 sm:px-4 py-10">
        {/* Modal */}
        <MeetingModal
          open={modalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
          initialData={editMeeting}
          isEdit={!!editMeeting}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2B6F6F] tracking-tight mb-1 flex items-center gap-3">
              <FaCalendarAlt className="text-[#43A3A3]" /> Meetings
            </h1>
            <p className="text-gray-500 text-base">
              View, manage, and join your upcoming meetings.
            </p>
          </div>
          <button
            className="bg-gradient-to-r from-[#43A3A3] to-[#B0D8D2] text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform duration-200"
            onClick={handleAdd}
          >
            + Schedule Meeting
          </button>
        </div>

        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search meetings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border border-[#B0D8D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A3A3] transition"
          />
          <select
            className="w-full md:w-48 px-4 py-3 border border-[#B0D8D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A3A3] transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-[#D6EBE2] to-[#F9FCFB] p-0.5 rounded-2xl shadow-lg">
          <div className="bg-white rounded-2xl overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E6F2F0]">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> Title
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    <div className="flex items-center gap-2">
                      <FaUserCircle /> Customer
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    <div className="flex items-center gap-2">
                      <FaUserMd /> Host
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    <div className="flex items-center gap-2">
                      <FaClock /> Start Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <FaVideo /> Zoom
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#43A3A3] uppercase tracking-wider align-middle">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F2F0]">
                {filteredMeetings.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="hover:bg-[#F3FAF9] transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 align-middle">
                      <div>
                        {meeting.title}
                        <div className="text-xs text-gray-400 mt-1">
                          {meeting.notes}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#B0D8D2]/30 text-[#43A3A3]">
                          <FaUserCircle />
                        </span>
                        <span>{meeting.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#D6EBE2]/40 text-[#2B6F6F]">
                          <FaUserMd />
                        </span>
                        <span>{meeting.host}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <span className="font-semibold text-[#2B6F6F]">
                        {formatDate(meeting.startTime)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                      <span className="inline-flex items-center gap-1 justify-center">
                        <FaClock className="text-[#43A3A3]" /> {meeting.duration} mins
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold justify-center ${
                          statusStyles[meeting.status] ||
                          "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {meeting.status === "Confirmed" && (
                          <FaCheckCircle className="text-green-500" />
                        )}
                        {meeting.status === "Pending" && (
                          <FaHourglassHalf className="text-yellow-500" />
                        )}
                        {meeting.status === "Cancelled" && (
                          <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                        )}
                        {meeting.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                      {meeting.zoomUrl ? (
                        <a
                          href={meeting.zoomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#43A3A3] font-semibold hover:underline justify-center"
                        >
                          <FaVideo /> Join
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#43A3A3] to-[#B0D8D2] text-white font-semibold shadow hover:scale-105 transition-transform duration-200 justify-center"
                        title="Edit Meeting"
                        onClick={() => handleEdit(meeting)}
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMeetings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      No meetings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingsPage;

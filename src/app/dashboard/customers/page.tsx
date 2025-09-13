"use client";
import React, { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";

interface Customer {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  meetings: string[];
}

interface CustomerWithId {
  id: number;
  name: string;
  email: string;
  phone: string;
  meetings: string[];
}

// Modal component for Add/Edit Customer
function CustomerModal({
  open,
  onClose,
  onSave,
  initialData,
  isEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialData: Customer | null;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<Customer>(
    initialData || {
      id: null,
      name: "",
      email: "",
      phone: "",
      meetings: [],
    }
  );

  React.useEffect(() => {
    setForm(
      initialData || {
        id: null,
        name: "",
        email: "",
        phone: "",
        meetings: [],
      }
    );
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: Customer) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMeetingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: Customer) => ({
      ...prev,
      meetings: e.target.value.split(",").map((m) => m.trim()),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-[#2B6F6F]">
          {isEdit ? "Edit Customer" : "Add Customer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Meetings <span className="text-xs text-gray-400">(comma separated)</span>
            </label>
            <input
              name="meetings"
              type="text"
              value={form.meetings.join(", ")}
              onChange={handleMeetingsChange}
              className="w-full px-3 py-2 border border-[#B0D8D2] rounded-lg focus:ring-2 focus:ring-[#43A3A3] outline-none"
              autoComplete="off"
              placeholder="e.g. Initial Consultation, Follow-up"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-3 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#43A3A3] to-[#B0D8D2] text-white font-semibold shadow hover:scale-105 transition-transform duration-200"
            >
              {isEdit ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerWithId[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      meetings: ["Initial Consultation"],
    },
    {
      id: 2,
      name: "Jane Roe",
      email: "jane.roe@example.com",
      phone: "098-765-4321",
      meetings: ["Follow-up"],
    },
  ]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalData, setModalData] = useState<Customer | null>(null);

  // Filtered customers by search
  const filteredCustomers = customers.filter((c) =>
    [c.name, c.email, c.phone]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setModalData(null);
    setModalEdit(false);
    setModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setModalData(customer);
    setModalEdit(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalData(null);
    setModalEdit(false);
  };

  const handleModalSave = (customer: Customer) => {
    if (modalEdit) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...customer, id: customer.id || Date.now() } : c))
      );
    } else {
      setCustomers((prev) => [
        ...prev,
        { ...customer, id: customer.id || Date.now() }, // simple id
      ]);
    }
    setModalOpen(false);
    setModalData(null);
    setModalEdit(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <CustomerModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        initialData={modalData}
        isEdit={modalEdit}
      />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#2B6F6F] tracking-tight mb-1">
            Customer Directory
          </h1>
          <p className="text-gray-500 text-base">
            Manage and view all your customers in one place.
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-[#43A3A3] to-[#B0D8D2] text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform duration-200"
          onClick={handleAdd}
        >
          + Add Customer
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full px-4 py-3 border border-[#B0D8D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A3A3] transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="bg-gradient-to-br from-[#D6EBE2] to-[#F9FCFB] p-0.5 rounded-2xl shadow-lg">
        <div className="bg-white rounded-2xl overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E6F2F0]">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaUserCircle /> Name
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaEnvelope /> Email
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaPhone /> Phone
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt /> Meetings
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#43A3A3] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6F2F0]">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-[#F3FAF9] transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#B0D8D2]/30 text-[#43A3A3] mr-2">
                      <FaUserCircle />
                    </span>
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block bg-[#D6EBE2] text-[#2B6F6F] px-3 py-1 rounded-full text-xs font-semibold">
                      {customer.meetings.join(", ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    {/* <button
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#43A3A3] to-[#B0D8D2] text-white font-semibold shadow hover:scale-105 transition-transform duration-200"
                    >
                      <FaEye className="text-lg" />
                      View
                    </button> */}
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#B0D8D2] to-[#43A3A3] text-white font-semibold shadow hover:scale-105 transition-transform duration-200"
                      onClick={() => handleEdit(customer)}
                    >
                      <FaEdit className="text-lg" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;

const SlotsPage = () => {
  // Dummy data for now
  const slots = [
    {
      id: 1,
      doctor: 'Dr. Smith',
      startTime: '2024-07-12T09:00:00Z',
      duration: 30,
      isBooked: false,
    },
    {
      id: 2,
      doctor: 'Dr. Jones',
      startTime: '2024-07-12T09:30:00Z',
      duration: 30,
      isBooked: true,
    },
    {
      id: 3,
      doctor: 'Dr. Smith',
      startTime: '2024-07-12T10:00:00Z',
      duration: 30,
      isBooked: false,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Available Slots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-4 rounded-lg shadow-md ${
              slot.isBooked
                ? 'bg-red-200 border-l-4 border-red-500'
                : 'bg-green-200 border-l-4 border-green-500'
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800">{slot.doctor}</h2>
            <p className="text-gray-600">{new Date(slot.startTime).toLocaleString()}</p>
            <p className="text-gray-600">{slot.duration} minutes</p>
            {!slot.isBooked && (
              <button className="mt-4 bg-[#43A3A3] text-white px-4 py-2 rounded-lg hover:bg-[#3b9292]">
                Book Slot
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotsPage;

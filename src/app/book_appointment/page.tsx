import Image from "next/image";

export default function bookAppointmentPage() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mx-[20px] lg:mx-[81px] mt-[91px]">
        {/* <div className="hidden lg:flex w-[36rem] h-[63rem] bg-[#505050] rounded-tl-[16px] rounded-bl-[16px]"></div> */}

        <Image
          className="hidden lg:flex w-[36rem] h-[63rem] rounded-tl-[16px] rounded-bl-[16px] object-cover"
          src="https://images.unsplash.com/photo-1607368386669-d940ce438fba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNsaW5pY3xlbnwwfHwwfHx8MA%3D%3D"
          alt="Clinic interior"
          width={600}
          height={1000}
        />

        <div className="flex flex-col gap-[30px]">
          <h2 className="text-[20px] lg:text-[36px]">
            Get expert advice tailored to your needs, book a session at your
            convenience.
          </h2>
          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px] font-semibold text-gray-700">
              Lorem Ipsum
            </p>
            <input
              type="text"
              name=""
              id=""
              className="h-[4rem] w-auto lg:w-[37rem] rounded-full bg-[#D9D9D9] px-[20px] text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter text here"
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px] font-semibold text-gray-700">
              Lorem Ipsum
            </p>
            <input
              type="text"
              name=""
              id=""
              className="h-[4rem] w-auto lg:w-[37rem] rounded-full bg-[#D9D9D9] px-[20px] text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter text here"
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[18px] font-semibold text-gray-700">
              Lorem Ipsum
            </p>
            <input
              type="text"
              name=""
              id=""
              className="h-[4rem] w-auto lg:w-[37rem] rounded-full bg-[#D9D9D9] px-[20px] text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter text here"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-[24px]">
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] font-semibold text-gray-700">
                Lorem Ipsum
              </p>
              <input
                type="text"
                name=""
                id=""
                className="h-[4rem] w-auto lg:w-[18rem] rounded-full bg-[#D9D9D9] px-[20px] text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter text here"
              />
            </div>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[18px] font-semibold text-gray-700">
                Lorem Ipsum
              </p>
              <input
                type="text"
                name=""
                id=""
                className="h-[4rem] w-auto lg:w-[18rem] rounded-full bg-[#D9D9D9] px-[20px] text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter text here"
              />
            </div>
          </div>

          <button className="h-[5rem] w-auto lg:w-[10rem] bg-green-400 text-white rounded-xl">
            Check Availability
          </button>

          <button className="h-[5rem] w-auto lg:w-[37rem] bg-[#0582D0] text-white text-[48px] rounded-full">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

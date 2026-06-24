"use client";
import { useState, ChangeEvent, FormEvent } from "react";

export default function ContactUsPage() {

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    serviceInterest: "",
    preferredTiming: "",
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-16">
      <div className="bg-white px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div
              className="relative flex items-center justify-start bg-[#D9D9D9] rounded-lg pl-8
                   w-[250px] h-[300px] sm:w-[350px] sm:h-[420px] md:w-[500px] md:h-[600px]"
            >
              <div
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-[125px] h-[150px] sm:w-[175px] sm:h-[210px] md:w-[250px] md:h-[300px] 
                     bg-[#505050] rounded-lg shadow-lg"
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-r-lg p-6 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-500 mb-2 sm:mb-4">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Ready to begin your healing journey? We&apos;re here to support you
                every step of the way.
              </p>
            </div>

            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:py-3 bg-[#D9D9D966] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:py-3 bg-[#D9D9D966] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:py-3 bg-[#D9D9D966] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Service Interest
                  </label>
                  <input
                    type="text"
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:py-3 bg-[#D9D9D966] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Timing
                </label>
                <input
                  type="text"
                  name="preferredTiming"
                  value={formData.preferredTiming}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:py-3 bg-[#D9D9D966] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 sm:py-3 bg-[#D9D9D966] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-6 py-3 flex items-center justify-center text-white hover:scale-102 transition-transform duration-300 bg-[linear-gradient(90deg,#D6EBE2_0%,#B0D8D2_25.96%,#43A3A3_100%)] max-w-full md:max-w-[220px] rounded-full"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-[#F9FCFB] py-8 px-6 rounded-xl">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <h2 className="text-xl font-medium text-teal-500 mb-8">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.8472 15.3554L16.4306 13.3764L16.4184 13.3707C16.1892 13.2727 15.939 13.2333 15.6907 13.2562C15.4424 13.2792 15.2037 13.3636 14.9963 13.502C14.9718 13.5181 14.9484 13.5357 14.9259 13.5545L12.6441 15.4998C11.1984 14.7976 9.70595 13.3164 9.00376 11.8895L10.9519 9.57294C10.9706 9.5495 10.9884 9.52606 11.0053 9.50075C11.1407 9.29384 11.2229 9.05667 11.2445 8.81035C11.2661 8.56402 11.2264 8.31618 11.1291 8.08887V8.07762L9.14438 3.65356C9.0157 3.35662 8.79444 3.10926 8.51362 2.94841C8.2328 2.78756 7.9075 2.72184 7.58626 2.76106C6.31592 2.92822 5.14986 3.55209 4.30588 4.51615C3.4619 5.48021 2.99771 6.71852 3.00001 7.99981C3.00001 15.4436 9.05626 21.4998 16.5 21.4998C17.7813 21.5021 19.0196 21.0379 19.9837 20.1939C20.9477 19.35 21.5716 18.1839 21.7388 16.9136C21.7781 16.5924 21.7125 16.2672 21.5518 15.9864C21.3911 15.7056 21.144 15.4843 20.8472 15.3554ZM16.5 19.9998C13.3185 19.9963 10.2682 18.7309 8.01856 16.4813C5.76888 14.2316 4.50348 11.1813 4.50001 7.99981C4.49648 7.08433 4.82631 6.19887 5.42789 5.50879C6.02947 4.8187 6.86167 4.37118 7.76907 4.24981C7.7687 4.25355 7.7687 4.25732 7.76907 4.26106L9.73782 8.66731L7.80001 10.9867C7.78034 11.0093 7.76247 11.0335 7.74657 11.0589C7.60549 11.2754 7.52273 11.5246 7.5063 11.7825C7.48988 12.0404 7.54035 12.2981 7.65282 12.5307C8.5022 14.2679 10.2525 16.0051 12.0084 16.8536C12.2428 16.965 12.502 17.0137 12.7608 16.995C13.0196 16.9762 13.2692 16.8907 13.485 16.7467C13.5091 16.7305 13.5322 16.7129 13.5544 16.6942L15.8334 14.7498L20.2397 16.7232C20.2397 16.7232 20.2472 16.7232 20.25 16.7232C20.1301 17.6319 19.6833 18.4658 18.9931 19.0689C18.3028 19.672 17.4166 20.0029 16.5 19.9998Z"
                      fill="#43A3A3"
                    />
                  </svg>

                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      Phone
                    </div>
                    <div className="text-sm text-gray-600">755-336-6545</div>
                  </div>
                </div>

                {/* Mail */}
                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 4.5H3C2.80109 4.5 2.61032 4.57902 2.46967 4.71967C2.32902 4.86032 2.25 5.05109 2.25 5.25V18C2.25 18.3978 2.40804 18.7794 2.68934 19.0607C2.97064 19.342 3.35218 19.5 3.75 19.5H20.25C20.6478 19.5 21.0294 19.342 21.3107 19.0607C21.592 18.7794 21.75 18.3978 21.75 18V5.25C21.75 5.05109 21.671 4.86032 21.5303 4.71967C21.3897 4.57902 21.1989 4.5 21 4.5ZM19.0716 6L12 12.4828L4.92844 6H19.0716ZM20.25 18H3.75V6.95531L11.4928 14.0531C11.6312 14.1801 11.8122 14.2506 12 14.2506C12.1878 14.2506 12.3688 14.1801 12.5072 14.0531L20.25 6.95531V18Z"
                      fill="#43A3A3"
                    />
                  </svg>

                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      Mail
                    </div>
                    <div className="text-sm text-gray-600">
                      hello@APCAMS-healing.com
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 6C11.2583 6 10.5333 6.21993 9.91661 6.63199C9.29993 7.04404 8.81928 7.62971 8.53545 8.31494C8.25162 9.00016 8.17736 9.75416 8.32205 10.4816C8.46675 11.209 8.8239 11.8772 9.34835 12.4017C9.8728 12.9261 10.541 13.2833 11.2684 13.4279C11.9958 13.5726 12.7498 13.4984 13.4351 13.2145C14.1203 12.9307 14.706 12.4501 15.118 11.8334C15.5301 11.2167 15.75 10.4917 15.75 9.75C15.75 8.75544 15.3549 7.80161 14.6517 7.09835C13.9484 6.39509 12.9946 6 12 6ZM12 12C11.555 12 11.12 11.868 10.75 11.6208C10.38 11.3736 10.0916 11.0222 9.92127 10.611C9.75097 10.1999 9.70642 9.7475 9.79323 9.31105C9.88005 8.87459 10.0943 8.47368 10.409 8.15901C10.7237 7.84434 11.1246 7.63005 11.561 7.54323C11.9975 7.45642 12.4499 7.50097 12.861 7.67127C13.2722 7.84157 13.6236 8.12996 13.8708 8.49997C14.118 8.86998 14.25 9.30499 14.25 9.75C14.25 10.3467 14.0129 10.919 13.591 11.341C13.169 11.7629 12.5967 12 12 12ZM12 1.5C9.81273 1.50248 7.71575 2.37247 6.16911 3.91911C4.62247 5.46575 3.75248 7.56273 3.75 9.75C3.75 12.6938 5.11031 15.8138 7.6875 18.7734C8.84552 20.1108 10.1489 21.3151 11.5734 22.3641C11.6995 22.4524 11.8498 22.4998 12.0037 22.4998C12.1577 22.4998 12.308 22.4524 12.4341 22.3641C13.856 21.3147 15.1568 20.1104 16.3125 18.7734C18.8859 15.8138 20.25 12.6938 20.25 9.75C20.2475 7.56273 19.3775 5.46575 17.8309 3.91911C16.2843 2.37247 14.1873 1.50248 12 1.5ZM12 20.8125C10.4503 19.5938 5.25 15.1172 5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 15.1153 13.5497 19.5938 12 20.8125Z"
                      fill="#43A3A3"
                    />
                  </svg>

                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      Address
                    </div>
                    <div className="text-sm text-gray-600">
                      123 Wellness Street
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F9FCFB] py-8 px-6 rounded-xl">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <h2 className="text-xl font-medium text-teal-500 mb-8">
                Office Hours
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM12 20.25C10.3683 20.25 8.77326 19.7661 7.41655 18.8596C6.05984 17.9531 5.00242 16.6646 4.378 15.1571C3.75358 13.6496 3.5902 11.9908 3.90853 10.3905C4.22685 8.79016 5.01259 7.32015 6.16637 6.16637C7.32016 5.01259 8.79017 4.22685 10.3905 3.90852C11.9909 3.59019 13.6497 3.75357 15.1571 4.37799C16.6646 5.00242 17.9531 6.05984 18.8596 7.41655C19.7661 8.77325 20.25 10.3683 20.25 12C20.2475 14.1873 19.3775 16.2843 17.8309 17.8309C16.2843 19.3775 14.1873 20.2475 12 20.25ZM18 12C18 12.1989 17.921 12.3897 17.7803 12.5303C17.6397 12.671 17.4489 12.75 17.25 12.75H12C11.8011 12.75 11.6103 12.671 11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V6.75C11.25 6.55109 11.329 6.36032 11.4697 6.21967C11.6103 6.07902 11.8011 6 12 6C12.1989 6 12.3897 6.07902 12.5303 6.21967C12.671 6.36032 12.75 6.55109 12.75 6.75V11.25H17.25C17.4489 11.25 17.6397 11.329 17.7803 11.4697C17.921 11.6103 18 11.8011 18 12Z"
                      fill="#43A3A3"
                    />
                  </svg>

                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      Monday - Friday
                    </div>
                    <div className="text-sm text-gray-600">
                      9:00 AM - 8:00 PM
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5 3H17.25V2.25C17.25 2.05109 17.171 1.86032 17.0303 1.71967C16.8897 1.57902 16.6989 1.5 16.5 1.5C16.3011 1.5 16.1103 1.57902 15.9697 1.71967C15.829 1.86032 15.75 2.05109 15.75 2.25V3H8.25V2.25C8.25 2.05109 8.17098 1.86032 8.03033 1.71967C7.88968 1.57902 7.69891 1.5 7.5 1.5C7.30109 1.5 7.11032 1.57902 6.96967 1.71967C6.82902 1.86032 6.75 2.05109 6.75 2.25V3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM6.75 4.5V5.25C6.75 5.44891 6.82902 5.63968 6.96967 5.78033C7.11032 5.92098 7.30109 6 7.5 6C7.69891 6 7.88968 5.92098 8.03033 5.78033C8.17098 5.63968 8.25 5.44891 8.25 5.25V4.5H15.75V5.25C15.75 5.44891 15.829 5.63968 15.9697 5.78033C16.1103 5.92098 16.3011 6 16.5 6C16.6989 6 16.8897 5.92098 17.0303 5.78033C17.171 5.63968 17.25 5.44891 17.25 5.25V4.5H19.5V7.5H4.5V4.5H6.75ZM19.5 19.5H4.5V9H19.5V19.5Z"
                      fill="#43A3A3"
                    />
                  </svg>

                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      Saturday
                    </div>
                    <div className="text-sm text-gray-600">
                      10:00 AM - 4:00 PM
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5 3H17.25V2.25C17.25 2.05109 17.171 1.86032 17.0303 1.71967C16.8897 1.57902 16.6989 1.5 16.5 1.5C16.3011 1.5 16.1103 1.57902 15.9697 1.71967C15.829 1.86032 15.75 2.05109 15.75 2.25V3H8.25V2.25C8.25 2.05109 8.17098 1.86032 8.03033 1.71967C7.88968 1.57902 7.69891 1.5 7.5 1.5C7.30109 1.5 7.11032 1.57902 6.96967 1.71967C6.82902 1.86032 6.75 2.05109 6.75 2.25V3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM6.75 4.5V5.25C6.75 5.44891 6.82902 5.63968 6.96967 5.78033C7.11032 5.92098 7.30109 6 7.5 6C7.69891 6 7.88968 5.92098 8.03033 5.78033C8.17098 5.63968 8.25 5.44891 8.25 5.25V4.5H15.75V5.25C15.75 5.44891 15.829 5.63968 15.9697 5.78033C16.1103 5.92098 16.3011 6 16.5 6C16.6989 6 16.8897 5.92098 17.0303 5.78033C17.171 5.63968 17.25 5.44891 17.25 5.25V4.5H19.5V7.5H4.5V4.5H6.75ZM19.5 19.5H4.5V9H19.5V19.5ZM14.7806 12.5306L13.0603 14.25L14.7806 15.9694C14.8503 16.0391 14.9056 16.1218 14.9433 16.2128C14.981 16.3039 15.0004 16.4015 15.0004 16.5C15.0004 16.5985 14.981 16.6961 14.9433 16.7872C14.9056 16.8782 14.8503 16.9609 14.7806 17.0306C14.7109 17.1003 14.6282 17.1556 14.5372 17.1933C14.4461 17.231 14.3485 17.2504 14.25 17.2504C14.1515 17.2504 14.0539 17.231 13.9628 17.1933C13.8718 17.1556 13.7891 17.1003 13.7194 17.0306L12 15.3103L10.2806 17.0306C10.2109 17.1003 10.1282 17.1556 10.0372 17.1933C9.94613 17.231 9.84855 17.2504 9.75 17.2504C9.65145 17.2504 9.55387 17.231 9.46283 17.1933C9.37178 17.1556 9.28906 17.1003 9.21937 17.0306C9.14969 16.9609 9.09442 16.8782 9.0567 16.7872C9.01899 16.6961 8.99958 16.5985 8.99958 16.5C8.99958 16.4015 9.01899 16.3039 9.0567 16.2128C9.09442 16.1218 9.14969 16.0391 9.21937 15.9694L10.9397 14.25L9.21937 12.5306C9.07864 12.3899 8.99958 12.199 8.99958 12C8.99958 11.801 9.07864 11.6101 9.21937 11.4694C9.36011 11.3286 9.55098 11.2496 9.75 11.2496C9.94902 11.2496 10.1399 11.3286 10.2806 11.4694L12 13.1897L13.7194 11.4694C13.7891 11.3997 13.8718 11.3444 13.9628 11.3067C14.0539 11.269 14.1515 11.2496 14.25 11.2496C14.3485 11.2496 14.4461 11.269 14.5372 11.3067C14.6282 11.3444 14.7109 11.3997 14.7806 11.4694C14.8503 11.5391 14.9056 11.6218 14.9433 11.7128C14.981 11.8039 15.0004 11.9015 15.0004 12C15.0004 12.0985 14.981 12.1961 14.9433 12.2872C14.9056 12.3782 14.8503 12.4609 14.7806 12.5306Z"
                      fill="#43A3A3"
                    />
                  </svg>

                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      Sunday
                    </div>
                    <div className="text-sm text-gray-600">Closed </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-[120px]">
        <div className="w-full h-[540px] bg-[#f1f1f1] lg:rounded-[16px] overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.306090303248!2d2.294481315674282!3d48.85884497928712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66f0349a8d395%3A0x74a9d0b607b59b53!2sEiffel%20Tower!5e0!3m2!1sen!2sus!4v1617809356500!5m2!1sen!2sus"
            width="100%"
            height="100%"
            // frameBorder="0"
            // style="border:0"
            // allowFullScreen=""
            aria-hidden="false"
            // tabIndex="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

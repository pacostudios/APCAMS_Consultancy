"use client";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import green from "@/assets/green.png";

export default function AboutPage() {
  const data = [
    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },
    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },
    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },
    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },
    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },

    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },
    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },
    {
      img: "",
      name: "Dr. Sarah Mitchell",
      title: "Founder & Clinical Psychologist",
    },
  ];

  const phylosophy = [
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V14C4 20.59 7.19 24.5837 9.86625 26.7737C12.7487 29.1312 15.6163 29.9312 15.7413 29.965C15.9131 30.0118 16.0944 30.0118 16.2663 29.965C16.3913 29.9312 19.255 29.1312 22.1413 26.7737C24.81 24.5837 28 20.59 28 14V7C28 6.46957 27.7893 5.96086 27.4142 5.58579C27.0391 5.21071 26.5304 5 26 5ZM26 14C26 18.6337 24.2925 22.395 20.925 25.1775C19.4591 26.3846 17.7919 27.324 16 27.9525C14.2315 27.335 12.5849 26.4123 11.135 25.2262C7.7275 22.4387 6 18.6625 6 14V7H26V14ZM10.2925 17.7075C10.1049 17.5199 9.99944 17.2654 9.99944 17C9.99944 16.7346 10.1049 16.4801 10.2925 16.2925C10.4801 16.1049 10.7346 15.9994 11 15.9994C11.2654 15.9994 11.5199 16.1049 11.7075 16.2925L14 18.5862L20.2925 12.2925C20.3854 12.1996 20.4957 12.1259 20.6171 12.0756C20.7385 12.0253 20.8686 11.9994 21 11.9994C21.1314 11.9994 21.2615 12.0253 21.3829 12.0756C21.5043 12.1259 21.6146 12.1996 21.7075 12.2925C21.8004 12.3854 21.8741 12.4957 21.9244 12.6171C21.9747 12.7385 22.0006 12.8686 22.0006 13C22.0006 13.1314 21.9747 13.2615 21.9244 13.3829C21.8741 13.5043 21.8004 13.6146 21.7075 13.7075L14.7075 20.7075C14.6146 20.8005 14.5043 20.8742 14.3829 20.9246C14.2615 20.9749 14.1314 21.0008 14 21.0008C13.8686 21.0008 13.7385 20.9749 13.6171 20.9246C13.4957 20.8742 13.3854 20.8005 13.2925 20.7075L10.2925 17.7075Z"
            fill="#43A3A3"
          />
        </svg>
      ),
      title: "Safety First",
      description:
        "We prioritize creating a secure, non-judgmental environment where vulnerability is honored and authentic expression is welcomed",
    },
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.7336 10.3955C29.1212 13.2978 29.3847 16.6111 28.473 19.6962C27.5614 22.7813 25.5393 25.4193 22.797 27.1011C20.0547 28.783 16.7867 29.3894 13.6235 28.8034C10.4604 28.2174 7.62651 26.4804 5.66872 23.9278C3.71093 21.3752 2.76807 18.1879 3.0221 14.981C3.27614 11.7741 4.70906 8.77502 7.04431 6.5625C9.37956 4.34997 12.4516 3.08089 15.6675 3.00019C18.8835 2.91949 22.0153 4.03289 24.4586 6.1255L27.2923 3.2905C27.48 3.10286 27.7345 2.99744 27.9998 2.99744C28.2652 2.99744 28.5197 3.10286 28.7073 3.2905C28.895 3.47814 29.0004 3.73263 29.0004 3.998C29.0004 4.26336 28.895 4.51786 28.7073 4.7055L16.7073 16.7055C16.5197 16.8931 16.2652 16.9986 15.9998 16.9986C15.7345 16.9986 15.48 16.8931 15.2923 16.7055C15.1047 16.5179 14.9993 16.2634 14.9993 15.998C14.9993 15.7326 15.1047 15.4781 15.2923 15.2905L18.7573 11.8255C17.8183 11.2044 16.6971 10.9185 15.5753 11.0139C14.4535 11.1094 13.3967 11.5806 12.5761 12.3514C11.7554 13.1222 11.219 14.1474 11.0535 15.261C10.888 16.3746 11.1032 17.5115 11.6642 18.4876C12.2253 19.4637 13.0993 20.2219 14.1449 20.6394C15.1905 21.0569 16.3463 21.1093 17.4254 20.7882C18.5045 20.467 19.4436 19.7911 20.0907 18.8698C20.7378 17.9485 21.0551 16.8358 20.9911 15.7117C20.9837 15.5804 21.0022 15.4489 21.0457 15.3248C21.0891 15.2006 21.1566 15.0862 21.2442 14.9882C21.3318 14.8901 21.4379 14.8102 21.5564 14.7531C21.6749 14.6961 21.8035 14.6629 21.9348 14.6555C22.2 14.6406 22.4603 14.7316 22.6584 14.9086C22.7565 14.9963 22.8363 15.1023 22.8934 15.2208C22.9505 15.3393 22.9837 15.4679 22.9911 15.5992C23.0822 17.1902 22.6278 18.7647 21.7029 20.0624C20.778 21.3601 19.438 22.3034 17.9044 22.7364C16.3708 23.1694 14.7353 23.0661 13.2683 22.4436C11.8013 21.8212 10.5906 20.7168 9.83634 19.313C9.08205 17.9093 8.82931 16.2901 9.1199 14.7233C9.41048 13.1564 10.227 11.7356 11.4345 10.6957C12.642 9.65572 14.1682 9.05892 15.7608 9.00389C17.3534 8.94885 18.9172 9.43889 20.1936 10.393L23.0373 7.54925C20.9533 5.81899 18.3035 4.9197 15.5969 5.02409C12.8902 5.12848 10.3176 6.2292 8.37305 8.11483C6.42851 10.0005 5.2492 12.538 5.06162 15.2402C4.87404 17.9424 5.69142 20.6185 7.35677 22.7548C9.02212 24.891 11.418 26.3366 14.0843 26.814C16.7505 27.2914 19.4992 26.7668 21.8022 25.3411C24.1053 23.9154 25.8005 21.6891 26.5621 19.0897C27.3237 16.4903 27.0981 13.7012 25.9286 11.258C25.8142 11.0186 25.7996 10.7437 25.888 10.4935C25.9763 10.2434 26.1605 10.0386 26.3998 9.92425C26.6392 9.80987 26.9142 9.79527 27.1643 9.88364C27.4144 9.97202 27.6192 10.1561 27.7336 10.3955Z"
            fill="#43A3A3"
          />
        </svg>
      ),
      title: "Personalized Approach",
      description:
        "No two healing journeys are alike. We carefully tailor our interventions to match your unique needs, preferences, and goals.",
    },
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.0002 28.9993C22.0002 29.2645 21.8948 29.5189 21.7073 29.7064C21.5197 29.8939 21.2654 29.9993 21.0002 29.9993H11.0002C10.7349 29.9993 10.4806 29.8939 10.2931 29.7064C10.1055 29.5189 10.0002 29.2645 10.0002 28.9993C10.0002 28.7341 10.1055 28.4797 10.2931 28.2922C10.4806 28.1046 10.7349 27.9993 11.0002 27.9993H21.0002C21.2654 27.9993 21.5197 28.1046 21.7073 28.2922C21.8948 28.4797 22.0002 28.7341 22.0002 28.9993ZM27.0002 12.9993C27.0045 14.6663 26.6279 16.3123 25.8991 17.8117C25.1704 19.311 24.1087 20.624 22.7952 21.6505C22.5496 21.8388 22.3502 22.0807 22.2125 22.3578C22.0747 22.6349 22.0021 22.9398 22.0002 23.2493V23.9993C22.0002 24.5297 21.7894 25.0384 21.4144 25.4135C21.0393 25.7886 20.5306 25.9993 20.0002 25.9993H12.0002C11.4697 25.9993 10.961 25.7886 10.586 25.4135C10.2109 25.0384 10.0002 24.5297 10.0002 23.9993V23.2493C9.99996 22.9435 9.92965 22.6419 9.79465 22.3676C9.65965 22.0932 9.46355 21.8535 9.22141 21.6668C7.91116 20.6463 6.85022 19.3412 6.11889 17.8502C5.38755 16.3591 5.00499 14.7213 5.00016 13.0605C4.96766 7.10304 9.78266 2.14179 15.7352 1.99929C17.2018 1.96394 18.6608 2.22235 20.0261 2.75931C21.3914 3.29626 22.6355 4.10092 23.6852 5.1259C24.7349 6.15089 25.5689 7.37549 26.1382 8.72765C26.7075 10.0798 27.0006 11.5322 27.0002 12.9993ZM25.0002 12.9993C25.0005 11.7989 24.7607 10.6105 24.2949 9.50415C23.8291 8.39779 23.1466 7.39581 22.2877 6.55718C21.4288 5.71854 20.4108 5.06021 19.2936 4.62092C18.1765 4.18163 16.9827 3.97028 15.7827 3.99929C10.9077 4.11429 6.97391 8.17304 7.00016 13.048C7.00473 14.4063 7.31816 15.7457 7.91673 16.9649C8.5153 18.1841 9.38334 19.2513 10.4552 20.0855C10.937 20.4601 11.3267 20.9399 11.5945 21.4883C11.8623 22.0367 12.001 22.639 12.0002 23.2493V23.9993H20.0002V23.2493C20.0016 22.6373 20.1427 22.0337 20.4128 21.4845C20.683 20.9354 21.075 20.4552 21.5589 20.0805C22.634 19.2403 23.503 18.1656 24.0994 16.9383C24.6958 15.7111 25.0039 14.3638 25.0002 12.9993ZM22.9864 11.8318C22.7271 10.3834 22.0303 9.04924 20.9897 8.00891C19.9492 6.96858 18.6149 6.27203 17.1664 6.01304C17.0369 5.9912 16.9043 5.9951 16.7763 6.02449C16.6483 6.05388 16.5274 6.1082 16.4203 6.18435C16.3133 6.26049 16.2223 6.35697 16.1526 6.46827C16.0829 6.57957 16.0357 6.70352 16.0139 6.83304C15.9921 6.96255 15.996 7.0951 16.0254 7.22311C16.0548 7.35113 16.1091 7.4721 16.1852 7.57911C16.2614 7.68613 16.3578 7.77711 16.4691 7.84684C16.5804 7.91658 16.7044 7.96371 16.8339 7.98554C18.9052 8.33429 20.6627 10.0918 21.0139 12.1668C21.0535 12.3997 21.1742 12.6111 21.3548 12.7634C21.5353 12.9158 21.7639 12.9994 22.0002 12.9993C22.0567 12.999 22.1131 12.9944 22.1689 12.9855C22.4303 12.9409 22.6633 12.7943 22.8166 12.5779C22.9699 12.3616 23.031 12.0932 22.9864 11.8318Z"
            fill="#43A3A3"
          />
        </svg>
      ),
      title: "Holistic Integration",
      description:
        "We address the whole person - mind, body, and spirit. Our approach integrates cognitive, emotional, somatic, and spiritual dimensions.",
    },
  ];

  const handleNavigate = () => {
    window.location.href = "/service";
  };

  return (
    <div>
      {/* <div className="grid grid-cols-2">
      
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-[24px]">
            <p className="text-[18px] text-[#0582D0]">About us</p>
            <h2 className="text-[42px]">Lorem Ipsum is simply dummy.</h2>
            <p className="text-[16px] leading-[24px] max-w-[559px]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scramble
            </p>
            <p className="text-[16px] leading-[24px] max-w-[559px]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
            <div className="flex justify-start">
              <button className=" text-[24px] bg-[#D9D9D9] w-[126px] h-[42px] text-center rounded-[162px]">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <section className="py-12 lg:py-20">
        <div className="w-[50vw] h-[30rem] lg:w-[30vw] lg:h-[45rem] overflow-hidden rounded-tr-lg rounded-br-lg absolute left-0 top-[7rem] lg:top-[9.6rem] z-[-1]">
          <Image
            className="w-full h-full object-cover"
            src={green}
            alt="green"
          />
        </div>
        <section className="max-w-screen-2xl mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-[24px]">
            <div className="">
              <Image
                className="w-full lg:-[20rem] lg:w-[38rem] h-[23rem] lg:h-[35rem] bg-[#505050] lg:-translate-x-5 rounded-2xl object-cover"
                src="https://www.shutterstock.com/image-photo/doctor-healthcare-medicine-patient-talking-600nw-2191880035.jpg"
                alt="Doctor consultation"
                width={600}
                height={400}
              />
            </div>
            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-[12px]">
                <p className="text-4xl text-[#43A3A3]">About APCAMS</p>
                {/* <h2 className="text-[42px]">Lorem Ipsum is simply dummy.</h2> */}
                <p className="text-[16px] lg:text-lg leading-[24px] max-w-[559px]">
                  Our comprehensive approach combines cutting-edge therapeutic
                  techniques with ancient wisdom, creating a unique space where
                  science meets soul, and where every individual&apos;s journey is
                  honored and supported with the utmost care and respect.
                </p>

                <div className="flex justify-start mt-8">
                  <button
                    className="px-6 py-3 flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 bg-[linear-gradient(90deg,#D6EBE2_0%,#B0D8D2_25.96%,#43A3A3_100%)] max-w-full md:max-w-[220px] rounded-full"
                    onClick={handleNavigate}
                  >
                    Explore{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col gap-[8px]">
            {/* <p className="text-[18px] text-[#0582D0]">Lorem Ipsum</p> */}
            <h2 className="text-4xl text-[#43A3A3]">
              Our Treatment Philosophy
            </h2>
            <p className="text-[16px] leading-[24px] mt-auto">
              The principles that guide our approach to healing
            </p>
          </div>
        </div>

        <div className="mt-[37px] border-b-[1px] border-[#00000080]" />

        <div className="grid grid-cols-1 lg:grid-cols-3 mt-[25px] gap-[40px]">
          {phylosophy.map((item, index) => (
            <div
              className="flex flex-col lg:gap-[12px] max-w-[300px]"
              key={index}
            >
              {item.icon}
              <p className="text-[20px]">{item.title}</p>
              <p className="text-[14px] leading-[24px]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-12 lg:mt-[121px] gap-4 lg:gap-0]">
          <div className="flex flex-col gap-[12px]">
            <p className="text-4xl text-[#43A3A3]">Our Core Values</p>

            <div className="grid grid-cols-2 gap-3 lg:gap-[24px] mt-[24px]">
              {["Compassion", "Growth Mindset", "Authencity", "Excellence"].map(
                (item, index) => {
                  return (
                    <div
                      className="flex items-center gap-2 px-4 py-2 bg-[#D6EBE2] w-fit rounded-full"
                      key={index}
                    >
                      <GoDotFill />
                      <p className="text-[16px] lg:text-xl leading-[24px]">
                        {item}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <Image
            className="bg-[#D9D9D9] w-full h-[20rem] rounded-[16px] object-cover"
            src="https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkaWNhbCUyMGNvbnN1bHRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Medical consultation"
            width={600}
            height={300}
          />
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 mt-[121px]">
          <div className="flex flex-col gap-[12px]">
            <h2 className="text-4xl text-[#43A3A3]">Meet Our Team</h2>
            <p className="text-[16px] leading-[24px] mt-auto lg:max-w-[452px]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy text
              ever since the 1500s,
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[40px] gap-[24px]">
          {data?.map((val, index) => {
            return (
              <div className="flex flex-col gap-[12px]" key={index}>
                <Image
                  className="w-full h-[21rem] bg-[#D9D9D9] rounded-xl object-cover"
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
                  alt="Team member"
                  width={300}
                  height={300}
                />
                <button className=" text-[16px] bg-[#43A3A3] h-[36px] text-center text-white rounded-full">
                  {val.name}
                </button>
                <p className="text-[18px] leading-[24px] mt-auto max-w-[447px]">
                  {val.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center mt-[115px]">
          <div className="flex flex-col justify-center  bg-[#344256] w-full h-[11rem] text-white rounded-t-xl lg:rounded-t-[0px] lg:rounded-tl-2xl lg:rounded-bl-2xl p-12">
            <h2 className="text-[20px] lg:text-4xl text-center lg:text-left mb-2">
              Ready to Begin Your Healing Journey?
            </h2>
            <p className="text-[14px] max-w-[90%] lg:max-w-[480px] text-center lg:text-left">
              Schedule your initial consultation and take the first step toward
              transformation
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-around bg-[url('/bg_img.png')] bg-cover bg-center w-full lg:h-[11rem] rounded-b-xl lg:rounded-b-[0px] lg:rounded-tr-2xl lg:rounded-br-2xl p-4 lg:p-0 ">
            <button className="bg-white px-6 py-2 rounded-full text-[#43A3A3] font-medium hover:bg-opacity-90 transition-colors text-base lg:text-xl">
              Schedule a consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import Accordion from "./components/Accordion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import green from "../../public/green.png";
import Image from "next/image";
import { TextAnimate } from "@/components/magicui/text-animate";
import { HyperText } from "@/components/magicui/hyper-text";
import Magnet from "./components/MagneticCard";

export default function Home() {
  const how_we_work = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
        >
          <rect width="110" height="110" rx="16" fill="#43A3A3" />
          <path
            d="M76.875 54.9999C76.875 55.4143 76.7104 55.8117 76.4174 56.1048C76.1243 56.3978 75.7269 56.5624 75.3125 56.5624H70.0273L62.6484 71.3241C62.5185 71.5837 62.3189 71.802 62.0719 71.9545C61.8249 72.107 61.5403 72.1876 61.25 72.1874H61.1719C60.8688 72.1724 60.5766 72.0695 60.3311 71.8912C60.0855 71.713 59.8972 71.467 59.7891 71.1835L48.623 41.8671L42.3594 55.6464C42.2353 55.9194 42.0352 56.151 41.7831 56.3134C41.531 56.4759 41.2374 56.5623 40.9375 56.5624H34.6875C34.2731 56.5624 33.8757 56.3978 33.5826 56.1048C33.2896 55.8117 33.125 55.4143 33.125 54.9999C33.125 54.5855 33.2896 54.1881 33.5826 53.8951C33.8757 53.602 34.2731 53.4374 34.6875 53.4374H39.9316L47.3281 37.1659C47.4556 36.8851 47.6634 36.6484 47.9252 36.4854C48.187 36.3225 48.4912 36.2407 48.7995 36.2503C49.1077 36.2599 49.4062 36.3605 49.6574 36.5394C49.9086 36.7183 50.1012 36.9676 50.2109 37.2558L61.4434 66.748L67.6641 54.3046C67.7934 54.0443 67.9928 53.8252 68.2399 53.672C68.4869 53.5188 68.7718 53.4376 69.0625 53.4374H75.3125C75.7269 53.4374 76.1243 53.602 76.4174 53.8951C76.7104 54.1881 76.875 54.5855 76.875 54.9999Z"
            fill="white"
          />
        </svg>
      ),
      title: "500+",
      dis: "Lives Transformed",
    },
    {
      icon: (
        <svg
          width="111"
          height="110"
          viewBox="0 0 111 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="110" height="110" rx="16" fill="#43A3A3" />
          <path
            d="M73.1875 48.75C73.1892 45.8535 72.4589 43.0035 71.0644 40.4648C69.6699 37.9262 67.6564 35.7811 65.211 34.2288C62.7656 32.6765 59.9675 31.7675 57.0767 31.586C54.1859 31.4046 51.2962 31.9566 48.6758 33.1909C46.0555 34.4252 43.7896 36.3017 42.0886 38.646C40.3876 40.9904 39.3066 43.7267 38.9461 46.6006C38.5857 49.4746 38.9573 52.3931 40.0266 55.0849C41.0959 57.7768 42.8282 60.1548 45.0625 61.998V76.875C45.0623 77.1414 45.1303 77.4035 45.2599 77.6363C45.3896 77.8691 45.5766 78.0649 45.8033 78.2051C46.0299 78.3452 46.2887 78.425 46.5549 78.437C46.8211 78.449 47.0859 78.3926 47.3242 78.2734L56 73.9453L64.6777 78.2832C64.8953 78.3873 65.1338 78.44 65.375 78.4375C65.7894 78.4375 66.1868 78.2728 66.4799 77.9798C66.7729 77.6868 66.9375 77.2894 66.9375 76.875V61.998C68.8924 60.3879 70.4667 58.365 71.5473 56.0745C72.6279 53.7839 73.188 51.2826 73.1875 48.75ZM41.9375 48.75C41.9375 45.9687 42.7623 43.2498 44.3075 40.9372C45.8527 38.6247 48.0489 36.8223 50.6185 35.7579C53.1881 34.6935 56.0156 34.4151 58.7435 34.9577C61.4713 35.5003 63.977 36.8396 65.9437 38.8063C67.9104 40.7729 69.2497 43.2786 69.7923 46.0065C70.3349 48.7344 70.0564 51.5619 68.9921 54.1314C67.9277 56.701 66.1253 58.8973 63.8127 60.4425C61.5001 61.9877 58.7813 62.8125 56 62.8125C52.2717 62.8083 48.6972 61.3254 46.0609 58.6891C43.4245 56.0527 41.9416 52.4783 41.9375 48.75ZM63.8125 74.3476L56.6973 70.791C56.4802 70.6823 56.2408 70.6258 55.998 70.6258C55.7553 70.6258 55.5159 70.6823 55.2988 70.791L48.1875 74.3476V64.0566C50.6062 65.2928 53.2837 65.9374 56 65.9374C58.7163 65.9374 61.3938 65.2928 63.8125 64.0566V74.3476ZM56 59.6875C58.1632 59.6875 60.2779 59.046 62.0766 57.8442C63.8752 56.6423 65.2771 54.9341 66.1049 52.9356C66.9328 50.937 67.1494 48.7378 66.7273 46.6162C66.3053 44.4945 65.2636 42.5456 63.734 41.016C62.2043 39.4863 60.2555 38.4446 58.1338 38.0226C56.0121 37.6006 53.813 37.8172 51.8144 38.645C49.8158 39.4729 48.1076 40.8747 46.9058 42.6734C45.704 44.4721 45.0625 46.5867 45.0625 48.75C45.0656 51.6498 46.2189 54.43 48.2694 56.4805C50.32 58.531 53.1001 59.6844 56 59.6875ZM56 40.9375C57.5452 40.9375 59.0556 41.3956 60.3404 42.2541C61.6252 43.1125 62.6265 44.3327 63.2178 45.7602C63.8091 47.1878 63.9638 48.7586 63.6624 50.2741C63.3609 51.7896 62.6169 53.1816 61.5243 54.2742C60.4317 55.3668 59.0396 56.1109 57.5241 56.4123C56.0087 56.7138 54.4378 56.5591 53.0103 55.9678C51.5827 55.3765 50.3626 54.3751 49.5041 53.0903C48.6457 51.8056 48.1875 50.2951 48.1875 48.75C48.1875 46.6779 49.0106 44.6908 50.4757 43.2257C51.9409 41.7606 53.928 40.9375 56 40.9375Z"
            fill="white"
          />
        </svg>
      ),
      title: "10+",
      dis: "Years Experience",
    },
    {
      icon: (
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="110" height="110" rx="16" fill="#43A3A3" />
          <path
            d="M76.7481 43.6874C76.5889 43.1908 76.2851 42.7529 75.8755 42.43C75.466 42.1071 74.9693 41.9138 74.4492 41.8749L67.2344 41.3046L64.459 34.7304C64.2563 34.2543 63.918 33.8483 63.4864 33.563C63.0547 33.2776 62.5487 33.1255 62.0313 33.1255C61.5138 33.1255 61.0078 33.2776 60.5761 33.563C60.1445 33.8483 59.8063 34.2543 59.6035 34.7304L56.8281 41.3046L49.6133 41.8749C49.0952 41.9131 48.6002 42.1047 48.1915 42.4253C47.7827 42.7459 47.4787 43.181 47.3182 43.6751C47.1577 44.1692 47.148 44.6998 47.2903 45.1995C47.4326 45.6991 47.7205 46.145 48.1172 46.4804L53.5977 51.1054L51.9258 58.0175C51.8042 58.5181 51.8339 59.0435 52.0113 59.5272C52.1886 60.0108 52.5055 60.4309 52.9219 60.7343C53.3421 61.044 53.8448 61.2222 54.3663 61.2462C54.8878 61.2702 55.4047 61.1389 55.8516 60.8691L62.0313 57.1484L68.2129 60.871C68.66 61.1401 69.1768 61.2709 69.6981 61.247C70.2195 61.223 70.722 61.0453 71.1426 60.7362C71.5582 60.4323 71.8744 60.012 72.0514 59.5285C72.2283 59.045 72.258 58.5198 72.1367 58.0194L70.4649 51.1073L75.9453 46.4823C76.3422 46.1493 76.6306 45.7054 76.7737 45.2075C76.9167 44.7096 76.9078 44.1803 76.7481 43.6874ZM67.711 49.3359C67.4892 49.5232 67.3241 49.7687 67.234 50.0447C67.144 50.3206 67.1326 50.6163 67.2012 50.8984L68.8184 57.58L62.8379 53.9843C62.5947 53.8379 62.3161 53.7606 62.0322 53.7606C61.7484 53.7606 61.4698 53.8379 61.2266 53.9843L55.2461 57.5839L56.8633 50.8984C56.9316 50.6161 56.92 50.3204 56.8296 50.0444C56.7392 49.7684 56.5737 49.523 56.3516 49.3359L51.0938 44.8944L58.0313 44.3456C58.3168 44.323 58.5906 44.2223 58.8228 44.0545C59.0549 43.8868 59.2365 43.6584 59.3477 43.3944L62.0313 37.0136L64.7246 43.3944C64.8358 43.6584 65.0174 43.8868 65.2495 44.0545C65.4817 44.2223 65.7555 44.323 66.041 44.3456L72.9805 44.8944L67.711 49.3359ZM47.2031 54.0585L35.793 65.4804C35.4998 65.7736 35.1021 65.9383 34.6875 65.9383C34.2729 65.9383 33.8752 65.7736 33.582 65.4804C33.2889 65.1872 33.1241 64.7895 33.1241 64.3749C33.1241 63.9603 33.2889 63.5626 33.582 63.2694L44.9981 51.8534C45.2913 51.5602 45.6889 51.3955 46.1035 51.3955C46.5182 51.3955 46.9158 51.5602 47.209 51.8534C47.5022 52.1466 47.6669 52.5443 47.6669 52.9589C47.6669 53.3735 47.5022 53.7712 47.209 54.0644L47.2031 54.0585ZM49.3145 63.7987C49.6073 64.0917 49.7718 64.489 49.7718 64.9032C49.7718 65.3175 49.6073 65.7147 49.3145 66.0077L38.918 76.4179C38.7728 76.5631 38.6005 76.6782 38.4108 76.7568C38.2211 76.8353 38.0178 76.8758 37.8125 76.8758C37.6072 76.8758 37.4039 76.8353 37.2142 76.7568C37.0246 76.6782 36.8522 76.5631 36.707 76.4179C36.5619 76.2727 36.4467 76.1004 36.3681 75.9107C36.2896 75.721 36.2491 75.5177 36.2491 75.3124C36.2491 75.1071 36.2896 74.9038 36.3681 74.7141C36.4467 74.5245 36.5619 74.3521 36.707 74.2069L47.1113 63.8046C47.4043 63.5118 47.8016 63.3473 48.2158 63.3473C48.6301 63.3473 49.0273 63.5118 49.3203 63.8046L49.3145 63.7987ZM63.5723 63.6034C63.7176 63.7485 63.8328 63.9209 63.9114 64.1106C63.9901 64.3002 64.0305 64.5036 64.0305 64.7089C64.0305 64.9142 63.9901 65.1176 63.9114 65.3072C63.8328 65.4969 63.7176 65.6693 63.5723 65.8144L52.9707 76.4159C52.6775 76.7091 52.2799 76.8738 51.8652 76.8738C51.4506 76.8738 51.053 76.7091 50.7598 76.4159C50.4666 76.1227 50.3019 75.7251 50.3019 75.3105C50.3019 74.8958 50.4666 74.4982 50.7598 74.205L61.3633 63.6034C61.5087 63.4571 61.6816 63.341 61.8721 63.2619C62.0625 63.1827 62.2668 63.142 62.4731 63.1422C62.6793 63.1424 62.8835 63.1834 63.0739 63.2629C63.2642 63.3424 63.4369 63.4588 63.582 63.6054L63.5723 63.6034Z"
            fill="white"
          />
        </svg>
      ),
      title: "95%",
      dis: "Client Satisfaction",
    },
  ];
  // const services = [
  //   {
  //     data: "Psychotherapy",
  //     dis: "Psychotherapy at Apcams offers a safe, supportive space to explore your thoughts, emotions, and life challenges. Through evidence-based approaches, we help you uncover patterns, heal past wounds, and build a more fulfilling, balanced life.",
  //   },
  //   {
  //     data: "Counseling",
  //     dis: "Counseling at Apcams provides compassionate guidance to help you navigate life's difficulties with clarity and confidence. Whether you're facing stress, relationship issues, or personal transitions, we're here to support your growth and well-being.",
  //   },
  //   {
  //     data: "Meditation Programs",
  //     dis: "Our Meditation Programs at Apcams are designed to help you cultivate inner peace, focus, and emotional resilience. Through guided practices and mindfulness techniques, you'll learn to quiet the mind and reconnect with the present moment.",
  //   },
  //   {
  //     data: "Specialized Services",
  //     dis: "Apcams's Specialized Services offer targeted support for unique emotional, psychological, and life challenges. From trauma recovery to stress management and holistic wellness, our tailored approaches are designed to meet your individual needs with care and expertise.",
  //   },
  // ];
  const accordionData = [
    {
      id: 1,
      title: "What can I expect during my first therapy or counseling session?",
      content:
        "In your first session, you’ll have a chance to share your concerns in a safe and confidential space. Your therapist or counselor will work with you to understand your goals and discuss how the process can best support your needs.",
    },
    {
      id: 2,
      title: "How do I know if I need therapy or counseling?",
      content:
        "If you're feeling overwhelmed, stuck, anxious, or are struggling with relationships or life transitions, therapy or counseling can provide valuable support and clarity. You don’t need to have a diagnosis—if something feels off, it’s okay to seek help.",
    },
    {
      id: 3,
      title: "What types of meditation do you offer in your programs?",
      content:
        "Our meditation programs include mindfulness, breathwork, guided visualization, and body awareness techniques. Each session is designed to support mental clarity, stress reduction, and emotional balance.",
    },
    {
      id: 4,
      title: "Are your services confidential?",
      content:
        "Yes, all sessions are completely confidential. Your privacy and trust are essential to the therapeutic process, and we adhere to strict professional and ethical standards.",
    },
    {
      id: 5,
      title: "Do you offer online or remote sessions?",
      content:
        "Yes, we offer both in-person and secure online sessions to ensure you can access support wherever you are. Online sessions are just as effective and convenient for those with busy schedules or limited mobility",
    },
  ];

  const our_services = [
    {
      icon: (
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="50" height="50" rx="25" fill="white" />
          <path
            d="M38.1248 24.5617C38.1237 23.4027 37.7943 22.2677 37.1749 21.2881C36.5555 20.3085 35.6714 19.5243 34.6248 19.0262V18.8742C34.6238 17.7468 34.2599 16.6496 33.5869 15.7451C32.914 14.8406 31.9677 14.1767 30.8881 13.8517C29.8086 13.5268 28.6531 13.5579 27.5926 13.9407C26.5321 14.3234 25.623 15.0373 24.9998 15.9769C24.3766 15.0373 23.4675 14.3234 22.4071 13.9407C21.3466 13.5579 20.1911 13.5268 19.1115 13.8517C18.032 14.1767 17.0857 14.8406 16.4127 15.7451C15.7398 16.6496 15.3759 17.7468 15.3748 18.8742V19.0262C14.3274 19.5229 13.4424 20.3066 12.8227 21.2863C12.203 22.266 11.874 23.4014 11.874 24.5606C11.874 25.7198 12.203 26.8553 12.8227 27.8349C13.4424 28.8146 14.3274 29.5983 15.3748 30.095V30.2492C15.3759 31.3766 15.7398 32.4738 16.4127 33.3783C17.0857 34.2828 18.032 34.9467 19.1115 35.2717C20.1911 35.5967 21.3466 35.5655 22.4071 35.1827C23.4675 34.8 24.3766 34.0861 24.9998 33.1466C25.623 34.0861 26.5321 34.8 27.5926 35.1827C28.6531 35.5655 29.8086 35.5967 30.8881 35.2717C31.9677 34.9467 32.914 34.2828 33.5869 33.3783C34.2599 32.4738 34.6238 31.3766 34.6248 30.2492V30.095C35.6712 29.5973 36.5553 28.8135 37.1747 27.8343C37.7941 26.855 38.1235 25.7204 38.1248 24.5617ZM20.6248 33.7492C19.7618 33.7491 18.9293 33.4301 18.2871 32.8535C17.6449 32.277 17.2384 31.4835 17.1456 30.6255C17.4286 30.6658 17.714 30.6863 17.9998 30.6867H18.8748C19.1069 30.6867 19.3295 30.5945 19.4936 30.4304C19.6577 30.2663 19.7498 30.0438 19.7498 29.8117C19.7498 29.5796 19.6577 29.3571 19.4936 29.193C19.3295 29.0289 19.1069 28.9367 18.8748 28.9367H17.9998C16.9669 28.9379 15.9668 28.5736 15.1766 27.9082C14.3865 27.2428 13.8573 26.3193 13.6827 25.3012C13.5081 24.2831 13.6994 23.236 14.2227 22.3454C14.746 21.4548 15.5675 20.778 16.5419 20.435C16.7124 20.3746 16.86 20.2629 16.9643 20.1152C17.0687 19.9676 17.1248 19.7912 17.1248 19.6103V18.8742C17.1248 17.9459 17.4936 17.0557 18.15 16.3993C18.8063 15.743 19.6966 15.3742 20.6248 15.3742C21.5531 15.3742 22.4433 15.743 23.0997 16.3993C23.7561 17.0557 24.1248 17.9459 24.1248 18.8742V26.3401C23.164 25.476 21.9171 24.9983 20.6248 24.9992C20.3928 24.9992 20.1702 25.0914 20.0061 25.2555C19.842 25.4196 19.7498 25.6421 19.7498 25.8742C19.7498 26.1063 19.842 26.3288 20.0061 26.4929C20.1702 26.657 20.3928 26.7492 20.6248 26.7492C21.5531 26.7492 22.4433 27.118 23.0997 27.7743C23.7561 28.4307 24.1248 29.3209 24.1248 30.2492C24.1248 31.1775 23.7561 32.0677 23.0997 32.7241C22.4433 33.3805 21.5531 33.7492 20.6248 33.7492ZM31.9998 28.9367H31.1248C30.8928 28.9367 30.6702 29.0289 30.5061 29.193C30.342 29.3571 30.2498 29.5796 30.2498 29.8117C30.2498 30.0438 30.342 30.2663 30.5061 30.4304C30.6702 30.5945 30.8928 30.6867 31.1248 30.6867H31.9998C32.2857 30.6863 32.5711 30.6658 32.8541 30.6255C32.7814 31.2977 32.5155 31.9346 32.0885 32.459C31.6616 32.9834 31.0919 33.3729 30.4483 33.5804C29.8047 33.7879 29.1148 33.8045 28.462 33.6282C27.8092 33.4519 27.2214 33.0903 26.7697 32.5871C26.318 32.0839 26.0217 31.4606 25.9168 30.7925C25.8118 30.1245 25.9026 29.4404 26.1782 28.8229C26.4537 28.2054 26.9023 27.6809 27.4696 27.3129C28.0369 26.9449 28.6986 26.7491 29.3748 26.7492C29.6069 26.7492 29.8295 26.657 29.9936 26.4929C30.1577 26.3288 30.2498 26.1063 30.2498 25.8742C30.2498 25.6421 30.1577 25.4196 29.9936 25.2555C29.8295 25.0914 29.6069 24.9992 29.3748 24.9992C28.0825 24.9983 26.8357 25.476 25.8748 26.3401V18.8742C25.8748 17.9459 26.2436 17.0557 26.9 16.3993C27.5563 15.743 28.4466 15.3742 29.3748 15.3742C30.3031 15.3742 31.1933 15.743 31.8497 16.3993C32.5061 17.0557 32.8748 17.9459 32.8748 18.8742V19.6103C32.8749 19.7912 32.9309 19.9676 33.0353 20.1152C33.1397 20.2629 33.2873 20.3746 33.4578 20.435C34.4322 20.778 35.2537 21.4548 35.777 22.3454C36.3003 23.236 36.4916 24.2831 36.317 25.3012C36.1424 26.3193 35.6132 27.2428 34.8231 27.9082C34.0329 28.5736 33.0328 28.9379 31.9998 28.9367ZM33.7498 23.2492C33.7498 23.4813 33.6577 23.7038 33.4936 23.8679C33.3295 24.032 33.1069 24.1242 32.8748 24.1242H32.4373C31.3931 24.1242 30.3915 23.7094 29.6531 22.9709C28.9147 22.2325 28.4998 21.231 28.4998 20.1867V19.7492C28.4998 19.5171 28.592 19.2946 28.7561 19.1305C28.9202 18.9664 29.1428 18.8742 29.3748 18.8742C29.6069 18.8742 29.8295 18.9664 29.9936 19.1305C30.1577 19.2946 30.2498 19.5171 30.2498 19.7492V20.1867C30.2498 20.7669 30.4803 21.3233 30.8905 21.7335C31.3008 22.1437 31.8572 22.3742 32.4373 22.3742H32.8748C33.1069 22.3742 33.3295 22.4664 33.4936 22.6305C33.6577 22.7946 33.7498 23.0171 33.7498 23.2492ZM17.5623 24.1242H17.1248C16.8928 24.1242 16.6702 24.032 16.5061 23.8679C16.342 23.7038 16.2498 23.4813 16.2498 23.2492C16.2498 23.0171 16.342 22.7946 16.5061 22.6305C16.6702 22.4664 16.8928 22.3742 17.1248 22.3742H17.5623C18.1425 22.3742 18.6989 22.1437 19.1091 21.7335C19.5194 21.3233 19.7498 20.7669 19.7498 20.1867V19.7492C19.7498 19.5171 19.842 19.2946 20.0061 19.1305C20.1702 18.9664 20.3928 18.8742 20.6248 18.8742C20.8569 18.8742 21.0795 18.9664 21.2436 19.1305C21.4077 19.2946 21.4998 19.5171 21.4998 19.7492V20.1867C21.4998 21.231 21.085 22.2325 20.3466 22.9709C19.6082 23.7094 18.6066 24.1242 17.5623 24.1242Z"
            fill="black"
          />
        </svg>
      ),
      title: "Psychotherapy",
      description:
        "Individual therapy sessions using evidence-based approaches like CBT, DBT, and mindfulness-based interventions.",
    },
    {
      icon: (
        <svg
          width="51"
          height="50"
          viewBox="0 0 51 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="50" height="50" rx="25" fill="white" />
          <path
            d="M24.8245 28.2713C25.9972 27.4905 26.8875 26.3531 27.3638 25.0272C27.8401 23.7014 27.8771 22.2574 27.4693 20.9089C27.0614 19.5604 26.2305 18.3789 25.0992 17.5392C23.968 16.6995 22.5966 16.2461 21.1877 16.2461C19.7789 16.2461 18.4075 16.6995 17.2762 17.5392C16.145 18.3789 15.314 19.5604 14.9062 20.9089C14.4984 22.2574 14.5354 23.7014 15.0117 25.0272C15.488 26.3531 16.3783 27.4905 17.551 28.2713C15.4297 29.0531 13.618 30.4999 12.3863 32.3958C12.3216 32.492 12.2766 32.6001 12.2541 32.7139C12.2315 32.8276 12.2317 32.9447 12.2548 33.0583C12.2779 33.172 12.3233 33.2799 12.3884 33.3758C12.4536 33.4718 12.5372 33.5538 12.6343 33.6171C12.7314 33.6805 12.8402 33.7239 12.9542 33.7448C13.0683 33.7658 13.1853 33.7639 13.2986 33.7392C13.4119 33.7145 13.5192 33.6675 13.6142 33.601C13.7092 33.5345 13.79 33.4497 13.852 33.3517C14.6464 32.1298 15.7336 31.1256 17.0147 30.4305C18.2958 29.7354 19.7302 29.3713 21.1877 29.3713C22.6453 29.3713 24.0797 29.7354 25.3608 30.4305C26.6419 31.1256 27.729 32.1298 28.5235 33.3517C28.6519 33.5425 28.8501 33.675 29.0754 33.7208C29.3007 33.7665 29.535 33.7217 29.7275 33.5962C29.9201 33.4706 30.0555 33.2742 30.1044 33.0496C30.1534 32.825 30.112 32.5901 29.9891 32.3958C28.7575 30.4999 26.9458 29.0531 24.8245 28.2713ZM16.3752 22.8113C16.3752 21.8594 16.6575 20.929 17.1863 20.1376C17.7151 19.3462 18.4667 18.7293 19.3461 18.3651C20.2254 18.0008 21.1931 17.9055 22.1266 18.0912C23.0601 18.2769 23.9176 18.7353 24.5907 19.4083C25.2637 20.0813 25.7221 20.9388 25.9078 21.8724C26.0935 22.8059 25.9982 23.7736 25.6339 24.6529C25.2697 25.5323 24.6528 26.2839 23.8614 26.8127C23.07 27.3415 22.1396 27.6238 21.1877 27.6238C19.9118 27.6223 18.6886 27.1148 17.7864 26.2126C16.8842 25.3104 16.3767 24.0872 16.3752 22.8113ZM39.3593 33.6066C39.1649 33.7333 38.9282 33.7777 38.7011 33.7299C38.4741 33.6821 38.2753 33.5461 38.1485 33.3517C37.355 32.129 36.268 31.1245 34.9866 30.4296C33.7053 29.7348 32.2704 29.3718 30.8127 29.3738C30.5807 29.3738 30.3581 29.2816 30.194 29.1175C30.0299 28.9534 29.9377 28.7308 29.9377 28.4988C29.9377 28.2667 30.0299 28.0441 30.194 27.88C30.3581 27.7159 30.5807 27.6238 30.8127 27.6238C31.5215 27.6231 32.2213 27.4659 32.8622 27.1634C33.5031 26.8609 34.0693 26.4206 34.5204 25.8739C34.9714 25.3273 35.2961 24.6877 35.4713 24.001C35.6465 23.3143 35.6679 22.5974 35.5339 21.9014C35.3999 21.2055 35.1139 20.5477 34.6962 19.9752C34.2786 19.4026 33.7396 18.9293 33.1178 18.5892C32.4961 18.2491 31.8068 18.0505 31.0994 18.0076C30.392 17.9647 29.6839 18.0786 29.0256 18.3411C28.9182 18.3875 28.8027 18.4119 28.6857 18.4129C28.5688 18.4139 28.4529 18.3914 28.3448 18.3469C28.2367 18.3023 28.1386 18.2365 28.0564 18.1534C27.9741 18.0702 27.9094 17.9715 27.8659 17.8629C27.8225 17.7543 27.8013 17.6382 27.8035 17.5212C27.8057 17.4043 27.8314 17.2891 27.8789 17.1822C27.9265 17.0754 27.9949 16.9792 28.0803 16.8992C28.1656 16.8193 28.2661 16.7573 28.3759 16.7169C29.8825 16.116 31.5582 16.0944 33.0798 16.6562C34.6014 17.218 35.861 18.3233 36.6157 19.7591C37.3704 21.1948 37.5667 22.8591 37.1667 24.431C36.7666 26.0029 35.7986 27.371 34.4495 28.2713C36.5708 29.0531 38.3825 30.4999 39.6141 32.3958C39.7409 32.5901 39.7852 32.8269 39.7374 33.0539C39.6897 33.281 39.5536 33.4798 39.3593 33.6066Z"
            fill="black"
          />
        </svg>
      ),
      title: "Counseling Services",
      description:
        "Comprehensive counseling for individuals, couples, families, and groups to address various life challenges.",
    },
    {
      icon: (
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="50" height="50" rx="25" fill="white" />
          <path
            d="M25 13.625C22.7502 13.625 20.551 14.2921 18.6804 15.542C16.8098 16.7919 15.3518 18.5685 14.4909 20.647C13.6299 22.7255 13.4047 25.0126 13.8436 27.2192C14.2825 29.4257 15.3658 31.4525 16.9567 33.0433C18.5475 34.6342 20.5743 35.7175 22.7809 36.1564C24.9874 36.5953 27.2745 36.3701 29.353 35.5091C31.4315 34.6482 33.2081 33.1902 34.458 31.3196C35.7079 29.449 36.375 27.2498 36.375 25C36.3718 21.9841 35.1724 19.0927 33.0398 16.9602C30.9073 14.8276 28.0159 13.6282 25 13.625ZM25 34.625C23.0964 34.625 21.2355 34.0605 19.6526 33.0029C18.0698 31.9453 16.8362 30.4421 16.1077 28.6833C15.3792 26.9246 15.1886 24.9893 15.5599 23.1223C15.9313 21.2552 16.848 19.5402 18.1941 18.1941C19.5402 16.848 21.2552 15.9313 23.1223 15.5599C24.9893 15.1886 26.9246 15.3792 28.6833 16.1077C30.4421 16.8362 31.9453 18.0698 33.0029 19.6526C34.0605 21.2355 34.625 23.0964 34.625 25C34.6221 27.5518 33.6071 29.9983 31.8027 31.8027C29.9983 33.6071 27.5518 34.6221 25 34.625ZM29.8584 18.9669L22.8584 22.4669C22.6892 22.5519 22.5519 22.6892 22.4669 22.8584L18.9669 29.8584C18.9001 29.9919 18.8686 30.1402 18.8753 30.2893C18.882 30.4384 18.9267 30.5832 19.0051 30.7102C19.0836 30.8371 19.1933 30.9418 19.3236 31.0144C19.454 31.087 19.6008 31.1251 19.75 31.125C19.8858 31.1248 20.0198 31.0934 20.1416 31.0331L27.1416 27.5331C27.3108 27.4481 27.4481 27.3108 27.5331 27.1416L31.0331 20.1416C31.1157 19.9772 31.1444 19.791 31.1151 19.6094C31.0858 19.4278 31 19.2601 30.87 19.13C30.7399 19 30.5722 18.9142 30.3906 18.8849C30.209 18.8556 30.0228 18.8843 29.8584 18.9669ZM26.0938 26.0937L21.7067 28.2933L23.9063 23.9062L28.2977 21.7111L26.0938 26.0937Z"
            fill="black"
          />
        </svg>
      ),
      title: "Meditation Programs",
      description:
        "Guided meditation, mindfulness training, and wellness retreats to cultivate inner peace and resilience.",
    },
  ];

  const handleNavigate = () => {
    window.location.href = "/book_appointment";
  };

  // const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote:
        "The mindfulness sessions transformed my approach to stress management. I feel more centered and confident in both my personal and professional life.",
      name: "Sarah Johnson",
      title: "Marketing Professional",
      avatar: "SJ",
    },
    {
      id: 2,
      quote:
        "Through CBT sessions, I learned to challenge negative thought patterns. The techniques I've gained have been life-changing for managing my anxiety.",
      name: "Michael Chen",
      title: "Software Engineer",
      avatar: "MC",
    },
    {
      id: 3,
      quote:
        "The therapeutic approach was exactly what I needed. I've developed better coping strategies and feel more resilient in facing daily challenges.",
      name: "Emily Rodriguez",
      title: "Teacher",
      avatar: "ER",
    },
    {
      id: 4,
      quote:
        "DBT skills have revolutionized how I handle emotions and relationships. I'm grateful for the compassionate and professional guidance I received.",
      name: "David Thompson",
      title: "Healthcare Worker",
      avatar: "DT",
    },
    {
      id: 5,
      quote:
        "The safe space created during our sessions allowed me to process trauma and develop healthy boundaries. My healing journey has been remarkable.",
      name: "Lisa Park",
      title: "Artist",
      avatar: "LP",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div>
      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-20 lg:gap-0 mb-2">
          <div className="relative flex items-center justify-center overflow-hidden animate-slide-in-left">
            <div className=" flex flex-col gap-4 lg:gap-8 text-left overflow-hidden animate-slide-in-left">
              <div className="flex items-center gap-2 p-2 bg-[#B0D8D21A] w-fit rounded-[16px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M15.4362 10.0828L11.4065 8.59375L9.92212 4.56094C9.83422 4.32213 9.67518 4.11604 9.46647 3.97046C9.25775 3.82488 9.0094 3.74682 8.75493 3.74682C8.50046 3.74682 8.25212 3.82488 8.0434 3.97046C7.83469 4.11604 7.67565 4.32213 7.58775 4.56094L6.094 8.59375L2.06118 10.0781C1.82238 10.166 1.61628 10.3251 1.4707 10.5338C1.32513 10.7425 1.24707 10.9908 1.24707 11.2453C1.24707 11.4998 1.32513 11.7481 1.4707 11.9568C1.61628 12.1656 1.82238 12.3246 2.06118 12.4125L6.094 13.9063L7.57837 17.9391C7.66628 18.1779 7.82531 18.384 8.03403 18.5295C8.24274 18.6751 8.49109 18.7532 8.74556 18.7532C9.00003 18.7532 9.24838 18.6751 9.45709 18.5295C9.66581 18.384 9.82484 18.1779 9.91275 17.9391L11.4065 13.9063L15.4393 12.4219C15.6781 12.334 15.8842 12.1749 16.0298 11.9662C16.1754 11.7575 16.2534 11.5092 16.2534 11.2547C16.2534 11.0002 16.1754 10.7519 16.0298 10.5432C15.8842 10.3344 15.6781 10.1754 15.4393 10.0875L15.4362 10.0828ZM10.7034 12.8297C10.6185 12.861 10.5415 12.9103 10.4776 12.9742C10.4136 13.0381 10.3643 13.1152 10.3331 13.2L8.75025 17.4883L7.17056 13.2031C7.13934 13.1174 7.08974 13.0395 7.02522 12.975C6.96071 12.9105 6.88285 12.8609 6.79712 12.8297L2.51197 11.25L6.79712 9.67031C6.88285 9.6391 6.96071 9.58949 7.02522 9.52498C7.08974 9.46046 7.13934 9.38261 7.17056 9.29688L8.75025 5.01172L10.3299 9.29688C10.3612 9.38171 10.4105 9.45876 10.4744 9.52269C10.5384 9.58662 10.6154 9.63592 10.7002 9.66719L14.9885 11.25L10.7034 12.8297ZM11.2502 3.125C11.2502 2.95924 11.3161 2.80027 11.4333 2.68306C11.5505 2.56585 11.7095 2.5 11.8752 2.5H13.1252V1.25C13.1252 1.08424 13.1911 0.925269 13.3083 0.808058C13.4255 0.690848 13.5845 0.625 13.7502 0.625C13.916 0.625 14.075 0.690848 14.1922 0.808058C14.3094 0.925269 14.3752 1.08424 14.3752 1.25V2.5H15.6252C15.791 2.5 15.95 2.56585 16.0672 2.68306C16.1844 2.80027 16.2502 2.95924 16.2502 3.125C16.2502 3.29076 16.1844 3.44973 16.0672 3.56694C15.95 3.68415 15.791 3.75 15.6252 3.75H14.3752V5C14.3752 5.16576 14.3094 5.32473 14.1922 5.44194C14.075 5.55915 13.916 5.625 13.7502 5.625C13.5845 5.625 13.4255 5.55915 13.3083 5.44194C13.1911 5.32473 13.1252 5.16576 13.1252 5V3.75H11.8752C11.7095 3.75 11.5505 3.68415 11.4333 3.56694C11.3161 3.44973 11.2502 3.29076 11.2502 3.125ZM19.3752 6.875C19.3752 7.04076 19.3094 7.19973 19.1922 7.31694C19.075 7.43415 18.916 7.5 18.7502 7.5H18.1252V8.125C18.1252 8.29076 18.0594 8.44973 17.9422 8.56694C17.825 8.68415 17.666 8.75 17.5002 8.75C17.3345 8.75 17.1755 8.68415 17.0583 8.56694C16.9411 8.44973 16.8752 8.29076 16.8752 8.125V7.5H16.2502C16.0845 7.5 15.9255 7.43415 15.8083 7.31694C15.6911 7.19973 15.6252 7.04076 15.6252 6.875C15.6252 6.70924 15.6911 6.55027 15.8083 6.43306C15.9255 6.31585 16.0845 6.25 16.2502 6.25H16.8752V5.625C16.8752 5.45924 16.9411 5.30027 17.0583 5.18306C17.1755 5.06585 17.3345 5 17.5002 5C17.666 5 17.825 5.06585 17.9422 5.18306C18.0594 5.30027 18.1252 5.45924 18.1252 5.625V6.25H18.7502C18.916 6.25 19.075 6.31585 19.1922 6.43306C19.3094 6.55027 19.3752 6.70924 19.3752 6.875Z"
                    fill="#43A3A3"
                  />
                </svg>
                <p className="text-[12px] md:text-[14px] text-left max-w-[530px] text-[#43A3A3]">
                  Transforming Lives Through Integrated and Holistic Healing.
                </p>
              </div>
              <h2 className="text-4xl md:text-[70px] font-[Outfit]">
                Alchemy
              </h2>
              <h3 className="text-[1.5rem] md:text-[2rem] font-[Outfit]">Psychotherapy, Counselling and Mediation Services</h3>
              <p className="text-[1rem] max-w-[440px] text-wrap mb-4 font-[DM_Sans]">
                Discover your path to healing and growth through personalized
                therapy, mindful counseling, and transformative meditation
                practices.
              </p>
              <button className="px-6 py-3 flex items-center justify-center text-white shadow-lg hover:scale-102 transition-transform duration-300 bg-[linear-gradient(90deg,#D6EBE2_0%,#B0D8D2_25.96%,#43A3A3_100%)] max-w-full md:max-w-[220px] rounded-full">
                Book Your Session
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center animate-slide-in-right">
            <div className="w-[8.5rem] h-[9rem] overflow-hidden rounded-xl absolute right-[-2vw] top-[-2rem] z-[-1]">
              <Image
                className="w-full h-full bg-[#D9D9D9] object-cover"
                src={green}
                alt="green"
              />
            </div>
            <Image
              className="w-[36rem] h-[25rem] md:h-[35rem] bg-[#D9D9D9] rounded-xl object-cover"
              src="https://plus.unsplash.com/premium_photo-1673953509986-9b2bfe934ae5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xpbmljfGVufDB8fDB8fHww"
              alt="Clinic interior"
              width={600}
              height={400}
            />
            <div className="w-[5rem] h-[5rem] bg-[#505050] rounded-full overflow-hidden absolute bottom-[-2.2vw] left-[-2vw] z-[-1]">
              <Image
                className="w-full h-full bg-[#D9D9D9] object-cover"
                src={green}
                alt="green"
              />
            </div>
            <div className="w-[13rem] h-[15rem] lg:w-[17.5rem] lg:h-[20rem] bg-[#505050] rounded-xl absolute right-[-2vw] bottom-[-15vw] lg:bottom-[-3vw]"></div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 md:py-2 mt-[128px] min-h-[260px] rounded-tr-[32px] rounded-tl-[32px] lg:rounded-tr-[64px] lg:rounded-tl-[64px] rounded-bl-none rounded-br-none bg-[#D6EBE2] gap-14">
          <div className="flex flex-col lg:flex-row items-center justify-evenly w-full flex-wrap gap-8">
            {how_we_work.map((card, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div>
                  <div className="w-[50px] h-[50px] lg:w-[65px] lg:h-[65px] bg-[#43A3A3] rounded-full flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-regular text-[30px] lg:text-[45px] leading-none">
                    <HyperText
                      startOnView={true}
                      animateOnHover={true}
                    >{`${card.title}`}</HyperText>
                  </h3>
                  <p className="text-[20px]">{card?.dis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 p-4">
        {services.map((card, index) => (
          <div
            key={index}
            className={`flex justify-between space-x-4 lg:p-4 rounded-[16px] p-4 transition-all duration-300 ${
              hoveredIndex === index ? "transform -translate-y-1 z-10" : ""
            }`}
          >
            <div>
              <p
                className={`text-[1.5rem] mb-4 transition-all duration-300 ease-in-out ${
                  hoveredIndex === index ? "text-[1.8rem]" : ""
                }`}
              >
                {card.data}
              </p>
              <p className="text-[1rem] max-w-[500px]">{card.dis}</p>
            </div>

            <button
              className="group h-12 w-12 lg:h-20 lg:w-20 rounded-full hover:bg-blue-600 border border-[#0582D0] flex items-center justify-center transition-colors duration-300"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="none"
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 group-hover:fill-white fill-blue-500"
              >
                <g id="ArrowUpRight">
                  <path
                    id="Vector"
                    d="M25.0006 8V21C25.0006 21.2652 24.8952 21.5196 24.7077 21.7071C24.5201 21.8946 24.2658 22 24.0006 22C23.7353 22 23.481 21.8946 23.2934 21.7071C23.1059 21.5196 23.0006 21.2652 23.0006 21V10.4137L8.70806 24.7075C8.52042 24.8951 8.26592 25.0006 8.00056 25.0006C7.73519 25.0006 7.4807 24.8951 7.29306 24.7075C7.10542 24.5199 7 24.2654 7 24C7 23.7346 7.10542 23.4801 7.29306 23.2925L21.5868 9H11.0006C10.7353 9 10.481 8.89464 10.2934 8.70711C10.1059 8.51957 10.0006 8.26522 10.0006 8C10.0006 7.73478 10.1059 7.48043 10.2934 7.29289C10.481 7.10536 10.7353 7 11.0006 7H24.0006C24.2658 7 24.5201 7.10536 24.7077 7.29289C24.8952 7.48043 25.0006 7.73478 25.0006 8Z"
                  />
                </g>
              </svg>
            </button>
          </div>
        ))}
      </div> */}

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16 mt-[100px]">
        <p className="text-[32px] mb-[20px] text-[#43A3A3]">About Us</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2.5fr] gap-10 place-content-center">
          <div>
            <Image
              src="https://cdn.pixabay.com/photo/2021/10/11/13/28/hospital-6700680_1280.png"
              alt="About us"
              className="w-[499px] h-[350px] rounded-xl"
              width={499}
              height={350}
            />
          </div>

          <div className="flex flex-col item-center justify-center gap-4">
            <TextAnimate animation="blurIn" className="text-base lg:text-2xl">
              At Alchemy, we believe that true healing is a transformative
              process that touches every aspect of your being
            </TextAnimate>
            .
            <button className="px-6 py-3 flex items-center justify-center text-white hover:scale-102 transition-transform duration-300 bg-[linear-gradient(90deg,#D6EBE2_0%,#B0D8D2_25.96%,#43A3A3_100%)] max-w-full md:max-w-[120px] rounded-full">
              Explore
            </button>
          </div>
        </div>
      </section>

      <section className="mt-[100px] max-w-screen-2xl mx-auto px-4 lg:px-16 py-12 lg:py-20">
        <h2 className="text-[32px] text-[#43A3A3] text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 h-full">
          {our_services.map((service, index) => {
            return (
              <Magnet padding={50} disabled={false} magnetStrength={5} key={index}>
                <div
                  className="bg-gradient-to-b from-[#D6EBE2] to-[#F9FCFB] relative group rounded-2xl p-8 h-full"
                >
                  <div className="mb-16">{service.icon}</div>

                  <div className="absolute top-6 right-6">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-teal-600"
                    >
                      <path d="M7 7h10v10" />
                      <path d="m7 17 10-10" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Magnet>
            );
          })}
        </div>
      </section>

      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-[32px] font-medium text-teal-600 mb-3">
            Client Testimonials
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Real stories of transformation and healing from our community
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center relative">
          {/* Light Gray Card */}
          <div className="bg-gray-200 rounded-3xl w-full h-[280px] md:h-[320px]"></div>

          {/* Dark Gray Testimonial Card */}
          <div className="absolute top-1/2 md:left-1/2 transform md:-translate-x-1/4 -translate-y-1/2 bg-slate-700 rounded-2xl p-6 md:p-8 text-white shadow-xl min-h-[240px] md:min-h-[280px] w-[90%] md:w-[70%]">
            {/* Quote */}
            <p className="text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </p>

            {/* Author Info */}
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-300 rounded-full flex items-center justify-center text-slate-700 font-semibold text-sm md:text-base mr-4">
                {currentTestimonial.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-base md:text-lg">
                  {currentTestimonial.name}
                </h4>
                <p className="text-gray-300 text-sm">
                  {currentTestimonial.title}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 flex flex-col gap-2">
              <button
                onClick={handlePrevious}
                className="w-10 h-10 md:w-12 md:h-12 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 md:w-12 md:h-12 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        {/* <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-teal-600" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div> */}
      </div>

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-[100px] p-4">
          <div>
            <p className="text-[32px] mb-[4px] text-[#43A3A3]">
              Frequently asked questions.
            </p>
            <p className="text-[1rem] text-gray-500">
              Cant find an answer ? contact us at -{" "}
              <span className="text-gray-700">0490 2082731</span>{" "}
            </p>
          </div>

          <div>
            {accordionData?.map((val, index) => {
              return (
                <Accordion
                  accIndex={index}
                  key={index}
                  data={val}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16">
        <div
          className="mt-[100px] bg-gradient-to-r from-[#D6EBE2] to-[#43A3A3] h-[16rem] m-auto rounded-2xl flex flex-col items-center justify-center p-4 gap-4"
          onClick={handleNavigate}
        >
          <TextAnimate className="text-2xl lg:text-4xl text-center">
            Ready to Begin Your Healing Journey?
          </TextAnimate>

          <p className="text-[16px]">
            Schedule your initial consultation and take the first step toward
            transformation
          </p>
          <button className="bg-white px-6 py-2 rounded-full text-[#43A3A3]">
            Schedule a consultation
          </button>
        </div>
      </section>
    </div>
  );
}

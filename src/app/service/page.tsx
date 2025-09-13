"use client";
import Image from "next/image";

export default function servicePage() {
  const services = [
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
            d="M30.2501 36.3739C30.2501 36.6059 30.158 36.8285 29.9939 36.9926C29.8298 37.1567 29.6072 37.2489 29.3751 37.2489H20.6251C20.3931 37.2489 20.1705 37.1567 20.0064 36.9926C19.8423 36.8285 19.7501 36.6059 19.7501 36.3739C19.7501 36.1418 19.8423 35.9193 20.0064 35.7552C20.1705 35.5911 20.3931 35.4989 20.6251 35.4989H29.3751C29.6072 35.4989 29.8298 35.5911 29.9939 35.7552C30.158 35.9193 30.2501 36.1418 30.2501 36.3739ZM34.6251 22.3739C34.6289 23.8326 34.2994 25.2728 33.6617 26.5847C33.0241 27.8966 32.0951 29.0455 30.9458 29.9437C30.7309 30.1085 30.5565 30.3201 30.4359 30.5626C30.3153 30.8051 30.2518 31.0719 30.2501 31.3426V31.9989C30.2501 32.463 30.0658 32.9081 29.7376 33.2363C29.4094 33.5645 28.9643 33.7489 28.5001 33.7489H21.5001C21.036 33.7489 20.5909 33.5645 20.2627 33.2363C19.9345 32.9081 19.7501 32.463 19.7501 31.9989V31.3426C19.75 31.0751 19.6884 30.8112 19.5703 30.5711C19.4522 30.3311 19.2806 30.1213 19.0687 29.9579C17.9224 29.0652 16.9942 27.9234 16.3543 26.6189C15.7144 25.3145 15.3795 23.8815 15.3751 22.4286C15.3467 17.2147 19.5598 12.8747 24.7683 12.7489C26.0516 12.718 27.3282 12.9441 28.5228 13.4139C29.7175 13.8837 30.8061 14.5878 31.7246 15.4847C32.643 16.3815 33.3728 17.4531 33.8709 18.6362C34.3691 19.8193 34.6255 21.0902 34.6251 22.3739ZM32.8751 22.3739C32.8754 21.3235 32.6656 20.2837 32.258 19.3156C31.8504 18.3476 31.2533 17.4708 30.5017 16.737C29.7502 16.0032 28.8595 15.4272 27.8819 15.0428C26.9044 14.6584 25.8599 14.4735 24.8098 14.4989C20.5442 14.5995 17.1022 18.1509 17.1251 22.4165C17.1291 23.605 17.4033 24.777 17.927 25.8439C18.4508 26.9107 19.2104 27.8444 20.1483 28.5744C20.5698 28.9021 20.9108 29.3219 21.1452 29.8018C21.3795 30.2816 21.5009 30.8087 21.5001 31.3426V31.9989H24.1251V27.1109L20.8811 23.8679C20.7169 23.7038 20.6247 23.4811 20.6247 23.2489C20.6247 23.0167 20.7169 22.794 20.8811 22.6298C21.0453 22.4656 21.2679 22.3734 21.5001 22.3734C21.7323 22.3734 21.955 22.4656 22.1192 22.6298L25.0001 25.5119L27.8811 22.6298C27.9624 22.5485 28.0589 22.484 28.1651 22.44C28.2713 22.396 28.3852 22.3734 28.5001 22.3734C28.6151 22.3734 28.729 22.396 28.8352 22.44C28.9414 22.484 29.0379 22.5485 29.1192 22.6298C29.2005 22.7111 29.265 22.8076 29.309 22.9139C29.353 23.0201 29.3756 23.1339 29.3756 23.2489C29.3756 23.3639 29.353 23.4777 29.309 23.5839C29.265 23.6901 29.2005 23.7867 29.1192 23.8679L25.8751 27.1109V31.9989H28.5001V31.3426C28.5011 30.8071 28.6245 30.2789 28.8609 29.7983C29.0973 29.3178 29.4404 28.8976 29.864 28.57C30.8048 27.8348 31.5651 26.8944 32.0869 25.8205C32.6088 24.7467 32.8784 23.5678 32.8751 22.3739Z"
            fill="black"
          />
        </svg>
      ),
      title: "Personal Growth",
      description:
        "Our personal growth programs combine therapeutic insights with life coaching strategies to help you identify your values, set meaningful goals, and create the life you envision. Discover your strengths and overcome limiting beliefs.",
      includes: [
        "Life Coaching",
        "Goal Setting & Achievement",
        "Self-Discovery Sessions",
        "Confidence Building",
        "Career Guidance",
        "Personal Development",
      ],
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
            d="M33.75 15.375H16.25C15.7859 15.375 15.3408 15.5594 15.0126 15.8876C14.6844 16.2158 14.5 16.6609 14.5 17.125V23.25C14.5 29.0162 17.2912 32.5108 19.633 34.427C22.1552 36.4898 24.6642 37.1909 24.7736 37.2194C24.924 37.2603 25.0826 37.2603 25.233 37.2194C25.3423 37.1909 27.8481 36.4898 30.3736 34.427C32.7087 32.5108 35.5 29.0162 35.5 23.25V17.125C35.5 16.6609 35.3156 16.2158 34.9874 15.8876C34.6592 15.5594 34.2141 15.375 33.75 15.375ZM33.75 23.25C33.75 27.3045 32.2559 30.5956 29.3094 33.0303C28.0267 34.0866 26.5679 34.9085 25 35.4584C23.4526 34.9181 22.0118 34.1107 20.7431 33.073C17.7616 30.6339 16.25 27.3297 16.25 23.25V17.125H33.75V23.25Z"
            fill="black"
          />
        </svg>
      ),
      title: "Addiction Support",
      description:
        "Our addiction support services provide evidence-based treatment for substance abuse and behavioral addictions. We offer personalized recovery plans, relapse prevention strategies, and ongoing support for sustainable recovery.",
      includes: [
        "Addiction Assessment",
        "Recovery Planning",
        "Relapse Prevention",
        "Support Groups",
        "Family Support",
        "Ongoing Monitoring",
      ],
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
      title: "Meditation & Mindfulness",
      description:
        "Learn the transformative power of mindfulness through our structured meditation programs. From beginner-friendly sessions to advanced retreats, discover how to cultivate presence, reduce stress, and enhance emotional well-being.",
      includes: [
        "Guided Meditation Sessions",
        "Mindfulness Training",
        "Stress Reduction Programs",
        "Wellness Retreats",
        "Breathwork Techniques",
        "Daily Practice Support",
      ],
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
            d="M30.4688 15.375C28.2102 15.375 26.2327 16.3462 25 17.988C23.7673 16.3462 21.7898 15.375 19.5312 15.375C17.7334 15.377 16.0097 16.0921 14.7384 17.3634C13.4671 18.6347 12.752 20.3584 12.75 22.1562C12.75 29.8125 24.102 36.0097 24.5855 36.2656C24.7129 36.3342 24.8553 36.37 25 36.37C25.1447 36.37 25.2871 36.3342 25.4145 36.2656C25.898 36.0097 37.25 29.8125 37.25 22.1562C37.248 20.3584 36.5329 18.6347 35.2616 17.3634C33.9903 16.0921 32.2666 15.377 30.4688 15.375ZM25 34.4937C23.0028 33.33 14.5 28.0286 14.5 22.1562C14.5017 20.8224 15.0324 19.5437 15.9755 18.6005C16.9187 17.6574 18.1974 17.1267 19.5312 17.125C21.6586 17.125 23.4447 18.2581 24.1906 20.0781C24.2565 20.2386 24.3687 20.3759 24.5128 20.4725C24.6569 20.5691 24.8265 20.6207 25 20.6207C25.1735 20.6207 25.3431 20.5691 25.4872 20.4725C25.6313 20.3759 25.7435 20.2386 25.8094 20.0781C26.5553 18.2548 28.3414 17.125 30.4688 17.125C31.8026 17.1267 33.0813 17.6574 34.0245 18.6005C34.9676 19.5437 35.4983 20.8224 35.5 22.1562C35.5 28.0198 26.995 33.3289 25 34.4937Z"
            fill="black"
          />
        </svg>
      ),
      title: "Healing & Recovery",
      description:
        "Our healing and recovery programs provide compassionate support for those experiencing grief, trauma, or emotional distress. We use trauma-informed approaches to help you process difficult experiences and rebuild resilience.",
      includes: [
        "Grief Counseling",
        "Trauma Recovery",
        "PTSD Support",
        "Emotional Healing",
        "Loss & Bereavement",
        "Crisis Intervention",
      ],
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
            d="M38.1248 24.5617C38.1237 23.4027 37.7943 22.2677 37.1749 21.2881C36.5555 20.3085 35.6714 19.5243 34.6248 19.0262V18.8742C34.6238 17.7468 34.2599 16.6496 33.5869 15.7451C32.914 14.8406 31.9677 14.1767 30.8881 13.8517C29.8086 13.5268 28.6531 13.5579 27.5926 13.9407C26.5321 14.3234 25.623 15.0373 24.9998 15.9769C24.3766 15.0373 23.4675 14.3234 22.4071 13.9407C21.3466 13.5579 20.1911 13.5268 19.1115 13.8517C18.032 14.1767 17.0857 14.8406 16.4127 15.7451C15.7398 16.6496 15.3759 17.7468 15.3748 18.8742V19.0262C14.3274 19.5229 13.4424 20.3066 12.8227 21.2863C12.203 22.266 11.874 23.4014 11.874 24.5606C11.874 25.7198 12.203 26.8553 12.8227 27.8349C13.4424 28.8146 14.3274 29.5983 15.3748 30.095V30.2492C15.3759 31.3766 15.7398 32.4738 16.4127 33.3783C17.0857 34.2828 18.032 34.9467 19.1115 35.2717C20.1911 35.5967 21.3466 35.5655 22.4071 35.1827C23.4675 34.8 24.3766 34.0861 24.9998 33.1466C25.623 34.0861 26.5321 34.8 27.5926 35.1827C28.6531 35.5655 29.8086 35.5967 30.8881 35.2717C31.9677 34.9467 32.914 34.2828 33.5869 33.3783C34.2599 32.4738 34.6238 31.3766 34.6248 30.2492V30.095C35.6712 29.5973 36.5553 28.8135 37.1747 27.8343C37.7941 26.855 38.1235 25.7204 38.1248 24.5617ZM20.6248 33.7492C19.7618 33.7491 18.9293 33.4301 18.2871 32.8535C17.6449 32.277 17.2384 31.4835 17.1456 30.6255C17.4286 30.6658 17.714 30.6863 17.9998 30.6867H18.8748C19.1069 30.6867 19.3295 30.5945 19.4936 30.4304C19.6577 30.2663 19.7498 30.0438 19.7498 29.8117C19.7498 29.5796 19.6577 29.3571 19.4936 29.193C19.3295 29.0289 19.1069 28.9367 18.8748 28.9367H17.9998C16.9669 28.9379 15.9668 28.5736 15.1766 27.9082C14.3865 27.2428 13.8573 26.3193 13.6827 25.3012C13.5081 24.2831 13.6994 23.236 14.2227 22.3454C14.746 21.4548 15.5675 20.778 16.5419 20.435C16.7124 20.3746 16.86 20.2629 16.9643 20.1152C17.0687 19.9676 17.1248 19.7912 17.1248 19.6103V18.8742C17.1248 17.9459 17.4936 17.0557 18.15 16.3993C18.8063 15.743 19.6966 15.3742 20.6248 15.3742C21.5531 15.3742 22.4433 15.743 23.0997 16.3993C23.7561 17.0557 24.1248 17.9459 24.1248 18.8742V26.3401C23.164 25.476 21.9171 24.9983 20.6248 24.9992C20.3928 24.9992 20.1702 25.0914 20.0061 25.2555C19.842 25.4196 19.7498 25.6421 19.7498 25.8742C19.7498 26.1063 19.842 26.3288 20.0061 26.4929C20.1702 26.657 20.3928 26.7492 20.6248 26.7492C21.5531 26.7492 22.4433 27.118 23.0997 27.7743C23.7561 28.4307 24.1248 29.3209 24.1248 30.2492C24.1248 31.1775 23.7561 32.0677 23.0997 32.7241C22.4433 33.3805 21.5531 33.7492 20.6248 33.7492ZM31.9998 28.9367H31.1248C30.8928 28.9367 30.6702 29.0289 30.5061 29.193C30.342 29.3571 30.2498 29.5796 30.2498 29.8117C30.2498 30.0438 30.342 30.2663 30.5061 30.4304C30.6702 30.5945 30.8928 30.6867 31.1248 30.6867H31.9998C32.2857 30.6863 32.5711 30.6658 32.8541 30.6255C32.7814 31.2977 32.5155 31.9346 32.0885 32.459C31.6616 32.9834 31.0919 33.3729 30.4483 33.5804C29.8047 33.7879 29.1148 33.8045 28.462 33.6282C27.8092 33.4519 27.2214 33.0903 26.7697 32.5871C26.318 32.0839 26.0217 31.4606 25.9168 30.7925C25.8118 30.1245 25.9026 29.4404 26.1782 28.8229C26.4537 28.2054 26.9023 27.6809 27.4696 27.3129C28.0369 26.9449 28.6986 26.7491 29.3748 26.7492C29.6069 26.7492 29.8295 26.657 29.9936 26.4929C30.1577 26.3288 30.2498 26.1063 30.2498 25.8742C30.2498 25.6421 30.1577 25.4196 29.9936 25.2555C29.8295 25.0914 29.6069 24.9992 29.3748 24.9992C28.0825 24.9983 26.8357 25.476 25.8748 26.3401V18.8742C25.8748 17.9459 26.2436 17.0557 26.9 16.3993C27.5563 15.743 28.4466 15.3742 29.3748 15.3742C30.3031 15.3742 31.1933 15.743 31.8497 16.3993C32.5061 17.0557 32.8748 17.9459 32.8748 18.8742V19.6103C32.8749 19.7912 32.9309 19.9676 33.0353 20.1152C33.1397 20.2629 33.2873 20.3746 33.4578 20.435C34.4322 20.778 35.2537 21.4548 35.777 22.3454C36.3003 23.236 36.4916 24.2831 36.317 25.3012C36.1424 26.3193 35.6132 27.2428 34.8231 27.9082C34.0329 28.5736 33.0328 28.9379 31.9998 28.9367ZM33.7498 23.2492C33.7498 23.4813 33.6577 23.7038 33.4936 23.8679C33.3295 24.032 33.1069 24.1242 32.8748 24.1242H32.4373C31.3931 24.1242 30.3915 23.7094 29.6531 22.9709C28.9147 22.2325 28.4998 21.231 28.4998 20.1867V19.7492C28.4998 19.5171 28.592 19.2946 28.7561 19.1305C28.9202 18.9664 29.1428 18.8742 29.3748 18.8742C29.6069 18.8742 29.8295 18.9664 29.9936 19.1305C30.1577 19.2946 30.2498 19.5171 30.2498 19.7492V20.1867C30.2498 20.7669 30.4803 21.3233 30.8905 21.7335C31.3008 22.1437 31.8572 22.3742 32.4373 22.3742H32.8748C33.1069 22.3742 33.3295 22.4664 33.4936 22.6305C33.6577 22.7946 33.7498 23.0171 33.7498 23.2492ZM17.5623 24.1242H17.1248C16.8928 24.1242 16.6702 24.032 16.5061 23.8679C16.342 23.7038 16.2498 23.4813 16.2498 23.2492C16.2498 23.0171 16.342 22.7946 16.5061 22.6305C16.6702 22.4664 16.8928 22.3742 17.1248 22.3742H17.5623C18.1425 22.3742 18.6989 22.1437 19.1091 21.7335C19.5194 21.3233 19.7498 20.7669 19.7498 20.1867V19.7492C19.7498 19.5171 19.842 19.2946 20.0061 19.1305C20.1702 18.9664 20.3928 18.8742 20.6248 18.8742C20.8569 18.8742 21.0795 18.9664 21.2436 19.1305C21.4077 19.2946 21.4998 19.5171 21.4998 19.7492V20.1867C21.4998 21.231 21.085 22.2325 20.3466 22.9709C19.6082 23.7094 18.6066 24.1242 17.5623 24.1242Z"
            fill="black"
          />
        </svg>
      ),
      title: "Psychotherapy",
      description:
        "Our psychotherapy services utilize proven therapeutic approaches including Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and mindfulness-based interventions to help you overcome mental health challenges and develop healthy coping strategies.",
      includes: [
        "Cognitive Behavioral Therapy (CBT)",
        "Dialectical Behavior Therapy (DBT)",
        "Mindfulness-Based Therapy",
        "Trauma-Informed Care",
        "Depression & Anxiety Treatment",
        "Stress Management",
      ],
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
            d="M24.8245 28.2713C25.9972 27.4905 26.8875 26.3531 27.3638 25.0272C27.8401 23.7014 27.8771 22.2574 27.4693 20.9089C27.0614 19.5604 26.2305 18.3789 25.0992 17.5392C23.968 16.6995 22.5966 16.2461 21.1877 16.2461C19.7789 16.2461 18.4075 16.6995 17.2762 17.5392C16.145 18.3789 15.314 19.5604 14.9062 20.9089C14.4984 22.2574 14.5354 23.7014 15.0117 25.0272C15.488 26.3531 16.3783 27.4905 17.551 28.2713C15.4297 29.0531 13.618 30.4999 12.3863 32.3958C12.3216 32.492 12.2766 32.6001 12.2541 32.7139C12.2315 32.8276 12.2317 32.9447 12.2548 33.0583C12.2779 33.172 12.3233 33.2799 12.3884 33.3758C12.4536 33.4718 12.5372 33.5538 12.6343 33.6171C12.7314 33.6805 12.8402 33.7239 12.9542 33.7448C13.0683 33.7658 13.1853 33.7639 13.2986 33.7392C13.4119 33.7145 13.5192 33.6675 13.6142 33.601C13.7092 33.5345 13.79 33.4497 13.852 33.3517C14.6464 32.1298 15.7336 31.1256 17.0147 30.4305C18.2958 29.7354 19.7302 29.3713 21.1877 29.3713C22.6453 29.3713 24.0797 29.7354 25.3608 30.4305C26.6419 31.1256 27.729 32.1298 28.5235 33.3517C28.6519 33.5425 28.8501 33.675 29.0754 33.7208C29.3007 33.7665 29.535 33.7217 29.7275 33.5962C29.9201 33.4706 30.0555 33.2742 30.1044 33.0496C30.1534 32.825 30.112 32.5901 29.9891 32.3958C28.7575 30.4999 26.9458 29.0531 24.8245 28.2713ZM16.3752 22.8113C16.3752 21.8594 16.6575 20.929 17.1863 20.1376C17.7151 19.3462 18.4667 18.7293 19.3461 18.3651C20.2254 18.0008 21.1931 17.9055 22.1266 18.0912C23.0601 18.2769 23.9176 18.7353 24.5907 19.4083C25.2637 20.0813 25.7221 20.9388 25.9078 21.8724C26.0935 22.8059 25.9982 23.7736 25.6339 24.6529C25.2697 25.5323 24.6528 26.2839 23.8614 26.8127C23.07 27.3415 22.1396 27.6238 21.1877 27.6238C19.9118 27.6223 18.6886 27.1148 17.7864 26.2126C16.8842 25.3104 16.3767 24.0872 16.3752 22.8113ZM39.3593 33.6066C39.1649 33.7333 38.9282 33.7777 38.7011 33.7299C38.4741 33.6821 38.2753 33.5461 38.1485 33.3517C37.355 32.129 36.268 31.1245 34.9866 30.4296C33.7053 29.7348 32.2704 29.3718 30.8127 29.3738C30.5807 29.3738 30.3581 29.2816 30.194 29.1175C30.0299 28.9534 29.9377 28.7308 29.9377 28.4988C29.9377 28.2667 30.0299 28.0441 30.194 27.88C30.3581 27.7159 30.5807 27.6238 30.8127 27.6238C31.5215 27.6231 32.2213 27.4659 32.8622 27.1634C33.5031 26.8609 34.0693 26.4206 34.5204 25.8739C34.9714 25.3273 35.2961 24.6877 35.4713 24.001C35.6465 23.3143 35.6679 22.5974 35.5339 21.9014C35.3999 21.2055 35.1139 20.5477 34.6962 19.9752C34.2786 19.4026 33.7396 18.9293 33.1178 18.5892C32.4961 18.2491 31.8068 18.0505 31.0994 18.0076C30.392 17.9647 29.6839 18.0786 29.0256 18.3411C28.9182 18.3875 28.8027 18.4119 28.6857 18.4129C28.5688 18.4139 28.4529 18.3914 28.3448 18.3469C28.2367 18.3023 28.1386 18.2365 28.0564 18.1534C27.9741 18.0702 27.9094 17.9715 27.8659 17.8629C27.8225 17.7543 27.8013 17.6382 27.8035 17.5212C27.8057 17.4043 27.8314 17.2891 27.8789 17.1822C27.9265 17.0754 27.9949 16.9792 28.0803 16.8992C28.1656 16.8193 28.2661 16.7573 28.3759 16.7169C29.8825 16.116 31.5582 16.0944 33.0798 16.6562C34.6014 17.218 35.861 18.3233 36.6157 19.7591C37.3704 21.1948 37.5667 22.8591 37.1667 24.431C36.7666 26.0029 35.7986 27.371 34.4495 28.2713C36.5708 29.0531 38.3825 30.4999 39.6141 32.3958C39.7409 32.5901 39.7852 32.8269 39.7374 33.0539C39.6897 33.281 39.5536 33.4798 39.3593 33.6066Z"
            fill="black"
          />
        </svg>
      ),
      title: "Counseling Services",
      description:
        "Our counseling services address relationship dynamics, family conflicts, and communication patterns. Whether you're seeking individual growth, couples therapy, or family healing, we provide a safe space for transformation.",
      includes: [
        "Individual Counseling",
        "Couples Therapy",
        "Family Counseling",
        "Group Sessions",
        "Relationship Issues",
        "Communication Skills",
      ],
    },
  ];

  const blogs = [
    {
      id: 1,
      category: "Mental Health",
      categoryColor: "bg-teal-100 text-teal-600",
      title: "Understanding Anxiety: A Guide to Finding Peace",
      description:
        "Explore practical techniques for managing anxiety and building resilience in daily life.",
      date: "March 8, 2025",
      readTime: "5 min read",
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      category: "Trauma Recovery",
      categoryColor: "bg-blue-100 text-blue-600",
      title: "The Power of Mindfulness in Healing Trauma",
      description:
        "How mindfulness practices can support your journey through trauma recovery.",
      date: "March 8, 2025",
      readTime: "4 min read",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      category: "Relationships",
      categoryColor: "bg-green-100 text-green-600",
      title: "Building Healthy Relationships: Communication Tips",
      description:
        "Essential communication skills for creating deeper, more meaningful connections.",
      date: "March 8, 2025",
      readTime: "6 min read",
      image: "/api/placeholder/300/200",
    },
    {
      id: 4,
      category: "Mental Health",
      categoryColor: "bg-teal-100 text-teal-600",
      title: "Understanding Anxiety: A Guide to Finding Peace",
      description:
        "Explore practical techniques for managing anxiety and building resilience in daily life.",
      date: "March 8, 2025",
      readTime: "5 min read",
      image: "/api/placeholder/300/200",
    },
  ];
  return (
    <>
      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-8 lg:py-20">
        <div className="flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between items-center">
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-[24px]">
              {/* <p className="text-[18px] text-[#0582D0]">About us</p> */}
              <h2 className="text-4xl text-[#43A3A3]">Our Services.</h2>
              <p className="text-base lg:text-lg leading-[24px] max-w-[580px]">
                Comprehensive healing and wellness services designed to support
                your unique journey of growth, recovery, and transformation.
              </p>
              <div className="flex justify-start">
                <button className="px-6 py-3 flex items-center justify-center text-white hover:scale-102 transition-transform duration-300 bg-[linear-gradient(90deg,#D6EBE2_0%,#B0D8D2_25.96%,#43A3A3_100%)] rounded-full">
                  Explore
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center relative">
            <Image
              className="w-full lg:w-[38rem] h-[25rem] bg-[#D9D9D9] rounded-xl object-cover"
              src="https://cdn.pixabay.com/photo/2016/12/05/19/43/pill-1884775_1280.jpg"
              alt="Medical services"
              width={600}
              height={400}
            />
            <div className="w-[13rem] h-[13rem] lg:w-[23rem] lg:h-[15rem] bg-[#505050] rounded-xl absolute  right-[-4vw] bottom-[-8rem] lg:bottom-[-9rem]"></div>
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-4 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-[80px] lg:mt-[160px] gap-[36px]">
          {services && services.length > 0 ? (
            services.map((val, index) => (
              <div
                className="rounded-lg p-6 bg-gradient-to-b from-[#D6EBE2] to-[#F9FCFB]"
                key={index}
              >
                <div className="flex items-center mb-4">
                  <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center mr-3">
                    {val.icon}
                  </div>
                </div>

                <h2 className="text-[20px] font-semibold mb-3">{val.title}</h2>

                <p className="text-[16px] mb-6 leading-relaxed min-h-[95px]">
                  {val.description}
                </p>

                {val.includes && val.includes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[16px] font-medium text-[#43A3A3] mb-3">
                      What&apos;s Included :
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      {val.includes.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-[14px]"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                            // clip-path="url(#clip0_179_237)"
                            >
                              <path
                                d="M12.7172 5.83272C12.9836 7.14014 12.7937 8.49938 12.1793 9.68376C11.5648 10.8681 10.5629 11.8061 9.34057 12.3412C8.11827 12.8762 6.74947 12.9761 5.46244 12.6241C4.17542 12.2721 3.04796 11.4895 2.2681 10.4069C1.48823 9.32423 1.10309 8.00694 1.17691 6.67469C1.25072 5.34245 1.77903 4.07577 2.67373 3.0859C3.56843 2.09603 4.77544 1.4428 6.09347 1.23515C7.41151 1.02749 8.76089 1.27797 9.9166 1.9448M5.24994 6.41605L6.99994 8.16605L12.8333 2.33272"
                                stroke="#43A3A3"
                                // stroke-width="1.25"
                                // stroke-linecap="round"
                                // stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_179_237">
                                <rect width="14" height="14" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-[170px] bg-gradient-to-r from-[#D6EBE2] via-[#B0D8D2] to-[#43A3A3] text-white font-medium py-3 px-4 rounded-full transition-colors duration-200">
                  Book Session
                </button>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </section>

      <div className="bg-[#F9FCFB] py-16 mt-[60px] mb-[60px] lg:mt-[120px] lg:mb-[120px]">
        <div className="text-center">
          <h2 className="text-[32px] text-[#43A3A3]">Our Process</h2>
          <p className="text-[16px]">
            How we guide you through your healing journey
          </p>
        </div>

        <div className="w-full max-w-8xl mx-auto p-4 text-center mt-[60px]">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-[#B0D8D280] border-2 border-[#43A3A3] rounded-full flex items-center justify-center text-teal-700 font-bold text-xl mb-4">
                  1
                </div>

                <div className="hidden lg:block absolute top-[6rem] left-[5.5rem] rotate-[20deg] w-[14rem] h-1 border-t border-black border-dashed"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Initial Consultation</h3>
              <p className="text-sm text-gray-600 max-w-[288px]">
                We begin with a comprehensive assessment to understand your
                unique needs and goals.
              </p>
            </div>

            <div className="flex flex-col-reverse lg:flex-col items-center text-center">
             <div>
             <h3 className="text-xl font-bold mb-2">Personalized Plan</h3>
              <p className="text-sm text-gray-600 max-w-[288px]">
                Together, we create a tailored treatment plan that aligns with
                your objectives and preferences.
              </p>
             </div>
              <div className="relative">
                <div className="w-24 h-24 bg-[#B0D8D280] border-2 border-[#43A3A3] rounded-full flex items-center justify-center text-teal-700 font-bold text-xl mt-4">
                  2
                </div>

                <div className="hidden lg:block absolute top-[1rem] left-[5.5rem] rotate-[-20deg] w-[14rem] h-1 border-t border-black border-dashed"></div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-[#B0D8D280] border-2 border-[#43A3A3] rounded-full flex items-center justify-center text-teal-700 font-bold text-xl mb-4">
                  3
                </div>

                <div className="hidden lg:block absolute top-[6rem] left-[5.5rem] rotate-[20deg] w-[14rem] h-1 border-t border-black border-dashed"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Active Sessions</h3>
              <p className="text-sm text-gray-600 max-w-[288px]">
                Begin your therapeutic sessions with regular meetings and
                skill-building exercises.
              </p>
            </div>

            <div className="flex flex-col-reverse lg:flex-col items-center text-center">
             <div className="flex flex-col">
             <h3 className="text-xl font-bold mb-2">Ongoing Support</h3>
              <p className="text-sm text-gray-600 max-w-[288px]">
                We provide continuous guidance and adjust your plan as you
                progress on your healing journey.
              </p>
             </div>
              <div className="relative">
                <div className="w-24 h-24 bg-[#B0D8D280] border-2 border-[#43A3A3] rounded-full flex items-center justify-center text-teal-700 font-bold text-xl mt-4">
                  4
                </div>
                <div className="hidden lg:block absolute top-1/2 left-full w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white max-w-screen-2xl mx-auto px-4 lg:px-16 mt-[60px] py-8 lg:py-20">
        <div className="">
          <div className="text-center mb-12">
            <h2 className="text-4xl  text-teal-500 mb-2">Blogs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-whiteoverflow-hidden flex flex-col gap-3 lg:gap-0 lg:flex-row item-center"
              >
                <div className="flex-shrink-0">
                  <Image
                    // src={blog.imageUrl}
                    src="https://images.unsplash.com/photo-1594897030264-ab7d87efc473?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt={blog.title}
                    className="w-[200px] h-[200px] object-cover rounded-xl"
                    width={200}
                    height={200}
                  />
                </div>

                <div className="px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 bg-[#B0D8D21A] border border-[#43A3A3]`}
                  >
                    {blog.category}
                  </span>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {blog.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {blog.date}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {blog.readTime}
                    </div>
                  </div>

                  <button className="text-teal-500 text-sm font-medium hover:text-teal-600 transition-colors duration-200 flex items-center">
                    Read More
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     
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
    </>
  );
}

import { CompanyProfile, JobPost, CandidateProfile, JobApplication, PortalNotification, SupportTicket } from "./types";

// Initial Mock Companies (Indian Tech Ecosystem)
export const INITIAL_COMPANIES: CompanyProfile[] = [
  {
    id: "comp-1",
    userId: "user-employer-1",
    companyName: "Razorpay",
     email: "careers@razorpay.com",
    logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&q=80",
    website: "https://razorpay.com/careers",
    industry: "Financial Technology",
    location: "Bengaluru, KA",
    companySize: "1,000 - 5,000 employees",
    about: "Razorpay is India's leading financial services marketplace, helping businesses accept, process, and disburse payments. We build secure distributed processing engines handling billions of monthly UPI, Card, and Netbanking transactions.",
    isVerified: true
  },
  {
    id: "comp-2",
    userId: "user-employer-2",
    companyName: "Zomato",
     email: "careers@zomato.com",
    logo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=100&h=100&fit=crop&q=80",
    website: "https://zomato.com",
    industry: "Logistics & Food Tech",
    location: "Gurugram, HR",
    companySize: "5,000 - 10,000 employees",
    about: "Zomato is an Indian multinational restaurant aggregator and food delivery pioneer. Combining state-of-the-art logistics AI with elegant interfaces, we deliver culinary happiness to millions of Indian foodies daily.",
    isVerified: true
  },
  {
    id: "comp-3",
    userId: "user-employer-3",
    companyName: "Tata Consultancy Services (TCS)",
    email: "careers@tcs.com",
    logo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop&q=80",
    website: "https://careers.tcs.com",
    industry: "IT Services & Consulting",
    location: "Mumbai, MH",
    companySize: "10,000+ employees",
    about: "TCS is a global leader in IT services, consulting, and business solutions. Headquartered in Mumbai, Maharashtra, we partner with the world's largest enterprises to catalyze their digital transformation journeys.",
    isVerified: true
  },
  {
    id: "comp-4",
    userId: "user-employer-4",
    companyName: "Ather Energy",
     email: "careers@atherenergy.com",
    logo: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=100&h=100&fit=crop&q=80",
    website: "https://atherenergy.com/careers",
    industry: "Automotive & Clean Energy",
    location: "Bengaluru, KA",
    companySize: "1,000 - 5,000 employees",
    about: "Ather Energy is at the forefront of the Indian electric vehicle revolution. We design, manufacture, and assemble smart UI electric scooters, lithium-ion battery matrices, and nationwide fast-charging grids.",
    isVerified: true
  },
  {
    id: "comp-5",
    userId: "user-employer-5",
    companyName: "Zoho Corporation",
      email: "careers@zoho.com",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&q=80",
    website: "https://zoho.com",
    industry: "Enterprise SaaS & Cloud",
    location: "Chennai, TN",
    companySize: "5,000 - 10,000 employees",
    about: "Zoho Corporation is a bootstrapping software giant made in India. We design suite-wide online productivity utilities, accounting channels, CRM pipelines, and low-code platforms serving over 100 million corporate users.",
    isVerified: false // Needs verification by admin!
  }
];

// Initial Job Openings
export const INITIAL_JOBS: JobPost[] = [
  {
    id: "job-1",
    companyId: "comp-1",
    companyName: "Razorpay",
    companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&q=80",
    title: "Senior Payments Architect",
    department: "Engineering",
    location: "Bengaluru, KA",
    workMode: "hybrid",
    type: "full-time",
    salaryRange: "₹35L - ₹50L LPA",
    description: "We are looking for a Senior Payments Architect to guide the structural evolution of our high-throughput transactional gateway mechanism. You will lead an exceptional engineering workspace of developers, setting standards for secure API handshakes, formulating low-latency pipeline policies, and defining fault-tolerant distributed models.",
    requirements: [
      "Mastery of Go, Java, or Rust with system-level distributed systems design.",
      "7+ years of architectural guidance in high-scale cloud microservices.",
      "In-depth understanding of queue frameworks (Kafka, RabbitMQ) and transactional databases (PostgreSQL/SQL).",
      "Outstanding engineering credentials with leadership experience in fast-growth FinTech teams."
    ],
    responsibilities: [
      "Direct architectural outlines, technology stacks, and operational patterns for our primary API payment engines.",
      "Perform weekly trade-off analysis on latencies, throughputs, failover scenarios, and cloud cost factors.",
      "Mentor and guide Senior and SDE-3 Engineers across multiple core platform squads.",
      "Formulate corporate transaction audit routines and review critical system releases."
    ],
    perks: [
      "Top-tier corporate wellness plan covering family and parent medical benefits.",
      "Aesthetic, premium office workspace in Outer Ring Road, Bengaluru with free catered food.",
      "Substantial performance-driven bonuses, ESOP grants, and relocation offsets.",
      "Annual educational stipend of ₹1,50,000 for technical certifications and resources."
    ],
    eligibility: "B.Tech/M.Tech/MCA in Computer Science or equivalent engineering portfolio success",
    skills: ["Kafka", "Go", "Java", "System Architecture", "SQL"],
    deadline: "2026-06-30",
    openings: 2,
    status: "published",
    postedDate: "2026-05-18",
    views: 342,
    applicationsCount: 4,
    isFeatured: true
  },
  {
    id: "job-2",
    companyId: "comp-2",
    companyName: "Zomato",
    companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=100&h=100&fit=crop&q=80",
    title: "UI/UX Strategy Lead",
    department: "Global Design",
    location: "Gurugram, HR",
    workMode: "hybrid",
    type: "full-time",
    salaryRange: "₹25L - ₹40L LPA",
    description: "Zomato's consumer and delivery network interfaces set design benchmarks nationally. We are seeking a design-obsessed UI/UX Strategy Lead to conceptualize our consumer ordering workflows, loyalty club panels, and merchant dashboards. You will drive typographic hierarchy, accessibility tokens, and coordinate with engineering Leads to translate vector assets into clean frontend code.",
    requirements: [
      "Impressive digital design portfolio demonstrating extensive modern consumer app or SaaS design iterations.",
      "Proficient mastery of Figma, style tokens, and layout guidelines for both mobile viewports and desktop dashboards.",
      "Strong capability to analyze user analytics and translate telemetry metrics into helpful micro-interactions."
    ],
    responsibilities: [
      "Own the visual brand system and reusable UI component architecture across Zomato's primary portals.",
      "Design high-fidelity interactive user flows, custom clickable mockups, and interaction guidelines.",
      "Collaborate directly with React/React Native developers to review layout responsive integrity across devices."
    ],
    perks: [
      "Subsidized high-quality home-office setups and remote energy credits.",
      "Generous health programs, gym/fitness membership compensations.",
      "Weekly team lunches at Michelin-rated and top-trending restaurants in Gurugram/Delhi NCR.",
      "Free premium delivery memberships and daily Zomato food voucher credits."
    ],
    eligibility: "Portfolio-first entry, background in product design, visual arts, or related design experience",
    skills: ["Design Systems", "Figma", "SaaS Design", "Tailwind CSS", "React"],
    deadline: "2026-07-15",
    openings: 1,
    status: "published",
    postedDate: "2026-05-19",
    views: 289,
    applicationsCount: 2,
    isFeatured: true
  },
  {
    id: "job-3",
    companyId: "comp-3",
    companyName: "Tata Consultancy Services (TCS)",
    companyLogo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop&q=80",
    title: "Product Marketing Intern",
    department: "Marketing",
    location: "Mumbai, MH",
    workMode: "on-site",
    type: "internship",
    salaryRange: "₹40,000 / month",
    description: "Gain outstanding industry exposure this summer working alongside TCS's enterprise growth leads. This structured, intensive internship is designed for engineering or management graduates eager to master product positioning, run competitive brand intelligence research, and draft client communication campaigns.",
    requirements: [
      "Enrolled in or recently graduated from a B.Tech, BBA, MBA, or Communications stream.",
      "Strong quantitative aptitude to synthesize market research insights and construct structured slide decks.",
      "Excellent communicative clarity and presentation abilities."
    ],
    responsibilities: [
      "Draft engaging marketing copy, coordinate technical write-ups, and support global service launch briefings.",
      "Organize enterprise stakeholder surveys, compiling metrics on digitized client satisfaction across verticals.",
      "Deliver a final summer internship thesis detailing regional digital transformation gaps to Senior Directors."
    ],
    perks: [
      "Stipend of ₹40k accompanied by structural internship completion certification.",
      "Daily access to modern TCS food lounges and corporate transport lines.",
      "1:1 professional mentorship pairing you with active Global Marketing Leads.",
      "High probability of receiving a Pre-Placement Offer (PPO) based on capstone project review."
    ],
    eligibility: "Active pre-final/final year collegiate status or graduated within the last 12 months",
    skills: ["Analysis", "Storytelling", "Market Research", "Presentation", "Content Strategy"],
    deadline: "2026-06-15",
    openings: 5,
    status: "published",
    postedDate: "2026-05-15",
    views: 450,
    applicationsCount: 15,
    isFeatured: true
  },
  {
    id: "job-4",
    companyId: "comp-4",
    companyName: "Ather Energy",
    title: "Battery Management Systems Engineer",
    department: "Autopilot UI & Dynamics",
    location: "Bengaluru, KA",
    workMode: "on-site",
    type: "full-time",
    salaryRange: "₹18L - ₹28L LPA",
    companyLogo: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=100&h=100&fit=crop&q=80",
    description: "Ather Energy is redesigning urban personal commutes. In this role, you will construct rich, physics-realistic simulation vectors to execute temperature safety tests, battery cell routing models, and firmware performance on real-world Indian road profiles. You will create highly customizable battery algorithms and state-of-charge trackers.",
    requirements: [
      "B.Tech/M.Tech or PhD in Electrical, Electronics, Automotive, or Aerospace Engineering.",
      "Robust experience with C++ and high-performance simulation or visualization software (such as MATLAB/Simulink or custom tools).",
      "Solid base in linear algebra, thermodynamic calculations, and kinematics."
    ],
    responsibilities: [
      "Generate detailed thermal models, heat-dissipation meshes, and high-frequency cell voltage simulation algorithms.",
      "Design multi-threaded telemetry logging tools modeling cell discharge across variable altitude and traffic densities.",
      "Optimize hardware-in-the-loop firmware controllers to bridge simulation predictions with real mechanical test fleets."
    ],
    perks: [
      "Attractive stock options (ESOPs) with immense equity growth potential.",
      "Corporate discounts on purchase of personal Ather smart scooters with complimentary charging at all home-base grids.",
      "Exceptional dynamic lab environments located in Indiranagar, Bengaluru, with full logistics compensation."
    ],
    eligibility: "B.Tech/M.Tech with specialized hardware integration and firmware development expertise",
    skills: ["C++", "MATLAB", "Embedded Systems", "Linear Algebra", "Python"],
    deadline: "2026-08-01",
    openings: 2,
    status: "published",
    postedDate: "2026-05-10",
    views: 512,
    applicationsCount: 8,
    isFeatured: false
  },
  {
    id: "job-5",
    companyId: "comp-5",
    companyName: "Zoho Corporation",
    title: "Junior Cloud Infrastructure Engineer",
    department: "Infrastructure Operations",
    location: "Chennai, TN",
    workMode: "hybrid",
    type: "full-time",
    salaryRange: "₹8L - ₹12L LPA",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&q=80",
    description: "Join Zoho's core infrastructure management fleet in Chennai. As a Junior Cloud Infrastructure Engineer, you will configure robust virtualization layers, monitor regional compute clusters, draft terraform descriptors to deploy services, and audit telemetry dashboards to ensure high availability metrics.",
    requirements: [
      "Strong base understanding of Linux system kernels, routing protocols, and bash scripting.",
      "Basic hands-on familiarity with private clouds or standard public systems (AWS, DigitalOcean, GCP).",
      "Fundamental clarity with custom Dockerfiles, Kubernetes pods, and git-ops runners."
    ],
    responsibilities: [
      "Review daily container status flags, optimizing pod resources and memory allocation thresholds.",
      "Formulate infrastructure blueprints using Terraform, automating database replication zones.",
      "Deploy localized logging collectors, debugging routing faults under the mentorship of Staff SREs."
    ],
    perks: [
      "Comprehensive medical insurance for your entire immediate family, including mental health consults.",
      "Zoho's famous serene, green campus office in Chennai with outstanding organic farm-to-table food provisions.",
      "Generous technology allowances supporting laptops, customized developer keyboards, and ergonomic setups."
    ],
    eligibility: "Graduate engineering degree or self-taught candidates with strong projects proving network/Linux mastery",
    skills: ["Docker", "AWS", "Linux System", "Terraform", "CI/CD"],
    deadline: "2026-06-25",
    openings: 1,
    status: "published",
    postedDate: "2026-05-17",
    views: 110,
    applicationsCount: 3,
    isFeatured: false
  }
];

// Initial preloaded Mock Candidates
export const MOCK_CANDIDATE_PROFILE: CandidateProfile = {
  id: "cand-1",
  userId: "user-candidate-1",
  email: "pilly2702@gmail.com",
  fullName: "Divya Sharma",
  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
  headline: "Full Stack Engineer & React Specialist",
  location: "Bengaluru, KA",
  about: "Enthusiastic and detail-oriented Software Engineer with 3+ years of experience constructing high-performance React portals and robust Node backends. Solid understanding of CSS frameworks, modern REST APIs, and database modeling.",
  roleType: "experienced",
  education: [
    {
      id: "edu-1",
      school: "Indian Institute of Information Technology (IIIT), Bangalore",
      degree: "Bachelor of Technology (B.Tech)",
      fieldOfStudy: "Computer Science and Engineering",
      startYear: "2019",
      endYear: "2023",
      grade: "8.9 CGPA"
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Wipro Digital Solutions",
      title: "Frontend Developer",
      location: "Bengaluru, KA",
      startDate: "2023-06",
      endDate: "Present",
      current: true,
      description: "Crafted modular React and Next.js application frameworks, boosting application load time and responsive flexibility. Configured custom utility hooks and decreased aggregate bundle sizes by 25% through lazy fetching structures."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Collaborative Task Canvas",
      description: "A real-time interactive kanban board utilizing web sockets and Canvas APIs, enabling remote developer teams to organize tasks together.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Socket.io"],
      link: "https://taskcanvas-india-demo.dev"
    }
  ],
  certifications: ["AWS Certified Developer Associate", "Frontend Excellence Mastery ID #812"],
  portfolioLinks: [
    { platform: "GitHub", url: "https://github.com/divyasharma-dev" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/divya-dev" },
    { platform: "Portfolio Website", url: "https://divyasharma.dev" }
  ],
  skills: ["React", "TypeScript", "Tailwind CSS", "Go", "Figma", "Node.js", "Docker", "AWS"],
  resumeUrl: "mock_resume_divya_sharma.pdf",
  resumeName: "Divya_Sharma_Resume_2026.pdf",
  phone: "+91 98765 43210",
  profileCompletion: 85
};

// Initial Mock Preloaded Candidate Profiles (available for Employers to search/see)
export const INITIAL_CANDIDATE_EXPLORER: CandidateProfile[] = [
  MOCK_CANDIDATE_PROFILE,
  {
    id: "cand-2",
    userId: "user-candidate-2",
    email: "rohan.roy@example.com",
    fullName: "Rohan Roy",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    headline: "Junior SRE & Systems Specialist | IIT Madras",
    location: "Chennai, TN",
    about: "Self-driven Computer Science student passionate about automated infrastructure, Linux systems scripting, and continuous integration strategies. Looking for high-intensity engineering internships to solve real cloud deployment challenges.",
    roleType: "student",
    education: [
      {
        id: "edu-2",
        school: "Indian Institute of Technology (IIT), Madras",
        degree: "Bachelor of Technology (B.Tech)",
        fieldOfStudy: "Computer Science",
        startYear: "2023",
        endYear: "2027"
      }
    ],
    experience: [
      {
        id: "exp-2",
        company: "IIT Madras Tech Club",
        title: "Docker Architect Assistant",
        location: "Chennai, TN",
        startDate: "2024-09",
        endDate: "Present",
        current: true,
        description: "Assisted in setting up sandbox containers using Docker for regional hackathons. Configured automatic Jenkins builds and webhooks."
      }
    ],
    projects: [
      {
        id: "proj-2",
        title: "Kubernetes Local Cluster Provisioner",
        description: "A Python automation script that sets up structured local testing clusters using minikube with automated ingress configurations.",
        technologies: ["Python", "Kubernetes", "Shell Scripting", "Minikube"]
      }
    ],
    certifications: ["Docker Professional Associate Certificate"],
    portfolioLinks: [
      { platform: "GitHub", url: "https://github.com/rohanroy-git" }
    ],
    skills: ["Docker", "Kubernetes", "Linux System", "Python", "Shell Scripting", "CI/CD"],
    resumeUrl: "rohan_roy_resume.pdf",
    resumeName: "Rohan_Roy_SRE_Resume.pdf",
    phone: "+91 91234 56789",
    profileCompletion: 90
  },
  {
    id: "cand-3",
    userId: "user-candidate-3",
    email: "anjali.nair@example.com",
    fullName: "Anjali Nair",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    headline: "Information Security Scholar | OSCP Aspirant",
    location: "Pune, MH",
    about: "A diligent college graduate with specialized expertise in reverse engineering software, network traffic analysis, and API penetration policies. Active CTF player in top Indian security communities.",
    roleType: "fresher",
    education: [
      {
        id: "edu-3",
        school: "Pune Institute of Computer Technology (PICT)",
        degree: "B.E. Computer Engineering",
        fieldOfStudy: "Cyber Security & Networks",
        startYear: "2022",
        endYear: "2026"
      }
    ],
    experience: [],
    projects: [
      {
        id: "proj-3",
        title: "CryptoVault: Static Cryptography Auditor",
        description: "An open-source node package that statically parses JS code to find hardcoded credentials and dangerous decryption functions.",
        technologies: ["TypeScript", "AST Parsing", "Security Audits"]
      }
    ],
    certifications: ["CompTIA Security+", "OSCP Candidate"],
    portfolioLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/anjalinair-sec" }
    ],
    skills: ["Linux System", "Analysis", "Python", "Docker", "Security Audits"],
    resumeUrl: "anjali_nair_security.pdf",
    resumeName: "Anjali_Nair_Security_CV.pdf",
    phone: "+91 99887 76655",
    profileCompletion: 75
  }
];

// Initial Preloaded Job Applications
export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1", // Razorpay Architect
    candidateId: "cand-1", // Divya Sharma
    candidateName: "Divya Sharma",
    candidateEmail: "pilly2702@gmail.com",
    candidatePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    candidateHeadline: "Full Stack Engineer & React Specialist",
    resumeName: "Divya_Sharma_Resume_2026.pdf",
    coverLetter: "I am absolutely thrilled by Razorpay's high-speed engineering breakthroughs. Solving gateway transaction-scaling challenges is exactly the type of engineering puzzle I excel at. I bring robust skills in API optimization and clean state management.",
    answers: [
      { question: "What is your experience scale with Kubernetes?", answer: "Over 3 years of building containerized microservices and automated deployment pipelines." },
      { question: "What is your earliest availability date?", answer: "Available immediately (Notice period already served)." }
    ],
    portfolioLinks: [
      { platform: "GitHub", url: "https://github.com/divyasharma-dev" }
    ],
    status: "interview_round_1",
    appliedDate: "2026-05-18",
    activityLog: [
      {
        id: "act-1-1",
        status: "applied",
        changedBy: "Candidate",
        timestamp: "2026-05-18T10:00:00Z",
        notes: "Initial submission completed."
      },
      {
        id: "act-1-2",
        status: "screening",
        changedBy: "Razorpay Recruiter",
        timestamp: "2026-05-19T09:30:00Z",
        notes: "Passed automated profile screen. Technical skills and CGPA metrics look highly compatible."
      },
      {
        id: "act-1-3",
        status: "interview_round_1",
        changedBy: "Razorpay Recruiter",
        timestamp: "2026-05-19T14:00:00Z",
        notes: "Scheduled Technical Hack Round 1 with Lead architect panel."
      }
    ]
  },
  {
    id: "app-2",
    jobId: "job-3", // TCS Marketing Intern
    candidateId: "cand-2", // Rohan Roy (represented as application)
    candidateName: "Rohan Roy",
    candidateEmail: "rohan.roy@example.com",
    candidatePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    candidateHeadline: "Junior SRE & Systems Specialist | IIT Madras",
    resumeName: "Rohan_Roy_SRE_Resume.pdf",
    coverLetter: "Eager to experience technical product marketing workflows to complement my computer engineering background. I bring robust analytical scripting skills from IIT Madras.",
    status: "applied",
    appliedDate: "2026-05-16",
    activityLog: [
      {
        id: "act-2-1",
        status: "applied",
        changedBy: "Candidate",
        timestamp: "2026-05-16T15:20:00Z",
        notes: "Applied via CareerBridge student placement cell."
      }
    ]
  }
];

// Pre-populated notifications
export const INITIAL_NOTIFICATIONS: PortalNotification[] = [
  {
    id: "not-1",
    userId: "user-candidate-1",
    title: "Technical Hack Scheduled",
    message: "Razorpay HR moved your application to 'Interview Round 1' for Senior Payments Architect position. Check your corporate mailbox sandbox!",
    timestamp: "2026-05-19T14:00:00Z",
    read: false,
    type: "interview_invite"
  },
  {
    id: "not-2",
    userId: "user-candidate-1",
    title: "Complete your profile",
    message: "A completed profile has a 4x higher chance of gaining hiring manager interest. Add your phone number and certificates now!",
    timestamp: "2026-05-20T08:00:00Z",
    read: false,
    type: "profile_nudge"
  },
  {
    id: "not-3",
    userId: "user-employer-1",
    title: "New Job Applicant",
    message: "Divya Sharma submitted an active application for the Senior Payments Architect opening.",
    timestamp: "2026-05-18T10:01:00Z",
    read: false,
    type: "new_applicant"
  }
];

// Initial Support Tickets
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tick-1",
    fullName: "Marcus Aurelius",
    email: "marcus@rome.net",
    subject: "Employer profile validation",
    message: "Greetings, we submitted Zoho Corporation profile details but our verified corporate status badge is currently pending. Please audit, thank you.",
    status: "open",
    timestamp: "2026-05-20T12:00:00Z"
  }
];

// Career Resources and Learning Content
export const CAREER_RESOURCES = [
  {
    id: "res-1",
    title: "The Ultimate Guide to Ace the System Design Interview",
    category: "Interview Prep",
    readTime: "8 min read",
    about: "Learn exact mental schemas used by Principal Engineers at top Indian companies to frame scalable storage questions, partition databases, and defend latency decisions.",
    steps: [
      "Deconstruct system borders: Write down explicit numbers for daily active users, requests per second, and bytes per request.",
      "Formulate high-level plans: Draw key database boxes, query load balancers, and queue segments before typing code parameters.",
      "Dive into replication: Clarify if your databases use solid acid transactions, replica read loops, or eventually consistent states.",
      "Calculate edge variables: Address regional replication lag, connection leaks, and index memory bottlenecks."
    ]
  },
  {
    id: "res-2",
    title: "Formatting a Resume that Clears Enterprise ATS Checkers",
    category: "Resume Tips",
    readTime: "5 min read",
    about: "Make sure your experience segments aren't accidentally discarded because of nested tables, fancy graphics, or missing metadata tags.",
    steps: [
      "Prefer highly readable single-column formats. Standard parsers read top-to-bottom, left-to-right.",
      "Structure sections with literal human headings: Experience, Education, Technical Skills, Projects, Certifications.",
      "Formulate action-verb descriptions: Replace 'responsible for making tasks' with 'Engineered Go microservice decreasing task latency by 20%'.",
      "Inject core keywords representing your actual skills: e.g. Docker, TypeScript, Go, rather than generic visual adjectives."
    ]
  },
  {
    id: "res-3",
    title: "A Tactical Blueprint to Securing High-Paying Internship Opportunities",
    category: "Skill Guidance",
    readTime: "6 min read",
    about: "How to stand out in crowds of thousands of applicants. Learn to build unique visual projects, reach out to recruiters, and show extreme potential.",
    steps: [
      "Select a high-focus niche instead of standard templates. Build real full-stack tooling solving local challenges.",
      "Keep public repositories meticulously polished. Include interactive deploy references, clear README guides, and solid mock setups.",
      "Send hyper-targeted notes directly to hiring partners: Write 3 objective sentences highlighting your projects instead of sending form essays.",
      "Treat early coding challenges as custom-engineered releases. Add unit test arrays and write precise execution instructions representatively."
    ]
  }
];

// FAQ Database
export const FAQS = [
  {
    question: "Do companies on CareerBridge verify their legal presence in India?",
    answer: "Yes, our audit moderators verify all company submissions by checking physical business registration documents, Corporate Identification Numbers (CIN), custom domain emails, and operational sites before awarding the Verified Company badge."
  },
  {
    question: "Is there any cost for Indian job seekers using CareerBridge?",
    answer: "No, CareerBridge is completely free for all categories of candidates: including college students, freshers, and experienced professionals looking to discover careers."
  },
  {
    question: "How does the simulated candidate onboarding score behave?",
    answer: "The profile completeness meter analyzes defined parameters like: About Description (15%), Education items (25%), Work Experience (30%), Resume uploading (20%), and Personal Portfolio Links (10%). Keeping your profile complete guarantees high recruiter priorities."
  },
  {
    question: "Can an employer schedule multiple interview rounds?",
    answer: "Absolutely. Recruiters can configure structural workflows (Technical Hack Round, Managerial Round, HR Round), tracking stages within an ATS-compatible board, and scheduling calendar invites directly in the application panels."
  }
];

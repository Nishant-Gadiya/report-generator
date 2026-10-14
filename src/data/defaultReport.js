/**
 * Default data model for a new report.
 * This is the single source of truth consumed by all templates.
 */
export const DEFAULT_REPORT = {
  id: null,
  createdAt: null,
  updatedAt: null,

  /** ── Front Sheet ── */
  frontSheet: {
    collegeName: 'JSS ACADEMY OF TECHNICAL EDUCATION, BENGALURU',
    academicYear: '2025-2026',
    departmentName: 'DEPARTMENT OF INFORMATION SCIENCE AND ENGINEERING',
    courseName: 'Advanced Java And DBMS',
    semester: "4th 'A'",
    reportType: 'MINI PROJECT REPORT ON',
    projectTitle: 'CINENOVA: AI TICKET BOOKING PLATFORM',
    guides: [
      { name: 'Dr. Supriya B N', designation: 'Associate Professor' },
      { name: 'Mrs. Rashmi B R', designation: 'Assistant Professor' },
    ],
    students: [
      { name: '', usn: '', section: '', email: '', phone: '' },
      { name: '', usn: '', section: '', email: '', phone: '' },
      { name: '', usn: '', section: '', email: '', phone: '' },
    ],
    affiliation: 'An Autonomous Institution affiliated to VTU, Belagavi',
    address: 'K.R. Road, V.V.Pura, Bengaluru-560 004',
    synopsisTitle: 'Minor-Project Synopsis (BCS586)',
    domain: 'Web Application Development & Real-Time Systems',
    groupId: '',
    coordinatorTitle: 'Signature of the Mini Project Co-ordinator',
  },

  /** ── Report Sections ── */
  sections: [
    {
      id: 'sec-1',
      title: 'Introduction',
      content:
        'This report presents CineNova, an AI-powered movie ticket booking platform that leverages modern web technologies and machine learning to enhance the cinema-going experience. The platform integrates intelligent recommendation systems, real-time seat availability, and seamless payment processing.\n\nCineNova addresses several limitations found in traditional ticket booking systems, including poor user experience, lack of personalisation, and inefficient seat management. By incorporating artificial intelligence, the system can learn user preferences and provide tailored recommendations.',
      pageBreakBefore: false,
      images: [],
    },
    {
      id: 'sec-2',
      title: 'Problem Statement',
      content:
        'Current cinema booking systems suffer from fragmented user experiences, lack of personalised recommendations, and inefficient resource management. Users often face difficulties in discovering movies aligned with their preferences, and theatre operators lack tools to optimise seat occupancy.\n\nThe primary challenge is to build a platform that can:\n1. Provide personalised movie recommendations using collaborative and content-based filtering.\n2. Manage real-time seat reservations without conflicts.\n3. Integrate payment gateways securely.\n4. Scale to handle peak booking demand around movie releases.',
      pageBreakBefore: false,
      images: [],
    },
    {
      id: 'sec-3',
      title: 'Objectives',
      content:
        'The key objectives of this project are as follows:\n\n1. To design and implement an AI-powered movie recommendation engine.\n2. To build a real-time seat selection and reservation system.\n3. To integrate Razorpay for secure payment processing.\n4. To create an administrative dashboard for theatre operators.\n5. To deploy the application using cloud infrastructure for high availability.\n6. To achieve a user satisfaction score of above 85% through iterative user testing.',
      pageBreakBefore: false,
      images: [],
    },
    {
      id: 'sec-4',
      title: 'System Architecture',
      content:
        'The system follows a three-tier architecture consisting of a React.js frontend, a Node.js Express backend, and a MongoDB database. Real-time communication is handled through Socket.IO for live seat updates.\n\nThe AI module operates as a microservice written in Python using FastAPI, exposing REST endpoints for recommendation queries. The main backend communicates with this microservice over HTTP.\n\nAuthentication is managed using JSON Web Tokens (JWT) with refresh token rotation. All sensitive environment variables are stored in cloud secret managers and never committed to version control.',
      pageBreakBefore: true,
      images: [],
    },
    {
      id: 'sec-5',
      title: 'Technology Stack',
      content:
        'Frontend: React.js 18, Redux Toolkit, Tailwind CSS, Socket.IO client.\n\nBackend: Node.js, Express.js, Socket.IO server, Mongoose ODM.\n\nAI/ML: Python 3.11, FastAPI, scikit-learn, pandas, NumPy.\n\nDatabase: MongoDB Atlas with full-text search indexing.\n\nPayment: Razorpay Payment Gateway API.\n\nInfrastructure: Docker, Nginx reverse proxy, AWS EC2, AWS S3 for media storage.\n\nCI/CD: GitHub Actions with automated testing and deployment pipelines.',
      pageBreakBefore: false,
      images: [],
    },
    {
      id: 'sec-6',
      title: 'Implementation',
      content:
        'The implementation was carried out in three sprints over a period of twelve weeks.\n\nSprint 1 (Weeks 1–4): Project setup, database schema design, basic authentication, and movie catalogue API.\n\nSprint 2 (Weeks 5–8): AI recommendation engine integration, real-time seat booking with Socket.IO, and payment gateway.\n\nSprint 3 (Weeks 9–12): Admin dashboard, performance optimisation, comprehensive testing, and deployment.\n\nUnit tests were written using Jest for backend services and React Testing Library for frontend components. Integration tests cover the complete booking flow from movie selection to payment confirmation.',
      pageBreakBefore: false,
      images: [],
    },
    {
      id: 'sec-7',
      title: 'Results and Discussion',
      content:
        'The application was tested with a cohort of 50 students. Key metrics recorded:\n\n- Average page load time: 1.2 seconds on a standard 4G connection.\n- Recommendation acceptance rate: 73% of suggested movies were booked.\n- Payment success rate: 98.5% across all test transactions.\n- Concurrent users handled during peak load test: 500.\n\nUser feedback indicated high satisfaction with the recommendation quality and the intuitive seat-selection interface. Areas flagged for improvement include the mobile keyboard behaviour during seat search and occasional latency in Socket.IO updates on slow networks.',
      pageBreakBefore: false,
      images: [],
    },
    {
      id: 'sec-8',
      title: 'Conclusion',
      content:
        'CineNova successfully demonstrates the viability of integrating AI recommendations into a cinema booking platform. The system meets all stated objectives and provides a significantly improved user experience compared to existing solutions.\n\nFuture work includes expanding the recommendation engine with deep learning models, adding multi-language support, and building a native mobile application for iOS and Android.',
      pageBreakBefore: false,
      images: [],
    },
  ],

  /** ── Preliminary Pages & References ── */
  acknowledgement: {
    enabled: true,
    heading: 'Acknowledgement',
    content:
      'The satisfaction and euphoria that accompany the successful completion of any task would be incomplete without mentioning the people who made it possible, whose constant guidance and encouragement served as a beacon of light.\n\nWe express our sincere gratitude and indebtedness to our esteemed institution and our Head of Department for providing us with the necessary facilities and support.\n\nWe place on record our profound gratitude to our project guide for their invaluable guidance, constructive suggestions, and continuous motivation throughout the development of this project.\n\nFinally, we thank our parents, friends, and all those who directly or indirectly helped us in the successful completion of this work.',
  },

  abstract: {
    enabled: true,
    heading: 'Abstract',
    content:
      'This report presents CineNova, an AI-powered movie ticket booking platform that leverages modern web technologies and machine learning to enhance the cinema-going experience. The platform integrates intelligent recommendation systems, real-time seat availability, and seamless payment processing.\n\nCineNova addresses several limitations found in traditional ticket booking systems, including poor user experience, lack of personalisation, and inefficient seat management. By incorporating artificial intelligence, the system can learn user preferences and provide tailored recommendations.',
  },

  references: {
    enabled: true,
    heading: 'References',
    items: [
      {
        id: 'ref-1',
        type: 'book',
        title: 'Recommender Systems Handbook',
        author: 'Ricci, F., Rokach, L., & Shapira, B.',
        year: '2015',
        publisher: 'Springer',
        url: '',
      },
      {
        id: 'ref-2',
        type: 'book',
        title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd ed.)',
        author: 'Géron, A.',
        year: '2022',
        publisher: "O'Reilly Media",
        url: '',
      },
      {
        id: 'ref-3',
        type: 'website',
        title: 'MongoDB Documentation',
        author: 'MongoDB Inc.',
        year: '2024',
        publisher: '',
        url: 'https://www.mongodb.com/docs/',
      },
      {
        id: 'ref-4',
        type: 'website',
        title: 'Socket.IO Documentation',
        author: 'Socket.IO',
        year: '2024',
        publisher: '',
        url: 'https://socket.io/docs/v4/',
      },
      {
        id: 'ref-5',
        type: 'website',
        title: 'Razorpay Payment APIs',
        author: 'Razorpay',
        year: '2024',
        publisher: '',
        url: 'https://razorpay.com/docs/',
      },
      {
        id: 'ref-6',
        type: 'website',
        title: 'React Documentation',
        author: 'React',
        year: '2024',
        publisher: '',
        url: 'https://react.dev/',
      },
    ],
  },

  /** ── Settings ── */
  settings: {
    template: 'classic', // 'classic' | 'modern'
    coverTemplate: 'jssateb', // 'jssateb' | 'bit'
    fontSize: 12,        // pt
    lineSpacing: 1.5,
    marginTop: 25,       // mm
    marginBottom: 25,    // mm
    marginLeft: 30,      // mm
    marginRight: 20,     // mm
    showTableOfContents: true,
    showListOfFigures: false,
  },

  /** ── Header & Footer Settings ── */
  headerFooter: {
    header: {
      enabled: true,
      text: 'CINENOVA: AI TICKET BOOKING PLATFORM',
      alignment: 'right', // 'left' | 'center' | 'right'
      showLine: true,
      lineThickness: 1,
      lineWidth: 70, // %
      lineAlignment: 'center', // 'left' | 'center' | 'right'
      headerToLineSpacingMm: 3,
      lineToContentSpacingMm: 8,
    },
    footer: {
      enabled: true,
      layout: 'left-center-page', // 'left-page' | 'left-center-page' | 'left-right' | 'left-center-right'
      leftText: 'Department of Information Science and Engineering',
      centerText: '',
      rightText: '',
      showPageNumber: true,
      showLine: true,
      lineThickness: 1,
      lineWidth: 70, // %
      lineAlignment: 'center', // 'left' | 'center' | 'right'
      contentToLineSpacingMm: 8,
      lineToTextSpacingMm: 3,
      bottomSpacingMm: 8,
    },
    pageDecoration: {
      firstPageBorder: 'double', // 'none' | 'single' | 'double'
      otherPagesBorder: 'double', // 'none' | 'single' | 'double'
      border: 'double',
    },
  },
};

/**
 * Generate a unique section ID.
 */
export function newSectionId() {
  return `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Create a blank section.
 */
export function createBlankSection() {
  return {
    id: newSectionId(),
    title: 'New Section',
    content: '',
    pageBreakBefore: false,
    images: [],
  };
}

/**
 * Generate a unique reference ID.
 */
export function newReferenceId() {
  return `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Create a blank reference.
 */
export function createBlankReference(type = 'book') {
  return {
    id: newReferenceId(),
    type, // 'book' | 'paper' | 'website'
    title: '',
    author: '',
    year: '',
    publisher: '',
    url: '',
  };
}

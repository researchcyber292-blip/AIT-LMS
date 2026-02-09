
import type { TeamMember, Course } from '@/lib/types';
import imageData from '@/lib/placeholder-images.json';

const { placeholderImages } = imageData;

const findImage = (id: string): { url: string; hint: string } => {
  const image = placeholderImages.find(img => img.id === id);
  if (!image) {
    console.warn(`Image with id ${id} not found. Using default.`);
    return {
      url: `https://picsum.photos/seed/${id}/600/400`,
      hint: 'placeholder',
    };
  }
  return { url: image.imageUrl, hint: image.imageHint };
};

const teamMemberData: Omit<TeamMember, 'image'| 'imageHint'>[] = [
  { id: 't1', name: 'Aviraj Singh', title: 'Founder & CEO' },
  { id: 't2', name: 'Priya Sharma', title: 'Head of Curriculum' },
  { id: 't3', name: 'Rajesh Kumar', title: 'Lead Instructor' },
  { id: 't4', name: 'Anjali Menon', title: 'Student Success Manager' },
];

export const TEAM_MEMBERS: TeamMember[] = teamMemberData.map(member => {
    const imgId = `person-${parseInt(member.id.split('')[1])}`;
    const img = findImage(imgId);
    return {
        ...member,
        image: img.url,
        imageHint: img.hint,
    }
});

export const COURSES: Course[] = [
    {
      id: 'ethical-hacking-1',
      title: 'The Complete Ethical Hacking Course: Zero to Hero',
      description: 'Learn to hack like a pro. A complete course for beginners.',
      longDescription: 'This course is designed for absolute beginners and will take you from zero to hero in the world of ethical hacking. You will learn the fundamentals of networking, penetration testing methodologies, and how to use essential tools like Metasploit and Nmap. By the end, you will be able to identify vulnerabilities and secure systems effectively.',
      price: 499,
      image: 'https://images.unsplash.com/photo-1544890225-2fde0e66f0d0?w=800&auto=format&fit=crop',
      imageHint: 'ethical hacking',
      instructorId: 'inst-1',
      learningObjectives: [
          'Understand core cybersecurity concepts.',
          'Learn to use Nmap for network scanning.',
          'Master Metasploit for exploitation.',
          'Identify and patch common web vulnerabilities.',
          'Conduct a full penetration test from start to finish.'
      ],
      curriculum: [
          { title: 'Module 1: Introduction to Ethical Hacking', content: 'Covers the basics of ethical hacking, legal frameworks, and the mindset of a penetration tester.'},
          { title: 'Module 2: Networking Fundamentals', content: 'Deep dive into TCP/IP, DNS, HTTP, and other essential protocols.'},
          { title: 'Module 3: Reconnaissance & Scanning', content: 'Learn active and passive information gathering techniques.'},
          { title: 'Module 4: Gaining Access', content: 'Exploiting vulnerabilities to gain control of systems.'},
          { title: 'Module 5: Post-Exploitation & Reporting', content: 'Maintaining access, covering tracks, and writing professional reports.'},
      ],
      level: 'Beginner',
      category: 'Ethical Hacking',
      priceType: 'paid', duration: '52h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 1250, lessons: 150, students: 8500,
      instructor: { name: 'Rajesh Kumar', avatar: 'https://picsum.photos/seed/instructor-1/40/40' }
    },
    {
      id: 'data-science-1',
      title: 'Data Science & Machine Learning Bootcamp',
      description: 'Become a data scientist in 2024! From zero to hero.',
      longDescription: 'This comprehensive bootcamp covers everything you need to know to become a data scientist. You will learn Python programming, data analysis with Pandas, data visualization with Matplotlib and Seaborn, and machine learning with Scikit-learn. The course includes multiple real-world projects to build your portfolio.',
      price: 599,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      imageHint: 'data science dashboard',
      instructorId: 'inst-2',
      learningObjectives: [
          'Master Python for data science.',
          'Perform data manipulation and analysis with Pandas.',
          'Create insightful data visualizations.',
          'Build and evaluate machine learning models.',
          'Complete a capstone project for your portfolio.'
      ],
      curriculum: [
          { title: 'Module 1: Python for Data Science', content: 'Learn the fundamentals of Python programming, including data types, loops, and functions.'},
          { title: 'Module 2: Data Analysis with Pandas', content: 'Explore how to load, clean, and analyze datasets using the powerful Pandas library.'},
          { title: 'Module 3: Data Visualization', content: 'Master Matplotlib and Seaborn to create compelling charts and graphs.'},
          { title: 'Module 4: Machine Learning Fundamentals', content: 'Understand the theory behind regression, classification, and clustering algorithms.'},
          { title: 'Module 5: Advanced Machine Learning', content: 'Dive into more complex topics like ensemble methods and model deployment.'}
      ],
      level: 'Intermediate',
      category: 'Data Science',
      priceType: 'paid', duration: '80h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 980, lessons: 210, students: 7600,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'full-stack-1',
      title: 'The Full Stack Web Development Bootcamp',
      description: 'Learn HTML, CSS, Javascript, Node, React, and more!',
      longDescription: 'Become a full-stack web developer with just one course. We will cover the entire web development process, from front-end technologies like HTML, CSS, and React, to back-end technologies like Node.js, Express, and MongoDB. You will build several projects, including a fully-featured e-commerce site.',
      price: 399,
      image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop',
      imageHint: 'full stack code',
      instructorId: 'inst-3',
      learningObjectives: [
          'Build responsive websites with HTML and CSS.',
          'Master modern JavaScript (ES6+).',
          'Create dynamic front-end applications with React.',
          'Develop back-end servers and APIs with Node.js and Express.',
          'Work with NoSQL databases like MongoDB.'
      ],
      curriculum: [
          { title: 'Module 1: Front-End Foundations', content: 'Learn the building blocks of the web: HTML5, CSS3, and Flexbox/Grid.'},
          { title: 'Module 2: JavaScript Deep Dive', content: 'From variables to asynchronous programming, master the language of the web.'},
          { title: 'Module 3: React & Modern Front-End', content: 'Build interactive user interfaces with the most popular front-end library.'},
          { title: 'Module 4: Back-End with Node & Express', content: 'Create robust server-side applications and RESTful APIs.'},
          { title: 'Module 5: Databases with MongoDB', content: 'Learn to store and manage data for your applications using a NoSQL database.'}
      ],
      level: 'Beginner',
      category: 'Full Stack Dev',
      priceType: 'paid', duration: '65h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 2100, lessons: 180, students: 10500,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'ai-ml-1',
      title: 'Artificial Intelligence A-Z: Build 5 AI Projects',
      description: 'Learn AI and ML from scratch. Build real-world projects.',
      longDescription: 'This course provides a complete introduction to the field of Artificial Intelligence. You will learn about search algorithms, neural networks, natural language processing, and computer vision. The course is project-based, so you will get hands-on experience building five different AI applications.',
      price: 799,
      image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&auto=format&fit=crop',
      imageHint: 'AI robot face',
      instructorId: 'inst-4',
      learningObjectives: [
          'Understand the fundamentals of AI and Machine Learning.',
          'Implement search algorithms for problem-solving.',
          'Build and train neural networks with TensorFlow.',
          'Create a chatbot using Natural Language Processing.',
          'Develop an image recognition system.'
      ],
      curriculum: [
        { title: 'Module 1: AI Fundamentals', content: 'Explore the history of AI and its core concepts.'},
        { title: 'Module 2: Search Algorithms', content: 'Learn how AI can find the best solution to complex problems.'},
        { title: 'Module 3: Neural Networks & Deep Learning', content: 'Dive into the architecture of the brain-inspired models that power modern AI.'},
        { title: 'Module 4: Natural Language Processing (NLP)', content: 'Teach computers to understand and process human language.'},
        { title: 'Module 5: Computer Vision', content: 'Enable machines to see and interpret the visual world.'}
      ],
      level: 'Advanced',
      category: 'AI & ML',
      priceType: 'paid', duration: '100h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 3500, lessons: 250, students: 9500,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'robotics-1',
      title: 'Robotics & Tech: From Zero to Autonomous',
      description: 'Build and program your own robots using Arduino and Python.',
      longDescription: 'This hands-on course will guide you through the process of building and programming your first robot. You will learn about electronics, microcontrollers like Arduino, and how to use Python to control your creations. The course culminates in a project where you build an autonomous line-following robot.',
      price: 699,
      image: 'https://images.unsplash.com/photo-1635833948333-d85915d3368d?w=800&auto=format&fit=crop',
      imageHint: 'robotics arm',
      instructorId: 'inst-5',
      learningObjectives: [
        'Understand basic electronics and circuit design.',
        'Program Arduino microcontrollers.',
        'Use sensors to make your robot aware of its environment.',
        'Control motors and actuators.',
        'Write Python scripts to implement robotic behaviors.'
      ],
      curriculum: [
        { title: 'Module 1: Electronics 101', content: 'Learn about voltage, current, resistance, and how to read a circuit diagram.'},
        { title: 'Module 2: Introduction to Arduino', content: 'Get started with the most popular microcontroller for hobbyists and professionals.'},
        { title: 'Module 3: Sensors & Perception', content: 'Use ultrasonic, infrared, and other sensors to give your robot senses.'},
        { title: 'Module 4: Movement & Actuation', content: 'Control DC motors, servos, and stepper motors.'},
        { title: 'Module 5: Autonomous Behavior with Python', content: 'Integrate everything you have learned to create a fully autonomous robot.'}
      ],
      level: 'Intermediate',
      category: 'Robotics & Tech',
      priceType: 'paid', duration: '70h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 800, lessons: 120, students: 4500,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
    },
     {
      id: 'coding-1',
      title: 'Coding for Absolute Beginners: Python & JavaScript',
      description: 'Your first step into the world of programming. No experience needed.',
      longDescription: 'Never written a line of code before? This is the course for you. We will gently introduce you to the fundamental concepts of programming using two of the most popular languages: Python and JavaScript. You will learn about variables, data types, conditional logic, loops, and functions, and build simple but fun applications.',
      price: 249,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
      imageHint: 'coding on laptop',
      instructorId: 'inst-3',
      learningObjectives: [
        'Understand what programming is and how it works.',
        'Write your first Python and JavaScript programs.',
        'Learn about variables, data types, and operators.',
        'Control the flow of your programs with conditional statements and loops.',
        'Create your own reusable functions.'
      ],
      curriculum: [
        { title: 'Module 1: What is Code?', content: 'A gentle introduction to the world of programming.'},
        { title: 'Module 2: Python Basics', content: 'Learn the simple and readable syntax of Python.'},
        { title: 'Module 3: JavaScript Basics', content: 'Dive into the language that powers the web.'},
        { title: 'Module 4: Core Programming Concepts', content: 'Understand the universal principles of programming that apply to any language.'},
        { title: 'Module 5: Your First Projects', content: 'Build a simple calculator and a text-based adventure game.'}
      ],
      level: 'Beginner',
      category: 'Coding',
      priceType: 'paid', duration: '40h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 3100, lessons: 90, students: 15000,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'ethical-hacking-2',
      title: 'Web Application Hacking and Security',
      description: 'Master common web vulnerabilities like SQLi, XSS, and CSRF.',
      longDescription: 'This course focuses specifically on the security of web applications. You will learn how to find and exploit the most common web vulnerabilities, including those in the OWASP Top 10. You will also learn how to defend against these attacks, making you a more effective security professional or a more secure developer.',
      price: 650,
      image: 'https://images.unsplash.com/photo-1593431038929-8e35493208f2?w=800&auto=format&fit=crop',
      imageHint: 'web security code',
      instructorId: 'inst-4',
      learningObjectives: [
        'Understand the OWASP Top 10.',
        'Perform SQL Injection (SQLi) attacks.',
        'Exploit Cross-Site Scripting (XSS) vulnerabilities.',
        'Understand and mitigate Cross-Site Request Forgery (CSRF).',
        'Use Burp Suite to analyze and attack web applications.'
      ],
      curriculum: [
        { title: 'Module 1: Web App Security Fundamentals', content: 'Learn the basics of how web applications work and the common attack vectors.'},
        { title: 'Module 2: Injection Attacks', content: 'Master SQL, Command, and other injection vulnerabilities.'},
        { title: 'Module 3: Cross-Site Scripting (XSS)', content: 'A deep dive into stored, reflected, and DOM-based XSS.'},
        { title: 'Module 4: Authentication & Authorization Flaws', content: 'Learn how to bypass login forms and escalate privileges.'},
        { title: 'Module 5: Secure Coding Practices', content: 'Learn how to write code that is secure by design.'}
      ],
      level: 'Intermediate',
      category: 'Ethical Hacking',
      priceType: 'paid', duration: '55h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 2300, lessons: 160, students: 9800,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'data-science-2',
      title: 'Python for Data Science and Machine Learning',
      description: 'Learn NumPy, Pandas, Matplotlib, Scikit-learn and more!',
      longDescription: 'This course is a deep dive into the core libraries that power data science in Python. You will go from a basic understanding of Python to a confident practitioner of the data science stack. The course is packed with exercises and real-world examples to solidify your understanding.',
      price: 499,
      image: 'https://images.unsplash.com/photo-1526374965328-5f61d25c04b6?w=800&auto=format&fit=crop',
      imageHint: 'python code data',
      instructorId: 'inst-5',
      learningObjectives: [
        'Perform complex numerical operations with NumPy.',
        'Manipulate and analyze dataframes with Pandas.',
        'Create a wide variety of plots with Matplotlib.',
        'Use Scikit-learn for machine learning tasks.',
        'Complete a real-world data analysis project.'
      ],
      curriculum: [
        { title: 'Module 1: Advanced NumPy', content: 'Master array manipulation, broadcasting, and numerical operations.'},
        { title: 'Module 2: Advanced Pandas', content: 'Learn about multi-level indexing, time series analysis, and advanced grouping.'},
        { title: 'Module 3: Advanced Matplotlib', content: 'Customize your plots to create publication-quality visualizations.'},
        { title: 'Module 4: Scikit-Learn in Depth', content: 'Explore pipelines, feature engineering, and model evaluation techniques.'},
        { title: 'Module 5: Real-World Project', content: 'Apply your skills to analyze a large dataset from Kaggle.'}
      ],
      level: 'Beginner',
      category: 'Data Science',
      priceType: 'paid', duration: '45h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 5100, lessons: 190, students: 18000,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
    },
    {
      id: 'ai-ml-2',
      title: 'Deep Learning Specialization',
      description: 'Master the foundations of Deep Learning, understand how to build neural networks.',
      longDescription: 'This specialization provides a pathway for you to gain the knowledge and skills to apply deep learning to your projects. You will learn the foundations of deep learning, understand how to build neural networks, and learn how to lead successful machine learning projects. You will work on case studies from healthcare, autonomous driving, and more.',
      price: 1199,
      image: 'https://images.unsplash.com/photo-1696253900257-2a5c4a03a743?w=800&auto=format&fit=crop',
      imageHint: 'neural network abstract',
      instructorId: 'inst-1',
      learningObjectives: [
        'Understand the major technology trends driving deep learning.',
        'Build, train, and apply deep neural networks.',
        'Implement optimization algorithms and hyperparameter tuning.',
        'Build a convolutional neural network for image recognition.',
        'Build a recurrent neural network for sequence data.'
      ],
      curriculum: [
        { title: 'Course 1: Neural Networks and Deep Learning', content: 'The foundational course of the specialization.'},
        { title: 'Course 2: Improving Deep Neural Networks', content: 'Learn about hyperparameter tuning, regularization, and optimization.'},
        { title: 'Course 3: Structuring Machine Learning Projects', content: 'Understand the strategy and best practices for building ML systems.'},
        { title: 'Course 4: Convolutional Neural Networks', content: 'Master the building blocks of computer vision.'},
        { title: 'Course 5: Sequence Models', content: 'Learn to work with time series data, natural language, and more.'}
      ],
      level: 'Highly Advanced',
      category: 'AI & ML',
      priceType: 'paid', duration: '150h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 4500, lessons: 300, students: 8000,
      instructor: { name: 'Rajesh Kumar', avatar: 'https://picsum.photos/seed/instructor-1/40/40' }
    },
    {
      id: 'full-stack-2',
      title: 'MERN Stack - The Complete Guide',
      description: 'Build fullstack React.js, Node.js, Express.js & MongoDB applications.',
      longDescription: 'This course is your one-stop-shop for learning the MERN stack. You will build a complete social media application from scratch, covering everything from user authentication and API design to front-end state management and deployment. This is a project-based course that will give you the confidence to build your own MERN stack applications.',
      price: 799,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop',
      imageHint: 'react code',
      instructorId: 'inst-2',
      learningObjectives: [
        'Build a complete MERN stack application.',
        'Implement user authentication with JWT.',
        'Design and build a RESTful API with Express and Mongoose.',
        'Manage application state with Redux Toolkit.',
        'Deploy your application to the cloud.'
      ],
      curriculum: [
        { title: 'Module 1: React Front-End', content: 'Build the user interface of our social media app.'},
        { title: 'Module 2: Node & Express Back-End', content: 'Create the server and API that will power our application.'},
        { title: 'Module 3: MongoDB Database', content: 'Design the database schema and interact with it using Mongoose.'},
        { title: 'Module 4: Authentication & Authorization', content: 'Secure your application and manage user accounts.'},
        { title: 'Module 5: State Management & Deployment', content: 'Use Redux for complex state and deploy your app for the world to see.'}
      ],
      level: 'Intermediate',
      category: 'Full Stack Dev',
      priceType: 'paid', duration: '85h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 2800, lessons: 220, students: 12500,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'robotics-2',
      title: 'ROS for Beginners: Basics, Motion, and OpenCV',
      description: 'Learn the Robot Operating System from scratch.',
      longDescription: 'This course is your first step into the world of professional robotics with ROS (Robot Operating System). You will learn the core concepts of ROS, including topics, services, and actions. You will also learn how to control robot motion and use OpenCV for computer vision tasks within the ROS ecosystem. This course uses the Gazebo simulator, so no physical hardware is required.',
      price: 850,
      image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop',
      imageHint: 'small robot',
      instructorId: 'inst-3',
      learningObjectives: [
        'Understand the architecture of ROS.',
        'Create and manage ROS nodes, topics, and services.',
        'Simulate robots in the Gazebo simulator.',
        'Control robot movement and navigation.',
        'Integrate OpenCV for basic computer vision tasks.'
      ],
      curriculum: [
        { title: 'Module 1: Introduction to ROS', content: 'Get started with ROS and understand its core philosophy.'},
        { title: 'Module 2: Topics, Services, and Actions', content: 'Master the fundamental communication patterns in ROS.'},
        { title: 'Module 3: Robot Simulation with Gazebo', content: 'Learn to build and simulate virtual robots and environments.'},
        { title: 'Module 4: Robot Motion & Control', content: 'Explore how to make your robots move in a controlled manner.'},
        { title: 'Module 5: Computer Vision with OpenCV and ROS', content: 'Give your robot the ability to see and react to its environment.'}
      ],
      level: 'Intermediate',
      category: 'Robotics & Tech',
      priceType: 'paid', duration: '95h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 600, lessons: 110, students: 3500,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'coding-2',
      title: 'Java Programming Masterclass for Software Developers',
      description: 'Learn Java from scratch and become a certified Java developer.',
      longDescription: 'This course is the ultimate guide to mastering Java, one of the most in-demand programming languages. We will cover everything from the basics of Java syntax to advanced topics like object-oriented programming, data structures, and algorithms. This course is perfect for beginners who want to become professional Java developers.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1629904853716-f0bc642d9b6b?w=800&auto=format&fit=crop',
      imageHint: 'java code editor',
      instructorId: 'inst-2',
      learningObjectives: [
        'Master the fundamentals of Java programming.',
        'Understand and apply object-oriented programming principles.',
        'Implement common data structures and algorithms in Java.',
        'Learn to write clean, efficient, and professional Java code.',
        'Prepare for Java certification exams.'
      ],
      curriculum: [
        { title: 'Module 1: Java Basics', content: 'Learn about variables, data types, and control flow in Java.'},
        { title: 'Module 2: Object-Oriented Programming (OOP)', content: 'A deep dive into classes, objects, inheritance, and polymorphism.'},
        { title: 'Module 3: Data Structures', content: 'Learn to implement arrays, linked lists, stacks, and queues.'},
        { title: 'Module 4: Algorithms', content: 'Understand sorting and searching algorithms and analyze their performance.'},
        { title: 'Module 5: Advanced Java', content: 'Explore topics like multithreading, networking, and database connectivity.'}
      ],
      level: 'Beginner',
      category: 'Coding',
      priceType: 'paid', duration: '90h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 6000, lessons: 400, students: 25000,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'ethical-hacking-3',
      title: 'Social Engineering: The Art of Human Hacking',
      description: 'Learn the techniques attackers use to manipulate and deceive.',
      longDescription: 'In this unique course, you will learn about the non-technical side of hacking: social engineering. You will explore the psychological principles that make humans vulnerable and learn the techniques attackers use to exploit them. This course will teach you how to defend yourself and your organization against these powerful attacks.',
      price: 400,
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop',
      imageHint: 'person whispering secret',
      instructorId: 'inst-2',
      learningObjectives: [
        'Understand the principles of social engineering.',
        'Learn about phishing, pretexting, and other attack vectors.',
        'Conduct a social engineering engagement.',
        'Develop a security awareness program.',
        'Defend against social engineering attacks.'
      ],
      curriculum: [
        { title: 'Module 1: The Psychology of Persuasion', content: 'Explore the work of Cialdini and other experts in influence.'},
        { title: 'Module 2: Information Gathering', content: 'Learn how attackers gather information about their targets before launching an attack.'},
        { title: 'Module 3: Attack Vectors', content: 'A deep dive into the most common social engineering techniques.'},
        { title: 'Module 4: Physical & Digital Attacks', content: 'Explore how social engineering is used in both the physical and digital worlds.'},
        { title: 'Module 5: Defense & Awareness', content: 'Learn how to build a human firewall to protect your organization.'}
      ],
      level: 'Beginner',
      category: 'Ethical Hacking',
      priceType: 'paid', duration: '18h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 2500, lessons: 55, students: 11500,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'data-science-3',
      title: 'Tableau 2024 A-Z: Hands-On Tableau Training',
      description: 'Master data visualization and create stunning dashboards.',
      longDescription: 'This course is a comprehensive guide to Tableau, the industry-leading data visualization tool. You will learn how to connect to data, create a wide variety of charts and graphs, and combine them into interactive dashboards. By the end of this course, you will be able to turn raw data into beautiful and insightful visualizations.',
      price: 300,
      image: 'https://images.unsplash.com/photo-1637416395253-9426f8279124?w=800&auto=format&fit=crop',
      imageHint: 'tableau dashboard chart',
      instructorId: 'inst-3',
      learningObjectives: [
        'Connect to various data sources.',
        'Create bar charts, line charts, scatter plots, and maps.',
        'Use calculations and parameters to enhance your visualizations.',
        'Build interactive dashboards with filters and actions.',
        'Share your work using Tableau Public and Tableau Server.'
      ],
      curriculum: [
        { title: 'Module 1: Getting Started with Tableau', content: 'Learn the Tableau interface and connect to your first dataset.'},
        { title: 'Module 2: Basic Charts', content: 'Master the most common chart types for data visualization.'},
        { title: 'Module 3: Calculated Fields & Parameters', content: 'Add a new layer of interactivity and analysis to your dashboards.'},
        { title: 'Module 4: Building Dashboards', content: 'Combine your worksheets into a cohesive and interactive story.'},
        { title: 'Module 5: Advanced Tableau Techniques', content: 'Explore Level of Detail (LOD) expressions, table calculations, and more.'}
      ],
      level: 'Beginner',
      category: 'Data Science',
      priceType: 'paid', duration: '35h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 3800, lessons: 120, students: 14000,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'ai-ml-3',
      title: 'Natural Language Processing with Python',
      description: 'Learn to analyze text data, build chatbots, and more with NLTK and spaCy.',
      longDescription: 'This course will teach you how to use Python to work with text data. You will learn about common NLP tasks like tokenization, stemming, and named entity recognition. You will use popular libraries like NLTK and spaCy to build a sentiment analyzer, a text summarizer, and a simple chatbot. This course is perfect for anyone who wants to unlock the power of text data.',
      price: 650,
      image: 'https://images.unsplash.com/photo-1531771686278-222c3ca12265?w=800&auto=format&fit=crop',
      imageHint: 'text analysis abstract',
      instructorId: 'inst-4',
      learningObjectives: [
        'Understand the fundamentals of Natural Language Processing.',
        'Pre-process and clean text data.',
        'Perform sentiment analysis on product reviews.',
        'Build a text summarizer.',
        'Create a simple rule-based chatbot.'
      ],
      curriculum: [
        { title: 'Module 1: Introduction to NLP', content: 'Learn the basics of NLP and how to work with text data in Python.'},
        { title: 'Module 2: Text Pre-processing', content: 'Master the techniques for cleaning and preparing text for analysis.'},
        { title: 'Module 3: Core NLP Tasks', content: 'Explore tokenization, stemming, lemmatization, and part-of-speech tagging.'},
        { title: 'Module 4: Sentiment Analysis & Text Classification', content: 'Build models to classify text and understand its sentiment.'},
        { title: 'Module 5: Advanced NLP Topics', content: 'An introduction to topic modeling, word embeddings, and chatbots.'}
      ],
      level: 'Intermediate',
      category: 'AI & ML',
      priceType: 'paid', duration: '50h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 1400, lessons: 100, students: 5500,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'full-stack-3',
      title: 'Django 4 - The Complete Guide',
      description: 'Build powerful web applications with Python and the Django framework.',
      longDescription: 'This course is a complete guide to building web applications with Django, the popular Python web framework. You will learn everything from setting up your development environment to deploying a production-ready application. We will cover the Django ORM, templates, forms, user authentication, and the Django admin interface. You will build a complete blog application as you progress through the course.',
      price: 450,
      image: 'https://images.unsplash.com/photo-1606115915090-be18a385f0f6?w=800&auto=format&fit=crop',
      imageHint: 'python django code',
      instructorId: 'inst-5',
      learningObjectives: [
        'Understand the Model-View-Template (MVT) architecture of Django.',
        'Design database models and interact with them using the Django ORM.',
        'Create dynamic web pages with Django templates.',
        'Build forms and handle user input.',
        'Implement user registration and authentication.'
      ],
      curriculum: [
        { title: 'Module 1: Getting Started with Django', content: 'Set up your environment and create your first Django project.'},
        { title: 'Module 2: Models & Databases', content: 'Learn how to define your data models and let Django handle the database.'},
        { title: 'Module 3: Views & Templates', content: 'Create the logic for your application and render dynamic HTML pages.'},
        { title: 'Module 4: Forms & User Input', content: 'Build forms to accept and validate data from users.'},
        { title: 'Module 5: User Authentication & Deployment', content: 'Add user accounts to your application and deploy it to the web.'}
      ],
      level: 'Intermediate',
      category: 'Full Stack Dev',
      priceType: 'paid', duration: '60h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 2100, lessons: 180, students: 9000,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
    }
  ];

export const INSTRUCTORS: any[] = [];

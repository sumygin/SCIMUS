const mongoose = require("mongoose")
const {Question, Watch, Solve, Rate, Like, QuestionCollection, Comment} = require("../database")
const hostUrl = "mongodb://127.0.0.1:27017/SCIMUS"
mongoose.connect(hostUrl)
        .then(() => {
            console.log("mongodb connected")})
        .catch(err => console.error(err))

async function del() {
  await Question.deleteMany({})
}

async function addQuestions() {
  const questions = [
    // --- 7001: Processor Structure & Function ---
    {
      question_id: 1000,
      topic_id: 7001,
      user_tag: "@admin",
      name: "Von Neumann Architecture",
      content: "Describe the role of the Control Unit (CU) within the Von Neumann architecture.",
      mark_scheme: "1. Decodes instructions.\n2. Sends control signals to coordinate data movement.\n3. Controls the timing of the CPU.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1001,
      topic_id: 7001,
      user_tag: "@admin",
      name: "CPU Registers",
      content: "Explain the relationship between the Memory Address Register (MAR) and the Memory Data Register (MDR) during a read operation.",
      mark_scheme: "1. MAR holds the address of the data to be fetched.\n2. Address is sent via Address Bus.\n3. Data at that address is transferred via Data Bus to the MDR.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1002,
      topic_id: 7001,
      user_tag: "@admin",
      name: "The System Clock",
      content: "How does increasing the clock speed affect the performance of a processor? Include one potential drawback.",
      mark_scheme: "1. Performance increases as more instructions are executed per second.\n2. Drawback: Generates more heat/consumes more power.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7002: Types of Processor ---
    {
      question_id: 1003,
      topic_id: 7002,
      user_tag: "@admin",
      name: "RISC vs CISC",
      content: "Compare RISC and CISC processors in terms of instruction complexity and hardware design.",
      mark_scheme: "1. RISC: Simple instructions, one clock cycle, requires more RAM.\n2. CISC: Complex instructions, multiple cycles, complex hardware but smaller code size.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1004,
      topic_id: 7002,
      user_tag: "@admin",
      name: "GPUs in Computing",
      content: "Why are GPUs more suitable for rendering 3D graphics than standard CPUs?",
      mark_scheme: "1. GPUs have thousands of smaller cores.\n2. Designed for parallel processing.\n3. Can handle identical operations on multiple data points simultaneously (SIMD).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1005,
      topic_id: 7002,
      user_tag: "@admin",
      name: "Parallel Processing",
      content: "Define the term 'Parallel Processing' and state one difficulty in implementing it.",
      mark_scheme: "1. Simultaneous execution of different tasks on multiple processor cores.\n2. Difficulty: Algorithms are hard to write/debug; sequential tasks cannot be parallelized.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7003: Input Output and Storage ---
    {
      question_id: 1006,
      topic_id: 7003,
      user_tag: "@admin",
      name: "Magnetic vs SSD",
      content: "Give two reasons why a Solid State Drive (SSD) is preferred over a Magnetic Hard Disk for a laptop.",
      mark_scheme: "1. Faster read/write speeds.\n2. No moving parts (more durable/silent).\n3. Lower power consumption.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1007,
      topic_id: 7003,
      user_tag: "@admin",
      name: "Optical Storage",
      content: "Explain how data is read from a CD-ROM.",
      mark_scheme: "1. Laser beam shines onto disk surface.\n2. Pits and Lands reflect light differently.\n3. Sensor detects reflection changes and converts to binary.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1008,
      topic_id: 7003,
      user_tag: "@admin",
      name: "Input Devices",
      content: "Identify an appropriate input device for a graphical designer and justify your choice.",
      mark_scheme: "1. Graphics Tablet.\n2. Allows for precision drawing and pressure sensitivity similar to pen and paper.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7004: Systems Software ---
    {
      question_id: 1009,
      topic_id: 7004,
      user_tag: "@admin",
      name: "Operating System Roles",
      content: "List three primary functions of an Operating System.",
      mark_scheme: "1. Memory Management.\n2. Processor Scheduling.\n3. Peripheral Management (Drivers).\n4. User Interface.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1010,
      topic_id: 7004,
      user_tag: "@admin",
      name: "Virtual Memory",
      content: "Describe the process of Paging in the context of Virtual Memory.",
      mark_scheme: "1. RAM is full.\n2. OS moves inactive pages to secondary storage (swap file).\n3. Pages are swapped back to RAM when needed.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1011,
      topic_id: 7004,
      user_tag: "@admin",
      name: "BIOS",
      content: "What is the function of the BIOS during the boot sequence?",
      mark_scheme: "1. Performs POST (Power On Self Test).\n2. Initializes hardware.\n3. Loads the Bootstrap Loader to start the OS.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7005: Applications Generation ---
    {
      question_id: 1012,
      topic_id: 7005,
      user_tag: "@admin",
      name: "Utility Software",
      content: "Explain the purpose of disk defragmentation software.",
      mark_scheme: "1. Reorganizes files on a magnetic disk.\n2. Moves file parts to contiguous sectors.\n3. Reduces read/write head movement, speeding up access.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1013,
      topic_id: 7005,
      user_tag: "@admin",
      name: "Open Source vs Closed",
      content: "State one advantage of Open Source software and one advantage of Proprietary software.",
      mark_scheme: "1. Open Source: Free to modify/distribute, community support.\n2. Proprietary: Professional support, polished user experience, copyright protection.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1014,
      topic_id: 7005,
      user_tag: "@admin",
      name: "Translators",
      content: "What is the difference between a Compiler and an Interpreter?",
      mark_scheme: "1. Compiler: Translates entire code at once, produces executable, errors reported at end.\n2. Interpreter: Translates line-by-line, stops at first error, no executable produced.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7006: Software Development ---
    {
      question_id: 1015,
      topic_id: 7006,
      user_tag: "@admin",
      name: "Waterfall Lifecycle",
      content: "Describe the Waterfall Model of software development.",
      mark_scheme: "1. Linear sequential phases (Analysis, Design, Implementation, Testing, Maintenance).\n2. Each phase must complete before the next begins.\n3. Hard to revisit previous stages.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1016,
      topic_id: 7006,
      user_tag: "@admin",
      name: "Agile Methodologies",
      content: "Why is Agile development often preferred for projects with changing requirements?",
      mark_scheme: "1. Iterative approach.\n2. Frequent feedback loops with user.\n3. Flexibility to change features during development sprints.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1017,
      topic_id: 7006,
      user_tag: "@admin",
      name: "Types of Testing",
      content: "Distinguish between Black Box and White Box testing.",
      mark_scheme: "1. Black Box: Testing functionality without seeing internal code (inputs/outputs).\n2. White Box: Testing internal logic and structure of the code.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7007: Programming Language Types ---
    {
      question_id: 1018,
      topic_id: 7007,
      user_tag: "@admin",
      name: "Procedural Languages",
      content: "Define what makes a language 'Procedural'.",
      mark_scheme: "1. Based on calling procedures/functions.\n2. Uses sequence, selection, and iteration.\n3. Step-by-step logic.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1019,
      topic_id: 7007,
      user_tag: "@admin",
      name: "Assembly Language",
      content: "What is the relationship between Assembly Language and Machine Code?",
      mark_scheme: "1. One-to-one relationship.\n2. Assembly uses mnemonics (LDA, ADD) for machine opcodes.\n3. Assembler translates it to binary.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1020,
      topic_id: 7007,
      user_tag: "@admin",
      name: "Object Oriented",
      content: "Explain the concept of 'Inheritance' in OOP.",
      mark_scheme: "1. A child class derives attributes and methods from a parent class.\n2. Promotes code reusability.\n3. Allows overriding of methods.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7008: Compression Encryption Hashing ---
    {
      question_id: 1021,
      topic_id: 7008,
      user_tag: "@admin",
      name: "Lossy vs Lossless",
      content: "Explain why Lossless compression is essential for text files but Lossy is acceptable for images.",
      mark_scheme: "1. Text: Removing data changes meaning/corrupts file.\n2. Images: Human eye cannot perceive minor pixel data loss; significantly reduces file size.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1022,
      topic_id: 7008,
      user_tag: "@admin",
      name: "Hashing",
      content: "How is hashing used to store user passwords securely?",
      mark_scheme: "1. Password is run through a hash function.\n2. Only the digest (hash) is stored.\n3. Cannot be reversed to find original password.\n4. Salt is added to prevent rainbow table attacks.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1023,
      topic_id: 7008,
      user_tag: "@admin",
      name: "Symmetric Encryption",
      content: "What is the main weakness of Symmetric Encryption compared to Asymmetric Encryption?",
      mark_scheme: "1. Key Exchange problem.\n2. Both parties need the same key.\n3. If the key is intercepted during transfer, the communication is compromised.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7009: Databases ---
    {
      question_id: 1024,
      topic_id: 7009,
      user_tag: "@admin",
      name: "Relational Databases",
      content: "Define what a 'Primary Key' and a 'Foreign Key' are.",
      mark_scheme: "1. Primary Key: Unique identifier for a record in a table.\n2. Foreign Key: Attribute that links to a Primary Key in another table to create a relationship.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1025,
      topic_id: 7009,
      user_tag: "@admin",
      name: "Normalization",
      content: "Describe the requirements for a database table to be in Third Normal Form (3NF).",
      mark_scheme: "1. Must be in 2NF (No partial dependencies).\n2. No transitive dependencies (All non-key attributes depend only on the primary key).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1026,
      topic_id: 7009,
      user_tag: "@admin",
      name: "SQL Injection",
      content: "What is SQL Injection and how can it be prevented?",
      mark_scheme: "1. Malicious SQL code entered into input fields to manipulate the database.\n2. Prevention: Use Prepared Statements / Parameterized Queries.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7010: Networks ---
    {
      question_id: 1027,
      topic_id: 7010,
      user_tag: "@admin",
      name: "TCP/IP Stack",
      content: "List the four layers of the TCP/IP stack in order.",
      mark_scheme: "1. Application Layer.\n2. Transport Layer.\n3. Internet (Network) Layer.\n4. Link (Network Interface) Layer.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1028,
      topic_id: 7010,
      user_tag: "@admin",
      name: "Packet Switching",
      content: "Explain how Packet Switching works.",
      mark_scheme: "1. Data broken into packets.\n2. Each packet travels independently via best route.\n3. Packets reassembled at destination using sequence numbers.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1029,
      topic_id: 7010,
      user_tag: "@admin",
      name: "Network Topologies",
      content: "State one advantage and one disadvantage of a Star Topology.",
      mark_scheme: "1. Advantage: If one cable fails, only that device is affected; easy to add nodes.\n2. Disadvantage: Dependent on central switch/server; cabling is expensive.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7011: Web Technologies ---
    {
      question_id: 1030,
      topic_id: 7011,
      user_tag: "@admin",
      name: "HTML and CSS",
      content: "Distinguish between the roles of HTML and CSS in web development.",
      mark_scheme: "1. HTML: Defines the structure and content.\n2. CSS: Defines the style and layout (presentation).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1031,
      topic_id: 7011,
      user_tag: "@admin",
      name: "Client vs Server Side",
      content: "Why might a validation check be performed on the client-side rather than the server-side?",
      mark_scheme: "1. Reduces server load.\n2. Faster feedback for the user (no network latency).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1032,
      topic_id: 7011,
      user_tag: "@admin",
      name: "Search Indexing",
      content: "Explain the function of a 'Web Crawler' (Spider).",
      mark_scheme: "1. Browses the web systematically.\n2. Indexes content of pages.\n3. Follows links to discover new pages for search engines.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7012: Data Types ---
    {
      question_id: 1033,
      topic_id: 7012,
      user_tag: "@admin",
      name: "Floating Point",
      content: "Convert the binary number 10.11 to denary.",
      mark_scheme: "1. Integer part (10) = 2.\n2. Fractional part (0.11) = 0.5 + 0.25 = 0.75.\n3. Total = 2.75.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1034,
      topic_id: 7012,
      user_tag: "@admin",
      name: "Two's Complement",
      content: "Show the representation of -6 in 4-bit Two's Complement.",
      mark_scheme: "1. +6 is 0110.\n2. Flip bits: 1001.\n3. Add 1: 1010.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1035,
      topic_id: 7012,
      user_tag: "@admin",
      name: "ASCII vs Unicode",
      content: "Why has Unicode largely replaced ASCII in modern computing?",
      mark_scheme: "1. ASCII is 7/8-bit, limited to English characters.\n2. Unicode is 16/32-bit, supports all global languages and emojis.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7013: Data Structures ---
    {
      question_id: 1036,
      topic_id: 7013,
      user_tag: "@admin",
      name: "Stacks",
      content: "Describe the LIFO property of a Stack data structure.",
      mark_scheme: "1. Last In First Out.\n2. The last item pushed onto the stack is the first one popped off.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1037,
      topic_id: 7013,
      user_tag: "@admin",
      name: "Linked Lists",
      content: "What does each node in a Linked List contain?",
      mark_scheme: "1. The data items.\n2. A pointer/reference to the next node.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1038,
      topic_id: 7013,
      user_tag: "@admin",
      name: "Trees",
      content: "In a Binary Search Tree, where would a value smaller than the root node be placed?",
      mark_scheme: "1. In the left subtree.\n2. Specifically, as a left child of the node.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7014: Boolean Algebra ---
    {
      question_id: 1039,
      topic_id: 7014,
      user_tag: "@admin",
      name: "De Morgan's Laws",
      content: "Simplify the expression NOT (A OR B) using De Morgan's Law.",
      mark_scheme: "1. (NOT A) AND (NOT B).\n2. Break the bar, change the sign.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1040,
      topic_id: 7014,
      user_tag: "@admin",
      name: "Logic Gates",
      content: "Draw or describe the Truth Table for an XOR gate.",
      mark_scheme: "1. 0 0 -> 0\n2. 0 1 -> 1\n3. 1 0 -> 1\n4. 1 1 -> 0",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1041,
      topic_id: 7014,
      user_tag: "@admin",
      name: "Karnaugh Maps",
      content: "What is the primary use of a Karnaugh Map?",
      mark_scheme: "1. To simplify boolean expressions.\n2. To minimize the number of logic gates needed in a circuit.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7015: Adders and Logic Circuits ---
    {
      question_id: 1042,
      topic_id: 7015,
      user_tag: "@admin",
      name: "Half Adder",
      content: "Which two logic gates make up a Half Adder?",
      mark_scheme: "1. XOR gate (for Sum).\n2. AND gate (for Carry).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1043,
      topic_id: 7015,
      user_tag: "@admin",
      name: "Full Adder",
      content: "Why is a Full Adder needed instead of a Half Adder when chaining circuits?",
      mark_scheme: "1. Full Adder has a 'Carry In' input.\n2. Allows it to handle the carry bit from the previous bit position.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1044,
      topic_id: 7015,
      user_tag: "@admin",
      name: "Flip-Flops",
      content: "What is the function of a D-Type Flip-Flop?",
      mark_scheme: "1. Stores 1 bit of data.\n2. Output changes only at the clock edge (synchronous).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7016: Computing Legislation ---
    {
      question_id: 1045,
      topic_id: 7016,
      user_tag: "@admin",
      name: "Data Protection Act",
      content: "State one principle of the Data Protection Act (GDPR).",
      mark_scheme: "1. Data must be used fairly, lawfully and transparently.\n2. Used for specified, explicit purposes.\n3. Accurate and kept up to date.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1046,
      topic_id: 7016,
      user_tag: "@admin",
      name: "Computer Misuse Act",
      content: "What are the three levels of offense under the Computer Misuse Act?",
      mark_scheme: "1. Unauthorized access.\n2. Unauthorized access with intent to commit further offense.\n3. Unauthorized modification of computer material.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1047,
      topic_id: 7016,
      user_tag: "@admin",
      name: "Copyright Design Patent",
      content: "How does the Copyright Designs and Patents Act apply to software piracy?",
      mark_scheme: "1. Makes it illegal to copy, distribute or use software without a license.\n2. Protects intellectual property of the creator.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7017: Moral and Ethical Issues ---
    {
      question_id: 1048,
      topic_id: 7017,
      user_tag: "@admin",
      name: "AI Ethics",
      content: "Discuss an ethical concern regarding the use of AI in hiring processes.",
      mark_scheme: "1. Algorithmic bias based on historical data.\n2. Lack of transparency in decision making.\n3. Discrimination against minorities.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1049,
      topic_id: 7017,
      user_tag: "@admin",
      name: "Environmental Impact",
      content: "How does the disposal of computer equipment affect the environment?",
      mark_scheme: "1. E-waste contains toxic chemicals (lead, mercury).\n2. Contaminates soil and water if dumped in landfills.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1050,
      topic_id: 7017,
      user_tag: "@admin",
      name: "Digital Divide",
      content: "What is meant by the 'Digital Divide'?",
      mark_scheme: "1. The gap between those who have access to technology/internet and those who do not.\n2. Causes disparity in education and job opportunities.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7018: Thinking Abstractly ---
    {
      question_id: 1051,
      topic_id: 7018,
      user_tag: "@admin",
      name: "Abstraction",
      content: "Define Abstraction in Computer Science.",
      mark_scheme: "1. Removing unnecessary details.\n2. Focusing only on the essential features of the problem.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1052,
      topic_id: 7018,
      user_tag: "@admin",
      name: "Representation",
      content: "How is a map of the London Underground an example of abstraction?",
      mark_scheme: "1. Does not show real distances or curves.\n2. Only shows stations and connections (topology) which is what the passenger needs.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1053,
      topic_id: 7018,
      user_tag: "@admin",
      name: "Information Hiding",
      content: "Explain how 'Information Hiding' relates to abstraction.",
      mark_scheme: "1. Data is hidden behind a simplified interface.\n2. The user interacts with the abstraction without needing to know internal complexity.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7019: Thinking Ahead ---
    {
      question_id: 1054,
      topic_id: 7019,
      user_tag: "@admin",
      name: "Caching",
      content: "How does Caching demonstrate 'Thinking Ahead'?",
      mark_scheme: "1. Predicting which data will be needed next.\n2. Storing it in faster memory to reduce access time.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1055,
      topic_id: 7019,
      user_tag: "@admin",
      name: "Pre-fetching",
      content: "What is 'Pre-fetching' in web browsing?",
      mark_scheme: "1. Browser loads linked pages in the background.\n2. Anticipates user clicks to speed up browsing.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1056,
      topic_id: 7019,
      user_tag: "@admin",
      name: "Inputs and Outputs",
      content: "Why is identifying inputs and outputs the first step in problem solving?",
      mark_scheme: "1. Defines the scope of the problem.\n2. Ensures the solution produces the correct result from available data.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7020: Thinking Procedurally ---
    {
      question_id: 1057,
      topic_id: 7020,
      user_tag: "@admin",
      name: "Decomposition",
      content: "What is Problem Decomposition?",
      mark_scheme: "1. Breaking a complex problem into smaller, manageable sub-problems.\n2. Each sub-problem can be solved individually.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1058,
      topic_id: 7020,
      user_tag: "@admin",
      name: "Top-Down Design",
      content: "Describe the Top-Down design approach.",
      mark_scheme: "1. Starts with the main system.\n2. Breaks it down into subsystems/modules.\n3. Continues until base level functions are reached.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1059,
      topic_id: 7020,
      user_tag: "@admin",
      name: "Modularisation",
      content: "State two benefits of writing modular code.",
      mark_scheme: "1. Easier to debug/test.\n2. Code reusability.\n3. Parallel development by teams.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7021: Thinking Logically ---
    {
      question_id: 1060,
      topic_id: 7021,
      user_tag: "@admin",
      name: "Sequence Selection Iteration",
      content: "Identify the three basic constructs of structured programming.",
      mark_scheme: "1. Sequence (Order of execution).\n2. Selection (If/Else).\n3. Iteration (Loops).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1061,
      topic_id: 7021,
      user_tag: "@admin",
      name: "Decision Tables",
      content: "What is a Decision Table used for?",
      mark_scheme: "1. Mapping conditions to actions.\n2. Used when logic involves multiple complex conditions.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1062,
      topic_id: 7021,
      user_tag: "@admin",
      name: "Flowcharts",
      content: "In a flowchart, what shape represents a decision?",
      mark_scheme: "1. A Diamond shape.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7022: Thinking Concurrently ---
    {
      question_id: 1063,
      topic_id: 7022,
      user_tag: "@admin",
      name: "Concurrency",
      content: "Define Concurrent Processing.",
      mark_scheme: "1. Multiple tasks appear to execute simultaneously.\n2. Processor switches between tasks rapidly (time slicing).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1064,
      topic_id: 7022,
      user_tag: "@admin",
      name: "Race Conditions",
      content: "What is a 'Race Condition'?",
      mark_scheme: "1. Output depends on the timing/sequence of uncontrolled events.\n2. Two threads access shared data simultaneously causing corruption.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1065,
      topic_id: 7022,
      user_tag: "@admin",
      name: "Deadlock",
      content: "Explain the concept of 'Deadlock' in concurrency.",
      mark_scheme: "1. Two processes are waiting for each other to release a resource.\n2. Neither can proceed.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7023: Programming Techniques ---
    {
      question_id: 1066,
      topic_id: 7023,
      user_tag: "@admin",
      name: "Recursion",
      content: "What are the two essential parts of a Recursive function?",
      mark_scheme: "1. Base Case (Stopping condition).\n2. Recursive Case (Function calls itself).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1067,
      topic_id: 7023,
      user_tag: "@admin",
      name: "Global vs Local",
      content: "Why is it good practice to avoid Global Variables?",
      mark_scheme: "1. Harder to debug (modified anywhere).\n2. Increases memory usage (remain in memory).\n3. Naming conflicts.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1068,
      topic_id: 7023,
      user_tag: "@admin",
      name: "IDEs",
      content: "List three features of an Integrated Development Environment (IDE) that help programmers.",
      mark_scheme: "1. Syntax Highlighting.\n2. Debugging tools (Breakpoints).\n3. Auto-completion (IntelliSense).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7024: Computational Methods ---
    {
      question_id: 1069,
      topic_id: 7024,
      user_tag: "@admin",
      name: "Divide and Conquer",
      content: "How does the 'Divide and Conquer' strategy work?",
      mark_scheme: "1. Break problem into smaller sub-problems.\n2. Solve sub-problems recursively.\n3. Combine results.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1070,
      topic_id: 7024,
      user_tag: "@admin",
      name: "Backtracking",
      content: "Describe the Backtracking algorithm approach.",
      mark_scheme: "1. Build solution incrementally.\n2. Abandon partial solutions (backtrack) as soon as they are determined invalid.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1071,
      topic_id: 7024,
      user_tag: "@admin",
      name: "Heuristics",
      content: "What is a Heuristic method?",
      mark_scheme: "1. 'Rule of thumb' or educated guess.\n2. Finds a 'good enough' solution when finding the perfect one is too slow.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7025: Algorithm Analysis and Design ---
    {
      question_id: 1072,
      topic_id: 7025,
      user_tag: "@admin",
      name: "Big O Notation",
      content: "What does Big O notation measure?",
      mark_scheme: "1. The time or space complexity of an algorithm.\n2. How execution time grows as input size (n) increases.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1073,
      topic_id: 7025,
      user_tag: "@admin",
      name: "Time Complexity",
      content: "Compare O(n) and O(n^2) complexities.",
      mark_scheme: "1. O(n): Linear time (loops once).\n2. O(n^2): Polynomial/Quadratic time (nested loops).\n3. O(n^2) is significantly slower for large n.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1074,
      topic_id: 7025,
      user_tag: "@admin",
      name: "Space Complexity",
      content: "Why might a recursive algorithm have high space complexity?",
      mark_scheme: "1. Each recursive call adds a frame to the call stack.\n2. Deep recursion consumes significant stack memory.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7026: Algorithms on Data Structures ---
    {
      question_id: 1075,
      topic_id: 7026,
      user_tag: "@admin",
      name: "Stack Operations",
      content: "What happens if you try to Pop from an empty Stack?",
      mark_scheme: "1. Stack Underflow error.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1076,
      topic_id: 7026,
      user_tag: "@admin",
      name: "Queue Operations",
      content: "Explain the Enqueue operation.",
      mark_scheme: "1. Adds an item to the rear of the queue.\n2. Checks for overflow first.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1077,
      topic_id: 7026,
      user_tag: "@admin",
      name: "Traversing Lists",
      content: "What is the time complexity of finding an item in an unsorted Linked List?",
      mark_scheme: "1. O(n).\n2. Linear search is required as you must traverse pointers from the head.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7027: Sorting Algorithms ---
    {
      question_id: 1078,
      topic_id: 7027,
      user_tag: "@admin",
      name: "Bubble Sort",
      content: "Briefly explain how Bubble Sort works.",
      mark_scheme: "1. Compare adjacent elements.\n2. Swap if in wrong order.\n3. Repeat passes until no swaps occur.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1079,
      topic_id: 7027,
      user_tag: "@admin",
      name: "Merge Sort",
      content: "What is the time complexity of Merge Sort and why?",
      mark_scheme: "1. O(n log n).\n2. Divide step is log n, Merge step is n.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1080,
      topic_id: 7027,
      user_tag: "@admin",
      name: "Quick Sort",
      content: "What is the role of the 'Pivot' in Quick Sort?",
      mark_scheme: "1. Element selected to partition the array.\n2. Smaller items move to left, larger to right.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7028: Searching Algorithms ---
    {
      question_id: 1081,
      topic_id: 7028,
      user_tag: "@admin",
      name: "Binary Search",
      content: "What precondition is required to perform a Binary Search?",
      mark_scheme: "1. The list must be sorted.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1082,
      topic_id: 7028,
      user_tag: "@admin",
      name: "Linear Search",
      content: "When is Linear Search preferred over Binary Search?",
      mark_scheme: "1. When the list is small.\n2. When the list is unsorted.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1083,
      topic_id: 7028,
      user_tag: "@admin",
      name: "Search Complexity",
      content: "Compare the worst-case complexities of Linear and Binary Search.",
      mark_scheme: "1. Linear: O(n).\n2. Binary: O(log n).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },

    // --- 7029: Path Finding Algorithms ---
    {
      question_id: 1084,
      topic_id: 7029,
      user_tag: "@admin",
      name: "Dijkstra's Algorithm",
      content: "What is the goal of Dijkstra's Algorithm?",
      mark_scheme: "1. To find the shortest path from a start node to every other node in a weighted graph.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1085,
      topic_id: 7029,
      user_tag: "@admin",
      name: "A* Algorithm",
      content: "How does A* improve upon Dijkstra's Algorithm?",
      mark_scheme: "1. Uses a heuristic function (h(n)).\n2. Estimates cost to goal to guide the search more efficiently.",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    },
    {
      question_id: 1086,
      topic_id: 7029,
      user_tag: "@admin",
      name: "Graphs",
      content: "What is the difference between a weighted and unweighted graph in pathfinding?",
      mark_scheme: "1. Weighted: Edges have costs/distances.\n2. Unweighted: All edges have equal value (usually 1).",
      tag: 1,
      published: true, study_stage:1, subject_id:6
    }
  ];

  await del()

  await Question.insertMany(questions).then(() => {})

  await Question.updateMany(
    {user_tag: "@admin"},
    {$set: {user_tag:"admin"}}
  )

  await Question.updateMany(
    {},
    {$set: {user_tag:"admin"}}
  )
  
  console.log("Inserted " + questions.length + " questions.");

  await Watch.deleteMany({})
  await Solve.deleteMany({})
  await Rate.deleteMany({})
  await Like.deleteMany({})
  await Comment.deleteMany({})
  await QuestionCollection.deleteMany({})
}

addQuestions()
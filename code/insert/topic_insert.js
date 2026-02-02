const mongoose = require("mongoose")
const {Topic} = require("../database")
const hostUrl = "mongodb://127.0.0.1:27017/SCIMUS"
mongoose.connect(hostUrl)
        .then(() => {
            console.log("mongodb connected")})
        .catch(err => console.error(err))

async function del() {
  await Topic.deleteMany({})
}

del()

Topic.insertMany([
  // ======================
  // GCSE SUBJECTS
  // ======================

  // GCSE Physics (subject_id: 10)
  { topic_id: 1001, subject_id: 10, name: "Energy" },
  { topic_id: 1002, subject_id: 10, name: "Electricity" },
  { topic_id: 1003, subject_id: 10, name: "Particle Model of Matter" },
  { topic_id: 1004, subject_id: 10, name: "Atomic Structure" },
  { topic_id: 1005, subject_id: 10, name: "Forces" },
  { topic_id: 1006, subject_id: 10, name: "Waves" },
  { topic_id: 1007, subject_id: 10, name: "Magnetism and Electromagnetism" },
  { topic_id: 1008, subject_id: 10, name: "Space Physics" },

  // GCSE Chemistry (subject_id: 9)
  { topic_id: 2001, subject_id: 9, name: "Key Concepts in Chemistry" },
  { topic_id: 2002, subject_id: 9, name: "States of Matter and Mixtures" },
  { topic_id: 2003, subject_id: 9, name: "Chemical Changes" },
  { topic_id: 2004, subject_id: 9, name: "Extracting Metals & Equilibria" },
  { topic_id: 2005, subject_id: 9, name: "Groups in the Periodic Table" },
  { topic_id: 2006, subject_id: 9, name: "Rates of Reaction and Energy" },
  { topic_id: 2007, subject_id: 9, name: "Fuels and Earth Science" },

  // GCSE Biology (subject_id: 8)
  { topic_id: 3001, subject_id: 8, name: "Key Concepts in Biology" },
  { topic_id: 3002, subject_id: 8, name: "Cells and Control" },
  { topic_id: 3003, subject_id: 8, name: "Genetics" },
  { topic_id: 3004, subject_id: 8, name: "Natural Selection and GM" },
  { topic_id: 3005, subject_id: 8, name: "Health and Disease" },
  { topic_id: 3006, subject_id: 8, name: "Plant Structures and Functions" },
  { topic_id: 3007, subject_id: 8, name: "Animal Coordination & Control" },
  { topic_id: 3008, subject_id: 8, name: "Exchange and Transport" },
  { topic_id: 3009, subject_id: 8, name: "Ecosystems and Material Cycles" },

  // GCSE Maths (subject_id: 7)
  { topic_id: 4001, subject_id: 7, name: "Number" },
  { topic_id: 4002, subject_id: 7, name: "Algebra" },
  { topic_id: 4003, subject_id: 7, name: "Ratio, Proportion and Rates" },
  { topic_id: 4004, subject_id: 7, name: "Geometry and Measures" },
  { topic_id: 4005, subject_id: 7, name: "Probability" },
  { topic_id: 4006, subject_id: 7, name: "Statistics" },

  // ======================
  // A-LEVEL SUBJECTS
  // ======================

  // A-Level Maths (subject_id: 1)
  { topic_id: 5001, subject_id: 1, name: "Proof" },
  { topic_id: 5002, subject_id: 1, name: "Algebra and Functions" },
  { topic_id: 5003, subject_id: 1, name: "Coordinate Geometry" },
  { topic_id: 5004, subject_id: 1, name: "Sequences and Series" },
  { topic_id: 5005, subject_id: 1, name: "Trigonometry" },
  { topic_id: 5006, subject_id: 1, name: "Exponentials and Logarithms" },
  { topic_id: 5007, subject_id: 1, name: "Differentiation" },
  { topic_id: 5008, subject_id: 1, name: "Integration" },
  { topic_id: 5009, subject_id: 1, name: "Numerical Methods" },
  { topic_id: 5010, subject_id: 1, name: "Vectors" },
  { topic_id: 5011, subject_id: 1, name: "Sampling" },
  { topic_id: 5012, subject_id: 1, name: "Data Presentation" },
  { topic_id: 5013, subject_id: 1, name: "Probability" },
  { topic_id: 5014, subject_id: 1, name: "Statistical Distributions" },
  { topic_id: 5015, subject_id: 1, name: "Hypothesis Testing" },
  { topic_id: 5016, subject_id: 1, name: "Quantities and Units" },
  { topic_id: 5017, subject_id: 1, name: "Kinematics" },
  { topic_id: 5018, subject_id: 1, name: "Forces and Newtons Laws" },
  { topic_id: 5019, subject_id: 1, name: "Moments" },

  // A-Level Further Maths (subject_id: 2)
  { topic_id: 6001, subject_id: 2, name: "Matrices" },
  { topic_id: 6002, subject_id: 2, name: "Complex Numbers" },
  { topic_id: 6003, subject_id: 2, name: "Roots of Polynomials" },
  { topic_id: 6004, subject_id: 2, name: "Vectors and 3D Space" },
  { topic_id: 6005, subject_id: 2, name: "Series and Proof" },
  { topic_id: 6006, subject_id: 2, name: "Further Calculus" },
  { topic_id: 6007, subject_id: 2, name: "Polar Coordinates" },
  { topic_id: 6008, subject_id: 2, name: "Maclaurin Series" },
  { topic_id: 6009, subject_id: 2, name: "Hyperbolic Functions" },
  { topic_id: 6010, subject_id: 2, name: "Differential Equations" },
  { topic_id: 6011, subject_id: 2, name: "Discrete Random Variables" },
  { topic_id: 6012, subject_id: 2, name: "Chi Squared Tests" },
  { topic_id: 6013, subject_id: 2, name: "Work Energy and Power" },
  { topic_id: 6014, subject_id: 2, name: "Impulse and Momentum" },
  { topic_id: 6015, subject_id: 2, name: "Algorithms" },
  { topic_id: 6016, subject_id: 2, name: "Graphs and Networks" },
  { topic_id: 6017, subject_id: 2, name: "Linear Programming" },

  // A-Level Computer Science (subject_id: 6)
  { topic_id: 7001, subject_id: 6, name: "Processor Structure & Function" },
  { topic_id: 7002, subject_id: 6, name: "Types of Processor" },
  { topic_id: 7003, subject_id: 6, name: "Input Output and Storage" },
  { topic_id: 7004, subject_id: 6, name: "Systems Software" },
  { topic_id: 7005, subject_id: 6, name: "Applications Generation" },
  { topic_id: 7006, subject_id: 6, name: "Software Development" },
  { topic_id: 7007, subject_id: 6, name: "Programming Language Types" },
  { topic_id: 7008, subject_id: 6, name: "Compression Encryption Hashing" },
  { topic_id: 7009, subject_id: 6, name: "Databases" },
  { topic_id: 7010, subject_id: 6, name: "Networks" },
  { topic_id: 7011, subject_id: 6, name: "Web Technologies" },
  { topic_id: 7012, subject_id: 6, name: "Data Types" },
  { topic_id: 7013, subject_id: 6, name: "Data Structures" },
  { topic_id: 7014, subject_id: 6, name: "Boolean Algebra" },
  { topic_id: 7015, subject_id: 6, name: "Adders and Logic Circuits" },
  { topic_id: 7016, subject_id: 6, name: "Computing Legislation" },
  { topic_id: 7017, subject_id: 6, name: "Moral and Ethical Issues" },
  { topic_id: 7018, subject_id: 6, name: "Thinking Abstractly" },
  { topic_id: 7019, subject_id: 6, name: "Thinking Ahead" },
  { topic_id: 7020, subject_id: 6, name: "Thinking Procedurally" },
  { topic_id: 7021, subject_id: 6, name: "Thinking Logically" },
  { topic_id: 7022, subject_id: 6, name: "Thinking Concurrently" },
  { topic_id: 7023, subject_id: 6, name: "Programming Techniques" },
  { topic_id: 7024, subject_id: 6, name: "Computational Methods" },
  { topic_id: 7025, subject_id: 6, name: "Algorithm Analysis and Design" },
  { topic_id: 7026, subject_id: 6, name: "Algorithms on Data Structures" },
  { topic_id: 7027, subject_id: 6, name: "Sorting Algorithms" },
  { topic_id: 7028, subject_id: 6, name: "Searching Algorithms" },
  { topic_id: 7029, subject_id: 6, name: "Path Finding Algorithms" },

  // A-Level Physics (subject_id: 5)
  { topic_id: 8001, subject_id: 5, name: "Practical Skills" },
  { topic_id: 8002, subject_id: 5, name: "Foundations of Physics" },
  { topic_id: 8003, subject_id: 5, name: "Motion" },
  { topic_id: 8004, subject_id: 5, name: "Forces in Action" },
  { topic_id: 8005, subject_id: 5, name: "Work Energy and Power" },
  { topic_id: 8006, subject_id: 5, name: "Materials" },
  { topic_id: 8007, subject_id: 5, name: "Momentum and Laws of Motion" },
  { topic_id: 8008, subject_id: 5, name: "Charge and Current" },
  { topic_id: 8009, subject_id: 5, name: "Energy Power and Resistance" },
  { topic_id: 8010, subject_id: 5, name: "Electrical Circuits" },
  { topic_id: 8011, subject_id: 5, name: "Waves" },
  { topic_id: 8012, subject_id: 5, name: "Quantum Physics" },
  { topic_id: 8013, subject_id: 5, name: "Thermal Physics" },
  { topic_id: 8014, subject_id: 5, name: "Ideal Gases" },
  { topic_id: 8015, subject_id: 5, name: "Circular Motion" },
  { topic_id: 8016, subject_id: 5, name: "Oscillations" },
  { topic_id: 8017, subject_id: 5, name: "Gravitational Fields" },
  { topic_id: 8018, subject_id: 5, name: "Stars" },
  { topic_id: 8019, subject_id: 5, name: "Cosmology" },
  { topic_id: 8020, subject_id: 5, name: "Capacitance" },
  { topic_id: 8021, subject_id: 5, name: "Electric Fields" },
  { topic_id: 8022, subject_id: 5, name: "Magnetic Fields" },
  { topic_id: 8023, subject_id: 5, name: "Particle Physics" },
  { topic_id: 8024, subject_id: 5, name: "Radioactivity" },
  { topic_id: 8025, subject_id: 5, name: "Nuclear Physics" },
  { topic_id: 8026, subject_id: 5, name: "Medical Imaging" },

  // A-Level Biology (subject_id: 3)
  { topic_id: 9001, subject_id: 3, name: "Mass Transport" },
  { topic_id: 9002, subject_id: 3, name: "Cardiovascular System" },
  { topic_id: 9003, subject_id: 3, name: "Heart Disease" },
  { topic_id: 9004, subject_id: 3, name: "Data Collection and Analysis" },
  { topic_id: 9005, subject_id: 3, name: "Energy Carbohydrates and Fats" },
  { topic_id: 9006, subject_id: 3, name: "Exchange of Substances" },
  { topic_id: 9007, subject_id: 3, name: "DNA and Genetics" },
  { topic_id: 9008, subject_id: 3, name: "Proteins" },
  { topic_id: 9009, subject_id: 3, name: "Inheritance" },
  { topic_id: 9010, subject_id: 3, name: "Cell Organelles" },
  { topic_id: 9011, subject_id: 3, name: "Reproduction" },
  { topic_id: 9012, subject_id: 3, name: "Stem Cells and Epigenetics" },
  { topic_id: 9013, subject_id: 3, name: "Variety of Life" },
  { topic_id: 9014, subject_id: 3, name: "Properties of Plants" },
  { topic_id: 9015, subject_id: 3, name: "Human Impact on Resources" },
  { topic_id: 9016, subject_id: 3, name: "Populations in Ecosystems" },
  { topic_id: 9017, subject_id: 3, name: "Photosynthesis" },
  { topic_id: 9018, subject_id: 3, name: "Energy and Ecosystems" },
  { topic_id: 9019, subject_id: 3, name: "Climate Change" },
  { topic_id: 9020, subject_id: 3, name: "Natural Selection and Speciation" },
  { topic_id: 9021, subject_id: 3, name: "Forensics" },
  { topic_id: 9022, subject_id: 3, name: "Infection and Immune System" },
  { topic_id: 9023, subject_id: 3, name: "Muscles and Movement" },
  { topic_id: 9024, subject_id: 3, name: "Respiration" },
  { topic_id: 9025, subject_id: 3, name: "Cardiac Cycle and Ventilation" },
  { topic_id: 9026, subject_id: 3, name: "Homeostasis and Exercise" },
  { topic_id: 9027, subject_id: 3, name: "Gene Expression" },
  { topic_id: 9028, subject_id: 3, name: "Nervous Transmission" },
  { topic_id: 9029, subject_id: 3, name: "Responses to Stimuli" },
  { topic_id: 9030, subject_id: 3, name: "Investigating Brain Function" },
  { topic_id: 9031, subject_id: 3, name: "Gene Projects" },
  { topic_id: 9032, subject_id: 3, name: "Synaptic Transmission" },

  // A-Level Chemistry (subject_id: 4)
  { topic_id: 10001, subject_id: 4, name: "Practical Skills" },
  { topic_id: 10002, subject_id: 4, name: "Atoms and Reactions" },
  { topic_id: 10003, subject_id: 4, name: "Electrons Bonding and Structure" },
  { topic_id: 10004, subject_id: 4, name: "Periodic Table" },
  { topic_id: 10005, subject_id: 4, name: "Physical Chemistry" },
  { topic_id: 10006, subject_id: 4, name: "Rates Equilibrium and pH" },
  { topic_id: 10007, subject_id: 4, name: "Energy" },
  { topic_id: 10008, subject_id: 4, name: "Transition Elements" },
  { topic_id: 10009, subject_id: 4, name: "Basic Concepts and Hydrocarbons" },
  { topic_id: 10010, subject_id: 4, name: "Alcohols Haloalkanes Analysis" },
  { topic_id: 10011, subject_id: 4, name: "Aromatic Compounds" },
  { topic_id: 10012, subject_id: 4, name: "Carbonyls and Carboxylic Acids" },
  { topic_id: 10013, subject_id: 4, name: "Nitrogen Compounds" },
  { topic_id: 10014, subject_id: 4, name: "Polymers and Synthesis" },
  { topic_id: 10015, subject_id: 4, name: "Chemical Analysis" }
]);

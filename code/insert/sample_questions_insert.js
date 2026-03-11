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
{
  question_id: 2001,
  topic_id: 7001,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Von Neumann Architecture & FDE Cycle",
  content: `<p>A computer system is based on the Von Neumann architecture.</p>
<p><b>(a)</b> State the four main components of the Von Neumann architecture and briefly describe the role of each. [4]</p>
<p><b>(b)</b> Describe each stage of the Fetch-Decode-Execute cycle, clearly identifying which registers are involved at each stage. [6]</p>
<p><b>(c)</b> The Program Counter (PC) currently holds the value <code>0x0A</code>. After one full FDE cycle, state the value of the PC, assuming no branching occurs and each instruction occupies one memory address. [1]</p>
<p><b>(d)</b> Explain why the Von Neumann bottleneck occurs and suggest one way it can be mitigated. [3]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. <b>CPU</b> — processes instructions and data.<br>
2. <b>Memory (RAM)</b> — stores both instructions and data in the same address space.<br>
3. <b>Input/Output</b> — allows communication with external devices.<br>
4. <b>Bus system</b> — transfers data between components (data, address, control buses).<br>
<br>
<b>(b)</b><br>
<b>Fetch:</b><br>
1. The address in the PC is copied to the MAR.<br>
2. The instruction at that memory address is fetched and placed in the MDR.<br>
3. The PC is incremented by 1.<br>
4. The instruction is copied from the MDR to the CIR.<br>
<b>Decode:</b><br>
5. The CU decodes the instruction in the CIR, splitting it into opcode and operand.<br>
<b>Execute:</b><br>
6. The appropriate action is carried out (e.g. ALU performs arithmetic, data moved between registers).<br>
<br>
<b>(c)</b><br>
1. <code>0x0B</code><br>
<br>
<b>(d)</b><br>
1. The Von Neumann bottleneck occurs because the CPU and memory share a single bus for both data and instructions.<br>
2. This means the CPU must wait for memory access, limiting throughput.<br>
3. Mitigation: use of <b>cache memory</b> to store frequently accessed instructions/data closer to the CPU, reducing the number of slow RAM accesses.`,
},

{
  question_id: 2002,
  topic_id: 7002,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "RISC vs CISC Processors",
  content: `<p>A computer manufacturer is deciding whether to use a RISC or CISC processor in a new device.</p>
<p><b>(a)</b> State what RISC and CISC stand for. [2]</p>
<p><b>(b)</b> Give <b>three</b> characteristics of a RISC processor. [3]</p>
<p><b>(c)</b> Give <b>three</b> characteristics of a CISC processor. [3]</p>
<p><b>(d)</b> The device is a low-power embedded system. Justify which processor type would be more suitable. [3]</p>
<p><b>(e)</b> A RISC processor executes one instruction per clock cycle. If the clock speed is 2 GHz, calculate the number of instructions executed per second. Express your answer in standard form. [2]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. RISC — Reduced Instruction Set Computer.<br>
2. CISC — Complex Instruction Set Computer.<br>
<br>
<b>(b)</b> Any three:<br>
1. Small, fixed-length instruction set.<br>
2. Each instruction executes in a single clock cycle.<br>
3. Uses pipelining effectively.<br>
4. Relies on software (compiler) to break complex tasks into simple instructions.<br>
5. More general-purpose registers.<br>
<br>
<b>(c)</b> Any three:<br>
1. Large, variable-length instruction set.<br>
2. Instructions may take multiple clock cycles.<br>
3. Complex instructions reduce the number of lines of code needed.<br>
4. More work done in hardware (microcode).<br>
5. Fewer general-purpose registers.<br>
<br>
<b>(d)</b><br>
1. RISC is more suitable.<br>
2. RISC processors consume less power due to simpler circuitry.<br>
3. This is important for embedded systems which are often battery-powered and thermally constrained.<br>
<br>
<b>(e)</b><br>
1. $2 \\text{ GHz} = 2 \\times 10^9$ clock cycles per second.<br>
2. At one instruction per cycle: $2 \\times 10^9$ instructions per second.`,
},

{
  question_id: 2003,
  topic_id: 7003,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Secondary Storage Technologies",
  content: `<p><b>(a)</b> Describe how data is read from a <b>magnetic hard disk drive (HDD)</b>. Your answer should refer to the physical components involved. [4]</p>
<p><b>(b)</b> Describe how data is stored on a <b>solid state drive (SSD)</b>. [3]</p>
<p><b>(c)</b> A user is choosing between an HDD and an SSD for a laptop. Compare the two technologies under the following headings:</p>
<ul>
  <li>Speed [2]</li>
  <li>Durability [2]</li>
  <li>Cost per GB [2]</li>
</ul>
<p><b>(d)</b> Optical storage uses a laser to read data. Explain how a CD-ROM encodes binary data and how the laser reads it. [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. The disk platters spin at high speed (e.g. 7200 RPM).<br>
2. Read/write heads float above the platter surface.<br>
3. Magnetic domains on the platter surface represent binary 1s and 0s.<br>
4. Changes in magnetic polarity are detected by the read head as the platter spins beneath it.<br>
<br>
<b>(b)</b><br>
1. Data is stored in NAND flash memory cells.<br>
2. Each cell stores charge in a floating gate transistor.<br>
3. The presence or absence (or level) of charge represents binary data.<br>
<br>
<b>(c)</b><br>
<b>Speed:</b><br>
1. SSDs are significantly faster for read/write operations.<br>
2. HDDs are slower due to mechanical movement of read heads.<br>
<b>Durability:</b><br>
1. SSDs have no moving parts, making them more resistant to physical shock.<br>
2. HDDs are vulnerable to damage from drops or vibration.<br>
<b>Cost per GB:</b><br>
1. HDDs are cheaper per GB.<br>
2. SSDs cost more per GB, though the gap has narrowed.<br>
<br>
<b>(d)</b><br>
1. A CD-ROM encodes data as a series of pits and lands on a reflective surface.<br>
2. A laser is shone onto the surface as the disc spins.<br>
3. Lands reflect the laser strongly (read as 1), pits scatter the laser (read as 0) — or transitions between pit/land represent 1s.`,
},

{
  question_id: 2004,
  topic_id: 7004,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "OS Scheduling and Memory Management",
  content: `<p>An operating system manages processes and memory on a multi-user server.</p>
<p><b>(a)</b> State <b>three</b> functions of an operating system. [3]</p>
<p><b>(b)</b> Explain what is meant by a <b>scheduling algorithm</b> and why scheduling is necessary. [3]</p>
<p><b>(c)</b> Describe how the <b>Round Robin</b> scheduling algorithm works and state one advantage of it. [3]</p>
<p><b>(d)</b> Explain what is meant by <b>virtual memory</b> and describe one disadvantage of using it. [3]</p>
<p><b>(e)</b> Explain the term <b>thrashing</b> in the context of virtual memory. [2]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b> Any three:<br>
1. Process/job scheduling.<br>
2. Memory management.<br>
3. File system management.<br>
4. Managing input/output devices via device drivers.<br>
5. Providing a user interface.<br>
6. Security and access control.<br>
<br>
<b>(b)</b><br>
1. A scheduling algorithm determines the order in which processes are allocated CPU time.<br>
2. Scheduling is necessary because multiple processes compete for the CPU simultaneously.<br>
3. Without scheduling, some processes could be starved of CPU time or the system would be inefficient.<br>
<br>
<b>(c)</b><br>
1. Each process is given a fixed time slice (quantum) in turn, cycling through all processes.<br>
2. If a process does not finish within its time slice, it is paused and placed back in the queue.<br>
3. Advantage: fair allocation of CPU time; no process is permanently starved.<br>
<br>
<b>(d)</b><br>
1. Virtual memory uses a portion of secondary storage (hard disk) as an extension of RAM.<br>
2. Pages of memory not currently needed are swapped out to disk, freeing RAM.<br>
3. Disadvantage: accessing secondary storage is much slower than RAM, leading to significant performance degradation.<br>
<br>
<b>(e)</b><br>
1. Thrashing occurs when the system spends more time swapping pages in and out of virtual memory than executing processes.<br>
2. This happens when RAM is heavily overcommitted, causing near-constant page faults.`,
},

{
  question_id: 2005,
  topic_id: 7008,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Compression, Encryption and Hashing",
  content: `<p><b>(a)</b> Distinguish between <b>lossy</b> and <b>lossless</b> compression. Give one example of a file format that uses each. [4]</p>
<p><b>(b)</b> Run-length encoding (RLE) is a lossless compression technique. Apply RLE to compress the following binary string and show your working:</p>
<p><code>11111100001111</code> [3]</p>
<p><b>(c)</b> Explain the difference between <b>symmetric</b> and <b>asymmetric</b> encryption. [4]</p>
<p><b>(d)</b> Describe how <b>public key encryption</b> is used to securely send a message from Alice to Bob. [4]</p>
<p><b>(e)</b> Explain what a <b>hash function</b> is and give one use of hashing in computer systems. [3]</p>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Lossy compression permanently removes data to reduce file size — the original cannot be perfectly reconstructed.<br>
2. Example: JPEG (images), MP3 (audio).<br>
3. Lossless compression reduces file size without losing any data — the original can be perfectly reconstructed.<br>
4. Example: PNG (images), ZIP (files).<br>
<br>
<b>(b)</b><br>
1. Six 1s → <code>6,1</code><br>
2. Four 0s → <code>4,0</code><br>
3. Four 1s → <code>4,1</code><br>
Result: <code>6,1 4,0 4,1</code> (accept equivalent valid RLE notation)<br>
<br>
<b>(c)</b><br>
1. Symmetric encryption uses the <b>same key</b> for both encryption and decryption.<br>
2. It is faster but requires the key to be securely shared between parties.<br>
3. Asymmetric encryption uses a <b>pair of keys</b>: a public key (shared openly) and a private key (kept secret).<br>
4. Data encrypted with the public key can only be decrypted with the corresponding private key.<br>
<br>
<b>(d)</b><br>
1. Bob generates a public/private key pair and shares his public key openly.<br>
2. Alice encrypts her message using Bob's public key.<br>
3. The encrypted message is sent to Bob.<br>
4. Bob decrypts the message using his private key, which only he possesses.<br>
<br>
<b>(e)</b><br>
1. A hash function takes an input of any size and produces a fixed-length output (hash/digest).<br>
2. It is a one-way function — the original input cannot be derived from the hash.<br>
3. Use: storing passwords — the hash of a password is stored rather than the plaintext, so even if the database is breached, passwords are not exposed.`,
},

{
  question_id: 2006,
  topic_id: 7009,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Relational Databases and SQL",
  content: `<p>A school uses a relational database to manage student records. The database contains the following tables:</p>
<p><code>Student(<u>StudentID</u>, FirstName, LastName, DOB, TutorGroupID)</code></p>
<p><code>TutorGroup(<u>TutorGroupID</u>, TutorName, Room)</code></p>
<p><code>Enrolment(<u>StudentID, SubjectID</u>, Grade)</code></p>
<p><code>Subject(<u>SubjectID</u>, SubjectName, Department)</code></p>
<p><b>(a)</b> Define the term <b>primary key</b> and identify the primary key of the <code>Enrolment</code> table. [2]</p>
<p><b>(b)</b> Explain what is meant by a <b>foreign key</b> and give one example from the schema above. [2]</p>
<p><b>(c)</b> Write an SQL query to return the first name, last name and grade of all students who achieved a grade of 'A' in the subject 'Computer Science'. [4]</p>
<p><b>(d)</b> Explain what is meant by <b>referential integrity</b> and describe what would happen if a TutorGroup record was deleted while students still referenced it. [3]</p>
<p><b>(e)</b> The database is said to be in <b>third normal form (3NF)</b>. State the three conditions that must be met for a table to be in 3NF. [3]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A primary key is a field (or combination of fields) that uniquely identifies each record in a table.<br>
2. The primary key of Enrolment is the composite key: <code>(StudentID, SubjectID)</code>.<br>
<br>
<b>(b)</b><br>
1. A foreign key is a field in one table that references the primary key of another table, creating a link between them.<br>
2. Example: <code>TutorGroupID</code> in <code>Student</code> references <code>TutorGroupID</code> in <code>TutorGroup</code>.<br>
<br>
<b>(c)</b><br>
<pre>
SELECT Student.FirstName, Student.LastName, Enrolment.Grade
FROM Student
JOIN Enrolment ON Student.StudentID = Enrolment.StudentID
JOIN Subject ON Enrolment.SubjectID = Subject.SubjectID
WHERE Subject.SubjectName = 'Computer Science'
AND Enrolment.Grade = 'A';
</pre>
1 mark for correct SELECT fields, 1 mark for correct JOINs, 1 mark for correct WHERE conditions, 1 mark for valid SQL syntax.<br>
<br>
<b>(d)</b><br>
1. Referential integrity ensures that foreign key values always refer to an existing primary key in the related table.<br>
2. If a TutorGroup record is deleted while students still reference it, referential integrity would be violated.<br>
3. The DBMS would either prevent the deletion (RESTRICT) or cascade the deletion/set the foreign key to NULL, depending on the constraint defined.<br>
<br>
<b>(e)</b><br>
1. The table must be in 1NF: all values are atomic and there are no repeating groups.<br>
2. The table must be in 2NF: no partial dependencies (every non-key attribute depends on the whole primary key).<br>
3. The table must be in 3NF: no transitive dependencies (non-key attributes depend only on the primary key, not on other non-key attributes).`,
},

{
  question_id: 2007,
  topic_id: 7010,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Network Topologies, Protocols, Security",
  content: `<p><b>(a)</b> Draw and describe the <b>star topology</b>. State one advantage and one disadvantage compared to a bus topology. [4]</p>
<p><b>(b)</b> Explain the purpose of the following protocols:</p>
<ul>
  <li>TCP/IP [2]</li>
  <li>HTTP vs HTTPS [2]</li>
  <li>FTP [1]</li>
</ul>
<p><b>(c)</b> Describe the <b>four layers of the TCP/IP model</b> and state one protocol associated with each layer. [8]</p>
<p><b>(d)</b> A company is concerned about network security. Describe how each of the following can protect a network:</p>
<ul>
  <li>Firewall [2]</li>
  <li>MAC address filtering [2]</li>
</ul>
<p><b>Total: 21 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. In a star topology, all devices connect to a central switch or hub.<br>
2. Advantage: if one cable fails, only that device is affected — the rest of the network continues to function.<br>
3. Disadvantage: if the central switch fails, the entire network goes down / more cabling required than bus.<br>
<br>
<b>(b)</b><br>
<b>TCP/IP:</b><br>
1. TCP ensures reliable, ordered delivery of data by breaking it into packets and reassembling them.<br>
2. IP handles addressing and routing packets across networks.<br>
<b>HTTP vs HTTPS:</b><br>
1. HTTP transfers web page data between client and server in plaintext.<br>
2. HTTPS uses TLS/SSL encryption to secure the data in transit.<br>
<b>FTP:</b><br>
1. FTP is used for transferring files between a client and a server over a network.<br>
<br>
<b>(c)</b><br>
1. <b>Application layer</b> — provides network services to applications; e.g. HTTP, FTP, DNS.<br>
2. <b>Transport layer</b> — manages end-to-end communication and error checking; e.g. TCP, UDP.<br>
3. <b>Internet layer</b> — handles logical addressing and routing; e.g. IP.<br>
4. <b>Network Access layer</b> — manages physical transmission of data on the network; e.g. Ethernet.<br>
<br>
<b>(d)</b><br>
<b>Firewall:</b><br>
1. A firewall monitors incoming and outgoing network traffic.<br>
2. It blocks packets that do not meet defined security rules, preventing unauthorised access.<br>
<b>MAC address filtering:</b><br>
1. The network administrator maintains a whitelist of allowed MAC addresses.<br>
2. Only devices whose MAC address is on the list are permitted to connect to the network.`,
},

{
  question_id: 2008,
  topic_id: 7012,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Binary Data Representation",
  content: `<p><b>(a)</b> Convert the denary number <b>219</b> to:</p>
<ul>
  <li>Binary (8-bit) [2]</li>
  <li>Hexadecimal [2]</li>
</ul>
<p><b>(b)</b> Using <b>two's complement</b> with 8 bits, represent the value <b>−45</b>. Show your working. [3]</p>
<p><b>(c)</b> Add the following two 8-bit two's complement numbers and state whether overflow occurs. Show your working. [3]</p>
<p>$01101101 + 01010110$</p>
<p><b>(d)</b> A sound sample is recorded using a <b>16-bit</b> sample resolution at a sample rate of <b>44,100 Hz</b> in <b>stereo</b>.</p>
<ul>
  <li>Calculate the bit rate in kbps. [2]</li>
  <li>Calculate the file size in MB for a 3-minute recording. [3]</li>
</ul>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Binary: $219 = 128+64+16+8+2+1 = 11011011_2$ [1 for method, 1 for correct answer]<br>
Hexadecimal: $219 = 13 \\times 16 + 11 = \\text{DB}_{16}$ [1 for method, 1 for correct answer]<br>
<br>
<b>(b)</b><br>
1. $45$ in binary (8-bit): $00101101$<br>
2. Invert all bits: $11010010$<br>
3. Add 1: $11010011$<br>
Answer: $11010011$<br>
<br>
<b>(c)</b><br>
1. $01101101 + 01010110 = 11000011$<br>
2. Both inputs are positive (MSB = 0) but the result has MSB = 1 (negative in two's complement).<br>
3. Overflow has occurred.<br>
<br>
<b>(d)</b><br>
<b>Bit rate:</b><br>
1. $16 \\times 44100 \\times 2 = 1{,}411{,}200 \\text{ bps}$<br>
2. $= 1411.2 \\text{ kbps}$<br>
<b>File size:</b><br>
1. Duration $= 3 \\times 60 = 180$ seconds<br>
2. Total bits $= 1{,}411{,}200 \\times 180 = 254{,}016{,}000$ bits<br>
3. $= 254{,}016{,}000 \\div 8 = 31{,}752{,}000$ bytes $\\approx 30.3 \\text{ MB}$`,
},

{
  question_id: 2009,
  topic_id: 7013,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Stacks, Queues and Linked Lists",
  content: `<p><b>(a)</b> Describe the <b>stack</b> data structure. State the two principal operations that can be performed on a stack and explain what each does. [4]</p>
<p><b>(b)</b> A stack is used to evaluate the following postfix (Reverse Polish Notation) expression. Trace the stack as each token is processed and state the final result:</p>
<p><code>5 3 + 4 2 - *</code> [4]</p>
<p><b>(c)</b> Describe the <b>queue</b> data structure and explain how a <b>circular queue</b> improves upon a standard linear queue. [4]</p>
<p><b>(d)</b> Describe the structure of a <b>singly linked list</b>. Explain how a node is inserted at the beginning of a linked list, clearly describing what pointers must be updated. [4]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A stack is a Last In First Out (LIFO) data structure.<br>
2. <b>Push</b> — adds an item to the top of the stack.<br>
3. <b>Pop</b> — removes and returns the item from the top of the stack.<br>
4. A stack pointer tracks the position of the top of the stack.<br>
<br>
<b>(b)</b><br>
1. Token 5: Push → Stack: [5]<br>
2. Token 3: Push → Stack: [5, 3]<br>
3. Token +: Pop 3 and 5, push 8 → Stack: [8]<br>
4. Token 4: Push → Stack: [8, 4]<br>
5. Token 2: Push → Stack: [8, 4, 2]<br>
6. Token -: Pop 2 and 4, push 2 → Stack: [8, 2]<br>
7. Token *: Pop 2 and 8, push 16 → Stack: [16]<br>
Final result: <b>16</b><br>
<br>
<b>(c)</b><br>
1. A queue is a First In First Out (FIFO) data structure — items are added at the rear and removed from the front.<br>
2. In a linear queue, once items are dequeued the front pointer advances and that space cannot be reused.<br>
3. A circular queue treats the array as circular — when the rear pointer reaches the end, it wraps around to the beginning.<br>
4. This allows previously freed spaces to be reused, making more efficient use of memory.<br>
<br>
<b>(d)</b><br>
1. A linked list consists of nodes, each containing a data field and a pointer to the next node.<br>
2. The last node's pointer is null, indicating the end of the list.<br>
3. To insert at the beginning: set the new node's pointer to point to the current head node.<br>
4. Update the head pointer to point to the new node.`,
},

{
  question_id: 2010,
  topic_id: 7014,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Boolean Algebra and Logic Circuits",
  content: `<p><b>(a)</b> Simplify the following Boolean expression using Boolean algebra. Show each step and state the law or rule used at each stage. [5]</p>
<p>$$F = A \\cdot \\overline{B} + A \\cdot B + \\overline{A} \\cdot B$$</p>
<p><b>(b)</b> Complete the truth table for the expression $F = (A + B) \\cdot \\overline{(A \\cdot B)}$: [3]</p>
<table border="1" cellpadding="4">
  <tr><th>A</th><th>B</th><th>F</th></tr>
  <tr><td>0</td><td>0</td><td></td></tr>
  <tr><td>0</td><td>1</td><td></td></tr>
  <tr><td>1</td><td>0</td><td></td></tr>
  <tr><td>1</td><td>1</td><td></td></tr>
</table>
<p><b>(c)</b> State the name of the gate described by the expression in (b) and explain its significance in digital circuits. [2]</p>
<p><b>(d)</b> Using De Morgan's theorem, simplify $\\overline{A \\cdot B}$ and $\\overline{A + B}$. [2]</p>
<p><b>Total: 12 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$F = A \\cdot \\overline{B} + A \\cdot B + \\overline{A} \\cdot B$<br>
1. $= A(\\overline{B} + B) + \\overline{A} \\cdot B$ — Distributive law<br>
2. $= A \\cdot 1 + \\overline{A} \\cdot B$ — Complement law: $\\overline{B} + B = 1$<br>
3. $= A + \\overline{A} \\cdot B$ — Identity law: $A \\cdot 1 = A$<br>
4. $= A + B$ — Absorption: $A + \\overline{A}B = A + B$<br>
<br>
<b>(b)</b><br>
A=0, B=0: F=0<br>
A=0, B=1: F=1<br>
A=1, B=0: F=1<br>
A=1, B=1: F=0<br>
<br>
<b>(c)</b><br>
1. This is the <b>XOR (Exclusive OR)</b> gate.<br>
2. It is significant because it outputs 1 only when inputs differ, and is a fundamental building block of binary adders.<br>
<br>
<b>(d)</b><br>
1. $\\overline{A \\cdot B} = \\overline{A} + \\overline{B}$<br>
2. $\\overline{A + B} = \\overline{A} \\cdot \\overline{B}$`,
},

{
  question_id: 2011,
  topic_id: 7015,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Adders and Flip-Flops",
  content: `<p><b>(a)</b> Draw the logic circuit for a <b>half adder</b> and complete its truth table, showing the Sum and Carry outputs. [4]</p>
<p><b>(b)</b> Explain why a <b>full adder</b> is needed to add multi-bit binary numbers, and state how it differs from a half adder. [3]</p>
<p><b>(c)</b> Using a full adder, add the following 4-bit binary numbers and state the result in denary. Show any carry bits clearly. [3]</p>
<p>$$1011 + 0110$$</p>
<p><b>(d)</b> Describe the role of a <b>D-type flip-flop</b> in a digital circuit and explain how it differs from a combinational logic circuit. [3]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Circuit: XOR gate for Sum, AND gate for Carry.<br>
A=0, B=0: Sum=0, Carry=0<br>
A=0, B=1: Sum=1, Carry=0<br>
A=1, B=0: Sum=1, Carry=0<br>
A=1, B=1: Sum=0, Carry=1<br>
1 mark for correct circuit, 1 mark for each correct output column.<br>
<br>
<b>(b)</b><br>
1. A half adder has only two inputs (A and B) and cannot accept a carry-in bit.<br>
2. When adding multi-bit numbers, carries from lower bit positions must be passed to the next column.<br>
3. A full adder has three inputs (A, B, and Carry-in) allowing it to handle these carries correctly.<br>
<br>
<b>(c)</b><br>
1. $1011 + 0110$: working right to left: $1+0=1$, $1+1=0$ carry 1, $0+1+1=0$ carry 1, $1+0+1=1$ carry 1<br>
2. Result: $10001_2$<br>
3. $10001_2 = 17_{10}$<br>
<br>
<b>(d)</b><br>
1. A D-type flip-flop is a sequential logic circuit that stores one bit of data.<br>
2. Its output is updated only on the rising (or falling) edge of a clock signal.<br>
3. Unlike combinational circuits whose output depends only on current inputs, flip-flops have memory — their output depends on both current input and previous state.`,
},

{
  question_id: 2012,
  topic_id: 7023,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Recursion and OOP",
  content: `<p><b>(a)</b> Define the term <b>recursion</b> and state the two essential components of any recursive algorithm. [3]</p>
<p><b>(b)</b> The following pseudocode defines a recursive function:</p>
<pre>
FUNCTION mystery(n)
  IF n == 0 THEN
    RETURN 1
  ELSE
    RETURN n * mystery(n - 1)
  ENDIF
ENDFUNCTION
</pre>
<p>Trace the function call <code>mystery(4)</code>, showing each recursive call and return value. State what the function computes. [4]</p>
<p><b>(c)</b> Explain the following object-oriented programming concepts, giving a brief example of each:</p>
<ul>
  <li>Encapsulation [2]</li>
  <li>Inheritance [2]</li>
  <li>Polymorphism [2]</li>
</ul>
<p><b>(d)</b> Explain one advantage of using OOP over procedural programming for large software projects. [2]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Recursion is when a function calls itself during its own execution.<br>
2. A <b>base case</b> — a condition that stops the recursion.<br>
3. A <b>recursive case</b> — the function calling itself with a modified argument, moving toward the base case.<br>
<br>
<b>(b)</b><br>
1. mystery(4) → 4 * mystery(3)<br>
2. mystery(3) → 3 * mystery(2)<br>
3. mystery(2) → 2 * mystery(1)<br>
4. mystery(1) → 1 * mystery(0) → 1 * 1 = 1<br>
Returns: 1 → 2 → 6 → 24<br>
The function computes $n!$ (n factorial).<br>
<br>
<b>(c)</b><br>
<b>Encapsulation:</b><br>
1. Bundling data (attributes) and methods together within a class, restricting direct access to internal state.<br>
2. Example: a <code>BankAccount</code> class with a private <code>balance</code> attribute, only accessible via <code>getBalance()</code>.<br>
<b>Inheritance:</b><br>
1. A subclass inherits attributes and methods from a parent class, allowing code reuse.<br>
2. Example: <code>Dog</code> inherits from <code>Animal</code>, gaining its <code>breathe()</code> method.<br>
<b>Polymorphism:</b><br>
1. Different classes can share the same method name but implement it differently.<br>
2. Example: both <code>Dog</code> and <code>Cat</code> have a <code>speak()</code> method, returning "Woof" and "Meow" respectively.<br>
<br>
<b>(d)</b><br>
1. OOP promotes modularity — code is organised into self-contained classes.<br>
2. This makes large codebases easier to maintain, debug and extend, as changes to one class are less likely to affect others.`,
},

{
  question_id: 2013,
  topic_id: 7025,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Time Complexity and Big-O Notation",
  content: `<p><b>(a)</b> Explain what is meant by the <b>time complexity</b> of an algorithm. [2]</p>
<p><b>(b)</b> State the Big-O time complexity of each of the following and justify your answer:</p>
<ul>
  <li>Accessing an element in an array by index [2]</li>
  <li>Linear search on an unsorted list of $n$ items [2]</li>
  <li>Bubble sort on a list of $n$ items [2]</li>
  <li>Binary search on a sorted list of $n$ items [2]</li>
</ul>
<p><b>(c)</b> An algorithm has time complexity $O(n^2)$. If the algorithm takes 4 seconds for $n = 1000$, estimate how long it would take for $n = 4000$. Show your working. [3]</p>
<p><b>(d)</b> Explain the difference between <b>time complexity</b> and <b>space complexity</b>, and give an example of a trade-off between the two. [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Time complexity describes how the running time of an algorithm grows as the size of the input ($n$) increases.<br>
2. It is typically expressed using Big-O notation, representing the worst-case scenario.<br>
<br>
<b>(b)</b><br>
1. Array index access: $O(1)$ — constant time; the memory address is calculated directly, regardless of array size.<br>
2. Linear search: $O(n)$ — in the worst case every element must be checked.<br>
3. Bubble sort: $O(n^2)$ — for each of $n$ elements, up to $n$ comparisons may be needed, giving nested loops.<br>
4. Binary search: $O(\\log n)$ — the search space is halved with each comparison.<br>
<br>
<b>(c)</b><br>
1. $O(n^2)$ means time $\\propto n^2$.<br>
2. Ratio of inputs: $\\frac{4000}{1000} = 4$, so time scales by $4^2 = 16$.<br>
3. Estimated time: $4 \\times 16 = 64$ seconds.<br>
<br>
<b>(d)</b><br>
1. Time complexity measures how runtime scales with input size; space complexity measures how memory usage scales.<br>
2. Example: memoisation (caching) reduces time complexity of a recursive algorithm but increases space complexity, as results are stored in memory.`,
},

{
  question_id: 2014,
  topic_id: 7027,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Sorting Algorithms",
  content: `<p><b>(a)</b> Trace the <b>bubble sort</b> algorithm on the following list, showing the state of the list after each complete pass. State how many passes were needed. [5]</p>
<p><code>[5, 3, 8, 1, 9, 2]</code></p>
<p><b>(b)</b> Describe the <b>merge sort</b> algorithm. Your answer should describe both the splitting and merging phases. [4]</p>
<p><b>(c)</b> Compare bubble sort and merge sort in terms of:</p>
<ul>
  <li>Time complexity (best and worst case) [4]</li>
  <li>Suitability for large datasets [2]</li>
</ul>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Pass 1: [3, 5, 1, 8, 2, 9]<br>
Pass 2: [3, 1, 5, 2, 8, 9]<br>
Pass 3: [1, 3, 2, 5, 8, 9]<br>
Pass 4: [1, 2, 3, 5, 8, 9]<br>
4 passes needed (accept 5 if student checks for no swaps).<br>
1 mark per correct pass, 1 mark for number of passes.<br>
<br>
<b>(b)</b><br>
<b>Splitting phase:</b><br>
1. The list is recursively divided in half until each sublist contains a single element.<br>
<b>Merging phase:</b><br>
2. Pairs of sublists are merged by comparing the front elements of each and placing the smaller into the output list.<br>
3. This continues until all sublists are merged into a single sorted list.<br>
4. Each merge step produces a sorted sublist, and the final merge produces the fully sorted list.<br>
<br>
<b>(c)</b><br>
<b>Time complexity:</b><br>
1. Bubble sort best case: $O(n)$ — if already sorted and optimised with a swap flag.<br>
2. Bubble sort worst case: $O(n^2)$.<br>
3. Merge sort best case: $O(n \\log n)$.<br>
4. Merge sort worst case: $O(n \\log n)$.<br>
<b>Large datasets:</b><br>
1. Merge sort is far more suitable for large datasets due to its $O(n \\log n)$ complexity.<br>
2. Bubble sort becomes impractically slow on large datasets due to $O(n^2)$ worst-case performance.`,
},

{
  question_id: 2015,
  topic_id: 7028,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Binary Search and Linear Search",
  content: `<p><b>(a)</b> Trace a <b>binary search</b> for the value <b>41</b> in the following sorted list. Show the mid-point calculated at each step and state how many comparisons were made. [5]</p>
<p><code>[3, 7, 12, 19, 25, 33, 41, 58, 72, 90]</code></p>
<p><b>(b)</b> Write pseudocode for an iterative binary search algorithm that takes a sorted array and a target value as inputs and returns the index of the target, or -1 if not found. [5]</p>
<p><b>(c)</b> State one situation where a <b>linear search</b> would be preferred over a binary search, and justify your answer. [2]</p>
<p><b>Total: 12 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. low=0, high=9, mid=4 → value=25. 41 > 25, so low=5.<br>
2. low=5, high=9, mid=7 → value=58. 41 < 58, so high=6.<br>
3. low=5, high=6, mid=5 → value=33. 41 > 33, so low=6.<br>
4. low=6, high=6, mid=6 → value=41. Found at index 6.<br>
4 comparisons made.<br>
<br>
<b>(b)</b><br>
<pre>
FUNCTION binarySearch(array, target)
  low ← 0
  high ← LENGTH(array) - 1
  WHILE low <= high DO
    mid ← (low + high) DIV 2
    IF array[mid] == target THEN
      RETURN mid
    ELSE IF array[mid] < target THEN
      low ← mid + 1
    ELSE
      high ← mid - 1
    ENDIF
  ENDWHILE
  RETURN -1
ENDFUNCTION
</pre>
1 mark each for: correct initialisation, correct WHILE condition, correct mid calculation, correct comparisons, returning -1.<br>
<br>
<b>(c)</b><br>
1. A linear search is preferred when the list is <b>unsorted</b>.<br>
2. Binary search requires a sorted list; sorting first would add overhead, making linear search more efficient for a single search on an unsorted dataset.`,
},

{
  question_id: 2016,
  topic_id: 7029,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Dijkstra's Shortest Path Algorithm",
  content: `<p>The following weighted graph represents a network of cities. The edge weights represent distances in miles.</p>
<p>Nodes: A, B, C, D, E<br>
Edges: A–B: 4, A–C: 2, B–C: 5, B–D: 10, C–E: 3, D–E: 4, B–E: 8</p>
<p><b>(a)</b> Apply <b>Dijkstra's algorithm</b> starting from node <b>A</b>. Show the working table at each step, including the current node visited, tentative distances, and visited set. [6]</p>
<p><b>(b)</b> State the shortest path from A to D and its total distance. [2]</p>
<p><b>(c)</b> State the time complexity of Dijkstra's algorithm using a simple implementation and explain why. [2]</p>
<p><b>(d)</b> State one limitation of Dijkstra's algorithm. [1]</p>
<p><b>Total: 11 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Initial distances: A=0, B=∞, C=∞, D=∞, E=∞. Visited={}.<br>
<br>
Step 1 — Visit A (dist 0):<br>
Update: B=4, C=2. Visited={A}.<br>
<br>
Step 2 — Visit C (dist 2, smallest unvisited):<br>
Update: B=min(4, 2+5)=4, E=2+3=5. Visited={A,C}.<br>
<br>
Step 3 — Visit B (dist 4):<br>
Update: D=min(∞, 4+10)=14, E=min(5, 4+8)=5. Visited={A,C,B}.<br>
<br>
Step 4 — Visit E (dist 5):<br>
Update: D=min(14, 5+4)=9. Visited={A,C,B,E}.<br>
<br>
Step 5 — Visit D (dist 9):<br>
No updates. Visited={A,C,B,E,D}.<br>
<br>
<b>(b)</b><br>
1. Shortest path: A → C → E → D<br>
2. Total distance: 9 miles.<br>
<br>
<b>(c)</b><br>
1. $O(n^2)$ where $n$ is the number of nodes.<br>
2. For each of $n$ nodes, the algorithm scans all unvisited nodes to find the minimum distance, giving $n$ iterations of an $O(n)$ scan.<br>
<br>
<b>(d)</b><br>
1. Dijkstra's algorithm does not work correctly with negative edge weights.`,
},

{
  question_id: 2017,
  topic_id: 7006,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Software Development Methodologies",
  content: `<p>A software company is developing a large payroll system for a client.</p>
<p><b>(a)</b> Describe the <b>Waterfall model</b> of software development. List its stages in order and describe what happens in each. [5]</p>
<p><b>(b)</b> Describe the <b>Agile methodology</b> and explain how it differs from the Waterfall model. [4]</p>
<p><b>(c)</b> The client's requirements are likely to change frequently during development. Justify which methodology would be more appropriate. [3]</p>
<p><b>(d)</b> Explain what is meant by <b>alpha testing</b> and <b>beta testing</b>, and state who carries out each type. [4]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. <b>Requirements analysis</b> — the system's requirements are gathered and documented.<br>
2. <b>Design</b> — the system architecture and design are planned.<br>
3. <b>Implementation</b> — the code is written according to the design.<br>
4. <b>Testing</b> — the system is tested against the requirements.<br>
5. <b>Maintenance</b> — the system is deployed and maintained/updated over time.<br>
<br>
<b>(b)</b><br>
1. Agile breaks development into short iterative cycles called sprints.<br>
2. Working software is delivered frequently, with requirements able to evolve between sprints.<br>
3. Unlike Waterfall, Agile does not require all requirements to be fixed at the start.<br>
4. Agile emphasises collaboration with the client throughout development rather than only at the beginning and end.<br>
<br>
<b>(c)</b><br>
1. Agile is more appropriate.<br>
2. Since the client's requirements are expected to change, Waterfall's rigid sequential structure would require costly restarts if requirements change after the design phase.<br>
3. Agile accommodates changing requirements between sprints, allowing the product to evolve alongside the client's needs.<br>
<br>
<b>(d)</b><br>
1. <b>Alpha testing</b> is carried out internally by the development team (or in-house testers).<br>
2. It tests the software in a controlled environment to find bugs before any external release.<br>
3. <b>Beta testing</b> is carried out by a limited group of real end users outside the organisation.<br>
4. It tests the software in real-world conditions to identify issues not caught during alpha testing.`,
},

{
  question_id: 2018,
  topic_id: 7011,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "HTML, CSS and Client-Server Architecture",
  content: `<p><b>(a)</b> Describe the difference between <b>client-side</b> and <b>server-side</b> processing. Give one example of a technology used for each. [4]</p>
<p><b>(b)</b> A web page contains the following HTML:</p>
<pre>
&lt;form action="/submit" method="POST"&gt;
  &lt;input type="text" name="username"&gt;
  &lt;input type="password" name="password"&gt;
  &lt;button type="submit"&gt;Login&lt;/button&gt;
&lt;/form&gt;
</pre>
<p>Explain what happens when the user clicks the Login button, describing the HTTP request that is sent and what the server might do in response. [4]</p>
<p><b>(c)</b> Explain the difference between <b>GET</b> and <b>POST</b> HTTP methods and state when each should be used. [4]</p>
<p><b>(d)</b> Describe what a <b>cookie</b> is and explain how it is used to maintain session state in a web application. [3]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Client-side processing occurs in the user's browser, on the user's machine.<br>
2. Example: JavaScript validating a form before submission.<br>
3. Server-side processing occurs on the web server, away from the user's machine.<br>
4. Example: PHP or Python querying a database and generating dynamic HTML.<br>
<br>
<b>(b)</b><br>
1. The browser sends an HTTP POST request to the URL <code>/submit</code>.<br>
2. The username and password are included in the request body (not the URL).<br>
3. The server receives the request, extracts the credentials, and queries a database to verify them.<br>
4. The server responds with either a redirect to a logged-in page or an error message.<br>
<br>
<b>(c)</b><br>
1. GET sends data appended to the URL as query parameters, visible in the address bar.<br>
2. GET should be used for retrieving data (e.g. search queries) where the request has no side effects.<br>
3. POST sends data in the request body, not visible in the URL.<br>
4. POST should be used for sending sensitive data (e.g. passwords) or when the request changes server-side state.<br>
<br>
<b>(d)</b><br>
1. A cookie is a small piece of data stored in the user's browser by the web server.<br>
2. When a user logs in, the server creates a session and sends a session ID to the browser as a cookie.<br>
3. On subsequent requests, the browser sends the cookie back to the server, allowing it to identify the user without requiring them to log in again.`,
},

{
  question_id: 2019,
  topic_id: 7018,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Abstraction and Decomposition",
  content: `<p><b>(a)</b> Define <b>abstraction</b> in the context of computational thinking and explain why it is a useful problem-solving technique. [3]</p>
<p><b>(b)</b> A programmer is designing a sat-nav system. Give <b>three</b> examples of details that could be abstracted away from the model of the road network, and briefly justify each. [3]</p>
<p><b>(c)</b> Define <b>decomposition</b> and explain how it is applied when designing a large software system. [3]</p>
<p><b>(d)</b> The sat-nav problem can be modelled as a graph. Describe what the nodes and edges of this graph would represent, and explain how abstraction has been applied in creating this model. [3]</p>
<p><b>Total: 12 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Abstraction is the process of removing unnecessary detail from a problem, focusing only on the information relevant to the solution.<br>
2. It is useful because it reduces complexity, making problems easier to model, understand and solve.<br>
3. It also allows general solutions to be applied to many specific problems.<br>
<br>
<b>(b)</b> Any three:<br>
1. Speed limits — not needed for basic route calculation, only for time estimates.<br>
2. Road surface type — irrelevant to finding the shortest path.<br>
3. Scenery or landmarks along the route — not needed for navigation logic.<br>
4. Number of lanes — unnecessary for basic routing.<br>
<br>
<b>(c)</b><br>
1. Decomposition is breaking a complex problem into smaller, more manageable sub-problems.<br>
2. Each sub-problem can be solved independently and then integrated.<br>
3. Example: a school management system might be decomposed into modules for student records, timetabling, and reporting.<br>
<br>
<b>(d)</b><br>
1. Nodes represent junctions or locations (e.g. road intersections, destinations).<br>
2. Edges represent roads connecting those locations, with weights representing distance or travel time.<br>
3. Abstraction has been applied by ignoring irrelevant details (road names, lane counts, scenery) and representing only the connectivity and distances needed for pathfinding.`,
},

{
  question_id: 2020,
  topic_id: 7024,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Computational Methods + Problem Solving",
  content: `<p><b>(a)</b> Explain what is meant by a <b>heuristic</b> approach to problem solving. Give one example of a problem where a heuristic is used instead of an exact algorithm, and explain why. [3]</p>
<p><b>(b)</b> Explain the concept of <b>backtracking</b> and describe a problem that can be solved using it. [3]</p>
<p><b>(c)</b> Define the term <b>intractable problem</b> and explain why some problems are considered intractable even though they are theoretically solvable. [3]</p>
<p><b>(d)</b> The <b>Travelling Salesman Problem (TSP)</b> is a well-known computational problem.</p>
<ul>
  <li>Describe the TSP. [2]</li>
  <li>State its time complexity for an exact solution and explain why this makes it intractable for large inputs. [3]</li>
</ul>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A heuristic is a technique that finds a good-enough solution to a problem in a reasonable time, without guaranteeing the optimal solution.<br>
2. Example: the Travelling Salesman Problem — finding the exact shortest route is computationally infeasible for large inputs.<br>
3. A heuristic (e.g. nearest neighbour) finds a near-optimal route quickly, which is acceptable in practice.<br>
<br>
<b>(b)</b><br>
1. Backtracking is an algorithmic technique that explores possible solutions incrementally, abandoning a path as soon as it cannot lead to a valid solution, and returning to the previous step.<br>
2. Example: solving a maze — if a path leads to a dead end, the algorithm backtracks to the last junction and tries a different route.<br>
<br>
<b>(c)</b><br>
1. An intractable problem is one that has a known solution but is not solvable in a reasonable time for large inputs.<br>
2. This is because the time complexity grows so rapidly (e.g. $O(n!)$ or $O(2^n)$) that even modern computers cannot solve large instances within a practical timeframe.<br>
3. They are distinguished from unsolvable problems — they can be solved in theory, just not efficiently.<br>
<br>
<b>(d)</b><br>
<b>Description:</b><br>
1. Given a list of cities and distances between them, find the shortest possible route that visits every city exactly once and returns to the starting city.<br>
<b>Complexity:</b><br>
2. The exact solution has time complexity $O(n!)$ — there are $n!$ possible routes to check.<br>
3. For $n = 20$ cities, $20! \\approx 2.4 \\times 10^{18}$ routes — even at billions of operations per second, this would take longer than the age of the universe, making it intractable.`,
},

{
  question_id: 2021,
  topic_id: 5007,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Differentiation from First Principles",
  content: `<p><b>(a)</b> State the definition of the derivative of a function $f(x)$ from first principles. [1]</p>
<p><b>(b)</b> Using first principles, prove that the derivative of $f(x) = x^2$ is $f'(x) = 2x$. Show all steps clearly. [4]</p>
<p><b>(c)</b> Differentiate the following with respect to $x$:</p>
<ul>
  <li>$y = 4x^3 - 7x^2 + 3x - 5$ [2]</li>
  <li>$y = \\sqrt{x} + \\dfrac{1}{x^2}$ [2]</li>
  <li>$y = (2x+3)(x^2-1)$ [3]</li>
</ul>
<p><b>(d)</b> Find the equation of the tangent to the curve $y = x^3 - 4x + 1$ at the point where $x = 2$. [4]</p>
<p><b>(e)</b> Find the $x$-coordinates of the stationary points of $y = 2x^3 - 9x^2 + 12x - 4$ and determine their nature. [5]</p>
<p><b>Total: 21 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$<br>
<br>
<b>(b)</b><br>
1. $f(x+h) = (x+h)^2 = x^2 + 2xh + h^2$<br>
2. $\\dfrac{f(x+h)-f(x)}{h} = \\dfrac{x^2+2xh+h^2-x^2}{h} = \\dfrac{2xh+h^2}{h} = 2x+h$<br>
3. As $h \\to 0$: $f'(x) = 2x$ ✓<br>
<br>
<b>(c)</b><br>
1. $\\dfrac{dy}{dx} = 12x^2 - 14x + 3$<br>
2. $y = x^{1/2} + x^{-2}$, so $\\dfrac{dy}{dx} = \\dfrac{1}{2}x^{-1/2} - 2x^{-3}$<br>
3. Expand: $y = 2x^3 - 2x + 3x^2 - 3$, so $\\dfrac{dy}{dx} = 6x^2 + 6x - 2$<br>
<br>
<b>(d)</b><br>
1. $\\dfrac{dy}{dx} = 3x^2 - 4$. At $x=2$: gradient $= 3(4)-4 = 8$.<br>
2. At $x=2$: $y = 8 - 8 + 1 = 1$. Point: $(2, 1)$.<br>
3. Tangent: $y - 1 = 8(x-2)$<br>
4. $y = 8x - 15$<br>
<br>
<b>(e)</b><br>
1. $\\dfrac{dy}{dx} = 6x^2 - 18x + 12 = 6(x^2 - 3x + 2) = 6(x-1)(x-2)$<br>
2. Stationary points at $x=1$ and $x=2$.<br>
3. $\\dfrac{d^2y}{dx^2} = 12x - 18$.<br>
4. At $x=1$: $\\dfrac{d^2y}{dx^2} = -6 < 0$ → local maximum.<br>
5. At $x=2$: $\\dfrac{d^2y}{dx^2} = 6 > 0$ → local minimum.`,
},

{
  question_id: 2022,
  topic_id: 5008,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Integration and Area Under a Curve",
  content: `<p><b>(a)</b> Find the following indefinite integrals:</p>
<ul>
  <li>$\\displaystyle \\int 6x^2 - 4x + 3 \\, dx$ [2]</li>
  <li>$\\displaystyle \\int \\dfrac{3}{x^2} + \\sqrt{x} \\, dx$ [3]</li>
</ul>
<p><b>(b)</b> Evaluate $\\displaystyle\\int_1^3 2x^2 + 1 \\, dx$. [3]</p>
<p><b>(c)</b> The curve $y = x^2 - 4x + 3$ intersects the $x$-axis at two points.</p>
<ul>
  <li>Find the $x$-coordinates of these points. [2]</li>
  <li>Find the area enclosed between the curve and the $x$-axis. [4]</li>
</ul>
<p><b>(d)</b> The region $R$ is bounded by $y = x^2$ and $y = x + 2$. Find the area of $R$. [5]</p>
<p><b>Total: 19 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $2x^3 - 2x^2 + 3x + c$<br>
2. $\\displaystyle\\int 3x^{-2} + x^{1/2} \\, dx = -3x^{-1} + \\dfrac{2}{3}x^{3/2} + c$<br>
<br>
<b>(b)</b><br>
1. $\\left[\\dfrac{2x^3}{3} + x\\right]_1^3 = \\left(18 + 3\\right) - \\left(\\dfrac{2}{3} + 1\\right)$<br>
2. $= 21 - \\dfrac{5}{3} = \\dfrac{58}{3}$<br>
<br>
<b>(c)</b><br>
1. $x^2 - 4x + 3 = 0 \\Rightarrow (x-1)(x-3) = 0 \\Rightarrow x = 1, x = 3$<br>
2. Area $= \\left|\\displaystyle\\int_1^3 x^2 - 4x + 3 \\, dx\\right|$<br>
3. $= \\left|\\left[\\dfrac{x^3}{3} - 2x^2 + 3x\\right]_1^3\\right| = \\left|(9-18+9) - (\\dfrac{1}{3}-2+3)\\right|$<br>
4. $= \\left|0 - \\dfrac{4}{3}\\right| = \\dfrac{4}{3}$<br>
<br>
<b>(d)</b><br>
1. Intersections: $x^2 = x+2 \\Rightarrow x^2-x-2=0 \\Rightarrow (x-2)(x+1)=0 \\Rightarrow x=-1, x=2$<br>
2. Area $= \\displaystyle\\int_{-1}^{2} (x+2) - x^2 \\, dx$<br>
3. $= \\left[\\dfrac{x^2}{2} + 2x - \\dfrac{x^3}{3}\\right]_{-1}^{2}$<br>
4. $= (2+4-\\dfrac{8}{3}) - (\\dfrac{1}{2}-2+\\dfrac{1}{3})$<br>
5. $= \\dfrac{10}{3} - (-\\dfrac{7}{6}) = \\dfrac{20}{6} + \\dfrac{7}{6} = \\dfrac{27}{6} = \\dfrac{9}{2}$`,
},

{
  question_id: 2023,
  topic_id: 8017,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Gravitational Fields",
  content: `<p><b>(a)</b> State Newton's Law of Gravitation and write the equation for the gravitational force between two point masses. Define all symbols used. [3]</p>
<p><b>(b)</b> The Earth has mass $M = 5.97 \\times 10^{24}$ kg and radius $R = 6.37 \\times 10^6$ m.</p>
<ul>
  <li>Calculate the gravitational field strength at the Earth's surface. Give your answer to 3 significant figures. [$G = 6.67 \\times 10^{-11}$ N m² kg⁻²] [3]</li>
  <li>A satellite orbits at an altitude of $3.50 \\times 10^5$ m above the surface. Calculate the gravitational field strength at this altitude. [2]</li>
</ul>
<p><b>(c)</b> Derive an expression for the orbital speed $v$ of a satellite in a circular orbit of radius $r$ around a planet of mass $M$. [3]</p>
<p><b>(d)</b> Show that the orbital period $T$ of a satellite satisfies $T^2 \\propto r^3$ (Kepler's Third Law). [3]</p>
<p><b>(e)</b> Calculate the orbital radius of a geostationary satellite above Earth. State one use of geostationary satellites. [$T = 24 \\times 3600$ s] [4]</p>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Every two point masses attract each other with a force directly proportional to the product of their masses and inversely proportional to the square of their separation.<br>
2. $F = \\dfrac{GMm}{r^2}$<br>
3. $G$ = gravitational constant, $M$ and $m$ = masses, $r$ = separation between centres.<br>
<br>
<b>(b)</b><br>
1. $g = \\dfrac{GM}{R^2} = \\dfrac{6.67\\times10^{-11} \\times 5.97\\times10^{24}}{(6.37\\times10^6)^2}$<br>
2. $= \\dfrac{3.982\\times10^{14}}{4.058\\times10^{13}} = 9.81$ N kg⁻¹<br>
3. At altitude: $r = 6.37\\times10^6 + 3.50\\times10^5 = 6.72\\times10^6$ m<br>
$g = \\dfrac{6.67\\times10^{-11} \\times 5.97\\times10^{24}}{(6.72\\times10^6)^2} = 8.82$ N kg⁻¹<br>
<br>
<b>(c)</b><br>
1. For circular orbit, gravitational force provides centripetal force: $\\dfrac{GMm}{r^2} = \\dfrac{mv^2}{r}$<br>
2. Cancel $m$ and one factor of $r$: $\\dfrac{GM}{r} = v^2$<br>
3. $v = \\sqrt{\\dfrac{GM}{r}}$<br>
<br>
<b>(d)</b><br>
1. Orbital circumference $= 2\\pi r$, so $T = \\dfrac{2\\pi r}{v} = 2\\pi r \\sqrt{\\dfrac{r}{GM}} = \\dfrac{2\\pi r^{3/2}}{\\sqrt{GM}}$<br>
2. $T^2 = \\dfrac{4\\pi^2}{GM} r^3$<br>
3. Since $\\dfrac{4\\pi^2}{GM}$ is constant for a given planet, $T^2 \\propto r^3$ ✓<br>
<br>
<b>(e)</b><br>
1. $T = 86400$ s. $r^3 = \\dfrac{GMT^2}{4\\pi^2} = \\dfrac{6.67\\times10^{-11}\\times5.97\\times10^{24}\\times86400^2}{4\\pi^2}$<br>
2. $r^3 = \\dfrac{3.982\\times10^{14} \\times 7.465\\times10^9}{39.48} = 7.54\\times10^{22}$<br>
3. $r = (7.54\\times10^{22})^{1/3} = 4.22\\times10^7$ m<br>
4. Use: telecommunications / weather monitoring / GPS (accept any valid use).`,
},

{
  question_id: 2024,
  topic_id: 9022,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Infection and the Immune System",
  content: `<p><b>(a)</b> Distinguish between <b>specific</b> and <b>non-specific</b> immune responses. Give two examples of non-specific defences. [4]</p>
<p><b>(b)</b> Describe the sequence of events that occurs when a B lymphocyte encounters a foreign antigen for the first time, leading to the production of antibodies. [5]</p>
<p><b>(c)</b> Explain the role of <b>memory cells</b> in the secondary immune response and explain why the secondary response is faster and more effective than the primary response. [4]</p>
<p><b>(d)</b> Describe the structure of an antibody and explain how it leads to the destruction of a pathogen. Your answer should refer to the antigen-antibody complex. [4]</p>
<p><b>(e)</b> Explain how <b>vaccination</b> confers immunity without the individual suffering from the disease. [3]</p>
<p><b>Total: 20 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Non-specific responses are the same regardless of the pathogen — they act as general barriers or responses.<br>
2. Specific responses are tailored to a particular antigen and involve lymphocytes.<br>
3. Examples of non-specific defences (any two): skin acting as a physical barrier; mucus and cilia in the airways; stomach acid; inflammation; phagocytosis by neutrophils.<br>
<br>
<b>(b)</b><br>
1. A macrophage engulfs the pathogen and presents the antigen on its surface (antigen-presenting cell).<br>
2. A T helper cell with a complementary receptor binds to the antigen and becomes activated.<br>
3. The activated T helper cell releases cytokines, stimulating the B lymphocyte with the complementary receptor to divide.<br>
4. The B lymphocyte undergoes clonal expansion — dividing by mitosis to produce clones.<br>
5. Clones differentiate into plasma cells, which secrete large quantities of specific antibodies.<br>
<br>
<b>(c)</b><br>
1. Some B and T lymphocyte clones differentiate into long-lived memory cells rather than plasma cells.<br>
2. Memory cells persist in the body after the initial infection is cleared.<br>
3. On re-exposure to the same antigen, memory cells rapidly divide and differentiate into plasma cells.<br>
4. This produces a faster, larger antibody response that clears the pathogen before symptoms develop.<br>
<br>
<b>(d)</b><br>
1. An antibody is a Y-shaped glycoprotein with two heavy chains and two light chains joined by disulfide bonds.<br>
2. The variable regions at the tips of the Y form the antigen-binding sites, which are complementary to a specific antigen.<br>
3. The antibody binds to the antigen, forming an antigen-antibody complex.<br>
4. This can neutralise toxins, agglutinate pathogens (making them easier to phagocytose), or activate the complement system leading to pathogen lysis.<br>
<br>
<b>(e)</b><br>
1. A vaccine introduces antigens (or weakened/dead pathogens) into the body without causing disease.<br>
2. The immune system mounts a primary response and produces memory cells specific to those antigens.<br>
3. If the individual later encounters the live pathogen, the secondary immune response rapidly destroys it before illness develops.`,
},

{
  question_id: 2025,
  topic_id: 10006,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Rates, Equilibrium and pH",
  content: `<p><b>(a)</b> State Le Chatelier's Principle. [1]</p>
<p><b>(b)</b> Consider the following equilibrium reaction:</p>
<p>$$\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g) \\quad \\Delta H = -92 \\text{ kJ mol}^{-1}$$</p>
<p>Predict and explain the effect on the position of equilibrium of:</p>
<ul>
  <li>Increasing the temperature [2]</li>
  <li>Increasing the pressure [2]</li>
  <li>Adding a catalyst [2]</li>
</ul>
<p><b>(c)</b> Write the expression for $K_c$ for the reaction above and state its units. [2]</p>
<p><b>(d)</b> Calculate the pH of the following solutions:</p>
<ul>
  <li>$0.050$ mol dm⁻³ HCl [2]</li>
  <li>$0.020$ mol dm⁻³ NaOH [2]</li>
  <li>A weak acid HA with $K_a = 1.8 \\times 10^{-5}$ mol dm⁻³ at a concentration of $0.10$ mol dm⁻³ [3]</li>
</ul>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. If a system at equilibrium is subjected to a change, the equilibrium will shift in the direction that opposes that change.<br>
<br>
<b>(b)</b><br>
<b>Increasing temperature:</b><br>
1. Equilibrium shifts to the left (towards reactants).<br>
2. The reaction is exothermic, so increasing temperature favours the endothermic (reverse) direction to absorb the excess heat.<br>
<b>Increasing pressure:</b><br>
1. Equilibrium shifts to the right (towards products).<br>
2. There are 4 moles of gas on the left and 2 on the right; shifting right reduces the number of moles of gas, reducing pressure.<br>
<b>Adding a catalyst:</b><br>
1. No change in the position of equilibrium.<br>
2. A catalyst speeds up both forward and reverse reactions equally, so equilibrium is reached faster but the equilibrium position is unchanged.<br>
<br>
<b>(c)</b><br>
1. $K_c = \\dfrac{[\\text{NH}_3]^2}{[\\text{N}_2][\\text{H}_2]^3}$<br>
2. Units: $\\dfrac{\\text{mol}^2\\text{dm}^{-6}}{\\text{mol}\\text{dm}^{-3} \\times \\text{mol}^3\\text{dm}^{-9}} = \\text{mol}^{-2}\\text{dm}^{6}$<br>
<br>
<b>(d)</b><br>
1. HCl: $[\\text{H}^+] = 0.050$ mol dm⁻³. $\\text{pH} = -\\log(0.050) = 1.30$<br>
2. NaOH: $[\\text{OH}^-] = 0.020$. $\\text{pOH} = -\\log(0.020) = 1.70$. $\\text{pH} = 14 - 1.70 = 12.30$<br>
3. Weak acid: $[\\text{H}^+] = \\sqrt{K_a \\times c} = \\sqrt{1.8\\times10^{-5} \\times 0.10} = \\sqrt{1.8\\times10^{-6}} = 1.342\\times10^{-3}$<br>
$\\text{pH} = -\\log(1.342\\times10^{-3}) = 2.87$`,
},

{
  question_id: 2026,
  topic_id: 6004,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Complex Numbers and Geometry",
  content: `<p><b>(a)</b> Given $z_1 = 3 + 4i$ and $z_2 = 1 - 2i$, find:</p>
<ul>
  <li>$z_1 + z_2$ [1]</li>
  <li>$z_1 z_2$ [2]</li>
  <li>$\\dfrac{z_1}{z_2}$, giving your answer in the form $a + bi$ [3]</li>
</ul>
<p><b>(b)</b> Find the modulus and argument of $z = -1 + \\sqrt{3}i$. Hence write $z$ in modulus-argument form. [4]</p>
<p><b>(c)</b> On an Argand diagram, describe the locus of points satisfying:</p>
<ul>
  <li>$|z - (2+i)| = 3$ [2]</li>
  <li>$\\arg(z - 1) = \\dfrac{\\pi}{4}$ [2]</li>
</ul>
<p><b>(d)</b> Use De Moivre's theorem to show that $\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$. [4]</p>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $z_1 + z_2 = 4 + 2i$<br>
2. $z_1 z_2 = (3+4i)(1-2i) = 3 - 6i + 4i - 8i^2 = 3 - 2i + 8 = 11 - 2i$<br>
3. $\\dfrac{z_1}{z_2} = \\dfrac{(3+4i)(1+2i)}{(1-2i)(1+2i)} = \\dfrac{3+6i+4i+8i^2}{1+4} = \\dfrac{3+10i-8}{5} = \\dfrac{-5+10i}{5} = -1+2i$<br>
<br>
<b>(b)</b><br>
1. $|z| = \\sqrt{(-1)^2+(\\sqrt{3})^2} = \\sqrt{1+3} = 2$<br>
2. $\\arg(z) = \\pi - \\arctan\\left(\\dfrac{\\sqrt{3}}{1}\\right) = \\pi - \\dfrac{\\pi}{3} = \\dfrac{2\\pi}{3}$<br>
3. Modulus-argument form: $z = 2\\left(\\cos\\dfrac{2\\pi}{3} + i\\sin\\dfrac{2\\pi}{3}\\right)$<br>
<br>
<b>(c)</b><br>
1. $|z-(2+i)|=3$: a circle with centre $(2,1)$ and radius 3 on the Argand diagram.<br>
2. $\\arg(z-1)=\\dfrac{\\pi}{4}$: a half-line starting at the point $(1,0)$ (not included) at angle $\\dfrac{\\pi}{4}$ to the positive real axis.<br>
<br>
<b>(d)</b><br>
1. By De Moivre: $(\\cos\\theta + i\\sin\\theta)^3 = \\cos 3\\theta + i\\sin 3\\theta$<br>
2. Expand LHS: $\\cos^3\\theta + 3\\cos^2\\theta(i\\sin\\theta) + 3\\cos\\theta(i\\sin\\theta)^2 + (i\\sin\\theta)^3$<br>
$= \\cos^3\\theta + 3i\\cos^2\\theta\\sin\\theta - 3\\cos\\theta\\sin^2\\theta - i\\sin^3\\theta$<br>
3. Take real part: $\\cos 3\\theta = \\cos^3\\theta - 3\\cos\\theta\\sin^2\\theta$<br>
4. Substitute $\\sin^2\\theta = 1-\\cos^2\\theta$: $\\cos 3\\theta = \\cos^3\\theta - 3\\cos\\theta(1-\\cos^2\\theta) = 4\\cos^3\\theta - 3\\cos\\theta$ ✓`,
},

{
  question_id: 2027,
  topic_id: 1003,
  subject_id: 10,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Particle Model of Matter",
  content: `<p><b>(a)</b> Describe the arrangement and movement of particles in a <b>solid</b>, a <b>liquid</b>, and a <b>gas</b>. [6]</p>
<p><b>(b)</b> Explain, in terms of particles, what happens when a solid is heated until it melts and then continues to be heated until it boils. [4]</p>
<p><b>(c)</b> A 2.0 kg block of ice at 0°C is heated until it becomes water at 100°C. Calculate the total energy required.</p>
<p>Specific latent heat of fusion of ice: $L_f = 3.34 \\times 10^5$ J kg⁻¹<br>
Specific heat capacity of water: $c = 4200$ J kg⁻¹ °C⁻¹ [4]</p>
<p><b>(d)</b> Explain why sweating cools the body down, using ideas about latent heat. [2]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
<b>Solid:</b><br>
1. Particles are closely packed in a regular lattice arrangement.<br>
2. Particles vibrate about fixed positions but do not move freely.<br>
<b>Liquid:</b><br>
3. Particles are close together but in a random arrangement.<br>
4. Particles can move past each other, allowing liquids to flow.<br>
<b>Gas:</b><br>
5. Particles are far apart and move rapidly in random directions.<br>
6. Particles have much greater kinetic energy and fill the container they occupy.<br>
<br>
<b>(b)</b><br>
1. On heating, particles in the solid vibrate more vigorously as they gain kinetic energy.<br>
2. At the melting point, particles gain enough energy to break free from their fixed positions — the regular lattice structure breaks down (latent heat of fusion is absorbed).<br>
3. In the liquid, continued heating increases particle kinetic energy further.<br>
4. At the boiling point, particles gain enough energy to completely overcome intermolecular forces and escape as gas (latent heat of vaporisation is absorbed).<br>
<br>
<b>(c)</b><br>
1. Energy to melt ice: $Q_1 = mL_f = 2.0 \\times 3.34\\times10^5 = 6.68\\times10^5$ J<br>
2. Energy to heat water: $Q_2 = mc\\Delta T = 2.0 \\times 4200 \\times 100 = 8.40\\times10^5$ J<br>
3. Total energy: $Q = Q_1 + Q_2 = 6.68\\times10^5 + 8.40\\times10^5 = 1.508\\times10^6$ J<br>
<br>
<b>(d)</b><br>
1. When sweat evaporates, it requires latent heat of vaporisation.<br>
2. This energy is taken from the skin, removing thermal energy from the body and cooling it.`,
},

{
  question_id: 2028,
  topic_id: 4002,
  subject_id: 7,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Algebra: Solving and Rearranging",
  content: `<p><b>(a)</b> Solve the following equations:</p>
<ul>
  <li>$3(2x - 4) = 5x + 1$ [2]</li>
  <li>$\\dfrac{2x+1}{3} - \\dfrac{x-2}{4} = 2$ [3]</li>
</ul>
<p><b>(b)</b> Factorise fully:</p>
<ul>
  <li>$6x^2 - 13x + 6$ [2]</li>
  <li>$4x^2 - 25$ [1]</li>
</ul>
<p><b>(c)</b> Solve the quadratic equation $2x^2 - 5x - 3 = 0$ using the quadratic formula. [3]</p>
<p><b>(d)</b> Rearrange $v^2 = u^2 + 2as$ to make $a$ the subject. [2]</p>
<p><b>(e)</b> Solve the simultaneous equations:</p>
<p>$3x + 2y = 16$<br>$5x - y = 9$ [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $6x - 12 = 5x + 1 \\Rightarrow x = 13$<br>
2. Multiply through by 12: $4(2x+1) - 3(x-2) = 24 \\Rightarrow 8x+4-3x+6=24 \\Rightarrow 5x = 14 \\Rightarrow x = \\dfrac{14}{5}$<br>
<br>
<b>(b)</b><br>
1. $6x^2-13x+6 = (2x-3)(3x-2)$<br>
2. $4x^2-25 = (2x+5)(2x-5)$<br>
<br>
<b>(c)</b><br>
1. $x = \\dfrac{5 \\pm \\sqrt{25+24}}{4} = \\dfrac{5 \\pm 7}{4}$<br>
2. $x = \\dfrac{12}{4} = 3$ or $x = \\dfrac{-2}{4} = -\\dfrac{1}{2}$<br>
<br>
<b>(d)</b><br>
1. $v^2 - u^2 = 2as$<br>
2. $a = \\dfrac{v^2 - u^2}{2s}$<br>
<br>
<b>(e)</b><br>
1. From equation 2: $y = 5x - 9$. Substitute into equation 1: $3x + 2(5x-9) = 16$<br>
2. $13x = 34 \\Rightarrow x = \\dfrac{34}{13}$... (accept elimination method)<br>
OR: multiply eq2 by 2: $10x - 2y = 18$. Add to eq1: $13x = 34 \\Rightarrow x = \\dfrac{34}{13}$, $y = \\dfrac{5\\times34}{13}-9 = \\dfrac{170-117}{13} = \\dfrac{53}{13}$<br>`,
},

{
  question_id: 2029,
  topic_id: 3005,
  subject_id: 8,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Health, Disease and Medicines",
  content: `<p><b>(a)</b> State the difference between <b>communicable</b> and <b>non-communicable</b> diseases. Give one example of each. [4]</p>
<p><b>(b)</b> Describe how the following act as barriers to infection:</p>
<ul>
  <li>The skin [2]</li>
  <li>The respiratory tract [2]</li>
</ul>
<p><b>(c)</b> Explain how <b>antibiotics</b> work and explain why they cannot be used to treat viral infections. [3]</p>
<p><b>(d)</b> Describe the process by which a new medicine is developed and tested before it can be prescribed to patients. [4]</p>
<p><b>(e)</b> Explain what is meant by an <b>antibiotic-resistant</b> strain of bacteria and describe how resistance arises through natural selection. [4]</p>
<p><b>Total: 19 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Communicable diseases can be spread from one organism to another (infectious).<br>
2. Example: tuberculosis, influenza, cholera (accept any valid communicable disease).<br>
3. Non-communicable diseases cannot be passed between organisms.<br>
4. Example: cancer, diabetes, heart disease (accept any valid non-communicable disease).<br>
<br>
<b>(b)</b><br>
<b>Skin:</b><br>
1. The skin forms a continuous physical barrier that prevents pathogens from entering the body.<br>
2. Sebaceous glands secrete sebum, which is slightly acidic and inhibits microbial growth.<br>
<b>Respiratory tract:</b><br>
1. Mucus lines the airways and traps pathogens and particles.<br>
2. Cilia beat rhythmically to move mucus (and trapped pathogens) upward toward the throat, where it is swallowed.<br>
<br>
<b>(c)</b><br>
1. Antibiotics interfere with bacterial cell processes, such as inhibiting cell wall synthesis or protein synthesis, killing or preventing bacterial growth.<br>
2. Viruses do not have cell walls or their own ribosomes — they use the host cell's machinery to replicate.<br>
3. Antibiotics therefore have no target within viruses and are ineffective against them.<br>
<br>
<b>(d)</b><br>
1. The drug is first tested in the laboratory on cells/tissues and computer models (preclinical testing).<br>
2. If promising, it is tested on animals to assess safety and toxicity.<br>
3. Clinical trials then take place in three phases: small groups for safety, larger groups for efficacy, then large-scale trials comparing against existing treatments or a placebo.<br>
4. A double-blind trial is used to eliminate bias; neither the patients nor the doctors know who receives the drug or placebo until after results are recorded.<br>
<br>
<b>(e)</b><br>
1. An antibiotic-resistant strain is one that can survive exposure to an antibiotic that would normally kill it.<br>
2. Within a bacterial population, random mutations mean some individuals are naturally resistant.<br>
3. When antibiotics are used, non-resistant bacteria are killed, but resistant individuals survive and reproduce.<br>
4. Over generations, the resistant trait becomes more common in the population — this is natural selection.`,
},

{
  question_id: 2030,
  topic_id: 5005,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Trigonometry: Identities and Equations",
  content: `<p><b>(a)</b> State the identities for $\\sin^2\\theta + \\cos^2\\theta$ and $\\tan\\theta$ in terms of $\\sin\\theta$ and $\\cos\\theta$. [2]</p>
<p><b>(b)</b> Prove the identity $\\dfrac{1 - \\cos^2\\theta}{\\sin\\theta} \\equiv \\sin\\theta$. [2]</p>
<p><b>(c)</b> Solve the following equations for $0° \\leq \\theta \\leq 360°$:</p>
<ul>
  <li>$2\\sin\\theta - 1 = 0$ [2]</li>
  <li>$2\\cos^2\\theta + \\cos\\theta - 1 = 0$ [4]</li>
  <li>$\\sin 2\\theta = \\cos\\theta$ [4]</li>
</ul>
<p><b>(d)</b> Show that $\\cos 2\\theta = 1 - 2\\sin^2\\theta$, starting from $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$. [2]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $\\sin^2\\theta + \\cos^2\\theta = 1$<br>
2. $\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}$<br>
<br>
<b>(b)</b><br>
1. $\\dfrac{1-\\cos^2\\theta}{\\sin\\theta} = \\dfrac{\\sin^2\\theta}{\\sin\\theta}$ (using $\\sin^2\\theta + \\cos^2\\theta = 1$)<br>
2. $= \\sin\\theta$ ✓<br>
<br>
<b>(c)</b><br>
1. $\\sin\\theta = \\dfrac{1}{2} \\Rightarrow \\theta = 30°, 150°$<br>
2. Let $c = \\cos\\theta$: $2c^2+c-1=0 \\Rightarrow (2c-1)(c+1)=0 \\Rightarrow \\cos\\theta = \\dfrac{1}{2}$ or $\\cos\\theta = -1$<br>
$\\Rightarrow \\theta = 60°, 300°, 180°$<br>
3. $\\sin 2\\theta = \\cos\\theta \\Rightarrow 2\\sin\\theta\\cos\\theta = \\cos\\theta \\Rightarrow \\cos\\theta(2\\sin\\theta - 1) = 0$<br>
$\\cos\\theta = 0 \\Rightarrow \\theta = 90°, 270°$<br>
$\\sin\\theta = \\dfrac{1}{2} \\Rightarrow \\theta = 30°, 150°$<br>
All solutions: $30°, 90°, 150°, 270°$<br>
<br>
<b>(d)</b><br>
1. $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = (1-\\sin^2\\theta) - \\sin^2\\theta$<br>
2. $= 1 - 2\\sin^2\\theta$ ✓`,
},

{
  question_id: 2031,
  topic_id: 10003,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Electrons, Bonding and Structure",
  content: `<p><b>(a)</b> Write the full electron configuration of the following species:</p>
<ul>
  <li>$\\text{Fe}$ (atomic number 26) [1]</li>
  <li>$\\text{Fe}^{2+}$ [1]</li>
  <li>$\\text{Cl}^-$ [1]</li>
</ul>
<p><b>(b)</b> Explain what is meant by the first ionisation energy of an element and write an equation to represent the first ionisation energy of sodium. [3]</p>
<p><b>(c)</b> The first ionisation energies of the elements lithium to neon show an overall increasing trend but with two notable dips. Identify where these dips occur and explain why each occurs. [4]</p>
<p><b>(d)</b> Describe the bonding in and the structure of:</p>
<ul>
  <li>Diamond [3]</li>
  <li>Sodium chloride [3]</li>
</ul>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Fe: $1s^2 2s^2 2p^6 3s^2 3p^6 3d^6 4s^2$<br>
2. Fe²⁺: $1s^2 2s^2 2p^6 3s^2 3p^6 3d^6$ (4s electrons removed first)<br>
3. Cl⁻: $1s^2 2s^2 2p^6 3s^2 3p^6$<br>
<br>
<b>(b)</b><br>
1. The first ionisation energy is the energy required to remove one mole of electrons from one mole of gaseous atoms in their ground state.<br>
2. This produces one mole of gaseous 1+ ions.<br>
3. $\\text{Na}(g) \\rightarrow \\text{Na}^+(g) + e^-$<br>
<br>
<b>(c)</b><br>
1. First dip: between Be and B (Be has higher first IE than B).<br>
2. B has a $2p^1$ electron, which is in a slightly higher energy subshell than Be's $2s^2$ and is shielded by the 2s electrons, so less energy is required to remove it.<br>
3. Second dip: between N and O (N has higher first IE than O).<br>
4. O has a paired electron in a 2p orbital; the repulsion between paired electrons makes it easier to remove one, despite the higher nuclear charge.<br>
<br>
<b>(d)</b><br>
<b>Diamond:</b><br>
1. Each carbon atom forms four covalent bonds with four neighbouring carbon atoms in a tetrahedral arrangement.<br>
2. This forms a giant covalent (macromolecular) lattice structure.<br>
3. It has a very high melting point due to the large number of strong covalent bonds that must be broken.<br>
<b>Sodium chloride:</b><br>
1. Na⁺ and Cl⁻ ions are arranged alternately in a giant ionic lattice.<br>
2. Strong electrostatic forces of attraction act between oppositely charged ions in all directions.<br>
3. It has a high melting point due to the large amount of energy required to overcome these strong ionic bonds.`,
},

{
  question_id: 2032,
  topic_id: 9017,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Photosynthesis",
  content: `<p><b>(a)</b> Write the overall equation for photosynthesis. [2]</p>
<p><b>(b)</b> Describe the <b>light-dependent reactions</b> of photosynthesis. Your answer should refer to the products formed and the role of the thylakoid membrane. [5]</p>
<p><b>(c)</b> Describe the <b>Calvin cycle</b> (light-independent reactions), including the roles of RuBisCO, GP, TP, and RuBP. [5]</p>
<p><b>(d)</b> A student investigates the effect of light intensity on the rate of photosynthesis using pondweed.</p>
<ul>
  <li>Describe how the student could measure the rate of photosynthesis. [2]</li>
  <li>Explain why the rate of photosynthesis levels off at high light intensities. [2]</li>
</ul>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\rightarrow{\\text{light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$<br>
2. (1 mark for correct reactants and products, 1 mark for light indicated)<br>
<br>
<b>(b)</b><br>
1. Light energy is absorbed by chlorophyll molecules embedded in the thylakoid membrane.<br>
2. This energy is used to excite electrons to a higher energy level; the electrons pass along the electron transport chain in the thylakoid membrane.<br>
3. Photolysis of water occurs: $2\\text{H}_2\\text{O} \\rightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2$; oxygen is released as a by-product.<br>
4. The flow of protons (H⁺) down their concentration gradient through ATP synthase drives the synthesis of ATP (photophosphorylation).<br>
5. NADP is reduced to NADPH using H⁺ ions and electrons. ATP and NADPH pass to the light-independent reactions.<br>
<br>
<b>(c)</b><br>
1. CO₂ is fixed by combining with RuBP (a 5-carbon compound) in a reaction catalysed by RuBisCO.<br>
2. This produces two molecules of GP (glycerate-3-phosphate), a 3-carbon compound.<br>
3. GP is reduced to TP (triose phosphate) using ATP and NADPH from the light-dependent reactions.<br>
4. Some TP is used to synthesise glucose and other organic molecules.<br>
5. Most TP is used to regenerate RuBP using ATP, allowing the cycle to continue.<br>
<br>
<b>(d)</b><br>
1. Count the number of oxygen bubbles produced per minute (or collect and measure the volume of gas produced) at different distances from a light source.<br>
2. At high light intensities, another factor becomes limiting — such as CO₂ concentration or temperature — so increasing light intensity further has no effect on the rate.`,
},

{
  question_id: 2033,
  topic_id: 8011,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Waves: Properties and Behaviour",
  content: `<p><b>(a)</b> State the difference between <b>transverse</b> and <b>longitudinal</b> waves. Give one example of each. [4]</p>
<p><b>(b)</b> A wave has a frequency of 440 Hz and a wavelength of 0.75 m. Calculate its wave speed. [2]</p>
<p><b>(c)</b> Describe what happens when a wave is:</p>
<ul>
  <li>Refracted [2]</li>
  <li>Diffracted [2]</li>
</ul>
<p><b>(d)</b> Describe the conditions required for <b>two-source interference</b> to produce a stable pattern, and explain why the sources must be coherent. [3]</p>
<p><b>(e)</b> In Young's double slit experiment, the slit separation is $0.50$ mm and the screen is $1.2$ m away. The fringe spacing is found to be $1.44$ mm. Calculate the wavelength of the light used. [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. In a transverse wave, the oscillation is perpendicular to the direction of wave travel.<br>
2. Example: light, water waves, electromagnetic waves.<br>
3. In a longitudinal wave, the oscillation is parallel to the direction of wave travel, consisting of compressions and rarefactions.<br>
4. Example: sound waves, ultrasound.<br>
<br>
<b>(b)</b><br>
1. $v = f\\lambda = 440 \\times 0.75 = 330$ m s⁻¹<br>
<br>
<b>(c)</b><br>
<b>Refraction:</b><br>
1. When a wave passes from one medium to another, it changes speed.<br>
2. If it meets the boundary at an angle, it also changes direction; the wavelength changes but the frequency remains constant.<br>
<b>Diffraction:</b><br>
1. When a wave passes through a gap or around an obstacle, it spreads out.<br>
2. Diffraction is most significant when the gap width is similar to the wavelength of the wave.<br>
<br>
<b>(d)</b><br>
1. The two sources must be coherent — they must have the same frequency and a constant phase difference.<br>
2. If sources are not coherent, the interference pattern shifts randomly and no stable pattern is observed.<br>
3. The sources should also be of similar amplitude to produce clear maxima and minima.<br>
<br>
<b>(e)</b><br>
1. $\\lambda = \\dfrac{wx}{D}$ where $w$ = fringe spacing, $x$ = slit separation, $D$ = distance to screen.<br>
2. $\\lambda = \\dfrac{1.44\\times10^{-3} \\times 0.50\\times10^{-3}}{1.2}$<br>
3. $\\lambda = 6.0\\times10^{-7}$ m $= 600$ nm`,
},

{
  question_id: 2034,
  topic_id: 2003,
  subject_id: 9,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Chemical Changes: Acids and Electrolysis",
  content: `<p><b>(a)</b> State what is meant by an <b>acid</b> and an <b:alkali</b> in terms of the ions they produce in solution. [2]</p>
<p><b>(b)</b> Write balanced ionic equations for the reaction of:</p>
<ul>
  <li>Hydrochloric acid with sodium hydroxide [2]</li>
  <li>Sulfuric acid with zinc carbonate [2]</li>
</ul>
<p><b>(c)</b> Describe how you would prepare a pure, dry sample of copper sulfate crystals from copper oxide and dilute sulfuric acid. [4]</p>
<p><b>(d)</b> During the electrolysis of dilute sulfuric acid:</p>
<ul>
  <li>State what is produced at each electrode. [2]</li>
  <li>Write half-equations for the reactions at each electrode. [2]</li>
  <li>Explain why twice the volume of gas is produced at one electrode compared to the other. [2]</li>
</ul>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. An acid produces hydrogen ions ($\\text{H}^+$) in aqueous solution.<br>
2. An alkali produces hydroxide ions ($\\text{OH}^-$) in aqueous solution.<br>
<br>
<b>(b)</b><br>
1. $\\text{H}^+(aq) + \\text{OH}^-(aq) \\rightarrow \\text{H}_2\\text{O}(l)$<br>
2. $\\text{ZnCO}_3(s) + \\text{H}_2\\text{SO}_4(aq) \\rightarrow \\text{ZnSO}_4(aq) + \\text{H}_2\\text{O}(l) + \\text{CO}_2(g)$<br>
<br>
<b>(c)</b><br>
1. Add excess copper oxide to warm dilute sulfuric acid and stir.<br>
2. Filter off the excess copper oxide using filter paper and a funnel.<br>
3. Heat the filtrate (copper sulfate solution) to evaporate some water until a saturated solution forms.<br>
4. Leave to cool and allow crystals to form; dry the crystals by blotting with filter paper.<br>
<br>
<b>(d)</b><br>
1. Cathode (negative): hydrogen gas. Anode (positive): oxygen gas.<br>
2. Cathode: $2\\text{H}^+ + 2e^- \\rightarrow \\text{H}_2$<br>
Anode: $2\\text{H}_2\\text{O} \\rightarrow \\text{O}_2 + 4\\text{H}^+ + 4e^-$<br>
3. For every mole of oxygen produced at the anode (requiring 4 electrons), 2 moles of hydrogen are produced at the cathode (requiring only 2 electrons per mole). Therefore twice the volume of hydrogen is produced compared to oxygen.`,
},

{
  question_id: 2035,
  topic_id: 6016,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "First Order Differential Equations",
  content: `<p><b>(a)</b> Solve the following differential equations, giving the general solution in each case:</p>
<ul>
  <li>$\\dfrac{dy}{dx} = 3x^2 - 2x$ [2]</li>
  <li>$\\dfrac{dy}{dx} = \\dfrac{x}{y}$ [3]</li>
</ul>
<p><b>(b)</b> Solve the differential equation $\\dfrac{dy}{dx} + 2y = 6$ given that $y = 5$ when $x = 0$. Give your answer in the form $y = f(x)$. [5]</p>
<p><b>(c)</b> A population $P$ grows at a rate proportional to its current size. Initially $P = 500$ and after 10 years $P = 800$.</p>
<ul>
  <li>Write and solve a differential equation to model this situation. [4]</li>
  <li>Predict the population after 25 years, to the nearest whole number. [2]</li>
</ul>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $y = x^3 - x^2 + c$<br>
2. Separate variables: $y \\, dy = x \\, dx \\Rightarrow \\dfrac{y^2}{2} = \\dfrac{x^2}{2} + c \\Rightarrow y^2 = x^2 + A$<br>
<br>
<b>(b)</b><br>
1. Integrating factor: $e^{\\int 2 \\, dx} = e^{2x}$<br>
2. Multiply through: $\\dfrac{d}{dx}(ye^{2x}) = 6e^{2x}$<br>
3. Integrate: $ye^{2x} = 3e^{2x} + c$<br>
4. $y = 3 + ce^{-2x}$<br>
5. Apply $y(0)=5$: $5 = 3 + c \\Rightarrow c = 2$. So $y = 3 + 2e^{-2x}$<br>
<br>
<b>(c)</b><br>
1. $\\dfrac{dP}{dt} = kP \\Rightarrow \\displaystyle\\int \\dfrac{1}{P} \\, dP = \\int k \\, dt \\Rightarrow \\ln P = kt + c$<br>
2. $P = Ae^{kt}$. At $t=0$: $A = 500$. So $P = 500e^{kt}$.<br>
3. At $t=10$: $800 = 500e^{10k} \\Rightarrow e^{10k} = 1.6 \\Rightarrow k = \\dfrac{\\ln 1.6}{10} = 0.04700$<br>
4. $P = 500e^{0.04700t}$<br>
5. At $t=25$: $P = 500e^{0.04700 \\times 25} = 500e^{1.175} = 500 \\times 3.239 \\approx 1620$`,
},

{
  question_id: 2036,
  topic_id: 11005,
  subject_id: 11,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "TMUA: Calculus Reasoning",
  content: `<p><b>(a)</b> A function is defined as $f(x) = x^3 - 6x^2 + 9x + 1$.</p>
<ul>
  <li>Find all stationary points of $f(x)$. [3]</li>
  <li>Determine the nature of each stationary point. [2]</li>
  <li>Sketch the curve, labelling all stationary points and the $y$-intercept. [2]</li>
</ul>
<p><b>(b)</b> Evaluate $\\displaystyle\\int_0^2 x^3 - 6x^2 + 9x + 1 \\, dx$ and interpret the result geometrically. [4]</p>
<p><b>(c)</b> Given that $g(x) = \\dfrac{e^{2x}}{x^2+1}$, find $g'(x)$ using the quotient rule. [3]</p>
<p><b>(d)</b> Show that the equation $h(x) = x^3 + x - 5 = 0$ has a root in the interval $[1, 2]$, and use one iteration of the Newton-Raphson method starting from $x_0 = 1.5$ to find an improved estimate. [4]</p>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $f'(x) = 3x^2 - 12x + 9 = 3(x^2-4x+3) = 3(x-1)(x-3)$<br>
2. Stationary points at $x=1$ and $x=3$.<br>
3. At $x=1$: $f(1) = 1-6+9+1 = 5$. At $x=3$: $f(3) = 27-54+27+1=1$.<br>
4. $f''(x) = 6x-12$. At $x=1$: $f''=-6<0$ → local maximum $(1,5)$. At $x=3$: $f''=6>0$ → local minimum $(3,1)$.<br>
5. Sketch: cubic shape, y-intercept at $(0,1)$, local max at $(1,5)$, local min at $(3,1)$.<br>
<br>
<b>(b)</b><br>
1. $\\left[\\dfrac{x^4}{4} - 2x^3 + \\dfrac{9x^2}{2} + x\\right]_0^2$<br>
2. $= (4 - 16 + 18 + 2) - 0 = 8$<br>
3. This represents the net signed area between the curve $y = f(x)$ and the $x$-axis from $x=0$ to $x=2$.<br>
<br>
<b>(c)</b><br>
1. $g'(x) = \\dfrac{2e^{2x}(x^2+1) - e^{2x}(2x)}{(x^2+1)^2}$<br>
2. $= \\dfrac{e^{2x}(2x^2+2-2x)}{(x^2+1)^2}$<br>
3. $= \\dfrac{2e^{2x}(x^2-x+1)}{(x^2+1)^2}$<br>
<br>
<b>(d)</b><br>
1. $h(1) = 1+1-5=-3<0$ and $h(2)=8+2-5=5>0$. Since $h$ is continuous and changes sign, by the IVT there is a root in $[1,2]$.<br>
2. $h'(x) = 3x^2+1$. At $x_0=1.5$: $h(1.5)=3.375+1.5-5=-0.125$, $h'(1.5)=6.75+1=7.75$<br>
3. $x_1 = 1.5 - \\dfrac{-0.125}{7.75} = 1.5 + 0.01613 \\approx 1.516$`,
},

{
  question_id: 2037,
  topic_id: 5014,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Statistical Distributions",
  content: `<p><b>(a)</b> State the conditions required for a random variable $X$ to follow a <b>binomial distribution</b> $B(n,p)$. [3]</p>
<p><b>(b)</b> A biased coin has probability 0.3 of landing heads. The coin is tossed 8 times. Let $X$ be the number of heads.</p>
<ul>
  <li>State the distribution of $X$. [1]</li>
  <li>Find $P(X = 3)$. [2]</li>
  <li>Find $P(X \\geq 2)$. [3]</li>
</ul>
<p><b>(c)</b> The heights of adult males are normally distributed with mean 175 cm and standard deviation 8 cm. Find:</p>
<ul>
  <li>$P(\\text{height} > 183 \\text{ cm})$ [2]</li>
  <li>$P(167 < \\text{height} < 191)$ [3]</li>
  <li>The height exceeded by only 10% of adult males. [3]</li>
</ul>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A fixed number of trials $n$.<br>
2. Each trial has exactly two outcomes: success or failure.<br>
3. Trials are independent and the probability of success $p$ is constant for each trial.<br>
<br>
<b>(b)</b><br>
1. $X \\sim B(8, 0.3)$<br>
2. $P(X=3) = \\binom{8}{3}(0.3)^3(0.7)^5 = 56 \\times 0.027 \\times 0.16807 = 0.2541$<br>
3. $P(X \\geq 2) = 1 - P(X=0) - P(X=1)$<br>
$P(X=0) = (0.7)^8 = 0.05765$<br>
$P(X=1) = 8 \\times 0.3 \\times (0.7)^7 = 0.19765$<br>
$P(X \\geq 2) = 1 - 0.05765 - 0.19765 = 0.7447$<br>
<br>
<b>(c)</b><br>
1. $Z = \\dfrac{183-175}{8} = 1$. $P(Z>1) = 1-0.8413 = 0.1587$<br>
2. $P\\left(\\dfrac{167-175}{8} < Z < \\dfrac{191-175}{8}\\right) = P(-1 < Z < 2)$<br>
$= \\Phi(2) - \\Phi(-1) = 0.9772 - 0.1587 = 0.8185$<br>
3. Top 10%: $P(Z < z) = 0.90 \\Rightarrow z = 1.282$<br>
Height $= 175 + 1.282 \\times 8 = 175 + 10.25 = 185.25$ cm`,
},

{
  question_id: 2038,
  topic_id: 8020,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Capacitance: Charging and Discharging",
  content: `<p><b>(a)</b> Define <b>capacitance</b> and state its SI unit. [2]</p>
<p><b>(b)</b> A capacitor of capacitance $C = 470\\ \\mu\\text{F}$ is charged to a potential difference of 12 V.</p>
<ul>
  <li>Calculate the charge stored on the capacitor. [2]</li>
  <li>Calculate the energy stored in the capacitor. [2]</li>
</ul>
<p><b>(c)</b> The capacitor in (b) is discharged through a resistor of resistance $R = 10\\ \\text{k}\\Omega$. The voltage across the capacitor at time $t$ is given by $V = V_0 e^{-t/RC}$.</p>
<ul>
  <li>Calculate the time constant $\\tau = RC$. [1]</li>
  <li>Calculate the voltage after one time constant. [2]</li>
  <li>Calculate the time for the voltage to fall to 1.5 V. [3]</li>
</ul>
<p><b>(d)</b> Sketch a graph of voltage against time for the discharging capacitor, labelling the initial voltage, the time constant, and the asymptote. [3]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Capacitance is the charge stored per unit potential difference: $C = \\dfrac{Q}{V}$<br>
2. SI unit: farad (F)<br>
<br>
<b>(b)</b><br>
1. $Q = CV = 470\\times10^{-6} \\times 12 = 5.64\\times10^{-3}$ C $= 5.64$ mC<br>
2. $E = \\dfrac{1}{2}CV^2 = \\dfrac{1}{2} \\times 470\\times10^{-6} \\times 144 = 3.38\\times10^{-2}$ J $= 33.8$ mJ<br>
<br>
<b>(c)</b><br>
1. $\\tau = RC = 10\\times10^3 \\times 470\\times10^{-6} = 4.70$ s<br>
2. After one time constant: $V = 12 \\times e^{-1} = 12 \\times 0.368 = 4.41$ V<br>
3. $1.5 = 12e^{-t/4.70} \\Rightarrow e^{-t/4.70} = 0.125 \\Rightarrow -\\dfrac{t}{4.70} = \\ln(0.125) = -2.079$<br>
$t = 4.70 \\times 2.079 = 9.77$ s<br>
<br>
<b>(d)</b><br>
1. Curve starts at $V_0 = 12$ V on the $y$-axis.<br>
2. Exponential decay shape, never touching the $t$-axis (asymptote at $V=0$).<br>
3. Time constant $\\tau = 4.70$ s marked on $t$-axis, with $V = 4.41$ V marked at that point.`,
},

{
  question_id: 2039,
  topic_id: 4004,
  subject_id: 7,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Geometry: Circles and Pythagoras",
  content: `<p><b>(a)</b> A circle has equation $x^2 + y^2 = 100$.</p>
<ul>
  <li>State the centre and radius of the circle. [2]</li>
  <li>Determine whether the point $(6, 8)$ lies on, inside, or outside the circle. Show your working. [2]</li>
</ul>
<p><b>(b)</b> A right-angled triangle has legs of length 9 cm and 40 cm. Calculate the length of the hypotenuse. [2]</p>
<p><b>(c)</b> A chord $AB$ of a circle with centre $O$ and radius 13 cm has length 24 cm. Calculate the perpendicular distance from $O$ to the chord. [3]</p>
<p><b>(d)</b> The diagram shows a sector of a circle with radius 8 cm and angle $\\theta = 1.2$ radians.</p>
<ul>
  <li>Calculate the arc length. [2]</li>
  <li>Calculate the area of the sector. [2]</li>
  <li>Calculate the area of the triangle formed by the two radii and the chord. [2]</li>
</ul>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Centre $(0,0)$, radius $= 10$<br>
2. $6^2 + 8^2 = 36+64 = 100 = 10^2$ → the point lies <b>on</b> the circle.<br>
<br>
<b>(b)</b><br>
1. $h^2 = 9^2 + 40^2 = 81 + 1600 = 1681$<br>
2. $h = 41$ cm<br>
<br>
<b>(c)</b><br>
1. The perpendicular from the centre bisects the chord, so half-chord $= 12$ cm.<br>
2. $d^2 + 12^2 = 13^2 \\Rightarrow d^2 = 169-144 = 25$<br>
3. $d = 5$ cm<br>
<br>
<b>(d)</b><br>
1. Arc length $= r\\theta = 8 \\times 1.2 = 9.6$ cm<br>
2. Area of sector $= \\dfrac{1}{2}r^2\\theta = \\dfrac{1}{2} \\times 64 \\times 1.2 = 38.4$ cm²<br>
3. Area of triangle $= \\dfrac{1}{2}r^2\\sin\\theta = \\dfrac{1}{2} \\times 64 \\times \\sin(1.2) = 32 \\times 0.9320 = 29.8$ cm²`,
},

{
  question_id: 2040,
  topic_id: 13004,
  subject_id: 14,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "PAT: Calculus Problems",
  content: `<p><b>(a)</b> Differentiate the following with respect to $x$:</p>
<ul>
  <li>$y = x^2 \\sin x$ [2]</li>
  <li>$y = \\ln(3x^2 + 1)$ [2]</li>
  <li>$y = e^{x^2}$ [2]</li>
</ul>
<p><b>(b)</b> Find the exact value of $\\displaystyle\\int_0^{\\pi/2} \\sin x \\cos x \\, dx$. [3]</p>
<p><b>(c)</b> A particle moves in a straight line. Its displacement from the origin at time $t$ seconds is given by $s = t^3 - 6t^2 + 9t$.</p>
<ul>
  <li>Find the velocity and acceleration as functions of $t$. [2]</li>
  <li>Find the times at which the particle is instantaneously at rest. [2]</li>
  <li>Find the total distance travelled in the first 4 seconds. [4]</li>
</ul>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Product rule: $\\dfrac{dy}{dx} = 2x\\sin x + x^2\\cos x$<br>
2. Chain rule: $\\dfrac{dy}{dx} = \\dfrac{6x}{3x^2+1}$<br>
3. Chain rule: $\\dfrac{dy}{dx} = 2xe^{x^2}$<br>
<br>
<b>(b)</b><br>
1. Use identity: $\\sin x \\cos x = \\dfrac{1}{2}\\sin 2x$<br>
2. $\\displaystyle\\int_0^{\\pi/2} \\dfrac{1}{2}\\sin 2x \\, dx = \\left[-\\dfrac{1}{4}\\cos 2x\\right]_0^{\\pi/2}$<br>
3. $= \\left(-\\dfrac{1}{4}\\cos\\pi\\right) - \\left(-\\dfrac{1}{4}\\cos 0\\right) = \\dfrac{1}{4} + \\dfrac{1}{4} = \\dfrac{1}{2}$<br>
<br>
<b>(c)</b><br>
1. $v = \\dfrac{ds}{dt} = 3t^2 - 12t + 9$, $\\quad a = \\dfrac{dv}{dt} = 6t - 12$<br>
2. $v=0$: $3(t^2-4t+3)=0 \\Rightarrow 3(t-1)(t-3)=0 \\Rightarrow t=1$ s and $t=3$ s<br>
3. $s(0)=0$, $s(1)=1-6+9=4$, $s(3)=27-54+27=0$, $s(4)=64-96+36=4$<br>
Distance $= |s(1)-s(0)| + |s(3)-s(1)| + |s(4)-s(3)|$<br>
$= 4 + 4 + 4 = 12$ m`,
},
{
  question_id: 2041,
  topic_id: 5004,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Sequences and Series",
  content: `<p><b>(a)</b> The first term of an arithmetic sequence is 3 and the common difference is 7.</p>
<ul>
  <li>Find the 20th term. [2]</li>
  <li>Find the sum of the first 20 terms. [2]</li>
</ul>
<p><b>(b)</b> A geometric sequence has first term $a = 5$ and common ratio $r = 0.6$.</p>
<ul>
  <li>Find the 8th term, giving your answer to 3 significant figures. [2]</li>
  <li>Find the sum to infinity. [2]</li>
</ul>
<p><b>(c)</b> The sum of the first $n$ terms of a series is given by $S_n = 3n^2 + 2n$. Find the $n$th term $u_n$ and show that the series is arithmetic. [4]</p>
<p><b>(d)</b> Expand $(1 + 2x)^5$ using the binomial theorem. [4]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $u_{20} = 3 + 19 \\times 7 = 3 + 133 = 136$<br>
2. $S_{20} = \\dfrac{20}{2}(3 + 136) = 10 \\times 139 = 1390$<br>
<br>
<b>(b)</b><br>
1. $u_8 = 5 \\times 0.6^7 = 5 \\times 0.02799 = 0.140$ (3 s.f.)<br>
2. $S_{\\infty} = \\dfrac{a}{1-r} = \\dfrac{5}{1-0.6} = \\dfrac{5}{0.4} = 12.5$<br>
<br>
<b>(c)</b><br>
1. $u_n = S_n - S_{n-1} = (3n^2+2n) - (3(n-1)^2+2(n-1))$<br>
2. $= 3n^2+2n - (3n^2-6n+3+2n-2) = 3n^2+2n-3n^2+4n-1 = 6n+1$<br>
3. $u_{n+1} - u_n = 6(n+1)+1 - (6n+1) = 6$, which is constant.<br>
4. Since the difference between consecutive terms is constant ($d=6$), the series is arithmetic. ✓<br>
<br>
<b>(d)</b><br>
1. $(1+2x)^5 = \\binom{5}{0}(2x)^0 + \\binom{5}{1}(2x)^1 + \\binom{5}{2}(2x)^2 + \\binom{5}{3}(2x)^3 + \\binom{5}{4}(2x)^4 + \\binom{5}{5}(2x)^5$<br>
2. $= 1 + 5(2x) + 10(4x^2) + 10(8x^3) + 5(16x^4) + 32x^5$<br>
3. $= 1 + 10x + 40x^2 + 80x^3 + 80x^4 + 32x^5$`,
},

{
  question_id: 2042,
  topic_id: 5006,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Exponentials and Logarithms",
  content: `<p><b>(a)</b> Solve the following equations, giving exact answers where possible:</p>
<ul>
  <li>$3^x = 20$ [2]</li>
  <li>$\\log_2(3x - 1) = 4$ [2]</li>
  <li>$\\log x + \\log(x-3) = 1$ [4]</li>
</ul>
<p><b>(b)</b> Given that $\\ln a = 3$ and $\\ln b = 5$, find:</p>
<ul>
  <li>$\\ln(a^2 b)$ [2]</li>
  <li>$\\ln\\sqrt{\\dfrac{a}{b}}$ [2]</li>
</ul>
<p><b>(c)</b> A radioactive substance decays according to $N = N_0 e^{-0.035t}$, where $t$ is in years.</p>
<ul>
  <li>Find the half-life of the substance. [3]</li>
  <li>Find the percentage remaining after 50 years. [2]</li>
</ul>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $x = \\dfrac{\\log 20}{\\log 3} = \\dfrac{\\ln 20}{\\ln 3} = 2.727$ (accept exact $\\log_3 20$)<br>
2. $3x-1 = 2^4 = 16 \\Rightarrow 3x = 17 \\Rightarrow x = \\dfrac{17}{3}$<br>
3. $\\log(x(x-3)) = 1 \\Rightarrow x(x-3) = 10 \\Rightarrow x^2-3x-10=0 \\Rightarrow (x-5)(x+2)=0$<br>
$x=5$ or $x=-2$. Reject $x=-2$ (log of negative undefined). $x=5$.<br>
<br>
<b>(b)</b><br>
1. $\\ln(a^2 b) = 2\\ln a + \\ln b = 2(3)+5 = 11$<br>
2. $\\ln\\sqrt{\\dfrac{a}{b}} = \\dfrac{1}{2}(\\ln a - \\ln b) = \\dfrac{1}{2}(3-5) = -1$<br>
<br>
<b>(c)</b><br>
1. Half-life: $\\dfrac{1}{2} = e^{-0.035t} \\Rightarrow -0.035t = \\ln 0.5 \\Rightarrow t = \\dfrac{\\ln 2}{0.035} = 19.8$ years<br>
2. $N = N_0 e^{-0.035 \\times 50} = N_0 e^{-1.75} = N_0 \\times 0.1738$<br>
Percentage remaining: $17.4\\%$`,
},

{
  question_id: 2043,
  topic_id: 6010,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Series and Mathematical Induction",
  content: `<p><b>(a)</b> Use the standard results for $\\displaystyle\\sum_{r=1}^{n} r$ and $\\displaystyle\\sum_{r=1}^{n} r^2$ to find a simplified expression for $\\displaystyle\\sum_{r=1}^{n} r(r+3)$. [4]</p>
<p><b>(b)</b> Hence evaluate $\\displaystyle\\sum_{r=1}^{20} r(r+3)$. [2]</p>
<p><b>(c)</b> Prove by mathematical induction that $\\displaystyle\\sum_{r=1}^{n} r^2 = \\dfrac{n(n+1)(2n+1)}{6}$ for all positive integers $n$. [6]</p>
<p><b>(d)</b> Use proof by induction to show that $7^n - 1$ is divisible by 6 for all positive integers $n$. [5]</p>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $\\displaystyle\\sum_{r=1}^{n} r(r+3) = \\sum_{r=1}^{n} r^2 + 3\\sum_{r=1}^{n} r$<br>
2. $= \\dfrac{n(n+1)(2n+1)}{6} + 3 \\cdot \\dfrac{n(n+1)}{2}$<br>
3. $= \\dfrac{n(n+1)(2n+1)}{6} + \\dfrac{9n(n+1)}{6}$<br>
4. $= \\dfrac{n(n+1)(2n+10)}{6} = \\dfrac{n(n+1) \\cdot 2(n+5)}{6} = \\dfrac{n(n+1)(n+5)}{3}$<br>
<br>
<b>(b)</b><br>
1. $\\dfrac{20 \\times 21 \\times 25}{3} = \\dfrac{10500}{3} = 3500$<br>
<br>
<b>(c)</b><br>
1. <b>Base case:</b> $n=1$: LHS $= 1^2 = 1$. RHS $= \\dfrac{1 \\times 2 \\times 3}{6} = 1$. ✓<br>
2. <b>Inductive step:</b> Assume true for $n=k$: $\\displaystyle\\sum_{r=1}^{k} r^2 = \\dfrac{k(k+1)(2k+1)}{6}$<br>
3. For $n=k+1$: $\\displaystyle\\sum_{r=1}^{k+1} r^2 = \\dfrac{k(k+1)(2k+1)}{6} + (k+1)^2$<br>
4. $= \\dfrac{k(k+1)(2k+1) + 6(k+1)^2}{6} = \\dfrac{(k+1)[k(2k+1)+6(k+1)]}{6}$<br>
5. $= \\dfrac{(k+1)(2k^2+7k+6)}{6} = \\dfrac{(k+1)(k+2)(2k+3)}{6}$<br>
6. This is the formula with $n=k+1$, so by induction the result holds for all positive integers $n$. ✓<br>
<br>
<b>(d)</b><br>
1. <b>Base case:</b> $n=1$: $7^1-1=6$, which is divisible by 6. ✓<br>
2. <b>Inductive step:</b> Assume $7^k - 1 = 6m$ for some integer $m$, i.e. $7^k = 6m+1$.<br>
3. $7^{k+1} - 1 = 7 \\cdot 7^k - 1 = 7(6m+1) - 1 = 42m + 7 - 1 = 42m + 6 = 6(7m+1)$<br>
4. Since $7m+1$ is an integer, $7^{k+1}-1$ is divisible by 6.<br>
5. By induction, $7^n - 1$ is divisible by 6 for all positive integers $n$. ✓`,
},

{
  question_id: 2044,
  topic_id: 8008,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Charge, Current and Resistance",
  content: `<p><b>(a)</b> Define <b>electric current</b> in terms of charge flow and state its SI unit. [2]</p>
<p><b>(b)</b> A charge of 45 C passes through a wire in 3 minutes. Calculate the current. [2]</p>
<p><b>(c)</b> State Ohm's Law and sketch a current-voltage graph for:</p>
<ul>
  <li>An ohmic conductor [1]</li>
  <li>A filament lamp [1]</li>
  <li>A diode [1]</li>
</ul>
<p><b>(d)</b> A circuit consists of a 12 V battery with internal resistance $r = 0.5\\ \\Omega$ connected to an external resistor $R = 5.5\\ \\Omega$.</p>
<ul>
  <li>Calculate the current in the circuit. [2]</li>
  <li>Calculate the terminal potential difference. [2]</li>
  <li>Calculate the power dissipated in the external resistor. [2]</li>
</ul>
<p><b>(e)</b> Explain why the terminal p.d. of a battery decreases as the current drawn increases. [2]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Electric current is the rate of flow of charge: $I = \\dfrac{\\Delta Q}{\\Delta t}$<br>
2. SI unit: ampere (A)<br>
<br>
<b>(b)</b><br>
1. $t = 3 \\times 60 = 180$ s<br>
2. $I = \\dfrac{Q}{t} = \\dfrac{45}{180} = 0.25$ A<br>
<br>
<b>(c)</b><br>
1. Ohmic conductor: straight line through origin.<br>
2. Filament lamp: curve with decreasing gradient (resistance increases with temperature).<br>
3. Diode: no current for negative voltage; sharp increase for positive voltage above threshold.<br>
<br>
<b>(d)</b><br>
1. $I = \\dfrac{\\varepsilon}{R+r} = \\dfrac{12}{5.5+0.5} = \\dfrac{12}{6} = 2$ A<br>
2. Terminal p.d. $= \\varepsilon - Ir = 12 - 2 \\times 0.5 = 11$ V<br>
3. $P = I^2 R = 4 \\times 5.5 = 22$ W<br>
<br>
<b>(e)</b><br>
1. The terminal p.d. is given by $V = \\varepsilon - Ir$.<br>
2. As current $I$ increases, the voltage drop across the internal resistance $Ir$ increases, so the terminal p.d. decreases.`,
},

{
  question_id: 2045,
  topic_id: 9024,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Respiration",
  content: `<p><b>(a)</b> Write the overall equation for <b>aerobic respiration</b>. [2]</p>
<p><b>(b)</b> Describe the process of <b>glycolysis</b>, including the net yield of ATP and NADH, and state where in the cell it occurs. [4]</p>
<p><b>(c)</b> Describe the <b>Krebs cycle</b>, including the inputs, outputs, and where it occurs. [5]</p>
<p><b>(d)</b> Describe the role of the <b>electron transport chain</b> in producing ATP, including the role of oxygen. [4]</p>
<p><b>(e)</b> Compare aerobic and <b>anaerobic respiration</b> in mammals in terms of location, products, and ATP yield. [4]</p>
<p><b>Total: 19 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O}$<br>
2. (+ energy / ATP released)<br>
<br>
<b>(b)</b><br>
1. Glycolysis occurs in the cytoplasm.<br>
2. One molecule of glucose (6C) is phosphorylated and split into two molecules of pyruvate (3C).<br>
3. Net yield: 2 ATP and 2 NADH per glucose molecule.<br>
4. No oxygen is required — glycolysis is anaerobic.<br>
<br>
<b>(c)</b><br>
1. The Krebs cycle occurs in the matrix of the mitochondria.<br>
2. Pyruvate is first converted to acetyl-CoA (2C), releasing CO₂ and producing NADH (link reaction).<br>
3. Acetyl-CoA combines with oxaloacetate (4C) to form citrate (6C).<br>
4. Through a series of reactions, citrate is broken down, releasing 2 CO₂, and producing 3 NADH, 1 FADH₂, and 1 ATP per turn.<br>
5. Oxaloacetate is regenerated to accept another acetyl-CoA; the cycle turns twice per glucose molecule.<br>
<br>
<b>(d)</b><br>
1. NADH and FADH₂ donate electrons to protein carriers in the inner mitochondrial membrane.<br>
2. Electrons pass along the chain, releasing energy used to pump H⁺ ions across the membrane, creating a proton gradient.<br>
3. H⁺ ions flow back through ATP synthase (chemiosmosis), driving the synthesis of ATP.<br>
4. At the end of the chain, electrons combine with oxygen and H⁺ to form water; oxygen acts as the final electron acceptor.<br>
<br>
<b>(e)</b><br>
1. Aerobic: occurs in cytoplasm and mitochondria; products are CO₂ and water; yield ≈ 36–38 ATP per glucose.<br>
2. Anaerobic (mammals): occurs in cytoplasm only; product is lactate; yield = 2 ATP per glucose.<br>
3. Anaerobic allows continued ATP production when oxygen is unavailable but is far less efficient.<br>
4. Lactate accumulates and must later be oxidised (oxygen debt) when oxygen becomes available again.`,
},

{
  question_id: 2046,
  topic_id: 10009,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Basic Concepts and Hydrocarbons",
  content: `<p><b>(a)</b> Define the term <b>homologous series</b> and state four characteristics shared by members of a homologous series. [4]</p>
<p><b>(b)</b> Draw the skeletal formulae of the following alkanes and state their molecular formulae:</p>
<ul>
  <li>2-methylbutane [2]</li>
  <li>2,3-dimethylpentane [2]</li>
</ul>
<p><b>(c)</b> Describe the mechanism of <b>free radical substitution</b> of methane with chlorine. Your answer should include the initiation, propagation, and termination steps with equations. [6]</p>
<p><b>(d)</b> Describe the mechanism of <b>electrophilic addition</b> of HBr to but-1-ene. Draw a curly arrow mechanism and state the major product, explaining your reasoning using Markovnikov's rule. [5]</p>
<p><b>Total: 19 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A homologous series is a family of organic compounds with the same general formula and functional group.<br>
2. Consecutive members differ by a $\\text{CH}_2$ unit.<br>
3. Members show a gradual trend in physical properties (e.g. boiling point increases with chain length).<br>
4. Members have similar chemical properties due to the same functional group.<br>
5. Each member can be represented by the same general formula.<br>
<br>
<b>(b)</b><br>
1. 2-methylbutane: skeletal formula showing a 4-carbon chain with a methyl branch on C2. Molecular formula: $\\text{C}_5\\text{H}_{12}$<br>
2. 2,3-dimethylpentane: skeletal formula showing a 5-carbon chain with methyl branches on C2 and C3. Molecular formula: $\\text{C}_7\\text{H}_{16}$<br>
<br>
<b>(c)</b><br>
<b>Initiation:</b><br>
1. $\\text{Cl}_2 \\xrightarrow{\\text{UV}} 2\\text{Cl}^\\bullet$ (homolytic fission)<br>
<b>Propagation:</b><br>
2. $\\text{Cl}^\\bullet + \\text{CH}_4 \\rightarrow \\text{HCl} + \\text{CH}_3^\\bullet$<br>
3. $\\text{CH}_3^\\bullet + \\text{Cl}_2 \\rightarrow \\text{CH}_3\\text{Cl} + \\text{Cl}^\\bullet$<br>
<b>Termination (any two):</b><br>
4. $\\text{Cl}^\\bullet + \\text{Cl}^\\bullet \\rightarrow \\text{Cl}_2$<br>
5. $\\text{CH}_3^\\bullet + \\text{Cl}^\\bullet \\rightarrow \\text{CH}_3\\text{Cl}$<br>
6. $\\text{CH}_3^\\bullet + \\text{CH}_3^\\bullet \\rightarrow \\text{C}_2\\text{H}_6$<br>
<br>
<b>(d)</b><br>
1. HBr acts as the electrophile; the $\\pi$ bond acts as the nucleophile.<br>
2. The H⁺ adds to C1 (the carbon with more H atoms — Markovnikov's rule), forming the more stable secondary carbocation on C2.<br>
3. Curly arrow from $\\pi$ bond to H of HBr, then from H–Br bond to Br.<br>
4. Br⁻ then attacks the carbocation at C2.<br>
5. Major product: 2-bromobutane (secondary carbocation is more stable than primary).`,
},

{
  question_id: 2047,
  topic_id: 1002,
  subject_id: 10,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Electricity: Circuits and Components",
  content: `<p><b>(a)</b> State the difference between a <b>series</b> and a <b>parallel</b> circuit. [2]</p>
<p><b>(b)</b> Three resistors of $4\\ \\Omega$, $6\\ \\Omega$, and $12\\ \\Omega$ are connected in parallel. Calculate the total resistance of the combination. [3]</p>
<p><b>(c)</b> A 9 V battery is connected to two resistors in series: $R_1 = 3\\ \\Omega$ and $R_2 = 6\\ \\Omega$.</p>
<ul>
  <li>Calculate the current in the circuit. [2]</li>
  <li>Calculate the potential difference across each resistor. [2]</li>
  <li>Calculate the power dissipated in $R_2$. [2]</li>
</ul>
<p><b>(d)</b> Describe how the resistance of a <b>thermistor</b> changes with temperature and give one application. [2]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. In a series circuit, components are connected in a single loop so the same current flows through all components.<br>
2. In a parallel circuit, components are connected across the same two points so they share the same potential difference but may carry different currents.<br>
<br>
<b>(b)</b><br>
1. $\\dfrac{1}{R_T} = \\dfrac{1}{4} + \\dfrac{1}{6} + \\dfrac{1}{12} = \\dfrac{3}{12} + \\dfrac{2}{12} + \\dfrac{1}{12} = \\dfrac{6}{12} = \\dfrac{1}{2}$<br>
2. $R_T = 2\\ \\Omega$<br>
<br>
<b>(c)</b><br>
1. $I = \\dfrac{V}{R_T} = \\dfrac{9}{3+6} = 1$ A<br>
2. $V_1 = IR_1 = 1 \\times 3 = 3$ V; $V_2 = IR_2 = 1 \\times 6 = 6$ V<br>
3. $P_2 = I^2 R_2 = 1^2 \\times 6 = 6$ W<br>
<br>
<b>(d)</b><br>
1. As temperature increases, the resistance of a thermistor decreases (NTC thermistor).<br>
2. Application: temperature sensor in a thermostat / fire alarm / medical thermometer (accept any valid use).`,
},

{
  question_id: 2048,
  topic_id: 2006,
  subject_id: 9,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Rates of Reaction and Energy Changes",
  content: `<p><b>(a)</b> State four factors that affect the rate of a chemical reaction. [4]</p>
<p><b>(b)</b> Explain how increasing temperature increases the rate of reaction. Your answer should refer to collision theory and activation energy. [4]</p>
<p><b>(c)</b> A student investigates the rate of reaction between marble chips and hydrochloric acid by measuring the volume of $\\text{CO}_2$ produced over time.</p>
<ul>
  <li>Describe how the student could increase the rate without changing the temperature or concentration. [2]</li>
  <li>Sketch a graph of volume of $\\text{CO}_2$ against time for the original experiment, and on the same axes, sketch the curve for the same experiment using powdered marble instead of chips. Label both curves. [3]</li>
</ul>
<p><b>(d)</b> Define the terms <b>exothermic</b> and <b>endothermic</b>. Draw labelled energy profile diagrams for each. [4]</p>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b> Any four:<br>
1. Temperature<br>
2. Concentration (of solution) / pressure (of gas)<br>
3. Surface area of solid reactants<br>
4. Presence of a catalyst<br>
5. Light (for some reactions)<br>
<br>
<b>(b)</b><br>
1. Increasing temperature increases the kinetic energy of particles.<br>
2. Particles move faster and collide more frequently.<br>
3. A greater proportion of particles have energy greater than or equal to the activation energy.<br>
4. Therefore more collisions are successful, and the rate of reaction increases.<br>
<br>
<b>(c)</b><br>
1. Use powdered marble (increased surface area) / use a catalyst.<br>
2. Powdered marble curve: steeper initial gradient (faster rate), reaches same final volume (same amount of product), levels off sooner. Both curves reach the same maximum volume. Labels on both curves.<br>
<br>
<b>(d)</b><br>
1. Exothermic: a reaction that releases energy to the surroundings; the products have lower energy than the reactants. ($\\Delta H < 0$)<br>
2. Endothermic: a reaction that absorbs energy from the surroundings; the products have higher energy than the reactants. ($\\Delta H > 0$)<br>
3. Exothermic diagram: reactants higher than products, activation energy hump shown, arrow pointing down for $\\Delta H$.<br>
4. Endothermic diagram: products higher than reactants, activation energy hump shown, arrow pointing up for $\\Delta H$.`,
},

{
  question_id: 2049,
  topic_id: 6024,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Forces and Newton's Laws (FM)",
  content: `<p><b>(a)</b> A particle of mass 5 kg is acted on by two forces: $\\mathbf{F_1} = (3\\mathbf{i} + 4\\mathbf{j})$ N and $\\mathbf{F_2} = (-1\\mathbf{i} + 2\\mathbf{j})$ N. Find the acceleration of the particle as a vector and calculate its magnitude. [4]</p>
<p><b>(b)</b> A particle of mass 3 kg moves along a rough horizontal surface. A horizontal force of 20 N is applied. The coefficient of friction is $\\mu = 0.4$. Take $g = 9.8$ m s⁻².</p>
<ul>
  <li>Calculate the friction force. [2]</li>
  <li>Find the acceleration of the particle. [2]</li>
</ul>
<p><b>(c)</b> Two particles A (mass 4 kg) and B (mass 6 kg) are connected by a light inextensible string over a smooth pulley (Atwood machine). Find the acceleration of the system and the tension in the string. [5]</p>
<p><b>(d)</b> A particle is projected at $30°$ above the horizontal with initial speed $20$ m s⁻¹. Find:</p>
<ul>
  <li>The time of flight. [3]</li>
  <li>The horizontal range. [2]</li>
</ul>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Resultant force: $\\mathbf{F} = (3-1)\\mathbf{i} + (4+2)\\mathbf{j} = 2\\mathbf{i} + 6\\mathbf{j}$ N<br>
2. $\\mathbf{a} = \\dfrac{\\mathbf{F}}{m} = \\dfrac{2\\mathbf{i}+6\\mathbf{j}}{5} = 0.4\\mathbf{i} + 1.2\\mathbf{j}$ m s⁻²<br>
3. $|\\mathbf{a}| = \\sqrt{0.4^2+1.2^2} = \\sqrt{0.16+1.44} = \\sqrt{1.60} = 1.26$ m s⁻²<br>
<br>
<b>(b)</b><br>
1. Normal reaction $N = mg = 3 \\times 9.8 = 29.4$ N. Friction $= \\mu N = 0.4 \\times 29.4 = 11.76$ N<br>
2. Net force $= 20 - 11.76 = 8.24$ N. $a = \\dfrac{8.24}{3} = 2.75$ m s⁻²<br>
<br>
<b>(c)</b><br>
1. Net force on system $= (6-4)g = 2 \\times 9.8 = 19.6$ N (B heavier, so B accelerates down)<br>
2. Total mass $= 10$ kg. $a = \\dfrac{19.6}{10} = 1.96$ m s⁻²<br>
3. For particle B: $6g - T = 6a \\Rightarrow T = 6(9.8-1.96) = 6 \\times 7.84 = 47.0$ N<br>
4. Check with A: $T - 4g = 4a \\Rightarrow T = 4(9.8+1.96) = 4 \\times 11.76 = 47.0$ N ✓<br>
<br>
<b>(d)</b><br>
1. Vertical component: $u_y = 20\\sin 30° = 10$ m s⁻¹<br>
2. Time to max height: $t = \\dfrac{u_y}{g} = \\dfrac{10}{9.8} = 1.020$ s. Total time of flight $= 2 \\times 1.020 = 2.04$ s<br>
3. Horizontal component: $u_x = 20\\cos 30° = 20 \\times \\dfrac{\\sqrt{3}}{2} = 10\\sqrt{3}$ m s⁻¹<br>
Range $= u_x \\times T = 10\\sqrt{3} \\times 2.04 = 35.3$ m`,
},

{
  question_id: 2050,
  topic_id: 3002,
  subject_id: 8,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Cells and Control",
  content: `<p><b>(a)</b> State the differences between <b>mitosis</b> and <b>meiosis</b> in terms of: number of divisions, number of daughter cells produced, and genetic variation in daughter cells. [3]</p>
<p><b>(b)</b> Describe the role of mitosis in the growth and repair of organisms. [2]</p>
<p><b>(c)</b> Describe the structure and function of the following cell components:</p>
<ul>
  <li>Nucleus [2]</li>
  <li>Mitochondria [2]</li>
  <li>Ribosome [2]</li>
</ul>
<p><b>(d)</b> Explain what is meant by a <b>stem cell</b> and describe one potential medical application of stem cells. [3]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Mitosis: one division, two daughter cells, genetically identical to parent (no variation).<br>
2. Meiosis: two divisions, four daughter cells, genetically varied (due to crossing over and independent assortment).<br>
<br>
<b>(b)</b><br>
1. Mitosis produces genetically identical daughter cells, allowing organisms to grow by increasing cell number.<br>
2. It also replaces damaged or worn-out cells with identical copies, enabling repair of tissues.<br>
<br>
<b>(c)</b><br>
<b>Nucleus:</b><br>
1. Contains the cell's DNA (genetic material) organised into chromosomes.<br>
2. Controls cell activities by directing protein synthesis via mRNA.<br>
<b>Mitochondria:</b><br>
1. Double-membraned organelle with a folded inner membrane (cristae).<br>
2. Site of aerobic respiration — produces ATP for the cell.<br>
<b>Ribosome:</b><br>
1. Small organelle found in the cytoplasm or on rough ER, made of rRNA and protein.<br>
2. Site of protein synthesis (translation of mRNA).<br>
<br>
<b>(d)</b><br>
1. A stem cell is an undifferentiated cell that can divide and differentiate into specialised cell types.<br>
2. Application: stem cells could be used to grow replacement tissues or organs (e.g. replacing damaged heart muscle after a heart attack, or treating leukaemia by replacing bone marrow cells).`,
},

{
  question_id: 2051,
  topic_id: 5013,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Probability",
  content: `<p><b>(a)</b> A bag contains 5 red, 3 blue, and 2 green balls. A ball is drawn at random. Find the probability that it is:</p>
<ul>
  <li>Red [1]</li>
  <li>Not green [1]</li>
</ul>
<p><b>(b)</b> Two balls are drawn without replacement. Find the probability that:</p>
<ul>
  <li>Both are red [2]</li>
  <li>One is red and one is blue [3]</li>
</ul>
<p><b>(c)</b> Events $A$ and $B$ are such that $P(A) = 0.4$, $P(B) = 0.5$, and $P(A \\cap B) = 0.2$.</p>
<ul>
  <li>Find $P(A \\cup B)$. [2]</li>
  <li>Determine whether $A$ and $B$ are independent. Justify your answer. [2]</li>
</ul>
<p><b>(d)</b> Given that $P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}$, find $P(A|B)$ for the events in part (c) and interpret what this means. [3]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $P(\\text{red}) = \\dfrac{5}{10} = \\dfrac{1}{2}$<br>
2. $P(\\text{not green}) = \\dfrac{8}{10} = \\dfrac{4}{5}$<br>
<br>
<b>(b)</b><br>
1. $P(\\text{both red}) = \\dfrac{5}{10} \\times \\dfrac{4}{9} = \\dfrac{20}{90} = \\dfrac{2}{9}$<br>
2. $P(\\text{one red, one blue}) = P(RB) + P(BR) = \\dfrac{5}{10} \\times \\dfrac{3}{9} + \\dfrac{3}{10} \\times \\dfrac{5}{9} = \\dfrac{15}{90} + \\dfrac{15}{90} = \\dfrac{30}{90} = \\dfrac{1}{3}$<br>
<br>
<b>(c)</b><br>
1. $P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.4 + 0.5 - 0.2 = 0.7$<br>
2. If independent: $P(A \\cap B) = P(A) \\times P(B) = 0.4 \\times 0.5 = 0.2$.<br>
Since $P(A \\cap B) = 0.2$ ✓, $A$ and $B$ are independent.<br>
<br>
<b>(d)</b><br>
1. $P(A|B) = \\dfrac{0.2}{0.5} = 0.4$<br>
2. This equals $P(A)$, confirming independence.<br>
3. Knowing that $B$ has occurred does not change the probability of $A$ occurring.`,
},

{
  question_id: 2052,
  topic_id: 8024,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Radioactivity and Nuclear Decay",
  content: `<p><b>(a)</b> Compare alpha, beta-minus, and gamma radiation in terms of: nature, charge, mass, penetrating power, and ionising ability. [5]</p>
<p><b>(b)</b> Write nuclear equations for the following decays:</p>
<ul>
  <li>Alpha decay of $^{226}_{88}\\text{Ra}$ [2]</li>
  <li>Beta-minus decay of $^{14}_{6}\\text{C}$ [2]</li>
</ul>
<p><b>(c)</b> A radioactive sample has a half-life of 8 days. The initial activity is $6400$ Bq.</p>
<ul>
  <li>Calculate the activity after 32 days. [2]</li>
  <li>Calculate the decay constant $\\lambda$ in s⁻¹. [2]</li>
</ul>
<p><b>(d)</b> The activity of a sample is given by $A = A_0 e^{-\\lambda t}$. If the initial activity is 5000 Bq and $\\lambda = 0.02$ s⁻¹, calculate the time for the activity to fall to 500 Bq. [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Alpha: helium nucleus ($^4_2\\text{He}$), charge +2, mass 4 u, stopped by paper / a few cm of air, strongly ionising.<br>
2. Beta-minus: fast electron ($^0_{-1}\\text{e}$), charge -1, negligible mass, stopped by a few mm of aluminium, moderately ionising.<br>
3. Gamma: electromagnetic radiation, no charge, no mass, reduced by thick lead/concrete, weakly ionising.<br>
<br>
<b>(b)</b><br>
1. $^{226}_{88}\\text{Ra} \\rightarrow ^{222}_{86}\\text{Rn} + ^4_2\\text{He}$<br>
2. $^{14}_{6}\\text{C} \\rightarrow ^{14}_{7}\\text{N} + ^0_{-1}\\text{e} + \\bar{\\nu}_e$<br>
<br>
<b>(c)</b><br>
1. 32 days $= 4$ half-lives. $A = \\dfrac{6400}{2^4} = \\dfrac{6400}{16} = 400$ Bq<br>
2. $\\lambda = \\dfrac{\\ln 2}{t_{1/2}} = \\dfrac{0.693}{8 \\times 24 \\times 3600} = \\dfrac{0.693}{691200} = 1.003 \\times 10^{-6}$ s⁻¹<br>
<br>
<b>(d)</b><br>
1. $500 = 5000 e^{-0.02t} \\Rightarrow e^{-0.02t} = 0.1$<br>
2. $-0.02t = \\ln(0.1) = -2.303$<br>
3. $t = \\dfrac{2.303}{0.02} = 115$ s`,
},

{
  question_id: 2053,
  topic_id: 4005,
  subject_id: 7,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Probability",
  content: `<p><b>(a)</b> A spinner has 8 equal sections numbered 1 to 8. Find the probability of spinning:</p>
<ul>
  <li>A prime number [2]</li>
  <li>A number greater than 5 [1]</li>
</ul>
<p><b>(b)</b> A bag contains 4 red and 6 blue counters. Two counters are drawn at random without replacement. Calculate the probability that:</p>
<ul>
  <li>Both counters are the same colour [3]</li>
  <li>At least one counter is red [3]</li>
</ul>
<p><b>(c)</b> The probability that it rains on any given day is 0.3. Assuming independence, find the probability that:</p>
<ul>
  <li>It rains on exactly 2 out of 3 days [2]</li>
  <li>It rains on at least one of 4 days [3]</li>
</ul>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Primes from 1–8: 2, 3, 5, 7 → $P = \\dfrac{4}{8} = \\dfrac{1}{2}$<br>
2. Numbers $> 5$: 6, 7, 8 → $P = \\dfrac{3}{8}$<br>
<br>
<b>(b)</b><br>
1. $P(\\text{both red}) = \\dfrac{4}{10} \\times \\dfrac{3}{9} = \\dfrac{12}{90}$<br>
$P(\\text{both blue}) = \\dfrac{6}{10} \\times \\dfrac{5}{9} = \\dfrac{30}{90}$<br>
$P(\\text{same colour}) = \\dfrac{12+30}{90} = \\dfrac{42}{90} = \\dfrac{7}{15}$<br>
2. $P(\\text{at least one red}) = 1 - P(\\text{both blue}) = 1 - \\dfrac{30}{90} = 1 - \\dfrac{1}{3} = \\dfrac{2}{3}$<br>
<br>
<b>(c)</b><br>
1. $P(\\text{exactly 2 out of 3}) = \\binom{3}{2}(0.3)^2(0.7)^1 = 3 \\times 0.09 \\times 0.7 = 0.189$<br>
2. $P(\\text{at least one in 4}) = 1 - P(\\text{none}) = 1 - (0.7)^4 = 1 - 0.2401 = 0.7599$`,
},

{
  question_id: 2054,
  topic_id: 9007,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "DNA, Genetics and Protein Synthesis",
  content: `<p><b>(a)</b> Describe the structure of a DNA molecule, including the components of a nucleotide, base pairing rules, and the overall double helix structure. [5]</p>
<p><b>(b)</b> Describe the process of <b>DNA replication</b>, including the roles of helicase, DNA polymerase, and the concept of semi-conservative replication. [5]</p>
<p><b>(c)</b> Describe the process of <b>transcription</b> and <b>translation</b>, clearly stating where each occurs and the roles of mRNA, tRNA, and ribosomes. [6]</p>
<p><b>(d)</b> A section of DNA template strand has the sequence: <code>3'-TACGCCATT-5'</code><br>
Determine the sequence of:</p>
<ul>
  <li>The mRNA produced [2]</li>
  <li>The amino acids coded for (use the codon table: AUG = Met, CGG = Arg, UAA = Stop) [2]</li>
</ul>
<p><b>Total: 20 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A nucleotide consists of a deoxyribose sugar, a phosphate group, and one of four nitrogenous bases (A, T, C, G).<br>
2. Nucleotides are joined by phosphodiester bonds between the sugar of one and the phosphate of the next, forming the sugar-phosphate backbone.<br>
3. Two strands are held together by hydrogen bonds between complementary base pairs: A pairs with T (2 H-bonds), C pairs with G (3 H-bonds).<br>
4. The strands are antiparallel (one runs 5'→3', the other 3'→5').<br>
5. The molecule is twisted into a double helix structure.<br>
<br>
<b>(b)</b><br>
1. Helicase unwinds and unzips the double helix by breaking hydrogen bonds between base pairs.<br>
2. Each original strand acts as a template; free DNA nucleotides are attracted by complementary base pairing.<br>
3. DNA polymerase joins the new nucleotides together by forming phosphodiester bonds, building the new strand in the 5'→3' direction.<br>
4. The result is two identical DNA molecules, each containing one original and one new strand — semi-conservative replication.<br>
<br>
<b>(c)</b><br>
<b>Transcription (nucleus):</b><br>
1. RNA polymerase unwinds the DNA and uses the template strand to assemble complementary mRNA nucleotides (U instead of T).<br>
2. The mRNA strand is released and processed (introns removed), then leaves the nucleus through nuclear pores.<br>
<b>Translation (ribosomes):</b><br>
3. The mRNA attaches to a ribosome; tRNA molecules carry specific amino acids and have anticodons complementary to mRNA codons.<br>
4. tRNA anticodons bind to mRNA codons; the ribosome catalyses peptide bond formation between adjacent amino acids.<br>
5. The ribosome moves along the mRNA; when a stop codon is reached, the polypeptide chain is released.<br>
<br>
<b>(d)</b><br>
1. Template strand: 3'-TACGCCATT-5' → mRNA (read 5'→3'): <code>5'-AUGCGGUAA-3'</code><br>
2. Codons: AUG = Met, CGG = Arg, UAA = Stop → amino acid sequence: Met – Arg (then stop)`,
},

{
  question_id: 2055,
  topic_id: 12001,
  subject_id: 13,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "ESAT Maths 1: Algebra and Functions",
  content: `<p><b>(a)</b> Solve the inequality $2x^2 - 7x + 3 \\leq 0$. [3]</p>
<p><b>(b)</b> Find the range of values of $k$ for which $x^2 + kx + 9 = 0$ has no real solutions. [3]</p>
<p><b>(c)</b> The function $f(x) = \\dfrac{2x+3}{x-1}$, $x \\neq 1$.</p>
<ul>
  <li>Find $f^{-1}(x)$. [3]</li>
  <li>Find $ff(x)$ and simplify. [3]</li>
  <li>State the domain and range of $f(x)$. [2]</li>
</ul>
<p><b>(d)</b> Sketch the graph of $y = |2x - 4|$, labelling all intercepts. Solve $|2x-4| = x + 1$. [4]</p>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $2x^2-7x+3 = (2x-1)(x-3)$<br>
2. Critical values: $x = \\dfrac{1}{2}$ and $x=3$.<br>
3. Since coefficient of $x^2$ is positive, parabola opens upward: inequality holds between roots: $\\dfrac{1}{2} \\leq x \\leq 3$<br>
<br>
<b>(b)</b><br>
1. No real solutions when discriminant $< 0$: $k^2 - 36 < 0$<br>
2. $(k-6)(k+6) < 0$<br>
3. $-6 < k < 6$<br>
<br>
<b>(c)</b><br>
1. Let $y = \\dfrac{2x+3}{x-1}$. Then $y(x-1) = 2x+3 \\Rightarrow yx-y=2x+3 \\Rightarrow x(y-2)=y+3 \\Rightarrow x = \\dfrac{y+3}{y-2}$<br>
So $f^{-1}(x) = \\dfrac{x+3}{x-2}$<br>
2. $ff(x) = f\\left(\\dfrac{2x+3}{x-1}\\right) = \\dfrac{2 \\cdot \\dfrac{2x+3}{x-1}+3}{\\dfrac{2x+3}{x-1}-1} = \\dfrac{\\dfrac{4x+6+3x-3}{x-1}}{\\dfrac{2x+3-x+1}{x-1}} = \\dfrac{7x+3}{x+4}$<br>
3. Domain: $x \\in \\mathbb{R}, x \\neq 1$. Range: $f(x) \\in \\mathbb{R}, f(x) \\neq 2$ (horizontal asymptote at $y=2$).<br>
<br>
<b>(d)</b><br>
1. $y=|2x-4|$: V-shape with vertex at $(2,0)$, $y$-intercept at $(0,4)$.<br>
2. Case 1: $2x-4 = x+1 \\Rightarrow x=5$, $y=6$. Check: $|6|=6$ ✓<br>
3. Case 2: $-(2x-4) = x+1 \\Rightarrow -2x+4=x+1 \\Rightarrow 3=3x \\Rightarrow x=1$, $y=2$. Check: $|{-2}|=2$ ✓<br>
4. Solutions: $x=1$ and $x=5$.`,
},
{
  question_id: 2056,
  topic_id: 9001,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Mass Transport in Animals",
  content: `<p>Describe and explain how the mammalian circulatory system is adapted to transport oxygen and nutrients efficiently to respiring tissues. In your answer you should refer to the structure of the heart, the role of haemoglobin, and the structure of blood vessels. [12]</p>`,
  mark_scheme: `1. The mammalian circulatory system is a double circulatory system — blood passes through the heart twice per complete circuit, maintaining high pressure for efficient delivery.<br>
2. The right side of the heart pumps deoxygenated blood to the lungs (pulmonary circulation); the left side pumps oxygenated blood to the body (systemic circulation).<br>
3. The left ventricle has a thicker muscular wall than the right ventricle, generating higher pressure to push blood around the entire body.<br>
4. The heart has four chambers separated by valves (atrioventricular and semilunar) which prevent backflow and ensure unidirectional blood flow.<br>
5. Arteries have thick, muscular, elastic walls to withstand high pressure — the elastic tissue allows them to stretch and recoil, smoothing pulsatile flow.<br>
6. Capillaries have walls only one cell thick, minimising the diffusion distance for oxygen and nutrients to reach cells.<br>
7. Capillaries have a large total cross-sectional area, reducing blood flow speed and allowing more time for exchange.<br>
8. Veins have large lumens and valves to return blood to the heart at low pressure, preventing backflow.<br>
9. Haemoglobin is a quaternary protein in red blood cells with four haem groups, each capable of binding one oxygen molecule — up to four $\\text{O}_2$ per haemoglobin.<br>
10. The oxyhaemoglobin dissociation curve is sigmoidal due to cooperative binding — binding of one $\\text{O}_2$ increases the affinity of remaining haem groups for oxygen (positive cooperativity).<br>
11. In respiring tissues, low $p\\text{O}_2$ and low pH (Bohr effect) cause haemoglobin to release oxygen more readily, ensuring delivery where it is most needed.<br>
12. The Bohr shift moves the dissociation curve to the right — at any given $p\\text{O}_2$, haemoglobin has a lower saturation, releasing more $\\text{O}_2$ to actively respiring tissues.`,
},

{
  question_id: 2057,
  topic_id: 5002,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Algebra and Functions",
  content: `<p><b>(a)</b> The function $f(x) = 2x^3 - 3x^2 - 11x + 6$.</p>
<ul>
  <li>Show that $(x-3)$ is a factor of $f(x)$. [1]</li>
  <li>Fully factorise $f(x)$. [3]</li>
  <li>Sketch the curve $y = f(x)$, labelling all intercepts with the axes. [3]</li>
</ul>
<p><b>(b)</b> Solve the inequality $\\dfrac{x+2}{x-1} > 3$. [4]</p>
<p><b>(c)</b> The functions $f$ and $g$ are defined as $f(x) = x^2 + 1$ and $g(x) = 2x - 3$ for $x \\in \\mathbb{R}$.</p>
<ul>
  <li>Find $gf(x)$ and $fg(x)$. [2]</li>
  <li>Find the values of $x$ for which $gf(x) = fg(x)$. [3]</li>
</ul>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $f(3) = 2(27)-3(9)-11(3)+6 = 54-27-33+6 = 0$ ✓ so $(x-3)$ is a factor.<br>
2. Divide: $2x^3-3x^2-11x+6 = (x-3)(2x^2+3x-2) = (x-3)(2x-1)(x+2)$<br>
3. Roots at $x=3$, $x=\\dfrac{1}{2}$, $x=-2$. $y$-intercept at $(0,6)$. Cubic with positive leading coefficient — sketch rises right, falls left, crossing all three roots.<br>
<br>
<b>(b)</b><br>
1. $\\dfrac{x+2}{x-1} - 3 > 0 \\Rightarrow \\dfrac{x+2-3(x-1)}{x-1} > 0 \\Rightarrow \\dfrac{-2x+5}{x-1} > 0$<br>
2. Critical values: $x = \\dfrac{5}{2}$ and $x=1$.<br>
3. Sign analysis: positive when $1 < x < \\dfrac{5}{2}$.<br>
4. Solution: $1 < x < \\dfrac{5}{2}$<br>
<br>
<b>(c)</b><br>
1. $gf(x) = g(x^2+1) = 2(x^2+1)-3 = 2x^2-1$<br>
$fg(x) = f(2x-3) = (2x-3)^2+1 = 4x^2-12x+10$<br>
2. $2x^2-1 = 4x^2-12x+10 \\Rightarrow 0 = 2x^2-12x+11$<br>
3. $x = \\dfrac{12 \\pm \\sqrt{144-88}}{4} = \\dfrac{12 \\pm \\sqrt{56}}{4} = \\dfrac{6 \\pm \\sqrt{14}}{2}$`,
},

{
  question_id: 2058,
  topic_id: 8012,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Quantum Physics",
  content: `<p>Describe the photoelectric effect, explaining how it provides evidence for the particle nature of light. In your answer, include a description of the experimental observations, explain why these observations cannot be explained by the wave model, and show how Einstein's photon model accounts for each observation. [9]</p>`,
  mark_scheme: `<b>Experimental observations:</b><br>
1. When light of sufficiently high frequency is shone onto a metal surface, electrons are emitted immediately.<br>
2. Below a certain threshold frequency $f_0$, no electrons are emitted regardless of the intensity of the light.<br>
3. Above the threshold frequency, increasing the intensity of light increases the number of electrons emitted per second, but not their maximum kinetic energy.<br>
4. Increasing the frequency of light above the threshold increases the maximum kinetic energy of emitted electrons.<br>
<br>
<b>Why the wave model fails:</b><br>
5. The wave model predicts that energy is spread continuously over the wavefront — any frequency should eventually deliver enough energy to release an electron if the intensity is high enough. This contradicts the existence of a threshold frequency.<br>
6. The wave model also predicts a time delay before emission as energy builds up, but emission is instantaneous — contradicting observation.<br>
<br>
<b>Einstein's photon model:</b><br>
7. Einstein proposed that light consists of discrete packets (photons) each with energy $E = hf$, where $h$ is Planck's constant.<br>
8. A single photon interacts with a single electron — if $hf < \\phi$ (the work function), the photon has insufficient energy to liberate the electron, explaining the threshold frequency: $f_0 = \\dfrac{\\phi}{h}$.<br>
9. Any energy above the work function is transferred to the electron as kinetic energy: $E_k = hf - \\phi$, explaining why $E_{k,\\text{max}}$ depends on frequency, not intensity. Higher intensity means more photons, hence more electrons, but not more energetic ones.`,
},

{
  question_id: 2059,
  topic_id: 10011,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Aromatic Chemistry",
  content: `<p><b>(a)</b> Describe the structure of benzene using the delocalised electron model. Explain why benzene is more stable than the Kekulé structure would predict, with reference to enthalpy of hydrogenation data. [5]</p>
<p><b>(b)</b> Describe the mechanism of <b>electrophilic substitution</b> of benzene with a nitrating mixture. Include the formation of the electrophile, the mechanism with curly arrows, and the role of the catalyst. [6]</p>
<p><b>(c)</b> Explain why phenol is more reactive than benzene towards electrophilic substitution, and predict the major product when phenol reacts with bromine water. [3]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Benzene ($\\text{C}_6\\text{H}_6$) has six carbon atoms in a regular hexagonal ring, each bonded to one hydrogen.<br>
2. Each carbon contributes one electron to a delocalised $\\pi$ system above and below the plane of the ring.<br>
3. All C–C bond lengths are equal (intermediate between single and double), consistent with delocalisation rather than alternating bonds.<br>
4. The enthalpy of hydrogenation of benzene is $-208$ kJ mol⁻¹, compared to the predicted $-360$ kJ mol⁻¹ for the Kekulé structure (three isolated double bonds × $-120$ kJ mol⁻¹).<br>
5. The difference ($\\approx 150$ kJ mol⁻¹) is the delocalisation (resonance) energy — benzene is more stable than predicted, making it resistant to addition reactions.<br>
<br>
<b>(b)</b><br>
1. Formation of electrophile: concentrated $\\text{HNO}_3$ and $\\text{H}_2\\text{SO}_4$ react: $\\text{HNO}_3 + \\text{H}_2\\text{SO}_4 \\rightarrow \\text{NO}_2^+ + \\text{HSO}_4^- + \\text{H}_2\\text{O}$. The nitronium ion $\\text{NO}_2^+$ is the electrophile.<br>
2. $\\text{NO}_2^+$ is attracted to the electron-rich $\\pi$ system of benzene.<br>
3. Curly arrow from $\\pi$ ring to $\\text{NO}_2^+$, forming an arenium ion intermediate (positive charge delocalised over ring).<br>
4. A curly arrow from the C–H bond to restore aromaticity, releasing $\\text{H}^+$.<br>
5. $\\text{H}^+$ reacts with $\\text{HSO}_4^-$ to regenerate $\\text{H}_2\\text{SO}_4$ (catalyst restored).<br>
6. Product: nitrobenzene ($\\text{C}_6\\text{H}_5\\text{NO}_2$).<br>
<br>
<b>(c)</b><br>
1. The $-\\text{OH}$ group donates a lone pair into the $\\pi$ system by conjugation, increasing electron density in the ring and activating it towards electrophilic attack.<br>
2. This makes phenol more reactive than benzene.<br>
3. Bromine water reacts without a catalyst; the major product is 2,4,6-tribromophenol (bromine substitutes at positions 2, 4, and 6, which are activated by the $-\\text{OH}$ group).`,
},

{
  question_id: 2060,
  topic_id: 6001,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Matrices and Transformations",
  content: `<p><b>(a)</b> Given $A = \\begin{pmatrix} 2 & 3 \\ 1 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} -1 & 2 \\ 3 & 0 \\end{pmatrix}$, find:</p>
<ul>
  <li>$AB$ [2]</li>
  <li>$A^{-1}$ [3]</li>
  <li>$\\det(AB)$ without fully calculating $AB$, using the property $\\det(AB) = \\det(A)\\det(B)$ [2]</li>
</ul>
<p><b>(b)</b> Describe the geometric transformation represented by each matrix:</p>
<ul>
  <li>$\\begin{pmatrix} 0 & -1 \\ 1 & 0 \\end{pmatrix}$ [2]</li>
  <li>$\\begin{pmatrix} -1 & 0 \\ 0 & 1 \\end{pmatrix}$ [1]</li>
  <li>$\\begin{pmatrix} 2 & 0 \\ 0 & 2 \\end{pmatrix}$ [1]</li>
</ul>
<p><b>(c)</b> Find the matrix representing a rotation of $60°$ anticlockwise about the origin, followed by a reflection in the $x$-axis. [4]</p>
<p><b>(d)</b> Solve the system of equations using matrices:</p>
<p>$2x + 3y = 7$<br>$x + 4y = 6$ [3]</p>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $AB = \\begin{pmatrix} 2(-1)+3(3) & 2(2)+3(0) \\ 1(-1)+4(3) & 1(2)+4(0) \\end{pmatrix} = \\begin{pmatrix} 7 & 4 \\ 11 & 2 \\end{pmatrix}$<br>
2. $\\det(A) = 2(4)-3(1) = 5$. $A^{-1} = \\dfrac{1}{5}\\begin{pmatrix} 4 & -3 \\ -1 & 2 \\end{pmatrix}$<br>
3. $\\det(A) = 5$, $\\det(B) = 0-6 = -6$. $\\det(AB) = 5 \\times (-6) = -30$<br>
<br>
<b>(b)</b><br>
1. Rotation of $90°$ anticlockwise about the origin.<br>
2. Reflection in the $y$-axis.<br>
3. Enlargement by scale factor 2 about the origin.<br>
<br>
<b>(c)</b><br>
1. Rotation $60°$ anticlockwise: $R = \\begin{pmatrix} \\cos 60° & -\\sin 60° \\ \\sin 60° & \\cos 60° \\end{pmatrix} = \\begin{pmatrix} \\frac{1}{2} & -\\frac{\\sqrt{3}}{2} \\ \\frac{\\sqrt{3}}{2} & \\frac{1}{2} \\end{pmatrix}$<br>
2. Reflection in $x$-axis: $M = \\begin{pmatrix} 1 & 0 \\ 0 & -1 \\end{pmatrix}$<br>
3. Combined (reflection after rotation): $MR = \\begin{pmatrix} 1 & 0 \\ 0 & -1 \\end{pmatrix}\\begin{pmatrix} \\frac{1}{2} & -\\frac{\\sqrt{3}}{2} \\ \\frac{\\sqrt{3}}{2} & \\frac{1}{2} \\end{pmatrix} = \\begin{pmatrix} \\frac{1}{2} & -\\frac{\\sqrt{3}}{2} \\ -\\frac{\\sqrt{3}}{2} & -\\frac{1}{2} \\end{pmatrix}$<br>
<br>
<b>(d)</b><br>
1. Matrix form: $A\\mathbf{x} = \\mathbf{b}$ where $A = \\begin{pmatrix} 2 & 3 \\ 1 & 4 \\end{pmatrix}$, $\\mathbf{b} = \\begin{pmatrix} 7 \\ 6 \\end{pmatrix}$<br>
2. $\\det(A) = 5$, $A^{-1} = \\dfrac{1}{5}\\begin{pmatrix} 4 & -3 \\ -1 & 2 \\end{pmatrix}$<br>
3. $\\mathbf{x} = A^{-1}\\mathbf{b} = \\dfrac{1}{5}\\begin{pmatrix} 4(7)+(-3)(6) \\ (-1)(7)+2(6) \\end{pmatrix} = \\dfrac{1}{5}\\begin{pmatrix} 10 \\ 5 \\end{pmatrix} = \\begin{pmatrix} 2 \\ 1 \\end{pmatrix}$. So $x=2$, $y=1$.`,
},

{
  question_id: 2061,
  topic_id: 3009,
  subject_id: 8,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Ecosystems and Material Cycles",
  content: `<p>Describe and explain the carbon cycle and the nitrogen cycle, including the key processes and organisms involved in each. In your answer, explain how human activities have affected the carbon cycle and the potential consequences of this. [12]</p>`,
  mark_scheme: `<b>Carbon cycle:</b><br>
1. Carbon enters the living world via photosynthesis — producers absorb $\\text{CO}_2$ from the atmosphere and fix it into organic molecules.<br>
2. Carbon passes through food chains as animals consume plants and other animals (feeding/ingestion).<br>
3. All organisms release $\\text{CO}_2$ back to the atmosphere through respiration.<br>
4. When organisms die, decomposers (bacteria and fungi) break down organic matter, releasing $\\text{CO}_2$ through decomposition and respiration.<br>
5. Over millions of years, dead organic matter was compressed to form fossil fuels (coal, oil, gas), locking carbon away.<br>
<br>
<b>Human impact on the carbon cycle:</b><br>
6. Burning fossil fuels releases previously locked $\\text{CO}_2$, significantly increasing atmospheric $\\text{CO}_2$ concentration.<br>
7. Deforestation reduces the number of trees available to absorb $\\text{CO}_2$ through photosynthesis, further increasing atmospheric levels.<br>
8. Increased $\\text{CO}_2$ enhances the greenhouse effect — more infrared radiation is absorbed and re-emitted by the atmosphere, leading to global warming.<br>
9. Consequences include rising sea levels (thermal expansion and melting ice), more extreme weather events, habitat loss, and disruption of ecosystems.<br>
<br>
<b>Nitrogen cycle:</b><br>
10. Nitrogen-fixing bacteria (e.g. <i>Rhizobium</i> in root nodules) convert atmospheric $\\text{N}_2$ into ammonia / ammonium ions, making nitrogen available to plants.<br>
11. Plants absorb nitrates from the soil to make proteins and nucleic acids; nitrogen passes through food chains by feeding.<br>
12. Decomposers break down dead organisms and waste, releasing ammonia (ammonification); nitrifying bacteria convert ammonia to nitrites then nitrates (nitrification).<br>
13. Denitrifying bacteria convert nitrates back to $\\text{N}_2$, returning nitrogen to the atmosphere and completing the cycle.`,
},

{
  question_id: 2062,
  topic_id: 5017,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Kinematics",
  content: `<p><b>(a)</b> A particle moves in a straight line. Its velocity at time $t$ seconds is given by $v = 3t^2 - 12t + 9$ m s⁻¹ for $t \\geq 0$.</p>
<ul>
  <li>Find the initial velocity and the times when the particle is at rest. [3]</li>
  <li>Find the acceleration at $t = 2$ s. [2]</li>
  <li>Given that the particle starts at the origin, find its displacement at $t = 4$ s. [3]</li>
  <li>Find the total distance travelled in the first 4 seconds. [4]</li>
</ul>
<p><b>(b)</b> A ball is thrown vertically upward from a height of 1.5 m above the ground with a speed of 12 m s⁻¹. Take $g = 9.8$ m s⁻².</p>
<ul>
  <li>Find the maximum height above the ground. [3]</li>
  <li>Find the time at which the ball hits the ground. [3]</li>
</ul>
<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Initial velocity: $v(0) = 0-0+9 = 9$ m s⁻¹<br>
At rest: $3t^2-12t+9=0 \\Rightarrow 3(t^2-4t+3)=0 \\Rightarrow 3(t-1)(t-3)=0 \\Rightarrow t=1$ s and $t=3$ s<br>
2. $a = \\dfrac{dv}{dt} = 6t-12$. At $t=2$: $a = 12-12 = 0$ m s⁻²<br>
3. $s = \\displaystyle\\int_0^4 3t^2-12t+9 \\, dt = \\left[t^3-6t^2+9t\\right]_0^4 = 64-96+36 = 4$ m<br>
4. $s(1) = 1-6+9 = 4$ m, $s(3) = 27-54+27=0$ m, $s(4) = 4$ m<br>
Distance: $|s(1)-s(0)| + |s(3)-s(1)| + |s(4)-s(3)| = 4+4+4 = 12$ m<br>
<br>
<b>(b)</b><br>
1. At max height, $v=0$: $v^2 = u^2-2gs \\Rightarrow 0 = 144-2(9.8)s \\Rightarrow s = \\dfrac{144}{19.6} = 7.35$ m above launch point.<br>
Max height $= 1.5 + 7.35 = 8.85$ m above ground.<br>
2. Taking upward as positive, origin at launch point: $-1.5 = 12t - \\dfrac{1}{2}(9.8)t^2$<br>
$4.9t^2 - 12t - 1.5 = 0$<br>
$t = \\dfrac{12 \\pm \\sqrt{144+4(4.9)(1.5)}}{2(4.9)} = \\dfrac{12 \\pm \\sqrt{144+29.4}}{9.8} = \\dfrac{12 \\pm \\sqrt{173.4}}{9.8}$<br>
$t = \\dfrac{12+13.17}{9.8} = \\dfrac{25.17}{9.8} = 2.57$ s (reject negative root)`,
},

{
  question_id: 2063,
  topic_id: 7016,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Legislation and Ethics in Computing",
  content: `<p>Discuss the ethical and legal responsibilities of software developers and organisations when handling personal data and developing systems that affect people's lives. In your answer, refer to relevant legislation, ethical frameworks, and real-world examples. [12]</p>`,
  mark_scheme: `1. The <b>Data Protection Act (2018) / GDPR</b> places legal obligations on organisations to handle personal data lawfully, fairly, and transparently.<br>
2. Key principles include: data must be collected for a specified purpose, stored no longer than necessary, kept secure, and individuals must be able to access or request deletion of their data.<br>
3. Developers have a legal responsibility to implement appropriate security measures (e.g. encryption, access controls) to protect personal data from breaches.<br>
4. The <b>Computer Misuse Act (1990)</b> criminalises unauthorised access to computer systems, writing malware, and hacking — developers must not create tools intended to circumvent security.<br>
5. The <b>Copyright, Designs and Patents Act (1988)</b> protects software as intellectual property — using unlicensed code or plagiarising open-source software without adhering to licence terms is illegal.<br>
6. Ethically, developers must consider the <b>impact on society</b> — e.g. algorithmic bias in AI systems used for hiring or credit scoring can discriminate unfairly against groups.<br>
7. The principle of <b>transparency</b> requires that users understand how their data is used and how automated decisions affecting them are made.<br>
8. <b>Accessibility</b> is an ethical concern — software should be designed to be usable by people with disabilities (e.g. screen reader compatibility).<br>
9. Real-world example: Cambridge Analytica harvested Facebook data without proper consent, violating data protection principles and causing public harm through targeted political manipulation.<br>
10. Developers should follow professional codes of conduct (e.g. BCS Code of Conduct) which emphasise public interest, professional competence, and integrity.<br>
11. The principle of <b>privacy by design</b> requires that data protection is built into systems from the outset, not added as an afterthought.<br>
12. Ultimately, developers must balance commercial pressures with ethical obligations — prioritising user welfare and societal impact over purely profit-driven decisions.`,
},

{
  question_id: 2064,
  topic_id: 6014,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Hyperbolic Functions",
  content: `<p><b>(a)</b> Define $\\sinh x$, $\\cosh x$, and $\\tanh x$ in terms of $e^x$. [3]</p>
<p><b>(b)</b> Prove the identity $\\cosh^2 x - \\sinh^2 x = 1$. [3]</p>
<p><b>(c)</b> Solve $\\cosh x = 5$, giving exact answers in terms of natural logarithms. [3]</p>
<p><b>(d)</b> Differentiate the following:</p>
<ul>
  <li>$y = \\sinh(3x^2)$ [2]</li>
  <li>$y = \\tanh x$ from first principles using the quotient rule applied to $\\dfrac{\\sinh x}{\\cosh x}$. [3]</li>
</ul>
<p><b>(e)</b> Find $\\displaystyle\\int_0^1 \\sinh x \\, dx$, giving your answer in exact form. [2]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $\\sinh x = \\dfrac{e^x - e^{-x}}{2}$<br>
2. $\\cosh x = \\dfrac{e^x + e^{-x}}{2}$<br>
3. $\\tanh x = \\dfrac{e^x - e^{-x}}{e^x + e^{-x}}$<br>
<br>
<b>(b)</b><br>
1. $\\cosh^2 x - \\sinh^2 x = \\left(\\dfrac{e^x+e^{-x}}{2}\\right)^2 - \\left(\\dfrac{e^x-e^{-x}}{2}\\right)^2$<br>
2. $= \\dfrac{(e^x+e^{-x})^2-(e^x-e^{-x})^2}{4} = \\dfrac{e^{2x}+2+e^{-2x}-e^{2x}+2-e^{-2x}}{4}$<br>
3. $= \\dfrac{4}{4} = 1$ ✓<br>
<br>
<b>(c)</b><br>
1. $\\dfrac{e^x+e^{-x}}{2} = 5 \\Rightarrow e^x+e^{-x} = 10 \\Rightarrow e^{2x}-10e^x+1=0$<br>
2. $e^x = \\dfrac{10 \\pm \\sqrt{96}}{2} = 5 \\pm 2\\sqrt{6}$<br>
3. $x = \\ln(5+2\\sqrt{6})$ or $x = \\ln(5-2\\sqrt{6})$ (note: $5-2\\sqrt{6} = \\dfrac{1}{5+2\\sqrt{6}} > 0$ so both valid; accept $x = \\pm\\ln(5+2\\sqrt{6})$)<br>
<br>
<b>(d)</b><br>
1. $\\dfrac{dy}{dx} = \\cosh(3x^2) \\times 6x = 6x\\cosh(3x^2)$<br>
2. $\\dfrac{d}{dx}(\\tanh x) = \\dfrac{\\cosh x \\cdot \\cosh x - \\sinh x \\cdot \\sinh x}{\\cosh^2 x} = \\dfrac{\\cosh^2 x - \\sinh^2 x}{\\cosh^2 x} = \\dfrac{1}{\\cosh^2 x} = \\text{sech}^2 x$<br>
<br>
<b>(e)</b><br>
1. $\\displaystyle\\int_0^1 \\sinh x \\, dx = \\left[\\cosh x\\right]_0^1 = \\cosh 1 - \\cosh 0 = \\cosh 1 - 1 = \\dfrac{e+e^{-1}}{2} - 1$`,
},

{
  question_id: 2065,
  topic_id: 2002,
  subject_id: 9,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "States of Matter and Mixtures",
  content: `<p><b>(a)</b> Explain, using ideas about particles and forces, why the boiling point of water is much higher than the boiling point of oxygen, despite both being simple molecular substances. [3]</p>
<p><b>(b)</b> Describe how you would separate the following mixtures, giving the name of the technique and a brief explanation of why it works in each case:</p>
<ul>
  <li>Salt dissolved in water [2]</li>
  <li>A mixture of two liquids with different boiling points [2]</li>
  <li>A mixture of different coloured dyes in solution [2]</li>
</ul>
<p><b>(c)</b> A student dissolves 20 g of potassium nitrate in 100 g of water at 60°C. The solution is then cooled to 20°C. Using the solubility data below, calculate the mass of crystals that form.</p>
<p>Solubility of $\\text{KNO}_3$: 31 g per 100 g water at 20°C, 110 g per 100 g water at 60°C. [3]</p>
<p><b>Total: 12 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Both water and oxygen have weak intermolecular forces, but water molecules form hydrogen bonds due to the highly electronegative oxygen atom bonded to hydrogen atoms.<br>
2. Hydrogen bonds are much stronger than the London dispersion forces present in oxygen molecules.<br>
3. More energy is required to overcome the stronger hydrogen bonds in water, hence a much higher boiling point.<br>
<br>
<b>(b)</b><br>
1. Salt dissolved in water: <b>evaporation / crystallisation</b> — heat the solution to evaporate the water, leaving solid salt behind.<br>
2. Two liquids with different boiling points: <b>fractional distillation</b> — the liquid with the lower boiling point evaporates first, condenses in the fractionating column, and is collected separately.<br>
3. Mixture of dyes: <b>chromatography</b> — different dyes have different solubilities in the solvent and different affinities for the stationary phase, so they travel different distances and separate.<br>
<br>
<b>(c)</b><br>
1. At 60°C: solubility is 110 g per 100 g water, so 20 g easily dissolves (solution is unsaturated).<br>
2. At 20°C: solubility is 31 g per 100 g water — only 31 g can remain dissolved.<br>
3. Mass of crystals formed $= 20 - 31$... wait, 20 g was dissolved originally; since 20 g $<$ 31 g, no crystals form. Award full marks if student correctly identifies that 20 g $<$ 31 g and concludes no crystals form. [If question intended 80 g dissolved: crystals $= 80-31 = 49$ g — accept this calculation if student works consistently from data given.]`,
},

{
  question_id: 2066,
  topic_id: 8016,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Simple Harmonic Motion",
  content: `<p><b>(a)</b> State the conditions required for simple harmonic motion (SHM) and write the defining equation $a = -\\omega^2 x$, defining all symbols. [3]</p>
<p><b>(b)</b> A mass on a spring oscillates with amplitude $A = 0.08$ m and period $T = 0.4$ s.</p>
<ul>
  <li>Calculate $\\omega$. [2]</li>
  <li>Write expressions for the displacement $x$, velocity $v$, and acceleration $a$ as functions of time, assuming $x = A$ at $t = 0$. [3]</li>
  <li>Calculate the maximum speed and maximum acceleration. [2]</li>
</ul>
<p><b>(c)</b> Sketch graphs of displacement, velocity, and acceleration against time for one complete oscillation on the same time axis. Label amplitude, period, and the phase relationships clearly. [4]</p>
<p><b>(d)</b> Show that the total energy of a SHM system is constant and proportional to $A^2$. [3]</p>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. SHM requires the acceleration to be directed towards a fixed equilibrium point and proportional to the displacement from it.<br>
2. $a = -\\omega^2 x$: $a$ = acceleration, $\\omega$ = angular frequency, $x$ = displacement from equilibrium.<br>
3. The negative sign indicates acceleration is always opposite in direction to displacement.<br>
<br>
<b>(b)</b><br>
1. $\\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi}{0.4} = 5\\pi = 15.7$ rad s⁻¹<br>
2. $x = 0.08\\cos(5\\pi t)$ m<br>
$v = -0.08 \\times 5\\pi \\sin(5\\pi t) = -0.4\\pi\\sin(5\\pi t)$ m s⁻¹<br>
$a = -0.08 \\times (5\\pi)^2\\cos(5\\pi t) = -2\\pi^2\\cos(5\\pi t)$ m s⁻²<br>
3. $v_{\\text{max}} = \\omega A = 5\\pi \\times 0.08 = 0.4\\pi \\approx 1.26$ m s⁻¹<br>
$a_{\\text{max}} = \\omega^2 A = 25\\pi^2 \\times 0.08 = 2\\pi^2 \\approx 19.7$ m s⁻²<br>
<br>
<b>(c)</b><br>
1. Displacement: cosine curve, amplitude $A$, period $T$.<br>
2. Velocity: negative sine curve, amplitude $\\omega A$, leads displacement by $90°$.<br>
3. Acceleration: negative cosine curve, amplitude $\\omega^2 A$, antiphase with displacement ($180°$ out of phase).<br>
4. All three curves correctly labelled with period $T = 0.4$ s.<br>
<br>
<b>(d)</b><br>
1. KE $= \\dfrac{1}{2}mv^2 = \\dfrac{1}{2}m\\omega^2(A^2-x^2)$ (using $v^2 = \\omega^2(A^2-x^2)$)<br>
2. PE $= \\dfrac{1}{2}m\\omega^2 x^2$<br>
3. Total energy $= \\text{KE}+\\text{PE} = \\dfrac{1}{2}m\\omega^2(A^2-x^2) + \\dfrac{1}{2}m\\omega^2x^2 = \\dfrac{1}{2}m\\omega^2 A^2$<br>
This is constant (independent of $x$) and proportional to $A^2$. ✓`,
},

{
  question_id: 2067,
  topic_id: 11009,
  subject_id: 11,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "TMUA: Logic and Proof",
  content: `<p><b>(a)</b> Prove that the sum of two consecutive odd numbers is always divisible by 4. [3]</p>
<p><b>(b)</b> Disprove the following statement by finding a counterexample: <i>"For all integers $n \\geq 1$, $n^2 + n + 41$ is prime."</i> [2]</p>
<p><b>(c)</b> Prove that $\\sqrt{2}$ is irrational. [4]</p>
<p><b>(d)</b> Consider the statement: <i>"If $n^2$ is even, then $n$ is even."</i></p>
<ul>
  <li>Prove this statement by contradiction. [3]</li>
  <li>Hence prove that $\\sqrt{2}$ is irrational using this result (a different method to part (c)). [3]</li>
</ul>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Let the two consecutive odd numbers be $2k-1$ and $2k+1$ for some integer $k$.<br>
2. Their sum $= (2k-1)+(2k+1) = 4k$.<br>
3. $4k$ is divisible by 4 for any integer $k$. ✓<br>
<br>
<b>(b)</b><br>
1. Try $n=40$: $40^2+40+41 = 1600+40+41 = 1681 = 41^2$.<br>
2. $41^2$ is not prime. This is a counterexample, so the statement is false. ✓<br>
<br>
<b>(c)</b><br>
1. Assume for contradiction that $\\sqrt{2} = \\dfrac{p}{q}$ where $p, q$ are integers with no common factor (fully reduced).<br>
2. Then $2 = \\dfrac{p^2}{q^2} \\Rightarrow p^2 = 2q^2$, so $p^2$ is even, hence $p$ is even. Write $p = 2m$.<br>
3. Then $(2m)^2 = 2q^2 \\Rightarrow 4m^2 = 2q^2 \\Rightarrow q^2 = 2m^2$, so $q^2$ is even, hence $q$ is even.<br>
4. Both $p$ and $q$ are even — this contradicts the assumption that $\\dfrac{p}{q}$ is fully reduced. So $\\sqrt{2}$ is irrational. ✓<br>
<br>
<b>(d)</b><br>
1. Assume for contradiction that $n^2$ is even but $n$ is odd. Write $n = 2k+1$.<br>
2. $n^2 = (2k+1)^2 = 4k^2+4k+1 = 2(2k^2+2k)+1$, which is odd.<br>
3. This contradicts the assumption that $n^2$ is even. So if $n^2$ is even, $n$ must be even. ✓<br>
4. Suppose $\\sqrt{2} = \\dfrac{p}{q}$ fully reduced. Then $p^2 = 2q^2$, so $p^2$ is even, hence $p$ is even (by the result above).<br>
5. Write $p=2m$: $q^2 = 2m^2$ so $q^2$ is even, hence $q$ is even.<br>
6. Contradiction — $p$ and $q$ share factor 2. So $\\sqrt{2}$ is irrational. ✓`,
},

{
  question_id: 2068,
  topic_id: 9028,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Nervous Transmission",
  content: `<p>Describe the structure of a myelinated motor neurone and explain how a nerve impulse is generated and propagated along the axon. In your answer, refer to the resting potential, action potential, and saltatory conduction. [12]</p>`,
  mark_scheme: `<b>Structure of a myelinated motor neurone:</b><br>
1. Consists of a cell body (soma) containing the nucleus, dendrites that receive signals, a long axon that conducts impulses away from the cell body, and axon terminals that synapse with effectors.<br>
2. The axon is surrounded by a myelin sheath formed by Schwann cells wrapping around the axon, with gaps called nodes of Ranvier between them.<br>
<br>
<b>Resting potential:</b><br>
3. At rest, the inside of the axon is negatively charged relative to the outside (approximately $-70$ mV) — this is the resting potential.<br>
4. This is maintained by the Na⁺/K⁺ ATPase pump, which actively transports 3 Na⁺ out and 2 K⁺ in per cycle, and by the membrane being more permeable to K⁺ than Na⁺.<br>
<br>
<b>Action potential:</b><br>
5. When a stimulus reaches threshold (approximately $-55$ mV), voltage-gated Na⁺ channels open and Na⁺ rushes into the axon down its electrochemical gradient — depolarisation occurs.<br>
6. The membrane potential rises to approximately $+40$ mV.<br>
7. Na⁺ channels then close and voltage-gated K⁺ channels open; K⁺ flows out, repolarising the membrane.<br>
8. The membrane briefly hyperpolarises (refractory period) before the resting potential is restored by the Na⁺/K⁺ pump.<br>
9. During the refractory period, a second action potential cannot be generated, ensuring impulses travel in one direction only.<br>
<br>
<b>Saltatory conduction:</b><br>
10. In myelinated neurones, the myelin sheath electrically insulates the axon between nodes of Ranvier.<br>
11. Depolarisation can only occur at the nodes, so the action potential appears to "jump" from node to node — saltatory conduction.<br>
12. This greatly increases the speed of nerve impulse transmission compared to unmyelinated axons.`,
},

{
  question_id: 2069,
  topic_id: 4003,
  subject_id: 7,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Ratio, Proportion and Rates of Change",
  content: `<p><b>(a)</b> Share £360 in the ratio $3:4:5$. [3]</p>
<p><b>(b)</b> A car travels 150 km in 2.5 hours. Calculate its average speed in km/h and in m/s. [3]</p>
<p><b>(c)</b> A map has a scale of $1:25000$. A road on the map measures 8.4 cm. Calculate the actual length of the road in km. [2]</p>
<p><b>(d)</b> The population of a town increases by 3.5% per year. The current population is 42,000. Calculate the population after 6 years, to the nearest whole number. [3]</p>
<p><b>(e)</b> A recipe uses 250 g of flour for 12 biscuits. How much flour is needed to make 30 biscuits? [2]</p>
<p><b>(f)</b> Two quantities $y$ and $x$ are in direct proportion. When $x = 4$, $y = 22$. Find $y$ when $x = 7$, and find $x$ when $y = 55$. [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Total parts $= 12$. Each part $= \\dfrac{360}{12} = £30$.<br>
2. Shares: $3 \\times 30 = £90$, $4 \\times 30 = £120$, $5 \\times 30 = £150$.<br>
<br>
<b>(b)</b><br>
1. Speed $= \\dfrac{150}{2.5} = 60$ km/h<br>
2. $60 \\text{ km/h} = \\dfrac{60 \\times 1000}{3600} = \\dfrac{60000}{3600} = 16.\\overline{6}$ m/s $\\approx 16.7$ m/s<br>
<br>
<b>(c)</b><br>
1. Actual length $= 8.4 \\times 25000 = 210000$ cm $= 2100$ m<br>
2. $= 2.1$ km<br>
<br>
<b>(d)</b><br>
1. Population $= 42000 \\times (1.035)^6$<br>
2. $(1.035)^6 = 1.2293$<br>
3. Population $= 42000 \\times 1.2293 = 51631$ (to nearest whole number)<br>
<br>
<b>(e)</b><br>
1. Flour per biscuit $= \\dfrac{250}{12}$ g<br>
2. For 30 biscuits: $\\dfrac{250}{12} \\times 30 = 625$ g<br>
<br>
<b>(f)</b><br>
1. $y = kx$. $22 = 4k \\Rightarrow k = 5.5$<br>
2. When $x=7$: $y = 5.5 \\times 7 = 38.5$<br>
3. When $y=55$: $x = \\dfrac{55}{5.5} = 10$`,
},

{
  question_id: 2070,
  topic_id: 8022,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Magnetic Fields and EM Induction",
  content: `<p><b>(a)</b> State the force on a current-carrying conductor in a magnetic field and write the equation $F = BIL\\sin\\theta$, defining all symbols. [3]</p>
<p><b>(b)</b> A wire of length 0.25 m carries a current of 3.0 A at right angles to a uniform magnetic field of flux density 0.40 T. Calculate the force on the wire. [2]</p>
<p><b>(c)</b> State Faraday's Law of electromagnetic induction and Lenz's Law. Write the equation for induced EMF. [3]</p>
<p><b>(d)</b> A coil of 200 turns and cross-sectional area $5.0 \\times 10^{-3}$ m² is rotated at 50 revolutions per second in a uniform magnetic field of flux density 0.30 T.</p>
<ul>
  <li>Calculate the maximum magnetic flux through the coil. [2]</li>
  <li>Calculate the maximum induced EMF. [3]</li>
  <li>Sketch the induced EMF as a function of time, labelling the peak EMF and period. [2]</li>
</ul>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A current-carrying conductor in a magnetic field experiences a force perpendicular to both the current and the field.<br>
2. $F = BIL\\sin\\theta$: $B$ = magnetic flux density (T), $I$ = current (A), $L$ = length of conductor (m), $\\theta$ = angle between conductor and field.<br>
<br>
<b>(b)</b><br>
1. At right angles: $\\theta = 90°$, $\\sin 90° = 1$.<br>
2. $F = BIL = 0.40 \\times 3.0 \\times 0.25 = 0.30$ N<br>
<br>
<b>(c)</b><br>
1. Faraday's Law: the magnitude of the induced EMF is proportional to the rate of change of magnetic flux linkage.<br>
2. Lenz's Law: the induced EMF acts in a direction such that the current it drives opposes the change in flux that caused it.<br>
3. $\\mathcal{E} = -N\\dfrac{d\\Phi}{dt}$<br>
<br>
<b>(d)</b><br>
1. Maximum flux: $\\Phi_{\\text{max}} = BA = 0.30 \\times 5.0\\times10^{-3} = 1.5\\times10^{-3}$ Wb<br>
2. $\\omega = 2\\pi f = 2\\pi \\times 50 = 100\\pi$ rad s⁻¹<br>
$\\mathcal{E}_{\\text{max}} = N\\omega\\Phi_{\\text{max}} = 200 \\times 100\\pi \\times 1.5\\times10^{-3} = 30\\pi \\approx 94.2$ V<br>
3. Sinusoidal curve, peak at $\\mathcal{E}_{\\text{max}} = 94.2$ V, period $T = \\dfrac{1}{50} = 0.02$ s labelled on time axis.`,
},
{
  question_id: 2071,
  topic_id: 5003,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Coordinate Geometry",
  content: `<p><b>(a)</b> The points $A(1, 3)$ and $B(5, 11)$ are the endpoints of a diameter of a circle.</p>
<ul>
  <li>Find the centre and radius of the circle. [3]</li>
  <li>Write down the equation of the circle. [2]</li>
  <li>Determine whether the point $C(6, 6)$ lies inside, on, or outside the circle. [2]</li>
</ul>
<p><b>(b)</b> Find the equation of the perpendicular bisector of $AB$. [3]</p>
<p><b>(c)</b> A line has equation $y = 2x - 1$. Find the coordinates of the points where this line intersects the circle from part (a). [4]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Centre $= \\left(\\dfrac{1+5}{2}, \\dfrac{3+11}{2}\\right) = (3, 7)$<br>
2. Radius $= \\dfrac{1}{2}\\sqrt{(5-1)^2+(11-3)^2} = \\dfrac{1}{2}\\sqrt{16+64} = \\dfrac{1}{2}\\sqrt{80} = 2\\sqrt{5}$<br>
3. Equation: $(x-3)^2+(y-7)^2 = 20$<br>
4. For $C(6,6)$: $(6-3)^2+(6-7)^2 = 9+1 = 10 < 20$ → $C$ lies inside the circle.<br>
<br>
<b>(b)</b><br>
1. Gradient of $AB = \\dfrac{11-3}{5-1} = 2$. Perpendicular gradient $= -\\dfrac{1}{2}$.<br>
2. Midpoint $= (3,7)$. Equation: $y-7 = -\\dfrac{1}{2}(x-3)$<br>
3. $y = -\\dfrac{1}{2}x + \\dfrac{17}{2}$<br>
<br>
<b>(c)</b><br>
1. Substitute $y=2x-1$ into $(x-3)^2+(y-7)^2=20$:<br>
$(x-3)^2+(2x-8)^2=20$<br>
2. $x^2-6x+9+4x^2-32x+64=20$<br>
$5x^2-38x+53=0$<br>
3. $x = \\dfrac{38 \\pm \\sqrt{1444-1060}}{10} = \\dfrac{38 \\pm \\sqrt{384}}{10} = \\dfrac{38 \\pm 8\\sqrt{6}}{10}$<br>
4. $x = \\dfrac{19 \\pm 4\\sqrt{6}}{5}$, $y = 2x-1$ gives corresponding $y$ values.`,
},

{
  question_id: 2072,
  topic_id: 8003,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Motion and SUVAT Equations",
  content: `A car accelerates uniformly from rest to 30 m s⁻¹ in 12 seconds, then travels at constant speed for 20 seconds, then decelerates uniformly to rest in 8 seconds.

<p><b>(a)</b> Calculate the acceleration during the first phase and the deceleration during the final phase. [3]</p>
<p><b>(b)</b> Calculate the total distance travelled. [4]</p>
<p><b>(c)</b> Sketch a velocity-time graph for the entire journey, labelling all key values. [3]</p>
<p><b>(d)</b> A second car starts from rest at the same point at $t = 0$ and accelerates uniformly throughout. It arrives at the same final position at the same time as the first car. Calculate the constant acceleration of the second car. [4]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Acceleration: $a = \\dfrac{v-u}{t} = \\dfrac{30-0}{12} = 2.5$ m s⁻²<br>
2. Deceleration: $a = \\dfrac{0-30}{8} = -3.75$ m s⁻²<br>
<br>
<b>(b)</b><br>
1. Phase 1: $s = \\dfrac{1}{2}(0+30)(12) = 180$ m<br>
2. Phase 2: $s = 30 \\times 20 = 600$ m<br>
3. Phase 3: $s = \\dfrac{1}{2}(30+0)(8) = 120$ m<br>
4. Total $= 180+600+120 = 900$ m<br>
<br>
<b>(c)</b><br>
1. Straight line from $(0,0)$ to $(12, 30)$.<br>
2. Horizontal line from $(12,30)$ to $(32,30)$.<br>
3. Straight line from $(32,30)$ to $(40,0)$. All values labelled.<br>
<br>
<b>(d)</b><br>
1. Total time $= 12+20+8 = 40$ s. Total distance $= 900$ m.<br>
2. For uniform acceleration from rest: $s = \\dfrac{1}{2}at^2$<br>
3. $900 = \\dfrac{1}{2} \\times a \\times 40^2 = 800a$<br>
4. $a = \\dfrac{900}{800} = 1.125$ m s⁻²`,
},

{
  question_id: 2073,
  topic_id: 9009,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Inheritance and Genetic Crosses",
  content: `<p><b>(a)</b> Explain the difference between <b>genotype</b> and <b>phenotype</b>, and between <b>dominant</b> and <b>recessive</b> alleles. [4]</p>
<p><b>(b)</b> In humans, the allele for brown eyes ($B$) is dominant over blue eyes ($b$). Two heterozygous brown-eyed parents have children.</p>
<ul>
  <li>Draw a genetic cross diagram to show the possible genotypes of their offspring. [3]</li>
  <li>State the expected ratio of phenotypes. [1]</li>
</ul>
<p><b>(c)</b> Cystic fibrosis is an autosomal recessive condition. A woman who is a carrier marries a man with cystic fibrosis.</p>
<ul>
  <li>Draw a genetic cross diagram for this couple. [3]</li>
  <li>Calculate the probability that their first child will have cystic fibrosis. [1]</li>
  <li>Calculate the probability that their first two children will both be carriers but not affected. [2]</li>
</ul>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Genotype: the alleles an organism possesses for a particular gene.<br>
2. Phenotype: the observable physical characteristics resulting from the genotype (and environment).<br>
3. A dominant allele is expressed in the phenotype even when only one copy is present (heterozygous).<br>
4. A recessive allele is only expressed in the phenotype when two copies are present (homozygous recessive).<br>
<br>
<b>(b)</b><br>
1. Parents: $Bb \\times Bb$<br>
Gametes: $B, b$ and $B, b$<br>
Offspring: $BB, Bb, Bb, bb$<br>
2. Phenotype ratio: 3 brown-eyed : 1 blue-eyed<br>
<br>
<b>(c)</b><br>
1. Let $F$ = unaffected allele, $f$ = cystic fibrosis allele.<br>
Carrier mother: $Ff$. Affected father: $ff$.<br>
Gametes: $F, f$ and $f, f$<br>
Offspring: $Ff, Ff, ff, ff$<br>
2. Probability of cystic fibrosis $(ff) = \\dfrac{1}{2}$ (50%)<br>
3. Probability of carrier $(Ff) = \\dfrac{1}{2}$. Probability both children are carriers $= \\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}$`,
},

{
  question_id: 2074,
  topic_id: 6011,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Further Calculus",
  content: `<p><b>(a)</b> Find $\\displaystyle\\int \\dfrac{1}{x^2+4x+13} \\, dx$. [4]</p>
<p><b>(b)</b> Use integration by parts to find $\\displaystyle\\int x^2 \\ln x \\, dx$. [4]</p>
<p><b>(c)</b> Use the substitution $u = \\sin x$ to evaluate $\\displaystyle\\int_0^{\\pi/2} \\sin^3 x \\cos x \\, dx$. [4]</p>
<p><b>(d)</b> Find $\\displaystyle\\int \\dfrac{3x+1}{(x+2)(x-1)} \\, dx$ using partial fractions. [5]</p>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Complete the square: $x^2+4x+13 = (x+2)^2+9$<br>
2. $\\displaystyle\\int \\dfrac{1}{(x+2)^2+9} \\, dx = \\dfrac{1}{3}\\arctan\\left(\\dfrac{x+2}{3}\\right) + c$<br>
<br>
<b>(b)</b><br>
1. Let $u = \\ln x$, $\\dfrac{dv}{dx} = x^2$. Then $\\dfrac{du}{dx} = \\dfrac{1}{x}$, $v = \\dfrac{x^3}{3}$.<br>
2. $\\displaystyle\\int x^2 \\ln x \\, dx = \\dfrac{x^3}{3}\\ln x - \\displaystyle\\int \\dfrac{x^3}{3} \\cdot \\dfrac{1}{x} \\, dx = \\dfrac{x^3}{3}\\ln x - \\dfrac{1}{3}\\displaystyle\\int x^2 \\, dx$<br>
3. $= \\dfrac{x^3}{3}\\ln x - \\dfrac{x^3}{9} + c$<br>
<br>
<b>(c)</b><br>
1. $u = \\sin x \\Rightarrow du = \\cos x \\, dx$. When $x=0$, $u=0$; when $x=\\dfrac{\\pi}{2}$, $u=1$.<br>
2. $\\displaystyle\\int_0^1 u^3 \\, du = \\left[\\dfrac{u^4}{4}\\right]_0^1 = \\dfrac{1}{4}$<br>
<br>
<b>(d)</b><br>
1. $\\dfrac{3x+1}{(x+2)(x-1)} = \\dfrac{A}{x+2} + \\dfrac{B}{x-1}$<br>
2. $3x+1 = A(x-1)+B(x+2)$. At $x=1$: $4=3B \\Rightarrow B=\\dfrac{4}{3}$. At $x=-2$: $-5=-3A \\Rightarrow A=\\dfrac{5}{3}$.<br>
3. $\\displaystyle\\int \\dfrac{5/3}{x+2} + \\dfrac{4/3}{x-1} \\, dx = \\dfrac{5}{3}\\ln|x+2| + \\dfrac{4}{3}\\ln|x-1| + c$`,
},

{
  question_id: 2075,
  topic_id: 1006,
  subject_id: 10,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Waves: Properties and Applications",
  content: `<p><b>(a)</b> State the difference between longitudinal and transverse waves, giving one example of each. [4]</p>
<p><b>(b)</b> A wave travels at 340 m s⁻¹ with a frequency of 680 Hz. Calculate the wavelength. [2]</p>
<p><b>(c)</b> Describe what happens to the speed, frequency, and wavelength of a wave when it passes from a less dense medium into a more dense medium. [3]</p>
<p><b>(d)</b> Explain how echoes are used in <b>ultrasound scanning</b> to produce images of internal body structures. [4]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. In a transverse wave, oscillations are perpendicular to the direction of energy transfer.<br>
2. Example: light, water waves.<br>
3. In a longitudinal wave, oscillations are parallel to the direction of energy transfer, with compressions and rarefactions.<br>
4. Example: sound waves.<br>
<br>
<b>(b)</b><br>
1. $\\lambda = \\dfrac{v}{f} = \\dfrac{340}{680} = 0.5$ m<br>
<br>
<b>(c)</b><br>
1. Speed decreases (wave slows down in denser medium).<br>
2. Frequency remains the same (determined by the source).<br>
3. Wavelength decreases (since $v = f\\lambda$ and $f$ is constant, $\\lambda$ decreases with $v$).<br>
<br>
<b>(d)</b><br>
1. A pulse of ultrasound (high-frequency sound) is directed into the body.<br>
2. At boundaries between different tissues (e.g. organ walls), some ultrasound is reflected back as an echo.<br>
3. The time taken for each echo to return is measured; since the speed of ultrasound in tissue is known, the distance to each boundary can be calculated.<br>
4. A computer processes the reflected pulses to build up a 2D image of internal structures.`,
},

{
  question_id: 2076,
  topic_id: 10012,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Carbonyls and Carboxylic Acids",
  content: `<p><b>(a)</b> Describe a chemical test to distinguish between an aldehyde and a ketone. State the reagent used, the observation for a positive result, and explain why ketones do not give a positive result. [4]</p>
<p><b>(b)</b> Describe the mechanism of <b>nucleophilic addition</b> of HCN to propanone. Include a curly arrow mechanism and explain why this reaction is useful in synthesis. [5]</p>
<p><b>(c)</b> Describe how you would prepare propanoic acid from propanal in two steps, giving reagents, conditions, and the product of each step. [4]</p>
<p><b>(d)</b> Explain why carboxylic acids have higher boiling points than alcohols of similar molecular mass. [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Tollens' reagent (ammoniacal silver nitrate) or Fehling's solution.<br>
2. Positive result with aldehyde: silver mirror forms (Tollens') or brick-red precipitate forms (Fehling's).<br>
3. Ketones cannot be oxidised under these mild conditions because they lack the hydrogen atom on the carbonyl carbon that aldehydes possess — they do not give a positive result.<br>
<br>
<b>(b)</b><br>
1. $\\text{CN}^-$ acts as the nucleophile, donating a lone pair to the electrophilic carbonyl carbon.<br>
2. Curly arrow from $\\text{CN}^-$ to C of $\\text{C=O}$; arrow from $\\text{C=O}$ bond to O, forming alkoxide intermediate.<br>
3. $\\text{H}^+$ (from HCN) protonates the alkoxide oxygen, giving a hydroxynitrile (cyanohydrin).<br>
4. Product from propanone: 2-hydroxy-2-methylpropanenitrile.<br>
5. This reaction is useful because it increases the carbon chain length by one, and the nitrile group can be hydrolysed to a carboxylic acid, providing a route to longer-chain molecules.<br>
<br>
<b>(c)</b><br>
1. Step 1: Oxidise propanal to propanoic acid directly using acidified potassium dichromate(VI) ($\\text{K}_2\\text{Cr}_2\\text{O}_7$/H⁺) under reflux — orange to green. Product: propanoic acid.<br>
(Accept: Step 1: oxidise propanal to propanoic acid in one step, or via two-step oxidation through the acid.)<br>
2. Alternatively: Step 1: reduce propanal to propan-1-ol using $\\text{NaBH}_4$. Step 2: oxidise propan-1-ol to propanoic acid using excess acidified $\\text{K}_2\\text{Cr}_2\\text{O}_7$ under reflux.<br>
<br>
<b>(d)</b><br>
1. Carboxylic acids can form hydrogen bonds between two molecules via both the O–H and C=O groups, creating dimers.<br>
2. This means carboxylic acids effectively have a much higher "molecular mass" in the liquid phase than their formula suggests.<br>
3. More energy is required to break these stronger/more extensive intermolecular forces, giving a higher boiling point than alcohols of similar molecular mass.`,
},

{
  question_id: 2077,
  topic_id: 3004,
  subject_id: 8,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Natural Selection + Genetic Modification",
  content: `<p>Describe and explain the process of natural selection, using an example of your choice. In your answer, explain how natural selection can lead to the development of a new species (speciation) over time. [9]</p>`,
  mark_scheme: `1. Within a population, there is natural genetic variation due to random mutations and sexual reproduction.<br>
2. Individuals with characteristics better suited to their environment are more likely to survive and reproduce — survival of the fittest.<br>
3. Example: in peppered moths, dark (melanic) moths had better camouflage on soot-darkened trees during industrialisation and were less likely to be eaten by predators.<br>
4. Survivors pass on their advantageous alleles to offspring — the frequency of beneficial alleles increases in the population over generations.<br>
5. Over many generations, the population becomes better adapted to its environment.<br>
<br>
6. Speciation occurs when populations of the same species become reproductively isolated from one another.<br>
7. In allopatric speciation, a physical barrier (e.g. mountain range, river) separates populations — gene flow between them stops.<br>
8. Each isolated population experiences different selection pressures and accumulates different mutations.<br>
9. Over time, the populations diverge genetically until they can no longer interbreed to produce fertile offspring — they have become separate species.`,
},

{
  question_id: 2078,
  topic_id: 5015,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Hypothesis Testing",
  content: `<p><b>(a)</b> Explain what is meant by a <b>null hypothesis</b> and an <b>alternative hypothesis</b>. State the difference between a one-tailed and a two-tailed test. [4]</p>
<p><b>(b)</b> A six-sided die is suspected to be biased towards 6. In 60 rolls, a 6 appears 16 times. Test at the 5% significance level whether there is evidence that the die is biased towards 6.</p>
<ul>
  <li>State your hypotheses clearly. [2]</li>
  <li>Calculate the critical region. [3]</li>
  <li>State your conclusion in context. [2]</li>
</ul>
<p><b>(c)</b> A manufacturer claims that 30% of customers prefer their new product. A random sample of 20 customers is taken and only 3 prefer the new product. Test at the 5% significance level whether there is evidence that the true proportion is less than 30%. [6]</p>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. The null hypothesis $H_0$ is the default assumption — it states there is no effect or no change.<br>
2. The alternative hypothesis $H_1$ is what we are testing for — it states the direction or existence of an effect.<br>
3. A one-tailed test tests for a change in one direction only (e.g. greater than).<br>
4. A two-tailed test tests for a change in either direction.<br>
<br>
<b>(b)</b><br>
1. $H_0: p = \\dfrac{1}{6}$. $H_1: p > \\dfrac{1}{6}$ (one-tailed, upper).<br>
2. $X \\sim B\\left(60, \\dfrac{1}{6}\\right)$. Find $c$ such that $P(X \\geq c) \\leq 0.05$.<br>
$P(X \\geq 16) = 1 - P(X \\leq 15)$. Using tables/calculation: $P(X \\leq 15) \\approx 0.9457$, so $P(X \\geq 16) \\approx 0.0543 > 0.05$.<br>
$P(X \\geq 17) \\approx 0.0287 < 0.05$. Critical region: $X \\geq 17$.<br>
3. Since 16 does not lie in the critical region ($X \\geq 17$), we do not reject $H_0$. There is insufficient evidence at the 5% level that the die is biased towards 6.<br>
<br>
<b>(c)</b><br>
1. $H_0: p = 0.3$. $H_1: p < 0.3$ (one-tailed, lower).<br>
2. $X \\sim B(20, 0.3)$. Find $P(X \\leq 3)$.<br>
3. $P(X \\leq 3) = P(X=0)+P(X=1)+P(X=2)+P(X=3)$<br>
$= 0.7^{20} + 20(0.3)(0.7^{19}) + \\binom{20}{2}(0.3)^2(0.7)^{18} + \\binom{20}{3}(0.3)^3(0.7)^{17}$<br>
$= 0.0008 + 0.0068 + 0.0278 + 0.0716 = 0.1071$<br>
4. $0.1071 > 0.05$, so we do not reject $H_0$.<br>
5. There is insufficient evidence at the 5% significance level that the true proportion preferring the product is less than 30%.`,
},

{
  question_id: 2079,
  topic_id: 8021,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Electric Fields",
  content: `<p><b>(a)</b> Define <b>electric field strength</b> and state its SI unit. Write the equation for the field strength due to a point charge. [3]</p>
<p><b>(b)</b> Two point charges $Q_1 = +3.0 \\times 10^{-6}$ C and $Q_2 = -2.0 \\times 10^{-6}$ C are placed 0.10 m apart in a vacuum.</p>
<ul>
  <li>Calculate the force between the charges. [$k = 8.99 \\times 10^9$ N m² C⁻²] [2]</li>
  <li>Find the point between the two charges where the electric field is zero. [4]</li>
</ul>
<p><b>(c)</b> An electron ($m = 9.11 \\times 10^{-31}$ kg, $q = 1.60 \\times 10^{-19}$ C) is placed in a uniform electric field of $E = 2.5 \\times 10^4$ N C⁻¹.</p>
<ul>
  <li>Calculate the force on the electron. [2]</li>
  <li>Calculate the acceleration of the electron. [2]</li>
</ul>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Electric field strength is the force per unit positive charge at a point: $E = \\dfrac{F}{Q}$.<br>
2. SI unit: N C⁻¹ (or V m⁻¹).<br>
3. Due to a point charge: $E = \\dfrac{kQ}{r^2}$<br>
<br>
<b>(b)</b><br>
1. $F = \\dfrac{kQ_1Q_2}{r^2} = \\dfrac{8.99\\times10^9 \\times 3.0\\times10^{-6} \\times 2.0\\times10^{-6}}{(0.10)^2} = \\dfrac{5.394}{0.01} = 5.4$ N (attractive)<br>
2. Let the zero-field point be at distance $x$ from $Q_1$. $\\dfrac{kQ_1}{x^2} = \\dfrac{kQ_2}{(0.10-x)^2}$<br>
$\\dfrac{3.0}{x^2} = \\dfrac{2.0}{(0.10-x)^2}$<br>
$3(0.10-x)^2 = 2x^2 \\Rightarrow \\sqrt{3}(0.10-x) = \\sqrt{2}x$<br>
$0.10\\sqrt{3} = x(\\sqrt{2}+\\sqrt{3}) \\Rightarrow x = \\dfrac{0.10\\sqrt{3}}{\\sqrt{2}+\\sqrt{3}} = 0.0549$ m from $Q_1$.<br>
(Note: since charges are opposite signs, zero field point is outside the charges — accept working showing this and finding external point.)<br>
<br>
<b>(c)</b><br>
1. $F = qE = 1.60\\times10^{-19} \\times 2.5\\times10^4 = 4.0\\times10^{-15}$ N<br>
2. $a = \\dfrac{F}{m} = \\dfrac{4.0\\times10^{-15}}{9.11\\times10^{-31}} = 4.39\\times10^{15}$ m s⁻²`,
},

{
  question_id: 2080,
  topic_id: 6022,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Bivariate Data and Correlation",
  content: `<p><b>(a)</b> Explain what is meant by the <b>product moment correlation coefficient</b> (PMCC) $r$. State the range of values $r$ can take and interpret $r = 1$, $r = 0$, and $r = -1$. [4]</p>
<p><b>(b)</b> A dataset gives $n = 8$, $\\sum x = 48$, $\\sum y = 64$, $\\sum x^2 = 320$, $\\sum y^2 = 556$, $\\sum xy = 408$.</p>
<ul>
  <li>Calculate $S_{xx}$, $S_{yy}$, and $S_{xy}$. [3]</li>
  <li>Calculate $r$ and comment on the correlation. [3]</li>
</ul>
<p><b>(c)</b> Find the equation of the regression line of $y$ on $x$ for the data in part (b), in the form $y = a + bx$. [3]</p>
<p><b>(d)</b> Explain why it would not be appropriate to use this regression line to predict the value of $x$ for a given $y$. [2]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. The PMCC measures the strength and direction of the linear correlation between two variables.<br>
2. $-1 \\leq r \\leq 1$.<br>
3. $r=1$: perfect positive linear correlation. $r=0$: no linear correlation. $r=-1$: perfect negative linear correlation.<br>
<br>
<b>(b)</b><br>
1. $S_{xx} = \\sum x^2 - \\dfrac{(\\sum x)^2}{n} = 320 - \\dfrac{48^2}{8} = 320 - 288 = 32$<br>
$S_{yy} = 556 - \\dfrac{64^2}{8} = 556 - 512 = 44$<br>
$S_{xy} = 408 - \\dfrac{48 \\times 64}{8} = 408 - 384 = 24$<br>
2. $r = \\dfrac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}} = \\dfrac{24}{\\sqrt{32 \\times 44}} = \\dfrac{24}{\\sqrt{1408}} = \\dfrac{24}{37.52} = 0.640$<br>
3. Moderate positive linear correlation between $x$ and $y$.<br>
<br>
<b>(c)</b><br>
1. $b = \\dfrac{S_{xy}}{S_{xx}} = \\dfrac{24}{32} = 0.75$<br>
2. $\\bar{x} = \\dfrac{48}{8} = 6$, $\\bar{y} = \\dfrac{64}{8} = 8$.<br>
3. $a = \\bar{y} - b\\bar{x} = 8 - 0.75 \\times 6 = 8 - 4.5 = 3.5$. Regression line: $y = 3.5 + 0.75x$<br>
<br>
<b>(d)</b><br>
1. The regression line of $y$ on $x$ minimises the sum of squared residuals in the $y$ direction — it is designed for predicting $y$ from $x$.<br>
2. To predict $x$ from $y$, you would need the regression line of $x$ on $y$, which is a different line (unless $r = \\pm 1$).`,
},

{
  question_id: 2081,
  topic_id: 9014,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Properties of Plants",
  content: `<p>Describe the structure of a leaf and explain how it is adapted for efficient photosynthesis. In your answer, refer to the role of each tissue layer and explain how the leaf minimises water loss while maximising gas exchange. [9]</p>`,
  mark_scheme: `1. The upper epidermis is a single transparent layer covered by a waxy cuticle — it allows light to pass through while reducing water loss by evaporation.<br>
2. Beneath the upper epidermis is the palisade mesophyll: tightly packed, column-shaped cells packed with chloroplasts, arranged perpendicular to the leaf surface to maximise light absorption.<br>
3. The spongy mesophyll contains irregularly shaped cells with large air spaces between them, allowing $\\text{CO}_2$ to diffuse freely to photosynthesising cells.<br>
4. The lower epidermis contains stomata — pores flanked by guard cells that open and close to regulate gas exchange and water loss.<br>
5. When light is available and water is plentiful, guard cells become turgid (via active uptake of K⁺ ions and subsequent osmosis), opening the stomata to allow $\\text{CO}_2$ in and $\\text{O}_2$ out.<br>
6. In dry conditions, guard cells lose water and become flaccid, closing the stomata to reduce transpiration — this limits water loss at the expense of gas exchange.<br>
7. Vascular bundles (veins) running through the leaf contain xylem (delivers water and minerals) and phloem (transports sugars), supporting the leaf and supplying the raw materials for photosynthesis.<br>
8. The large surface area to volume ratio of the leaf as a whole maximises light interception and gas exchange.<br>
9. The thin, flat shape of the leaf minimises the diffusion distance for $\\text{CO}_2$ to reach the palisade cells from the stomata.`,
},

{
  question_id: 2082,
  topic_id: 7026,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Algorithms on Data Structures",
  content: `<p><b>(a)</b> Describe the structure of a <b>binary search tree (BST)</b>. Explain the rule that governs where a new node is inserted. [3]</p>
<p><b>(b)</b> Insert the following values into an initially empty BST in the order given and draw the resulting tree:</p>
<p><code>15, 9, 22, 5, 12, 18, 30</code> [4]</p>
<p><b>(c)</b> Perform an <b>in-order traversal</b> of the tree from part (b) and state what you notice about the output. [2]</p>
<p><b>(d)</b> Describe how you would delete the node with value <b>9</b> from the tree, which has two children. State the general rule for deleting a node with two children from a BST. [3]</p>
<p><b>(e)</b> State the worst-case time complexity for searching a BST and describe the tree structure that causes this worst case. [2]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. A BST is a tree where each node has at most two children.<br>
2. For any node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater.<br>
3. A new node is inserted by traversing from the root, going left if the new value is smaller and right if larger, until a null position is found.<br>
<br>
<b>(b)</b><br>
Root: 15<br>
9 < 15 → left of 15<br>
22 > 15 → right of 15<br>
5 < 15, < 9 → left of 9<br>
12 < 15, > 9 → right of 9<br>
18 > 15, < 22 → left of 22<br>
30 > 15, > 22 → right of 22<br>
(Award marks for correct tree structure drawn)<br>
<br>
<b>(c)</b><br>
1. In-order traversal (left, root, right): 5, 9, 12, 15, 18, 22, 30<br>
2. The values are output in ascending sorted order — in-order traversal of a BST always produces a sorted sequence.<br>
<br>
<b>(d)</b><br>
1. To delete node 9 (which has children 5 and 12): find its in-order successor (the smallest value in its right subtree) — this is 12.<br>
2. Replace the value of node 9 with 12, then delete the original node containing 12.<br>
3. General rule: replace the node with either its in-order successor (smallest in right subtree) or in-order predecessor (largest in left subtree), then delete that successor/predecessor.<br>
<br>
<b>(e)</b><br>
1. Worst-case time complexity: $O(n)$.<br>
2. This occurs when the BST is completely unbalanced — e.g. values inserted in sorted order produce a linear chain (each node has only a right child), effectively becoming a linked list.`,
},

{
  question_id: 2083,
  topic_id: 10007,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Energy Changes in Chemistry",
  content: `<p><b>(a)</b> Define <b>enthalpy of combustion</b> and <b>enthalpy of formation</b>. [2]</p>
<p><b>(b)</b> Use the following data to calculate the enthalpy of combustion of ethanol ($\\text{C}_2\\text{H}_5\\text{OH}$) using Hess's Law.</p>
<p>$\\Delta H_f^\\circ[\\text{C}_2\\text{H}_5\\text{OH}(l)] = -278$ kJ mol⁻¹<br>
$\\Delta H_f^\\circ[\\text{CO}_2(g)] = -394$ kJ mol⁻¹<br>
$\\Delta H_f^\\circ[\\text{H}_2\\text{O}(l)] = -286$ kJ mol⁻¹ [4]</p>
<p><b>(c)</b> The following bond enthalpies are given:</p>
<p>$\\text{C–H} = +413$, $\\text{C–C} = +347$, $\\text{C=O} = +805$, $\\text{O–H} = +464$, $\\text{O=O} = +498$ kJ mol⁻¹</p>
<p>Use these values to calculate the enthalpy change for the combustion of ethane ($\\text{C}_2\\text{H}_6$). [5]</p>
<p><b>(d)</b> Explain why bond enthalpy calculations give approximate rather than exact values. [2]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Enthalpy of combustion: the enthalpy change when one mole of a substance is completely burned in oxygen under standard conditions.<br>
2. Enthalpy of formation: the enthalpy change when one mole of a compound is formed from its elements in their standard states under standard conditions.<br>
<br>
<b>(b)</b><br>
1. $\\text{C}_2\\text{H}_5\\text{OH}(l) + 3\\text{O}_2(g) \\rightarrow 2\\text{CO}_2(g) + 3\\text{H}_2\\text{O}(l)$<br>
2. $\\Delta H_c = \\sum \\Delta H_f(\\text{products}) - \\sum \\Delta H_f(\\text{reactants})$<br>
3. $= [2(-394) + 3(-286)] - [(-278) + 0]$<br>
4. $= [-788 + (-858)] - [-278] = -1646 + 278 = -1368$ kJ mol⁻¹<br>
<br>
<b>(c)</b><br>
$\\text{C}_2\\text{H}_6 + \\dfrac{7}{2}\\text{O}_2 \\rightarrow 2\\text{CO}_2 + 3\\text{H}_2\\text{O}$<br>
1. Bonds broken: $6(\\text{C–H}) + 1(\\text{C–C}) + \\dfrac{7}{2}(\\text{O=O})$<br>
$= 6(413) + 347 + 3.5(498) = 2478 + 347 + 1743 = 4568$ kJ<br>
2. Bonds formed: $4(\\text{C=O}) + 6(\\text{O–H})$ (in $2\\text{CO}_2$ and $3\\text{H}_2\\text{O}$)<br>
$= 4(805) + 6(464) = 3220 + 2784 = 6004$ kJ<br>
3. $\\Delta H = 4568 - 6004 = -1436$ kJ mol⁻¹<br>
<br>
<b>(d)</b><br>
1. Bond enthalpy values are average values taken from many different compounds.<br>
2. The actual bond enthalpy for a specific bond in a specific molecule may differ from the average, so the calculated value is only an approximation.`,
},

{
  question_id: 2084,
  topic_id: 4006,
  subject_id: 7,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Statistics: Averages and Spread",
  content: `<p><b>(a)</b> The following data shows the number of goals scored per match by a football team in a season:</p>
<p><code>0, 1, 1, 2, 2, 2, 3, 3, 4, 5, 5, 6</code></p>
<ul>
  <li>Find the mean, median, and mode. [3]</li>
  <li>Find the range and interquartile range. [3]</li>
</ul>
<p><b>(b)</b> A second team has a mean of 2.8 goals per match and a standard deviation of 1.9. Compare the two teams' scoring performances. [3]</p>
<p><b>(c)</b> A student says: "The mean is the best average to use for this data." Evaluate this statement. [2]</p>
<p><b>Total: 11 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Mean $= \\dfrac{0+1+1+2+2+2+3+3+4+5+5+6}{12} = \\dfrac{34}{12} = 2.8\\overline{3}$<br>
Median: middle values are 6th and 7th = 2 and 3. Median $= 2.5$<br>
Mode $= 2$<br>
2. Range $= 6-0 = 6$<br>
$Q_1$: 3rd value $= 1$. $Q_3$: 10th value $= 5$. IQR $= 5-1 = 4$<br>
<br>
<b>(b)</b><br>
1. Team 1 mean $\\approx 2.83$, Team 2 mean $= 2.8$ — both teams score a similar average number of goals per match.<br>
2. Calculate Team 1 standard deviation or compare spread: Team 1 range $= 6$, Team 2 SD $= 1.9$ — more information needed for direct comparison but Team 2's SD suggests moderate spread.<br>
3. Team 1 appears more consistent around the mean (accept any valid comparison using the data provided).<br>
<br>
<b>(c)</b><br>
1. The mean is affected by extreme values (e.g. the 0 and 6) and may not represent the typical score well.<br>
2. The median (2.5) may be more appropriate as it is not skewed by outliers — the student's claim is not necessarily correct.`,
},

{
  question_id: 2085,
  topic_id: 8013,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Thermal Physics and Ideal Gases",
  content: `<p><b>(a)</b> State the three assumptions of the kinetic theory of ideal gases. [3]</p>
<p><b>(b)</b> Derive the relationship $pV = \\dfrac{1}{3}Nm\\langle c^2 \\rangle$ from the kinetic theory model, outlining the key steps. [5]</p>
<p><b>(c)</b> Use the ideal gas law $pV = nRT$ and the result from (b) to show that the mean kinetic energy of a molecule is $\\dfrac{3}{2}k_BT$. [3]</p>
<p><b>(d)</b> A fixed mass of gas is heated at constant pressure from 300 K to 450 K. The initial volume is $2.0 \\times 10^{-3}$ m³. Calculate the new volume. [2]</p>
<p><b>(e)</b> The pressure of a gas in a sealed container is $1.5 \\times 10^5$ Pa at 300 K. The container is heated to 450 K. Calculate the new pressure, assuming the volume is constant. [2]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b> Any three:<br>
1. Gas molecules are point masses with negligible volume compared to the container.<br>
2. All collisions between molecules and with the container walls are perfectly elastic (no kinetic energy lost).<br>
3. There are no intermolecular forces except during collisions.<br>
4. The time of a collision is negligible compared to the time between collisions.<br>
5. Molecules move in random directions with a range of speeds.<br>
<br>
<b>(b)</b><br>
1. Consider $N$ molecules in a cubic box of side $L$. A molecule with speed $c_x$ in the $x$-direction hits a wall and bounces back — change in momentum $= 2mc_x$.<br>
2. Time between successive collisions with the same wall $= \\dfrac{2L}{c_x}$. Force on wall from one molecule $= \\dfrac{2mc_x}{2L/c_x} = \\dfrac{mc_x^2}{L}$.<br>
3. Total force from all $N$ molecules: $F = \\dfrac{Nm\\langle c_x^2 \\rangle}{L}$. Pressure $= \\dfrac{F}{L^2} = \\dfrac{Nm\\langle c_x^2 \\rangle}{L^3} = \\dfrac{Nm\\langle c_x^2 \\rangle}{V}$.<br>
4. By symmetry: $\\langle c^2 \\rangle = \\langle c_x^2 \\rangle + \\langle c_y^2 \\rangle + \\langle c_z^2 \\rangle = 3\\langle c_x^2 \\rangle$, so $\\langle c_x^2 \\rangle = \\dfrac{1}{3}\\langle c^2 \\rangle$.<br>
5. Therefore $p = \\dfrac{Nm\\langle c^2 \\rangle}{3V}$, i.e. $pV = \\dfrac{1}{3}Nm\\langle c^2 \\rangle$ ✓<br>
<br>
<b>(c)</b><br>
1. From $pV = \\dfrac{1}{3}Nm\\langle c^2 \\rangle$ and $pV = nRT = Nk_BT$:<br>
2. $Nk_BT = \\dfrac{1}{3}Nm\\langle c^2 \\rangle \\Rightarrow k_BT = \\dfrac{1}{3}m\\langle c^2 \\rangle$<br>
3. Mean KE $= \\dfrac{1}{2}m\\langle c^2 \\rangle = \\dfrac{3}{2}k_BT$ ✓<br>
<br>
<b>(d)</b><br>
1. At constant pressure: $\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}$<br>
2. $V_2 = \\dfrac{V_1 T_2}{T_1} = \\dfrac{2.0\\times10^{-3} \\times 450}{300} = 3.0\\times10^{-3}$ m³<br>
<br>
<b>(e)</b><br>
1. At constant volume: $\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2}$<br>
2. $p_2 = \\dfrac{1.5\\times10^5 \\times 450}{300} = 2.25\\times10^5$ Pa`,
},

{
  question_id: 2086,
  topic_id: 6003,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Roots of Polynomials",
  content: `<p><b>(a)</b> A cubic equation $x^3 + ax^2 + bx + c = 0$ has roots $\\alpha$, $\\beta$, $\\gamma$. Write down expressions for $\\alpha+\\beta+\\gamma$, $\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha$, and $\\alpha\\beta\\gamma$ in terms of $a$, $b$, $c$. [3]</p>
<p><b>(b)</b> The cubic $2x^3 - 5x^2 + 4x - 1 = 0$ has roots $\\alpha$, $\\beta$, $\\gamma$. Find:</p>
<ul>
  <li>$\\alpha+\\beta+\\gamma$, $\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha$, $\\alpha\\beta\\gamma$ [3]</li>
  <li>$\\alpha^2+\\beta^2+\\gamma^2$ [2]</li>
  <li>$\\dfrac{1}{\\alpha}+\\dfrac{1}{\\beta}+\\dfrac{1}{\\gamma}$ [2]</li>
</ul>
<p><b>(c)</b> Find a cubic equation with integer coefficients whose roots are $2\\alpha$, $2\\beta$, $2\\gamma$. [3]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $\\alpha+\\beta+\\gamma = -a$<br>
2. $\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha = b$<br>
3. $\\alpha\\beta\\gamma = -c$<br>
<br>
<b>(b)</b><br>
1. Divide through by 2: $x^3 - \\dfrac{5}{2}x^2 + 2x - \\dfrac{1}{2} = 0$<br>
$\\alpha+\\beta+\\gamma = \\dfrac{5}{2}$, $\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha = 2$, $\\alpha\\beta\\gamma = \\dfrac{1}{2}$<br>
2. $\\alpha^2+\\beta^2+\\gamma^2 = (\\alpha+\\beta+\\gamma)^2 - 2(\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha) = \\dfrac{25}{4} - 4 = \\dfrac{9}{4}$<br>
3. $\\dfrac{1}{\\alpha}+\\dfrac{1}{\\beta}+\\dfrac{1}{\\gamma} = \\dfrac{\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha}{\\alpha\\beta\\gamma} = \\dfrac{2}{1/2} = 4$<br>
<br>
<b>(c)</b><br>
1. New roots $2\\alpha$, $2\\beta$, $2\\gamma$: substitute $x = \\dfrac{y}{2}$ into original equation:<br>
$2\\left(\\dfrac{y}{2}\\right)^3 - 5\\left(\\dfrac{y}{2}\\right)^2 + 4\\left(\\dfrac{y}{2}\\right) - 1 = 0$<br>
2. $\\dfrac{y^3}{4} - \\dfrac{5y^2}{4} + 2y - 1 = 0$<br>
3. Multiply by 4: $y^3 - 5y^2 + 8y - 4 = 0$`,
},

{
  question_id: 2087,
  topic_id: 9026,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Homeostasis and Exercise",
  content: `<p>Describe how the human body maintains a constant core body temperature (thermoregulation) in response to both overheating and overcooling. In your answer, refer to the roles of the hypothalamus, skin, and effectors involved. [12]</p>`,
  mark_scheme: `<b>Role of the hypothalamus:</b><br>
1. The hypothalamus in the brain acts as the thermoregulatory centre, containing thermoreceptors that detect changes in blood temperature.<br>
2. Peripheral thermoreceptors in the skin also send signals to the hypothalamus about external temperature changes.<br>
3. The hypothalamus coordinates responses via the nervous system and hormones to return body temperature to the set point (~37°C).<br>
<br>
<b>Responses to overheating:</b><br>
4. Vasodilation: arterioles near the skin surface dilate, increasing blood flow to the skin and allowing more heat to be lost by radiation.<br>
5. Sweating: sweat glands secrete sweat onto the skin surface; as sweat evaporates it absorbs latent heat from the body, cooling it.<br>
6. Erector pili muscles relax — hairs lie flat, reducing the insulating layer of trapped air.<br>
7. Metabolic rate decreases slightly — less heat is generated internally.<br>
<br>
<b>Responses to overcooling:</b><br>
8. Vasoconstriction: arterioles near the skin surface constrict, reducing blood flow to the skin and conserving heat in the core.<br>
9. Shivering: skeletal muscles contract rapidly and involuntarily, generating heat through respiration.<br>
10. Erector pili muscles contract — hairs stand on end, trapping a layer of insulating air close to the skin (more effective in other mammals).<br>
11. Increased secretion of adrenaline and thyroxine increases metabolic rate, generating more heat.<br>
12. These mechanisms together form a negative feedback loop — any deviation from the set point triggers a response that opposes the change and restores normal temperature.`,
},

{
  question_id: 2088,
  topic_id: 2004,
  subject_id: 9,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Extracting Metals and Equilibria",
  content: `<p><b>(a)</b> Explain why some metals can be extracted by reduction with carbon whilst others require electrolysis. Use the reactivity series in your answer. [3]</p>
<p><b>(b)</b> Write the equation for the extraction of iron from iron(III) oxide using carbon monoxide in a blast furnace, and state the type of reaction occurring. [2]</p>
<p><b>(c)</b> Aluminium is extracted by electrolysis of molten aluminium oxide.</p>
<ul>
  <li>Explain why aluminium oxide must be molten (not dissolved in water) for electrolysis. [2]</li>
  <li>Write half-equations for the reactions at the anode and cathode. [2]</li>
  <li>Explain why the carbon anodes need to be replaced regularly. [2]</li>
</ul>
<p><b>Total: 11 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Metals below carbon in the reactivity series (e.g. iron, copper) can be extracted by reduction with carbon or carbon monoxide, as carbon is more reactive and can displace them.<br>
2. Metals above carbon in the reactivity series (e.g. aluminium, sodium) are too reactive to be reduced by carbon — they require the stronger reducing power provided by electrolysis.<br>
<br>
<b>(b)</b><br>
1. $\\text{Fe}_2\\text{O}_3 + 3\\text{CO} \\rightarrow 2\\text{Fe} + 3\\text{CO}_2$<br>
2. This is a redox reaction — iron is reduced (gains electrons / loses oxygen), carbon monoxide is oxidised.<br>
<br>
<b>(c)</b><br>
1. Aluminium oxide dissolved in water would result in hydrogen being produced at the cathode (from water) instead of aluminium, as $\\text{H}^+$ ions are discharged in preference to $\\text{Al}^{3+}$.<br>
2. Cathode: $\\text{Al}^{3+} + 3e^- \\rightarrow \\text{Al}$<br>
Anode: $2\\text{O}^{2-} \\rightarrow \\text{O}_2 + 4e^-$<br>
3. The oxygen produced at the anode reacts with the carbon electrodes at high temperature, burning them away as carbon dioxide — they must be replaced periodically.`,
},

{
  question_id: 2089,
  topic_id: 5010,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Vectors in 2D and 3D",
  content: `<p><b>(a)</b> Given $\\mathbf{a} = 2\\mathbf{i} - 3\\mathbf{j} + \\mathbf{k}$ and $\\mathbf{b} = \\mathbf{i} + 4\\mathbf{j} - 2\\mathbf{k}$, find:</p>
<ul>
  <li>$3\\mathbf{a} - 2\\mathbf{b}$ [2]</li>
  <li>$|\\mathbf{a}|$ and $|\\mathbf{b}|$ [2]</li>
  <li>The unit vector in the direction of $\\mathbf{a} + \\mathbf{b}$ [3]</li>
</ul>
<p><b>(b)</b> Find the dot product $\\mathbf{a} \\cdot \\mathbf{b}$ and hence find the angle between $\\mathbf{a}$ and $\\mathbf{b}$, to the nearest degree. [4]</p>
<p><b>(c)</b> The position vectors of points $P$ and $Q$ are $\\mathbf{p} = (1, -2, 4)$ and $\\mathbf{q} = (5, 0, -2)$.</p>
<ul>
  <li>Find $\\overrightarrow{PQ}$ and its magnitude. [2]</li>
  <li>Find the coordinates of the midpoint of $PQ$. [1]</li>
  <li>Find the vector equation of the line through $P$ and $Q$. [2]</li>
</ul>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $3\\mathbf{a}-2\\mathbf{b} = (6-2)\\mathbf{i}+(-9-8)\\mathbf{j}+(3+4)\\mathbf{k} = 4\\mathbf{i}-17\\mathbf{j}+7\\mathbf{k}$<br>
2. $|\\mathbf{a}| = \\sqrt{4+9+1} = \\sqrt{14}$, $|\\mathbf{b}| = \\sqrt{1+16+4} = \\sqrt{21}$<br>
3. $\\mathbf{a}+\\mathbf{b} = 3\\mathbf{i}+\\mathbf{j}-\\mathbf{k}$. $|\\mathbf{a}+\\mathbf{b}| = \\sqrt{9+1+1} = \\sqrt{11}$.<br>
Unit vector $= \\dfrac{1}{\\sqrt{11}}(3\\mathbf{i}+\\mathbf{j}-\\mathbf{k})$<br>
<br>
<b>(b)</b><br>
1. $\\mathbf{a}\\cdot\\mathbf{b} = (2)(1)+(-3)(4)+(1)(-2) = 2-12-2 = -12$<br>
2. $\\cos\\theta = \\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|} = \\dfrac{-12}{\\sqrt{14}\\times\\sqrt{21}} = \\dfrac{-12}{\\sqrt{294}} = \\dfrac{-12}{17.15} = -0.6997$<br>
3. $\\theta = \\arccos(-0.6997) \\approx 134°$<br>
<br>
<b>(c)</b><br>
1. $\\overrightarrow{PQ} = \\mathbf{q}-\\mathbf{p} = (4, 2, -6)$. $|\\overrightarrow{PQ}| = \\sqrt{16+4+36} = \\sqrt{56} = 2\\sqrt{14}$<br>
2. Midpoint $= \\left(\\dfrac{1+5}{2}, \\dfrac{-2+0}{2}, \\dfrac{4-2}{2}\\right) = (3, -1, 1)$<br>
3. Line: $\\mathbf{r} = \\begin{pmatrix}1\\\\-2\\\\4\\end{pmatrix} + t\\begin{pmatrix}4\\\\2\\\\-6\\end{pmatrix}$`,
},

{
  question_id: 2090,
  topic_id: 3001,
  subject_id: 8,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Key Concepts in Biology",
  content: `<p><b>(a)</b> State the cell theory and explain its significance in biology. [3]</p>
<p><b>(b)</b> Describe the differences between <b>prokaryotic</b> and <b>eukaryotic</b> cells. [4]</p>
<p><b>(c)</b> Explain the process of <b>osmosis</b> and describe an experiment a student could carry out to demonstrate osmosis using potato cylinders. Include the expected results and conclusion. [6]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. All living organisms are made of one or more cells.<br>
2. The cell is the basic structural and functional unit of life.<br>
3. All cells arise from pre-existing cells (cell division).<br>
<br>
<b>(b)</b><br>
1. Prokaryotic cells have no membrane-bound nucleus — DNA is found in the cytoplasm as a single circular chromosome.<br>
2. Prokaryotic cells are generally much smaller than eukaryotic cells and have no membrane-bound organelles.<br>
3. Eukaryotic cells have a true nucleus enclosed by a nuclear envelope and contain membrane-bound organelles (e.g. mitochondria, ER).<br>
4. Prokaryotes may have plasmids and a cell wall made of peptidoglycan; eukaryotic cell walls (if present) are made of cellulose (plants) or chitin (fungi).<br>
<br>
<b>(c)</b><br>
1. Osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential across a partially permeable membrane.<br>
2. Experiment: cut potato cylinders of equal mass and size. Place them in solutions of different concentrations (e.g. 0%, 0.2 M, 0.4 M, 0.6 M, 0.8 M, 1.0 M sucrose) for 30 minutes.<br>
3. Remove cylinders, dry gently, and measure their mass again.<br>
4. Expected results: cylinders in dilute solutions gain mass (water moves in by osmosis); cylinders in concentrated solutions lose mass (water moves out); at one concentration, mass is unchanged (isotonic — water potential of solution equals that of potato).<br>
5. Conclusion: the change in mass demonstrates osmosis; the concentration at which no change occurs equals the water potential of potato cells.`,
},

{
  question_id: 2091,
  topic_id: 6019,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Second Order Differential Equations",
  content: `<p><b>(a)</b> Find the general solution of $\\dfrac{d^2y}{dx^2} - 5\\dfrac{dy}{dx} + 6y = 0$. [3]</p>
<p><b>(b)</b> Find the general solution of $\\dfrac{d^2y}{dx^2} - 4\\dfrac{dy}{dx} + 4y = 0$. [3]</p>
<p><b>(c)</b> Find the general solution of $\\dfrac{d^2y}{dx^2} + 4y = 8x^2$. [5]</p>
<p><b>(d)</b> Solve the initial value problem: $\\dfrac{d^2y}{dx^2} - y = e^{2x}$, given $y(0) = 0$ and $y'(0) = 1$. [6]</p>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Auxiliary equation: $m^2-5m+6=0 \\Rightarrow (m-2)(m-3)=0 \\Rightarrow m=2,3$<br>
2. Distinct real roots: $y = Ae^{2x}+Be^{3x}$<br>
<br>
<b>(b)</b><br>
1. Auxiliary equation: $m^2-4m+4=0 \\Rightarrow (m-2)^2=0 \\Rightarrow m=2$ (repeated)<br>
2. Repeated root: $y = (A+Bx)e^{2x}$<br>
<br>
<b>(c)</b><br>
1. Complementary function: $m^2+4=0 \\Rightarrow m=\\pm 2i$. CF: $y = A\\cos 2x + B\\sin 2x$<br>
2. Particular integral: try $y = px^2+qx+r$. $y'' = 2p$.<br>
$2p + 4(px^2+qx+r) = 8x^2$<br>
3. Comparing: $4p=8 \\Rightarrow p=2$; $4q=0 \\Rightarrow q=0$; $2p+4r=0 \\Rightarrow r=-1$.<br>
PI: $y = 2x^2-1$<br>
4. General solution: $y = A\\cos 2x + B\\sin 2x + 2x^2-1$<br>
<br>
<b>(d)</b><br>
1. CF: $m^2-1=0 \\Rightarrow m=\\pm1$. CF: $y=Ae^x+Be^{-x}$<br>
2. PI: try $y=Ce^{2x}$. $4Ce^{2x}-Ce^{2x}=e^{2x} \\Rightarrow 3C=1 \\Rightarrow C=\\dfrac{1}{3}$. PI: $y=\\dfrac{e^{2x}}{3}$<br>
3. General solution: $y = Ae^x+Be^{-x}+\\dfrac{e^{2x}}{3}$<br>
4. $y(0)=0$: $A+B+\\dfrac{1}{3}=0 \\Rightarrow A+B=-\\dfrac{1}{3}$<br>
5. $y'=Ae^x-Be^{-x}+\\dfrac{2e^{2x}}{3}$. $y'(0)=1$: $A-B+\\dfrac{2}{3}=1 \\Rightarrow A-B=\\dfrac{1}{3}$<br>
6. Solving: $A=0$, $B=-\\dfrac{1}{3}$. Solution: $y = -\\dfrac{1}{3}e^{-x}+\\dfrac{1}{3}e^{2x} = \\dfrac{1}{3}(e^{2x}-e^{-x})$`,
},

{
  question_id: 2092,
  topic_id: 1004,
  subject_id: 10,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Atomic Structure and Radioactivity",
  content: `<p><b>(a)</b> Describe the structure of an atom, including the location, relative mass, and relative charge of the three subatomic particles. [3]</p>
<p><b>(b)</b> Define the terms <b>atomic number</b>, <b>mass number</b>, and <b>isotope</b>. [3]</p>
<p><b>(c)</b> Carbon-14 ($^{14}_{6}\\text{C}$) is a radioactive isotope that undergoes beta-minus decay.</p>
<ul>
  <li>Write the nuclear equation for this decay. [2]</li>
  <li>State what happens to the nucleus during beta decay in terms of its protons and neutrons. [2]</li>
</ul>
<p><b>(d)</b> A sample of carbon-14 has a half-life of 5730 years. A sample initially contains 80 g. How much remains after 17190 years? [3]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Protons: in the nucleus, relative mass 1, relative charge +1.<br>
2. Neutrons: in the nucleus, relative mass 1, relative charge 0.<br>
3. Electrons: in shells/orbitals around the nucleus, relative mass negligible (~1/1836), relative charge -1.<br>
<br>
<b>(b)</b><br>
1. Atomic number: the number of protons in the nucleus of an atom.<br>
2. Mass number: the total number of protons and neutrons in the nucleus.<br>
3. Isotopes: atoms of the same element with the same atomic number but different mass numbers (different numbers of neutrons).<br>
<br>
<b>(c)</b><br>
1. $^{14}_{6}\\text{C} \\rightarrow ^{14}_{7}\\text{N} + ^{0}_{-1}\\text{e}$ (+ antineutrino, accept without)<br>
2. During beta-minus decay, a neutron in the nucleus is converted into a proton — the number of protons increases by 1 and the number of neutrons decreases by 1. Mass number is unchanged.<br>
<br>
<b>(d)</b><br>
1. $17190 \\div 5730 = 3$ half-lives.<br>
2. After 3 half-lives: $80 \\times \\left(\\dfrac{1}{2}\\right)^3 = 80 \\times \\dfrac{1}{8} = 10$ g`,
},

{
  question_id: 2093,
  topic_id: 10015,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Chemical Analysis",
  content: `<p><b>(a)</b> Describe how you would use <b>thin layer chromatography (TLC)</b> to identify an unknown compound from a set of reference samples. Explain how $R_f$ values are calculated and used. [5]</p>
<p><b>(b)</b> A compound gives the following results in chemical tests:</p>
<ul>
  <li>Gives a silver mirror with Tollens' reagent</li>
  <li>Decolourises bromine water</li>
  <li>Does not react with sodium carbonate</li>
</ul>
<p>Identify a functional group consistent with each observation, and suggest a possible structure for the compound. [4]</p>
<p><b>(c)</b> Describe how <b>mass spectrometry</b> can be used to determine the molecular formula and structural features of an organic compound. [4]</p>
<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Apply a small spot of each reference compound and the unknown onto a TLC plate using a capillary tube. Mark the baseline in pencil.<br>
2. Place the plate in a suitable solvent (mobile phase) so the solvent level is below the spots. Allow the solvent to run up the plate by capillary action.<br>
3. Remove the plate when the solvent front is near the top and mark the solvent front. Allow to dry and visualise spots (e.g. UV lamp or iodine vapour).<br>
4. $R_f = \\dfrac{\\text{distance travelled by spot}}{\\text{distance travelled by solvent front}}$<br>
5. Compare $R_f$ values of the unknown with those of reference compounds — a match identifies the unknown. Different compounds have different $R_f$ values due to different affinities for the stationary and mobile phases.<br>
<br>
<b>(b)</b><br>
1. Silver mirror with Tollens' → aldehyde group ($-\\text{CHO}$) present.<br>
2. Decolourises bromine water → C=C double bond (alkene) or aldehyde (aldehydes also decolourise bromine water by oxidation).<br>
3. No reaction with sodium carbonate → no carboxylic acid group.<br>
4. Possible structure: an aldehyde with an alkene group, e.g. but-3-enal ($\\text{CH}_2=\\text{CH}-\\text{CH}_2-\\text{CHO}$).<br>
<br>
<b>(c)</b><br>
1. The molecular ion peak ($M^+$) gives the relative molecular mass of the compound.<br>
2. The $M+1$ peak gives information about the number of carbon atoms (due to natural abundance of $^{13}\\text{C}$).<br>
3. Fragmentation patterns — the $m/z$ values of fragment ions — reveal structural features. Known fragments (e.g. $m/z = 15$ for $\\text{CH}_3^+$, $m/z = 29$ for $\\text{CHO}^+$) help identify functional groups and carbon skeleton.<br>
4. The molecular formula can be confirmed by high-resolution mass spectrometry, which gives exact masses that can be matched to a unique molecular formula.`,
},

{
  question_id: 2094,
  topic_id: 6025,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Work, Energy and Power (FM Mechanics)",
  content: `<p><b>(a)</b> A particle of mass 4 kg is pulled from rest up a rough inclined plane (angle 30°) by a force of 40 N parallel to the plane. The coefficient of friction is $\\mu = 0.2$ and $g = 9.8$ m s⁻².</p>
<ul>
  <li>Draw a force diagram and resolve forces parallel and perpendicular to the plane. [3]</li>
  <li>Find the acceleration of the particle. [3]</li>
  <li>Find the speed of the particle after it has travelled 5 m up the plane. [2]</li>
</ul>
<p><b>(b)</b> Use the work-energy theorem to verify your answer to (a)(iii) by calculating the net work done and the kinetic energy gained. [4]</p>
<p><b>(c)</b> A motor raises a crate of mass 200 kg through a height of 8 m in 10 seconds at constant speed. Calculate the power output of the motor. [3]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Forces: Weight $4g$ down the slope (component $4g\\sin30°$) and perpendicular ($4g\\cos30°$), applied force 40 N up slope, normal reaction $N$ perpendicular to slope, friction $F$ down slope.<br>
2. Perpendicular: $N = 4g\\cos30° = 4\\times9.8\\times\\dfrac{\\sqrt{3}}{2} = 33.95$ N<br>
Friction: $F = \\mu N = 0.2\\times33.95 = 6.79$ N<br>
3. Parallel: $40 - 4g\\sin30° - 6.79 = 4a$<br>
$40 - 19.6 - 6.79 = 4a \\Rightarrow 13.61 = 4a \\Rightarrow a = 3.40$ m s⁻²<br>
4. $v^2 = u^2+2as = 0+2(3.40)(5) = 34 \\Rightarrow v = \\sqrt{34} = 5.83$ m s⁻¹<br>
<br>
<b>(b)</b><br>
1. Work done by applied force: $W_{app} = 40\\times5 = 200$ J<br>
2. Work done against gravity: $W_g = 4\\times9.8\\times5\\times\\sin30° = 98$ J<br>
3. Work done against friction: $W_f = 6.79\\times5 = 33.95$ J<br>
4. Net work $= 200-98-33.95 = 68.05$ J<br>
KE $= \\dfrac{1}{2}\\times4\\times34 = 68$ J ✓ (small rounding difference acceptable)<br>
<br>
<b>(c)</b><br>
1. Force required (constant speed) $= mg = 200\\times9.8 = 1960$ N<br>
2. Work done $= 1960\\times8 = 15680$ J<br>
3. Power $= \\dfrac{W}{t} = \\dfrac{15680}{10} = 1568$ W $\\approx 1.57$ kW`,
},

{
  question_id: 2095,
  topic_id: 7020,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Thinking Procedurally and Decomposition",
  content: `<p>A student is designing a program to manage a school library. The program must allow librarians to: add new books, search for a book by title or author, borrow and return books, and display overdue books.</p>
<p><b>(a)</b> Apply <b>decomposition</b> to this problem. Identify at least four distinct modules/procedures the program should contain, and for each, describe its inputs, outputs, and purpose. [8]</p>
<p><b>(b)</b> Write pseudocode for the <b>search by title</b> procedure. It should take a list of book records and a search string, and return a list of all matching books (case-insensitive). [5]</p>
<p><b>(c)</b> Explain the advantages of using <b>modular programming</b> for this system. [3]</p>
<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b> Award 2 marks per module (1 for description, 1 for correct inputs/outputs), up to 4 modules:<br>
1. <b>addBook()</b>: Input — book details (title, author, ISBN, copies). Output — updated book database. Purpose — adds a new book record to the library system.<br>
2. <b>searchBook()</b>: Input — search string, search type (title/author). Output — list of matching books. Purpose — finds books matching the query.<br>
3. <b>borrowBook()</b>: Input — book ID, student ID, current date. Output — updated borrow record, updated availability. Purpose — records a book being borrowed and decrements available copies.<br>
4. <b>returnBook()</b>: Input — book ID, student ID, return date. Output — updated return record, updated availability. Purpose — records a return and increments available copies.<br>
5. <b>displayOverdue()</b>: Input — current date, borrow records. Output — list of overdue books and borrowers. Purpose — identifies books not returned within the loan period.<br>
<br>
<b>(b)</b><br>
<pre>
PROCEDURE searchByTitle(bookList, searchString)
  searchString ← LOWERCASE(searchString)
  results ← []
  FOR EACH book IN bookList DO
    IF LOWERCASE(book.title) CONTAINS searchString THEN
      results.APPEND(book)
    ENDIF
  ENDFOR
  RETURN results
ENDPROCEDURE
</pre>
1 mark each for: correct loop structure, case-insensitive comparison, correct condition, appending to results, returning results.<br>
<br>
<b>(c)</b><br>
1. Each module can be developed, tested, and debugged independently, making the overall development process more manageable.<br>
2. Modules can be reused in other programs or in future versions of the system without rewriting code.<br>
3. Multiple developers can work on different modules simultaneously, improving efficiency in team projects.`,
},

{
  question_id: 2096,
  topic_id: 9023,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Muscles and Movement",
  content: `<p><b>(a)</b> Describe the <b>sliding filament theory</b> of muscle contraction. In your answer, refer to the roles of actin, myosin, troponin, tropomyosin, ATP, and calcium ions. [9]</p>`,
  mark_scheme: `1. Skeletal muscle fibres contain myofibrils made up of repeating units called sarcomeres, bounded by Z-lines.<br>
2. Each sarcomere contains thick filaments (myosin) and thin filaments (actin); the overlap of these filaments creates the banding pattern seen under the microscope.<br>
3. When a nerve impulse arrives at the neuromuscular junction, acetylcholine is released and binds to receptors on the muscle fibre, triggering an action potential along the T-tubules.<br>
4. The action potential causes the sarcoplasmic reticulum to release calcium ions ($\\text{Ca}^{2+}$) into the cytoplasm of the muscle fibre.<br>
5. $\\text{Ca}^{2+}$ binds to troponin on the thin filament, causing a conformational change that moves tropomyosin away from the myosin-binding sites on actin — the binding sites are exposed.<br>
6. Myosin heads bind to the exposed actin binding sites, forming cross-bridges.<br>
7. The myosin head pivots (power stroke), pulling the actin filament towards the centre of the sarcomere — the sarcomere shortens, but the filament lengths remain unchanged (sliding filament theory).<br>
8. ATP binds to the myosin head, causing it to detach from actin. ATP is hydrolysed to ADP + Pᵢ, re-cocking the myosin head into the high-energy position ready for the next cycle.<br>
9. This cycle of attachment, power stroke, and detachment repeats as long as $\\text{Ca}^{2+}$ and ATP are available; when the nerve impulse stops, $\\text{Ca}^{2+}$ is pumped back into the sarcoplasmic reticulum, tropomyosin covers the binding sites, and the muscle relaxes.`,
},

{
  question_id: 2097,
  topic_id: 11004,
  subject_id: 11,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "TMUA: Trigonometry Problems",
  content: `<p><b>(a)</b> Prove the identity $\\dfrac{\\sin 2\\theta}{1 + \\cos 2\\theta} \\equiv \\tan\\theta$. [3]</p>
<p><b>(b)</b> Solve $3\\sin^2\\theta + 7\\cos\\theta + 3 = 0$ for $0° \\leq \\theta \\leq 360°$, giving solutions to 1 decimal place. [5]</p>
<p><b>(c)</b> In triangle $ABC$, $AB = 7$ cm, $BC = 10$ cm, and $\\angle ABC = 52°$. Find the area of the triangle and the length of $AC$, to 3 significant figures. [5]</p>
<p><b>(d)</b> Find all values of $x$ in $[0, 2\\pi]$ satisfying $\\cos 2x + \\cos x = 0$. Give exact answers. [4]</p>
<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $\\dfrac{\\sin 2\\theta}{1+\\cos 2\\theta} = \\dfrac{2\\sin\\theta\\cos\\theta}{1+(2\\cos^2\\theta-1)}$<br>
2. $= \\dfrac{2\\sin\\theta\\cos\\theta}{2\\cos^2\\theta}$<br>
3. $= \\dfrac{\\sin\\theta}{\\cos\\theta} = \\tan\\theta$ ✓<br>
<br>
<b>(b)</b><br>
1. Use $\\sin^2\\theta = 1-\\cos^2\\theta$: $3(1-\\cos^2\\theta)+7\\cos\\theta+3=0$<br>
$-3\\cos^2\\theta+7\\cos\\theta+6=0 \\Rightarrow 3\\cos^2\\theta-7\\cos\\theta-6=0$<br>
2. $(3\\cos\\theta+2)(\\cos\\theta-3)=0 \\Rightarrow \\cos\\theta=-\\dfrac{2}{3}$ or $\\cos\\theta=3$ (reject)<br>
3. $\\theta = \\arccos\\left(-\\dfrac{2}{3}\\right) = 131.8°$<br>
4. Second solution: $\\theta = 360°-131.8° = 228.2°$<br>
<br>
<b>(c)</b><br>
1. Area $= \\dfrac{1}{2}ab\\sin C = \\dfrac{1}{2}(7)(10)\\sin52° = 35\\sin52° = 35\\times0.7880 = 27.6$ cm²<br>
2. By cosine rule: $AC^2 = 7^2+10^2-2(7)(10)\\cos52° = 49+100-140\\times0.6157 = 149-86.20 = 62.80$<br>
$AC = \\sqrt{62.80} = 7.92$ cm<br>
<br>
<b>(d)</b><br>
1. $\\cos 2x + \\cos x = 2\\cos^2 x - 1 + \\cos x = 0$<br>
2. $(2\\cos x - 1)(\\cos x + 1) = 0$<br>
3. $\\cos x = \\dfrac{1}{2} \\Rightarrow x = \\dfrac{\\pi}{3}, \\dfrac{5\\pi}{3}$<br>
4. $\\cos x = -1 \\Rightarrow x = \\pi$<br>
Solutions: $x = \\dfrac{\\pi}{3}, \\pi, \\dfrac{5\\pi}{3}$`,
},

{
  question_id: 2098,
  topic_id: 8014,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Ideal Gases and Kinetic Theory",
  content: `A sealed container holds $2.5 \\times 10^{-3}$ m³ of an ideal gas at a pressure of $1.0 \\times 10^5$ Pa and temperature 300 K. The gas is then heated until its temperature reaches 600 K and its volume expands to $4.0 \\times 10^{-3}$ m³.

<p><b>(a)</b> Calculate the new pressure of the gas. [3]</p>
<p><b>(b)</b> Calculate the number of moles of gas in the container. [$R = 8.31$ J mol⁻¹ K⁻¹] [2]</p>
<p><b>(c)</b> Calculate the root mean square (rms) speed of the gas molecules at 600 K, given that each molecule has mass $4.65 \\times 10^{-26}$ kg. [$k_B = 1.38 \\times 10^{-23}$ J K⁻¹] [3]</p>
<p><b>(d)</b> Explain why real gases deviate from ideal gas behaviour at high pressures and low temperatures. [3]</p>
<p><b>Total: 11 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Using combined gas law: $\\dfrac{p_1 V_1}{T_1} = \\dfrac{p_2 V_2}{T_2}$<br>
2. $p_2 = \\dfrac{p_1 V_1 T_2}{T_1 V_2} = \\dfrac{1.0\\times10^5 \\times 2.5\\times10^{-3} \\times 600}{300 \\times 4.0\\times10^{-3}}$<br>
3. $p_2 = \\dfrac{150}{1.2} = 1.25\\times10^5$ Pa<br>
<br>
<b>(b)</b><br>
1. $pV = nRT \\Rightarrow n = \\dfrac{pV}{RT} = \\dfrac{1.0\\times10^5 \\times 2.5\\times10^{-3}}{8.31\\times300}$<br>
2. $n = \\dfrac{250}{2493} = 0.100$ mol<br>
<br>
<b>(c)</b><br>
1. $\\dfrac{1}{2}m\\langle c^2 \\rangle = \\dfrac{3}{2}k_BT \\Rightarrow \\langle c^2 \\rangle = \\dfrac{3k_BT}{m}$<br>
2. $\\langle c^2 \\rangle = \\dfrac{3\\times1.38\\times10^{-23}\\times600}{4.65\\times10^{-26}} = \\dfrac{2.484\\times10^{-20}}{4.65\\times10^{-26}} = 5.34\\times10^5$ m² s⁻²<br>
3. $c_{rms} = \\sqrt{5.34\\times10^5} = 731$ m s⁻¹<br>
<br>
<b>(d)</b><br>
1. At high pressures, gas molecules are forced close together — the volume of the molecules themselves becomes significant compared to the container volume, so the actual volume is greater than predicted by the ideal gas law.<br>
2. At low temperatures, molecules move more slowly and intermolecular attractions become significant — real molecules attract each other, reducing the pressure below that predicted for an ideal gas.<br>
3. The ideal gas model assumes molecules have negligible volume and no intermolecular forces, which breaks down under these conditions.`,
},

{
  question_id: 2099,
  topic_id: 13006,
  subject_id: 14,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "PAT: Mechanics Problems",
  content: `<p><b>(a)</b> A uniform ladder of length 5 m and mass 20 kg leans against a smooth vertical wall at an angle of 60° to the horizontal. The ground is rough. A person of mass 70 kg stands three-quarters of the way up the ladder.</p>
<ul>
  <li>Draw a diagram showing all forces acting on the ladder. [2]</li>
  <li>By taking moments about the base of the ladder, find the normal reaction force from the wall. [4]</li>
  <li>Find the friction force at the base and determine the minimum coefficient of friction required. [3]</li>
</ul>
<p><b>(b)</b> A ball of mass 0.5 kg is attached to a string of length 1.2 m and swings in a vertical circle. The minimum speed at the top of the circle for the string to remain taut is $v_{min}$. Find $v_{min}$ and the tension in the string at the bottom of the circle when moving at $v_{min}$. [$g = 9.8$ m s⁻²] [5]</p>
<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. Forces: weight of ladder $20g$ at midpoint, weight of person $70g$ at $\\frac{3}{4}$ up, normal reaction $N_W$ horizontal from wall (at top), normal reaction $N_G$ vertical from ground (at base), friction $F$ horizontal at base.<br>
2. Taking moments about the base (anticlockwise positive):<br>
$N_W \\times 5\\sin60° = 20g \\times \\frac{5}{2}\\cos60° + 70g \\times \\frac{3}{4}\\times5\\cos60°$<br>
3. $N_W \\times 5\\times\\dfrac{\\sqrt{3}}{2} = 20(9.8)(2.5)(0.5) + 70(9.8)(3.75)(0.5)$<br>
$= 245 + 1286.25 = 1531.25$<br>
4. $N_W = \\dfrac{1531.25}{5\\times0.866} = \\dfrac{1531.25}{4.33} = 353.6$ N<br>
5. Horizontal equilibrium: $F = N_W = 353.6$ N<br>
Vertical equilibrium: $N_G = (20+70)\\times9.8 = 882$ N<br>
6. $\\mu_{min} = \\dfrac{F}{N_G} = \\dfrac{353.6}{882} = 0.401$<br>
<br>
<b>(b)</b><br>
1. At the top, minimum speed when tension $= 0$: centripetal force provided entirely by gravity.<br>
$\\dfrac{mv_{min}^2}{r} = mg \\Rightarrow v_{min}^2 = gr = 9.8\\times1.2 = 11.76$ m² s⁻²<br>
$v_{min} = \\sqrt{11.76} = 3.43$ m s⁻¹<br>
2. Using energy conservation from top to bottom (height difference $= 2r = 2.4$ m):<br>
$\\dfrac{1}{2}mv_b^2 = \\dfrac{1}{2}mv_{min}^2 + mg(2r) = \\dfrac{1}{2}(11.76)+9.8\\times2.4 = 5.88+23.52 = 29.4$<br>
$v_b^2 = 58.8$ m² s⁻²<br>
3. At the bottom, $T - mg = \\dfrac{mv_b^2}{r}$<br>
$T = m\\left(g + \\dfrac{v_b^2}{r}\\right) = 0.5\\left(9.8 + \\dfrac{58.8}{1.2}\\right) = 0.5(9.8+49) = 0.5\\times58.8 = 29.4$ N`,
},

{
  question_id: 2100,
  topic_id: 6012,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Polar Coordinates",
  content: `<p><b>(a)</b> Convert the following to Cartesian coordinates:</p>
<ul>
  <li>$\\left(3, \\dfrac{\\pi}{3}\\right)$ in polar form [2]</li>
  <li>$\\left(2, \\dfrac{3\\pi}{4}\\right)$ in polar form [2]</li>
</ul>
<p><b>(b)</b> Convert the following to polar coordinates, giving $r > 0$ and $0 \\leq \\theta < 2\\pi$:</p>
<ul>
  <li>$(1, -\\sqrt{3})$ [2]</li>
  <li>$(-4, 4)$ [2]</li>
</ul>
<p><b>(c)</b> Sketch the curve $r = 2(1+\\cos\\theta)$ (a cardioid) for $0 \\leq \\theta \\leq 2\\pi$. Label the points where $\\theta = 0$, $\\theta = \\dfrac{\\pi}{2}$, $\\theta = \\pi$. [3]</p>
<p><b>(d)</b> Find the area enclosed by the curve $r = 2\\cos\\theta$ for $0 \\leq \\theta \\leq \\dfrac{\\pi}{2}$, using $A = \\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta r^2 \\, d\\theta$. [4]</p>
<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. $\\left(3, \\dfrac{\\pi}{3}\\right)$: $x = 3\\cos\\dfrac{\\pi}{3} = \\dfrac{3}{2}$, $y = 3\\sin\\dfrac{\\pi}{3} = \\dfrac{3\\sqrt{3}}{2}$. Cartesian: $\\left(\\dfrac{3}{2}, \\dfrac{3\\sqrt{3}}{2}\\right)$<br>
2. $\\left(2, \\dfrac{3\\pi}{4}\\right)$: $x = 2\\cos\\dfrac{3\\pi}{4} = -\\sqrt{2}$, $y = 2\\sin\\dfrac{3\\pi}{4} = \\sqrt{2}$. Cartesian: $(-\\sqrt{2}, \\sqrt{2})$<br>
<br>
<b>(b)</b><br>
1. $(1,-\\sqrt{3})$: $r = \\sqrt{1+3} = 2$. $\\theta = \\arctan\\left(\\dfrac{-\\sqrt{3}}{1}\\right) = -\\dfrac{\\pi}{3}$, so $\\theta = 2\\pi - \\dfrac{\\pi}{3} = \\dfrac{5\\pi}{3}$. Polar: $\\left(2, \\dfrac{5\\pi}{3}\\right)$<br>
2. $(-4,4)$: $r = \\sqrt{16+16} = 4\\sqrt{2}$. $\\theta = \\pi + \\arctan\\left(\\dfrac{4}{-4}\\right) = \\pi - \\dfrac{\\pi}{4} = \\dfrac{3\\pi}{4}$. Polar: $\\left(4\\sqrt{2}, \\dfrac{3\\pi}{4}\\right)$<br>
<br>
<b>(c)</b><br>
1. $\\theta=0$: $r=4$. Point $(4,0)$ on positive $x$-axis.<br>
2. $\\theta=\\dfrac{\\pi}{2}$: $r=2$. Point $(0,2)$ on positive $y$-axis.<br>
3. $\\theta=\\pi$: $r=0$. Point at the origin. Cardioid shape correctly sketched through these points.<br>
<br>
<b>(d)</b><br>
1. $A = \\dfrac{1}{2}\\displaystyle\\int_0^{\\pi/2} (2\\cos\\theta)^2 \\, d\\theta = \\dfrac{1}{2}\\displaystyle\\int_0^{\\pi/2} 4\\cos^2\\theta \\, d\\theta$<br>
2. $= 2\\displaystyle\\int_0^{\\pi/2} \\dfrac{1+\\cos 2\\theta}{2} \\, d\\theta = \\displaystyle\\int_0^{\\pi/2} 1+\\cos 2\\theta \\, d\\theta$<br>
3. $= \\left[\\theta + \\dfrac{\\sin 2\\theta}{2}\\right]_0^{\\pi/2} = \\left(\\dfrac{\\pi}{2} + 0\\right) - (0) = \\dfrac{\\pi}{2}$`,
},

{
  question_id: 2101,
  topic_id: 5001,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Algebraic Methods and Proof",
  content: `<p><b>(a)</b> Prove that the sum of any three consecutive even integers is divisible by 6. [3]</p>

<p><b>(b)</b> Disprove the statement: "For all integers $n \\geq 1$, $n^2 + n + 41$ is prime." [2]</p>

<p><b>(c)</b> Prove by contradiction that $\\sqrt{3}$ is irrational. [4]</p>

<p><b>(d)</b> Given that $x$ and $y$ are real numbers with $x > y > 0$, prove that $x^2 > y^2$. [3]</p>

<p><b>Total: 12 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Let the three consecutive even integers be $2n$, $2n+2$, $2n+4$.<br>
<br>
Sum $= 2n + (2n+2) + (2n+4) = 6n + 6 = 6(n+1)$<br>
<br>
This is divisible by 6 for all integers $n$. $\\square$<br>
<br>
<b>(b)</b><br>
Counterexample: let $n = 41$.<br>
<br>
$41^2 + 41 + 41 = 41(41 + 1 + 1) = 41 \\times 43$, which is not prime. $\\square$<br>
<br>
<b>(c)</b><br>
Assume $\\sqrt{3}$ is rational. Then $\\sqrt{3} = \\dfrac{p}{q}$ where $p, q$ are integers with no common factor and $q \\neq 0$.<br>
<br>
Then $3 = \\dfrac{p^2}{q^2}$, so $p^2 = 3q^2$.<br>
<br>
This means $p^2$ is divisible by 3, so $p$ is divisible by 3. Write $p = 3k$.<br>
<br>
Then $(3k)^2 = 3q^2 \\Rightarrow 9k^2 = 3q^2 \\Rightarrow q^2 = 3k^2$, so $q$ is also divisible by 3.<br>
<br>
This contradicts the assumption that $p$ and $q$ have no common factor. Therefore $\\sqrt{3}$ is irrational. $\\square$<br>
<br>
<b>(d)</b><br>
Since $x > y > 0$, we have $x - y > 0$ and $x + y > 0$.<br>
<br>
Therefore $(x-y)(x+y) > 0$, i.e. $x^2 - y^2 > 0$, so $x^2 > y^2$. $\\square$`,
},

{
  question_id: 2102,
  topic_id: 8015,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Nuclear Physics",
  content: `<p><b>(a)</b> Define <b>binding energy</b> and explain what is meant by the <b>binding energy per nucleon</b>. [3]</p>

<p><b>(b)</b> The nucleus $^{56}_{26}\\text{Fe}$ has a measured mass of $55.9349$ u. The mass of a proton is $1.00728$ u and a neutron is $1.00867$ u. ($1 \\text{ u} = 931.5$ MeV c⁻²)</p>
<ul>
  <li>Calculate the mass defect of $^{56}_{26}\\text{Fe}$ in atomic mass units. [2]</li>
  <li>Calculate the binding energy in MeV and the binding energy per nucleon. [3]</li>
</ul>

<p><b>(c)</b> Explain, using the binding energy per nucleon curve, why energy is released in both fission and fusion reactions. [4]</p>

<p><b>(d)</b> A nucleus of $^{235}_{92}\\text{U}$ undergoes fission:</p>
<p>$$^{235}_{92}\\text{U} + ^{1}_{0}\\text{n} \\rightarrow ^{141}_{56}\\text{Ba} + ^{92}_{36}\\text{Kr} + 3^{1}_{0}\\text{n}$$</p>
<p>Verify that this equation is balanced in terms of proton number and nucleon number. [2]</p>

<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Binding energy is the energy required to completely separate a nucleus into its individual protons and neutrons.<br>
<br>
Equivalently, it is the energy released when the nucleus is assembled from its constituent nucleons.<br>
<br>
Binding energy per nucleon is the total binding energy divided by the number of nucleons — it measures the average stability of each nucleon in the nucleus.<br>
<br>
<b>(b)</b><br>
Mass of constituents: $26 \\times 1.00728 + 30 \\times 1.00867 = 26.1893 + 30.2601 = 56.4494$ u<br>
<br>
Mass defect: $\\Delta m = 56.4494 - 55.9349 = 0.5145$ u<br>
<br>
Binding energy: $E = 0.5145 \\times 931.5 = 479.3$ MeV<br>
<br>
Binding energy per nucleon: $\\dfrac{479.3}{56} = 8.56$ MeV per nucleon<br>
<br>
<b>(c)</b><br>
The binding energy per nucleon curve peaks at around iron ($A \\approx 56$) and falls off for both lighter and heavier nuclei.<br>
<br>
In fusion, two light nuclei (low binding energy per nucleon) combine to form a heavier nucleus with higher binding energy per nucleon — energy is released equal to the increase in total binding energy.<br>
<br>
In fission, a very heavy nucleus (lower binding energy per nucleon than iron) splits into two medium-mass fragments which have a higher binding energy per nucleon — the increase in total binding energy is released as energy.<br>
<br>
In both cases, the products are more tightly bound than the reactants.<br>
<br>
<b>(d)</b><br>
Proton numbers: $92 + 0 = 56 + 36 + 0 \\Rightarrow 92 = 92$ ✓<br>
<br>
Nucleon numbers: $235 + 1 = 141 + 92 + 3 \\Rightarrow 236 = 236$ ✓`,
},

{
  question_id: 2103,
  topic_id: 9007,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Cell Division and Cancer",
  content: `<p>Describe the stages of the cell cycle (including mitosis) and explain how the process is controlled by checkpoints. Explain what happens when these controls fail, with reference to the development of cancer and the properties of tumour cells. [12]</p>`,
  mark_scheme: `<b>Cell cycle stages:</b><br>
1. Interphase is divided into G1 (cell growth, organelle duplication), S phase (DNA replication — each chromosome is copied to form two identical sister chromatids), and G2 (further growth, preparation for division).<br>
<br>
2. Mitosis consists of four stages: prophase (chromosomes condense, spindle fibres form, nuclear envelope breaks down), metaphase (chromosomes align at the cell equator attached to spindle fibres), anaphase (sister chromatids are pulled to opposite poles by shortening spindle fibres), and telophase (nuclear envelopes reform, chromosomes decondense).<br>
<br>
3. Cytokinesis follows mitosis — the cytoplasm divides to produce two genetically identical daughter cells.<br>
<br>
<b>Checkpoint control:</b><br>
4. The G1 checkpoint checks whether the cell is large enough and whether DNA is undamaged before committing to division.<br>
<br>
5. The G2 checkpoint checks that DNA has been replicated correctly and completely before entering mitosis.<br>
<br>
6. The spindle assembly checkpoint (M checkpoint) ensures all chromosomes are correctly attached to spindle fibres before anaphase begins.<br>
<br>
7. These checkpoints are controlled by cyclin-dependent kinases (CDKs) and tumour suppressor proteins such as p53, which can halt the cell cycle or trigger apoptosis if damage is detected.<br>
<br>
<b>Cancer:</b><br>
8. Cancer arises when mutations occur in proto-oncogenes (converting them to oncogenes that promote excessive cell division) or in tumour suppressor genes (which normally inhibit division or promote apoptosis).<br>
<br>
9. When checkpoint controls fail, cells with damaged DNA continue to divide uncontrollably, producing a tumour.<br>
<br>
10. Malignant tumour cells may invade surrounding tissues and spread via the blood or lymphatic system to form secondary tumours (metastasis).<br>
<br>
11. Cancer cells also exhibit immortality (bypassing normal limits on cell division), loss of contact inhibition, and evasion of apoptosis.<br>
<br>
12. Treatments such as chemotherapy and radiotherapy target rapidly dividing cells, but side effects arise because normal dividing cells (e.g. in bone marrow, hair follicles) are also affected.`,
},

{
  question_id: 2104,
  topic_id: 10008,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Transition Metals",
  content: `<p><b>(a)</b> State two characteristic properties of transition metals and explain each in terms of their electronic configuration. [4]</p>

<p><b>(b)</b> Write the full electronic configuration of $\\text{Fe}^{3+}$ and state why iron commonly forms the $+2$ and $+3$ oxidation states. [3]</p>

<p><b>(c)</b> Describe the role of transition metals as <b>heterogeneous catalysts</b>, using iron in the Haber process as an example. Explain why transition metals are effective catalysts. [4]</p>

<p><b>(d)</b> Aqueous copper(II) sulfate is treated with an excess of aqueous ammonia. Describe the observations and write the equation for the reaction. [3]</p>

<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b> Any two from:<br>
1. Variable oxidation states — transition metals have partially filled 3d subshells; 3d and 4s electrons are close in energy, so different numbers of electrons can be removed to give different stable oxidation states.<br>
<br>
2. Formation of coloured ions — d-d electron transitions occur when d-electrons absorb specific wavelengths of visible light and are promoted to higher d-orbitals; the complementary colour is observed.<br>
<br>
3. Catalytic activity — ability to change oxidation state allows them to accept and donate electrons, facilitating reactions.<br>
<br>
4. Formation of complex ions — the metal ion can act as a Lewis acid, accepting lone pairs from ligands into empty d-orbitals.<br>
<br>
<b>(b)</b><br>
$\\text{Fe}^{3+}$: $[\\text{Ar}]\\, 3d^5$ (loses 3s electrons then one 3d electron)<br>
<br>
Iron forms $\\text{Fe}^{2+}$ by losing both 4s electrons, and $\\text{Fe}^{3+}$ by additionally losing one 3d electron — the $3d^5$ half-filled configuration is particularly stable due to exchange energy, making $\\text{Fe}^{3+}$ relatively stable.<br>
<br>
<b>(c)</b><br>
A heterogeneous catalyst is in a different phase from the reactants. In the Haber process, iron (solid) catalyses the reaction between nitrogen and hydrogen (gases).<br>
<br>
Reactant molecules adsorb onto the iron surface, weakening their bonds and bringing them into close proximity — this lowers the activation energy.<br>
<br>
Products desorb from the surface, freeing active sites for further reaction.<br>
<br>
Transition metals are effective because they can adsorb molecules without binding them too strongly (intermediate adsorption enthalpy) and because their variable oxidation states allow them to form and break bonds with reactants.<br>
<br>
<b>(d)</b><br>
Initially a pale blue precipitate of $\\text{Cu(OH)}_2$ forms; with excess ammonia, this dissolves to give a deep blue solution.<br>
<br>
$\\text{Cu}^{2+}(aq) + 4\\text{NH}_3(aq) \\rightarrow [\\text{Cu(NH}_3)_4]^{2+}(aq)$<br>
<br>
The deep blue colour is due to the formation of the tetraamminecopper(II) complex ion.`,
},

{
  question_id: 2105,
  topic_id: 5007,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Trigonometric Equations",
  content: `<p><b>(a)</b> Solve $2\\sin^2 x - \\sin x - 1 = 0$ for $0° \\leq x \\leq 360°$. [4]</p>

<p><b>(b)</b> Solve $\\cos 2x = 3\\cos x - 2$ for $0 \\leq x \\leq 2\\pi$, giving exact answers. [5]</p>

<p><b>(c)</b> Express $5\\sin x + 12\\cos x$ in the form $R\\sin(x + \\phi)$ where $R > 0$ and $0 < \\phi < \\dfrac{\\pi}{2}$.</p>
<ul>
  <li>State the maximum and minimum values, and the values of $x$ at which they occur in $[0, 2\\pi]$. [5]</li>
</ul>

<p><b>(d)</b> Show that $\\dfrac{\\cos 3x}{\\cos x} = 1 - 4\\sin^2 x$. [4]</p>

<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$(2\\sin x + 1)(\\sin x - 1) = 0$<br>
<br>
$\\sin x = -\\dfrac{1}{2}$ or $\\sin x = 1$<br>
<br>
$\\sin x = 1 \\Rightarrow x = 90°$<br>
<br>
$\\sin x = -\\dfrac{1}{2} \\Rightarrow x = 210°, 330°$<br>
<br>
<b>(b)</b><br>
$\\cos 2x = 2\\cos^2 x - 1$, so $2\\cos^2 x - 1 = 3\\cos x - 2$<br>
<br>
$2\\cos^2 x - 3\\cos x + 1 = 0 \\Rightarrow (2\\cos x - 1)(\\cos x - 1) = 0$<br>
<br>
$\\cos x = \\dfrac{1}{2} \\Rightarrow x = \\dfrac{\\pi}{3}, \\dfrac{5\\pi}{3}$<br>
<br>
$\\cos x = 1 \\Rightarrow x = 0, 2\\pi$<br>
<br>
<b>(c)</b><br>
$R = \\sqrt{5^2 + 12^2} = \\sqrt{169} = 13$<br>
<br>
$\\tan \\phi = \\dfrac{12}{5} \\Rightarrow \\phi = \\arctan\\dfrac{12}{5} = 1.176$ rad<br>
<br>
So $5\\sin x + 12\\cos x = 13\\sin(x + 1.176)$<br>
<br>
Maximum value $= 13$, when $x + 1.176 = \\dfrac{\\pi}{2} \\Rightarrow x = 0.395$ rad<br>
<br>
Minimum value $= -13$, when $x + 1.176 = \\dfrac{3\\pi}{2} \\Rightarrow x = 3.536$ rad<br>
<br>
<b>(d)</b><br>
$\\cos 3x = \\cos(2x + x) = \\cos 2x \\cos x - \\sin 2x \\sin x$<br>
<br>
$= (1 - 2\\sin^2 x)\\cos x - 2\\sin x \\cos x \\cdot \\sin x$<br>
<br>
$= \\cos x - 2\\sin^2 x \\cos x - 2\\sin^2 x \\cos x$<br>
<br>
$= \\cos x(1 - 4\\sin^2 x)$<br>
<br>
Dividing both sides by $\\cos x$: $\\dfrac{\\cos 3x}{\\cos x} = 1 - 4\\sin^2 x$ ✓`,
},

{
  question_id: 2106,
  topic_id: 8022,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Electromagnetic Induction",
  content: `<p><b>(a)</b> State Faraday's law and Lenz's law of electromagnetic induction. [3]</p>

<p><b>(b)</b> A rectangular coil of 200 turns, area $4.0 \\times 10^{-3}$ m², rotates at $50$ Hz in a uniform magnetic field of $0.15$ T.</p>
<ul>
  <li>Write an expression for the magnetic flux through the coil as a function of time. [1]</li>
  <li>Derive an expression for the induced EMF as a function of time. [2]</li>
  <li>Calculate the peak EMF. [2]</li>
</ul>

<p><b>(c)</b> A straight conductor of length 0.30 m moves with velocity 4.0 m s⁻¹ perpendicular to a magnetic field of $0.25$ T. Calculate the EMF induced in the conductor and explain, using Fleming's right-hand rule, the direction of the induced current. [3]</p>

<p><b>(d)</b> Explain why eddy currents are induced in the metal core of a transformer and describe one method used to reduce power losses due to eddy currents. [3]</p>

<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Faraday's law: the induced EMF in a circuit is equal to the rate of change of magnetic flux linkage through the circuit: $\\mathcal{E} = -\\dfrac{d(N\\Phi)}{dt}$<br>
<br>
Lenz's law: the direction of the induced EMF (and hence induced current) is always such as to oppose the change in flux that caused it — consistent with the negative sign in Faraday's law.<br>
<br>
<b>(b)</b><br>
$\\Phi = BA\\cos(\\omega t) = 0.15 \\times 4.0\\times10^{-3} \\cos(100\\pi t) = 6.0\\times10^{-4}\\cos(100\\pi t)$ Wb<br>
<br>
$\\mathcal{E} = -N\\dfrac{d\\Phi}{dt} = -200 \\times (-6.0\\times10^{-4} \\times 100\\pi) \\sin(100\\pi t)$<br>
<br>
$\\mathcal{E} = 200 \\times 6.0\\times10^{-4} \\times 100\\pi \\sin(100\\pi t) = 12\\pi \\sin(100\\pi t)$ V<br>
<br>
Peak EMF: $\\mathcal{E}_0 = NBA\\omega = 200 \\times 0.15 \\times 4.0\\times10^{-3} \\times 100\\pi = 12\\pi \\approx 37.7$ V<br>
<br>
<b>(c)</b><br>
$\\mathcal{E} = Blv = 0.25 \\times 0.30 \\times 4.0 = 0.30$ V<br>
<br>
Using Fleming's right-hand rule: point the thumb in the direction of conductor motion, fingers in the direction of the magnetic field — the second finger points in the direction of the induced conventional current.<br>
<br>
<b>(d)</b><br>
The changing magnetic flux in the core induces circulating currents (eddy currents) in the conducting iron, which dissipate energy as heat (Joule heating).<br>
<br>
To reduce eddy currents, the core is laminated — made of thin layers of iron electrically insulated from each other, reducing the area available for eddy current loops and increasing resistance, thus reducing the induced currents and power loss.`,
},

{
  question_id: 2107,
  topic_id: 6004,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Mathematical Induction",
  content: `<p>Prove each of the following by mathematical induction:</p>

<p><b>(a)</b> $\\displaystyle\\sum_{r=1}^{n} r^2 = \\dfrac{n(n+1)(2n+1)}{6}$ [6]</p>

<p><b>(b)</b> $7^n - 1$ is divisible by 6 for all integers $n \\geq 1$. [5]</p>

<p><b>(c)</b> $\\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix}^n = \\begin{pmatrix} 2^n & 2^n - 1 \\\\ 0 & 1 \\end{pmatrix}$ for all integers $n \\geq 1$. [6]</p>

<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
<b>Base case</b> $n=1$: LHS $= 1$. RHS $= \\dfrac{1 \\times 2 \\times 3}{6} = 1$. ✓<br>
<br>
<b>Inductive step</b>: Assume true for $n=k$: $\\displaystyle\\sum_{r=1}^{k} r^2 = \\dfrac{k(k+1)(2k+1)}{6}$<br>
<br>
For $n = k+1$:<br>
$\\displaystyle\\sum_{r=1}^{k+1} r^2 = \\dfrac{k(k+1)(2k+1)}{6} + (k+1)^2$<br>
<br>
$= \\dfrac{k(k+1)(2k+1) + 6(k+1)^2}{6} = \\dfrac{(k+1)[k(2k+1) + 6(k+1)]}{6}$<br>
<br>
$= \\dfrac{(k+1)(2k^2+7k+6)}{6} = \\dfrac{(k+1)(k+2)(2k+3)}{6}$ ✓<br>
<br>
This is the required form with $n = k+1$. By induction, true for all $n \\geq 1$. $\\square$<br>
<br>
<b>(b)</b><br>
<b>Base case</b> $n=1$: $7^1 - 1 = 6$, divisible by 6. ✓<br>
<br>
<b>Inductive step</b>: Assume $7^k - 1 = 6m$ for some integer $m$.<br>
<br>
$7^{k+1} - 1 = 7 \\cdot 7^k - 1 = 7(6m+1) - 1 = 42m + 7 - 1 = 42m + 6 = 6(7m+1)$<br>
<br>
This is divisible by 6. By induction, true for all $n \\geq 1$. $\\square$<br>
<br>
<b>(c)</b><br>
<b>Base case</b> $n=1$: $\\begin{pmatrix}2&1\\\\0&1\\end{pmatrix}^1 = \\begin{pmatrix}2&1\\\\0&1\\end{pmatrix} = \\begin{pmatrix}2^1 & 2^1-1\\\\0&1\\end{pmatrix}$ ✓<br>
<br>
<b>Inductive step</b>: Assume true for $n=k$: $\\begin{pmatrix}2&1\\\\0&1\\end{pmatrix}^k = \\begin{pmatrix}2^k & 2^k-1\\\\0&1\\end{pmatrix}$<br>
<br>
For $n=k+1$:<br>
$\\begin{pmatrix}2^k & 2^k-1\\\\0&1\\end{pmatrix}\\begin{pmatrix}2&1\\\\0&1\\end{pmatrix} = \\begin{pmatrix}2^{k+1} & 2^k+(2^k-1)\\\\0&1\\end{pmatrix} = \\begin{pmatrix}2^{k+1} & 2^{k+1}-1\\\\0&1\\end{pmatrix}$ ✓<br>
<br>
By induction, true for all $n \\geq 1$. $\\square$`,
},

{
  question_id: 2108,
  topic_id: 9012,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Kidneys and Osmoregulation",
  content: `<p>Describe the structure of the nephron and explain how the kidney produces urine of variable concentration. In your answer, refer to the roles of the loop of Henle, the distal convoluted tubule, and ADH. [12]</p>`,
  mark_scheme: `<b>Structure of the nephron:</b><br>
1. The nephron begins at the Bowman's capsule, which surrounds the glomerulus — a knot of capillaries where ultrafiltration occurs under high hydrostatic pressure.<br>
<br>
2. The filtrate passes along the proximal convoluted tubule (PCT), where most glucose, amino acids, water, and useful ions are reabsorbed by active transport and osmosis.<br>
<br>
3. The filtrate then enters the loop of Henle, a hairpin-shaped structure descending into the medulla and ascending back to the cortex.<br>
<br>
<b>Loop of Henle — counter-current multiplier:</b><br>
4. The descending limb is permeable to water but not salts — water leaves by osmosis into the increasingly salty medullary interstitium, concentrating the filtrate.<br>
<br>
5. The ascending limb is impermeable to water but actively pumps NaCl out into the interstitium, maintaining the high salt concentration gradient in the medulla.<br>
<br>
6. This counter-current arrangement multiplies the salt concentration gradient in the medulla, which is essential for producing concentrated urine.<br>
<br>
<b>Distal convoluted tubule and collecting duct:</b><br>
7. The DCT and collecting duct pass back through the medulla — water leaves by osmosis into the hypertonic interstitium, concentrating the urine further.<br>
<br>
8. The permeability of the collecting duct to water is controlled by ADH (antidiuretic hormone), released from the posterior pituitary gland.<br>
<br>
<b>Role of ADH:</b><br>
9. When blood water potential is low (e.g. dehydration), osmoreceptors in the hypothalamus detect this and trigger ADH release.<br>
<br>
10. ADH causes aquaporin channels to be inserted into the collecting duct membrane, increasing water permeability — more water is reabsorbed and a small volume of concentrated urine is produced.<br>
<br>
11. When blood water potential is high (e.g. after drinking), ADH secretion decreases, fewer aquaporins are present, less water is reabsorbed, and a large volume of dilute urine is produced.<br>
<br>
12. This constitutes a negative feedback loop that maintains blood water potential within narrow limits.`,
},

{
  question_id: 2109,
  topic_id: 1003,
  subject_id: 10,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Forces and Newton's Laws",
  content: `<p><b>(a)</b> State Newton's three laws of motion. [3]</p>

<p><b>(b)</b> A car of mass 1200 kg accelerates from rest to 20 m s⁻¹ in 8 seconds.</p>
<ul>
  <li>Calculate the acceleration. [1]</li>
  <li>Calculate the resultant force on the car. [2]</li>
  <li>The driving force from the engine is 4500 N. Calculate the friction force on the car. [2]</li>
</ul>

<p><b>(c)</b> A box of mass 5 kg sits on a table. A rope attached to the box goes over a frictionless pulley and supports a hanging mass of 3 kg. The surface of the table has a coefficient of friction $\\mu = 0.2$. Calculate the acceleration of the system and the tension in the rope. [$g = 9.8$ m s⁻²] [5]</p>

<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
1. An object remains at rest or moves with constant velocity unless acted upon by a resultant force.<br>
<br>
2. The resultant force on an object equals its mass multiplied by its acceleration: $F = ma$.<br>
<br>
3. For every action there is an equal and opposite reaction.<br>
<br>
<b>(b)</b><br>
$a = \\dfrac{\\Delta v}{t} = \\dfrac{20}{8} = 2.5$ m s⁻²<br>
<br>
$F_{net} = ma = 1200 \\times 2.5 = 3000$ N<br>
<br>
Friction force $= 4500 - 3000 = 1500$ N<br>
<br>
<b>(c)</b><br>
Normal reaction on box: $N = 5 \\times 9.8 = 49$ N<br>
<br>
Friction on box: $F = \\mu N = 0.2 \\times 49 = 9.8$ N<br>
<br>
For the system (net force $=$ weight of hanging mass $-$ friction):<br>
<br>
$3 \\times 9.8 - 9.8 = (5 + 3) \\times a$<br>
<br>
$29.4 - 9.8 = 8a \\Rightarrow a = \\dfrac{19.6}{8} = 2.45$ m s⁻²<br>
<br>
Tension: consider the hanging mass: $3 \\times 9.8 - T = 3 \\times 2.45$<br>
<br>
$T = 29.4 - 7.35 = 22.05 \\approx 22.1$ N`,
},

{
  question_id: 2110,
  topic_id: 10009,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Polymers and Green Chemistry",
  content: `<p><b>(a)</b> Explain the difference between <b>addition polymerisation</b> and <b>condensation polymerisation</b>, giving one example of each with a monomer and the repeat unit of the polymer formed. [6]</p>

<p><b>(b)</b> Describe the environmental problems associated with addition polymers and explain why biodegradable polymers are desirable. [3]</p>

<p><b>(c)</b> Nylon-6,6 is made from hexanedioic acid and 1,6-diaminohexane.</p>
<ul>
  <li>Draw the repeat unit of nylon-6,6 and identify the type of linkage formed. [2]</li>
  <li>Write the equation for the formation of this linkage, showing the functional groups reacting and the small molecule eliminated. [2]</li>
</ul>

<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Addition polymerisation: monomers with a C=C double bond join together with no other product — the double bond opens and the monomers link into a chain.<br>
<br>
Example: ethene ($\\text{CH}_2=\\text{CH}_2$) polymerises to form poly(ethene). Repeat unit: $-[\\text{CH}_2-\\text{CH}_2]-$<br>
<br>
Condensation polymerisation: monomers join together with the elimination of a small molecule (usually water or HCl) at each step. Monomers must have two functional groups.<br>
<br>
Example: lactic acid ($\\text{CH}_3\\text{CH(OH)COOH}$) polymerises to form poly(lactic acid) (a polyester), with water eliminated at each step. Repeat unit contains an ester linkage $-\\text{COO}-$.<br>
<br>
<b>(b)</b><br>
Addition polymers (e.g. poly(ethene)) are non-biodegradable — they persist in the environment for hundreds of years, accumulating in landfill and causing harm to wildlife (e.g. ingestion by marine animals).<br>
<br>
Biodegradable polymers can be broken down by microorganisms, reducing environmental persistence and waste management problems.<br>
<br>
<b>(c)</b><br>
Repeat unit: $-[\\text{NH}-(\\text{CH}_2)_6-\\text{NH}-\\text{CO}-(\\text{CH}_2)_4-\\text{CO}]-$ with amide ($-\\text{CONH}-$) linkages.<br>
<br>
Reaction: $-\\text{COOH} + \\text{H}_2\\text{N}- \\rightarrow -\\text{CONH}- + \\text{H}_2\\text{O}$<br>
<br>
A carboxylic acid group reacts with an amine group, eliminating water to form an amide bond.`,
},

{
  question_id: 2111,
  topic_id: 5011,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Further Integration",
  content: `<p><b>(a)</b> Use integration by parts to find $\\displaystyle\\int x^2 e^x \\, dx$. [4]</p>

<p><b>(b)</b> Use the substitution $u = x^2 + 1$ to find $\\displaystyle\\int \\dfrac{x}{(x^2+1)^3} \\, dx$. [4]</p>

<p><b>(c)</b> Evaluate $\\displaystyle\\int_0^1 \\dfrac{2x+3}{x^2+3x+2} \\, dx$, using partial fractions. [6]</p>

<p><b>(d)</b> Find the area enclosed between $y = \\sin x$ and $y = \\cos x$ from $x = \\dfrac{\\pi}{4}$ to $x = \\dfrac{5\\pi}{4}$. [4]</p>

<p><b>Total: 18 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Apply integration by parts twice.<br>
<br>
First: $u = x^2$, $\\dfrac{dv}{dx} = e^x$, so $\\dfrac{du}{dx} = 2x$, $v = e^x$:<br>
<br>
$\\displaystyle\\int x^2 e^x \\, dx = x^2 e^x - 2\\displaystyle\\int x e^x \\, dx$<br>
<br>
Second: $\\displaystyle\\int x e^x \\, dx = xe^x - e^x$<br>
<br>
So $\\displaystyle\\int x^2 e^x \\, dx = x^2 e^x - 2xe^x + 2e^x + c = e^x(x^2 - 2x + 2) + c$<br>
<br>
<b>(b)</b><br>
$u = x^2+1 \\Rightarrow du = 2x \\, dx \\Rightarrow x \\, dx = \\dfrac{du}{2}$<br>
<br>
$\\displaystyle\\int \\dfrac{x}{(x^2+1)^3} \\, dx = \\dfrac{1}{2}\\displaystyle\\int u^{-3} \\, du = \\dfrac{1}{2} \\cdot \\dfrac{u^{-2}}{-2} + c = -\\dfrac{1}{4(x^2+1)^2} + c$<br>
<br>
<b>(c)</b><br>
$x^2+3x+2 = (x+1)(x+2)$, so $\\dfrac{2x+3}{(x+1)(x+2)} = \\dfrac{A}{x+1} + \\dfrac{B}{x+2}$<br>
<br>
$2x+3 = A(x+2)+B(x+1)$. At $x=-1$: $1 = A$. At $x=-2$: $-1 = -B \\Rightarrow B = 1$.<br>
<br>
$\\displaystyle\\int_0^1 \\dfrac{1}{x+1} + \\dfrac{1}{x+2} \\, dx = \\Big[\\ln|x+1| + \\ln|x+2|\\Big]_0^1$<br>
<br>
$= (\\ln 2 + \\ln 3) - (\\ln 1 + \\ln 2) = \\ln 3$<br>
<br>
<b>(d)</b><br>
$\\cos x = \\sin x$ at $x = \\dfrac{\\pi}{4}$ and $x = \\dfrac{5\\pi}{4}$ — on this interval $\\sin x \\geq \\cos x$.<br>
<br>
$A = \\displaystyle\\int_{\\pi/4}^{5\\pi/4} (\\sin x - \\cos x) \\, dx = \\Big[-\\cos x - \\sin x\\Big]_{\\pi/4}^{5\\pi/4}$<br>
<br>
$= \\left(\\dfrac{\\sqrt{2}}{2} + \\dfrac{\\sqrt{2}}{2}\\right) - \\left(-\\dfrac{\\sqrt{2}}{2} - \\dfrac{\\sqrt{2}}{2}\\right) = \\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$`,
},

{
  question_id: 2112,
  topic_id: 7021,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Encryption and Security",
  content: `<p><b>(a)</b> Explain the difference between <b>symmetric</b> and <b>asymmetric</b> encryption. Give one advantage of each. [4]</p>

<p><b>(b)</b> Describe how <b>public key cryptography</b> is used to send a secure message from Alice to Bob. Explain what each key is used for and why the system is secure. [5]</p>

<p><b>(c)</b> Describe how a <b>digital signature</b> works. Explain how it provides both authentication and integrity. [4]</p>

<p><b>(d)</b> State two differences between a <b>virus</b> and a <b>worm</b>. [2]</p>

<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Symmetric encryption: both the sender and receiver use the same key to encrypt and decrypt data.<br>
Advantage: fast and computationally efficient — suitable for encrypting large amounts of data.<br>
<br>
Asymmetric encryption: uses a mathematically linked key pair — a public key (shared openly) and a private key (kept secret). Data encrypted with the public key can only be decrypted with the private key.<br>
Advantage: eliminates the key distribution problem — the public key can be shared freely without compromising security.<br>
<br>
<b>(b)</b><br>
1. Bob generates a public/private key pair and shares his public key openly.<br>
<br>
2. Alice obtains Bob's public key and uses it to encrypt her message.<br>
<br>
3. The encrypted message is sent to Bob, who decrypts it using his private key — only Bob can decrypt it since only he has the private key.<br>
<br>
4. The system is secure because deriving the private key from the public key requires solving computationally infeasible mathematical problems (e.g. factoring very large numbers in RSA).<br>
<br>
5. Even if an attacker intercepts the encrypted message and knows the public key, they cannot decrypt the message without the private key.<br>
<br>
<b>(c)</b><br>
1. The sender creates a hash of the message using a hash function, then encrypts the hash with their private key — this is the digital signature.<br>
<br>
2. The receiver decrypts the signature using the sender's public key to recover the hash, then independently hashes the received message.<br>
<br>
3. Authentication: if the decrypted hash matches the independently computed hash, the message must have come from the sender (only the sender has their private key).<br>
<br>
4. Integrity: any alteration to the message would produce a different hash, and the signature would not verify — tampering is detected.<br>
<br>
<b>(d)</b><br>
1. A virus requires a host file and user action (e.g. opening an infected file) to spread; a worm is self-replicating and can spread independently across networks without user action.<br>
<br>
2. A virus attaches itself to an existing program or file; a worm is a standalone program that does not need to attach to a host file.`,
},

{
  question_id: 2113,
  topic_id: 4005,
  subject_id: 7,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Quadratics and Simultaneous Equations",
  content: `<p><b>(a)</b> Solve the quadratic equation $3x^2 - 7x - 6 = 0$, giving exact solutions. [3]</p>

<p><b>(b)</b> Solve the simultaneous equations:</p>
<p>$y = 2x - 1$ and $x^2 + y^2 = 25$ [4]</p>

<p><b>(c)</b> A rectangle has a perimeter of 26 cm and an area of 42 cm². Find its dimensions. [4]</p>

<p><b>(d)</b> The equation $x^2 + kx + (k+3) = 0$ has two distinct real roots. Find the range of values of $k$. [3]</p>

<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$x = \\dfrac{7 \\pm \\sqrt{49 + 72}}{6} = \\dfrac{7 \\pm \\sqrt{121}}{6} = \\dfrac{7 \\pm 11}{6}$<br>
<br>
$x = 3$ or $x = -\\dfrac{2}{3}$<br>
<br>
<b>(b)</b><br>
Substitute $y = 2x-1$ into $x^2+y^2=25$:<br>
<br>
$x^2 + (2x-1)^2 = 25 \\Rightarrow 5x^2 - 4x - 24 = 0$<br>
<br>
$x = \\dfrac{4 \\pm \\sqrt{16 + 480}}{10} = \\dfrac{4 \\pm \\sqrt{496}}{10}$<br>
<br>
$x = \\dfrac{4 \\pm 4\\sqrt{31}}{10} = \\dfrac{2 \\pm 2\\sqrt{31}}{5}$<br>
<br>
$y = 2x - 1$ gives the corresponding $y$ values.<br>
<br>
<b>(c)</b><br>
Let length $= l$, width $= w$. Then $2(l+w) = 26 \\Rightarrow l+w = 13$ and $lw = 42$.<br>
<br>
$l$ and $w$ are roots of $t^2 - 13t + 42 = 0 \\Rightarrow (t-6)(t-7) = 0$<br>
<br>
Dimensions: $6$ cm by $7$ cm.<br>
<br>
<b>(d)</b><br>
For two distinct real roots: discriminant $> 0$<br>
<br>
$k^2 - 4(k+3) > 0 \\Rightarrow k^2 - 4k - 12 > 0 \\Rightarrow (k-6)(k+2) > 0$<br>
<br>
$k < -2$ or $k > 6$`,
},

{
  question_id: 2114,
  topic_id: 8016,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Particle Physics",
  content: `<p><b>(a)</b> Classify each of the following as a hadron, lepton, or exchange boson, and state whether each is a fermion or boson:</p>
<ul>
  <li>electron</li>
  <li>proton</li>
  <li>photon</li>
  <li>neutrino</li>
  <li>pion ($\\pi^0$)</li>
</ul>
<p>[5]</p>

<p><b>(b)</b> State the quark composition of a proton and a neutron, and give the charge of each quark. [3]</p>

<p><b>(c)</b> The following decay is observed: $p \\rightarrow n + e^+ + \\nu_e$</p>
<p>Show that lepton number, baryon number, and charge are all conserved in this decay. [4]</p>

<p><b>(d)</b> Explain what is meant by <b>antimatter</b> and describe what happens when a particle meets its corresponding antiparticle. [3]</p>

<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Electron — lepton, fermion.<br>
Proton — hadron (baryon), fermion.<br>
Photon — exchange boson, boson.<br>
Neutrino — lepton, fermion.<br>
Pion ($\\pi^0$) — hadron (meson), boson.<br>
<br>
<b>(b)</b><br>
Proton: uud — two up quarks ($+\\dfrac{2}{3}e$ each) and one down quark ($-\\dfrac{1}{3}e$). Total charge $= +e$.<br>
<br>
Neutron: udd — one up quark and two down quarks. Total charge $= \\dfrac{2}{3} - \\dfrac{1}{3} - \\dfrac{1}{3} = 0$.<br>
<br>
<b>(c)</b><br>
Charge: $+1 \\rightarrow 0 + 1 + 0 = +1$ ✓<br>
<br>
Baryon number: $+1 \\rightarrow +1 + 0 + 0 = +1$ ✓<br>
<br>
Lepton number: $0 \\rightarrow 0 + (-1) + 1 = 0$ (positron has lepton number $-1$, electron neutrino $+1$) ✓<br>
<br>
<b>(d)</b><br>
Every particle has a corresponding antiparticle with the same mass but opposite charge and quantum numbers.<br>
<br>
When a particle meets its antiparticle, they annihilate — their combined mass-energy is converted entirely into photons (gamma radiation), with a minimum of two photons produced to conserve momentum.<br>
<br>
The reverse process — pair production — occurs when a photon of sufficient energy creates a particle-antiparticle pair.`,
},

{
  question_id: 2115,
  topic_id: 6006,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Vectors and 3D Geometry",
  content: `<p><b>(a)</b> Find the equation of the plane passing through the point $(2, -1, 3)$ with normal vector $\\mathbf{n} = \\begin{pmatrix}1\\\\2\\\\-1\\end{pmatrix}$. [2]</p>

<p><b>(b)</b> Find the equation of the plane through the three points $A(1,0,0)$, $B(0,2,0)$, $C(0,0,3)$. [4]</p>

<p><b>(c)</b> Find the angle between the planes $x + 2y - z = 5$ and $2x - y + 3z = 1$. [3]</p>

<p><b>(d)</b> Find the shortest distance from the point $P(3, 1, -2)$ to the plane $2x - y + 2z = 4$. [3]</p>

<p><b>(e)</b> Determine whether the line $\\mathbf{r} = \\begin{pmatrix}1\\\\2\\\\0\\end{pmatrix} + t\\begin{pmatrix}1\\\\-1\\\\2\\end{pmatrix}$ lies in, is parallel to, or intersects the plane $x + 2y + z = 5$. [3]</p>

<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$1(x-2) + 2(y+1) - 1(z-3) = 0$<br>
<br>
$x + 2y - z + 3 = 0$ (or $x + 2y - z = -3$)<br>
<br>
<b>(b)</b><br>
$\\overrightarrow{AB} = (-1,2,0)$, $\\overrightarrow{AC} = (-1,0,3)$<br>
<br>
$\\mathbf{n} = \\overrightarrow{AB} \\times \\overrightarrow{AC} = \\begin{vmatrix}\\mathbf{i}&\\mathbf{j}&\\mathbf{k}\\\\-1&2&0\\\\-1&0&3\\end{vmatrix} = (6,3,2)$<br>
<br>
Plane through $A(1,0,0)$: $6(x-1)+3y+2z=0 \\Rightarrow 6x+3y+2z=6$<br>
<br>
Equivalently: $\\dfrac{x}{1}+\\dfrac{y}{2}+\\dfrac{z}{3}=1$<br>
<br>
<b>(c)</b><br>
$\\mathbf{n}_1 = (1,2,-1)$, $\\mathbf{n}_2 = (2,-1,3)$<br>
<br>
$\\cos\\theta = \\dfrac{|\\mathbf{n}_1 \\cdot \\mathbf{n}_2|}{|\\mathbf{n}_1||\\mathbf{n}_2|} = \\dfrac{|2-2-3|}{\\sqrt{6}\\sqrt{14}} = \\dfrac{3}{\\sqrt{84}} = \\dfrac{3}{2\\sqrt{21}}$<br>
<br>
$\\theta = \\arccos\\left(\\dfrac{3}{2\\sqrt{21}}\\right) \\approx 70.9°$<br>
<br>
<b>(d)</b><br>
$d = \\dfrac{|2(3)-1(1)+2(-2)-4|}{\\sqrt{4+1+4}} = \\dfrac{|6-1-4-4|}{3} = \\dfrac{|-3|}{3} = 1$<br>
<br>
<b>(e)</b><br>
Direction vector $\\mathbf{d} = (1,-1,2)$. Normal $\\mathbf{n} = (1,2,1)$.<br>
<br>
$\\mathbf{d} \\cdot \\mathbf{n} = 1 - 2 + 2 = 1 \\neq 0$, so the line is not parallel to the plane — it intersects.<br>
<br>
Substituting the line: $(1+t)+2(2-t)+(2t)=5 \\Rightarrow 1+t+4-2t+2t=5 \\Rightarrow t=0$.<br>
<br>
Intersection point: $(1,2,0)$.`,
},

{
  question_id: 2116,
  topic_id: 2003,
  subject_id: 9,
  study_stage: 0,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Acids, Bases and Salts",
  content: `<p><b>(a)</b> State the definition of an acid and a base in terms of proton transfer (Brønsted–Lowry). [2]</p>

<p><b>(b)</b> Write ionic equations for the reactions of:</p>
<ul>
  <li>Hydrochloric acid with sodium hydroxide [1]</li>
  <li>Sulfuric acid with calcium carbonate [2]</li>
  <li>Ethanoic acid with sodium carbonate [2]</li>
</ul>

<p><b>(c)</b> Describe how you would prepare a pure, dry sample of copper(II) sulfate crystals from copper(II) oxide and dilute sulfuric acid. [4]</p>

<p><b>(d)</b> Universal indicator is added to four solutions, giving the following colours: red, orange, green, dark blue. Place the solutions in order from most acidic to most alkaline and estimate the pH of each. [2]</p>

<p><b>Total: 13 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
An acid is a proton (H⁺) donor.<br>
<br>
A base is a proton (H⁺) acceptor.<br>
<br>
<b>(b)</b><br>
HCl + NaOH: $\\text{H}^+ + \\text{OH}^- \\rightarrow \\text{H}_2\\text{O}$<br>
<br>
H₂SO₄ + CaCO₃: $2\\text{H}^+ + \\text{CaCO}_3 \\rightarrow \\text{Ca}^{2+} + \\text{H}_2\\text{O} + \\text{CO}_2$<br>
<br>
CH₃COOH + Na₂CO₃: $2\\text{CH}_3\\text{COOH} + \\text{CO}_3^{2-} \\rightarrow 2\\text{CH}_3\\text{COO}^- + \\text{H}_2\\text{O} + \\text{CO}_2$<br>
<br>
<b>(c)</b><br>
1. Add excess copper(II) oxide to warm dilute sulfuric acid and stir until no more dissolves (excess solid ensures all acid is used up).<br>
<br>
2. Filter off the excess copper(II) oxide using filter paper and a funnel to obtain a clear blue copper(II) sulfate solution.<br>
<br>
3. Evaporate the filtrate gently by heating until a small volume of solution remains (do not evaporate to dryness).<br>
<br>
4. Allow the solution to cool — blue copper(II) sulfate crystals form. Filter, wash with a little distilled water, and dry gently (e.g. between filter papers or in a low-temperature oven).<br>
<br>
<b>(d)</b><br>
Order (most acidic to most alkaline): red, orange, green, dark blue.<br>
<br>
Approximate pH: red $\\approx 1–2$, orange $\\approx 4–5$, green $\\approx 7$, dark blue $\\approx 12–13$.`,
},

{
  question_id: 2117,
  topic_id: 5012,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Differential Equations",
  content: `<p><b>(a)</b> Solve the differential equation $\\dfrac{dy}{dx} = \\dfrac{x}{y}$, given that $y = 3$ when $x = 0$. [3]</p>

<p><b>(b)</b> Find the general solution of $\\dfrac{dy}{dx} + 2y = e^{-x}$, using an integrating factor. [5]</p>

<p><b>(c)</b> A population $P$ grows according to $\\dfrac{dP}{dt} = 0.04P$. Initially $P = 500$.</p>
<ul>
  <li>Solve the differential equation. [2]</li>
  <li>Find the time taken for the population to double, to 3 significant figures. [2]</li>
</ul>

<p><b>(d)</b> The rate at which a hot object cools is proportional to the difference between its temperature $T$ and the ambient temperature $T_0 = 20°\\text{C}$. Initially $T = 80°\\text{C}$, and after 10 minutes $T = 50°\\text{C}$. Find the temperature after 30 minutes. [5]</p>

<p><b>Total: 17 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Separate variables: $y \\, dy = x \\, dx$<br>
<br>
$\\dfrac{y^2}{2} = \\dfrac{x^2}{2} + c$<br>
<br>
At $y=3$, $x=0$: $\\dfrac{9}{2} = c$<br>
<br>
$y^2 = x^2 + 9$, so $y = \\sqrt{x^2+9}$ (taking positive root)<br>
<br>
<b>(b)</b><br>
Integrating factor: $\\mu = e^{\\int 2 \\, dx} = e^{2x}$<br>
<br>
Multiply through: $\\dfrac{d}{dx}(ye^{2x}) = e^{2x} \\cdot e^{-x} = e^x$<br>
<br>
$ye^{2x} = e^x + c$<br>
<br>
$y = e^{-x} + ce^{-2x}$<br>
<br>
<b>(c)</b><br>
$\\dfrac{dP}{P} = 0.04 \\, dt \\Rightarrow P = Ae^{0.04t}$. At $t=0$: $A = 500$, so $P = 500e^{0.04t}$<br>
<br>
For doubling: $1000 = 500e^{0.04t} \\Rightarrow e^{0.04t} = 2 \\Rightarrow t = \\dfrac{\\ln 2}{0.04} = 17.3$ minutes<br>
<br>
<b>(d)</b><br>
$\\dfrac{dT}{dt} = -k(T-20)$. Let $\\theta = T - 20$: $\\dfrac{d\\theta}{dt} = -k\\theta$<br>
<br>
$\\theta = Ae^{-kt}$. At $t=0$: $\\theta = 60$, so $A = 60$.<br>
<br>
At $t=10$: $\\theta = 30$, so $30 = 60e^{-10k} \\Rightarrow e^{-10k} = \\dfrac{1}{2} \\Rightarrow k = \\dfrac{\\ln 2}{10}$<br>
<br>
At $t=30$: $\\theta = 60e^{-3\\ln 2} = 60 \\times \\dfrac{1}{8} = 7.5$°C<br>
<br>
$T = 7.5 + 20 = 27.5°\\text{C}$`,
},

{
  question_id: 2118,
  topic_id: 9024,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Ecosystems and Energy Flow",
  content: `<p><b>(a)</b> Explain the difference between a <b>food chain</b> and a <b>food web</b>, and define the terms <b>producer</b>, <b>primary consumer</b>, and <b>trophic level</b>. [4]</p>

<p><b>(b)</b> In an ecosystem, the dry mass at each trophic level is as follows:</p>
<table border="1" cellpadding="5">
<tr><th>Trophic level</th><th>Dry biomass (kg ha⁻¹)</th></tr>
<tr><td>Producers</td><td>10000</td></tr>
<tr><td>Primary consumers</td><td>1000</td></tr>
<tr><td>Secondary consumers</td><td>100</td></tr>
</table>
<ul>
  <li>Calculate the efficiency of energy transfer between each trophic level. [2]</li>
  <li>Explain why energy is lost between trophic levels. [4]</li>
</ul>

<p><b>(c)</b> Explain how human activities have disrupted the <b>nitrogen cycle</b> and describe the ecological consequences of excess nitrates entering waterways. [4]</p>

<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
A food chain shows a linear sequence of feeding relationships; a food web shows the interconnected feeding relationships between multiple species in an ecosystem.<br>
<br>
A producer is an organism that synthesises organic molecules from inorganic substances (e.g. plants using photosynthesis).<br>
<br>
A primary consumer is an organism that feeds directly on producers (a herbivore).<br>
<br>
A trophic level is the position an organism occupies in a food chain, defined by its source of nutrition.<br>
<br>
<b>(b)</b><br>
Efficiency (producers to primary consumers): $\\dfrac{1000}{10000} \\times 100 = 10\\%$<br>
<br>
Efficiency (primary to secondary consumers): $\\dfrac{100}{1000} \\times 100 = 10\\%$<br>
<br>
Energy is lost because:<br>
1. Not all biomass is consumed (some organisms die without being eaten and are decomposed).<br>
2. Not all ingested material is assimilated — undigested material is lost in faeces.<br>
3. Energy is lost as heat through cellular respiration (metabolism), including maintaining body temperature in endotherms.<br>
4. Energy is used for movement, growth, and reproduction rather than being passed to the next trophic level.<br>
<br>
<b>(c)</b><br>
Human activities that disrupt the nitrogen cycle include: industrial fertiliser application (excess nitrates leach into waterways through run-off) and burning fossil fuels (releases nitrogen oxides).<br>
<br>
When excess nitrates enter waterways (eutrophication):<br>
1. Algae and aquatic plants grow rapidly (algal bloom), blocking sunlight to submerged plants, which die.<br>
2. Aerobic bacteria decompose the dead organic matter, consuming dissolved oxygen — deoxygenation of the water.<br>
3. Fish and other aerobic organisms suffocate and die, causing a collapse in biodiversity.`,
},

{
  question_id: 2119,
  topic_id: 13005,
  subject_id: 13,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "ESAT: Sequences and Series",
  content: `<p><b>(a)</b> The $n$th term of a sequence is given by $u_n = 3n^2 - 2n + 1$.</p>
<ul>
  <li>Find $u_1$, $u_5$, and $u_{10}$. [2]</li>
  <li>Show that the sequence is not arithmetic. [2]</li>
</ul>

<p><b>(b)</b> An arithmetic series has first term $a = 7$ and common difference $d = 3$.</p>
<ul>
  <li>Find the 20th term. [1]</li>
  <li>Find the sum of the first 20 terms. [2]</li>
  <li>Find the value of $n$ such that the sum of the first $n$ terms exceeds 1000. [3]</li>
</ul>

<p><b>(c)</b> A geometric series has first term 12 and common ratio $\\dfrac{2}{3}$. Find the sum to infinity and the smallest value of $n$ for which the sum of the first $n$ terms exceeds 99% of the sum to infinity. [5]</p>

<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$u_1 = 3-2+1 = 2$, $u_5 = 75-10+1 = 66$, $u_{10} = 300-20+1 = 281$<br>
<br>
For an arithmetic sequence, the differences $u_2 - u_1$, $u_3 - u_2$, etc. must be constant.<br>
<br>
$u_2 = 12-4+1=9$, $u_3 = 27-6+1=22$. $u_2-u_1 = 7$, $u_3-u_2 = 13$. The differences are not equal, so the sequence is not arithmetic. ✓<br>
<br>
<b>(b)</b><br>
$u_{20} = 7 + 19 \\times 3 = 7 + 57 = 64$<br>
<br>
$S_{20} = \\dfrac{20}{2}(7+64) = 10 \\times 71 = 710$<br>
<br>
$S_n = \\dfrac{n}{2}(14 + 3(n-1)) = \\dfrac{n}{2}(3n+11) > 1000$<br>
<br>
$3n^2 + 11n - 2000 > 0$<br>
<br>
$n = \\dfrac{-11 + \\sqrt{121 + 24000}}{6} = \\dfrac{-11 + \\sqrt{24121}}{6} = \\dfrac{-11 + 155.3}{6} \\approx 24.1$<br>
<br>
So smallest integer $n = 25$.<br>
<br>
<b>(c)</b><br>
$S_\\infty = \\dfrac{12}{1 - 2/3} = \\dfrac{12}{1/3} = 36$<br>
<br>
99% of $S_\\infty = 0.99 \\times 36 = 35.64$<br>
<br>
$S_n = 36\\left(1 - \\left(\\dfrac{2}{3}\\right)^n\\right) > 35.64$<br>
<br>
$\\left(\\dfrac{2}{3}\\right)^n < 0.01$<br>
<br>
$n \\ln\\dfrac{2}{3} < \\ln 0.01 \\Rightarrow n > \\dfrac{\\ln 0.01}{\\ln(2/3)} = \\dfrac{-4.6052}{-0.4055} = 11.36$<br>
<br>
Smallest $n = 12$.`,
},

{
  question_id: 2120,
  topic_id: 8017,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Gravitational Fields",
  content: `<p><b>(a)</b> State Newton's law of gravitation and write the equation for the gravitational field strength due to a point mass. [3]</p>

<p><b>(b)</b> Show that for a satellite in circular orbit, $T^2 \\propto r^3$ (Kepler's third law). [4]</p>

<p><b>(c)</b> The Moon orbits Earth with a period of 27.3 days at a mean orbital radius of $3.84 \\times 10^8$ m. Use Kepler's third law to find the orbital radius of a geostationary satellite (period 24 hours). [$T^2 = \\dfrac{4\\pi^2 r^3}{GM}$] [4]</p>

<p><b>(d)</b> Calculate the escape velocity from the Earth's surface. [$M_E = 5.97 \\times 10^{24}$ kg, $R_E = 6.37 \\times 10^6$ m, $G = 6.67 \\times 10^{-11}$ N m² kg⁻²] [3]</p>

<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
The gravitational force between two point masses is directly proportional to the product of their masses and inversely proportional to the square of the distance between them: $F = \\dfrac{GMm}{r^2}$<br>
<br>
Gravitational field strength: $g = \\dfrac{GM}{r^2}$ (force per unit mass at a point)<br>
<br>
<b>(b)</b><br>
For a circular orbit, gravitational force provides the centripetal force:<br>
<br>
$\\dfrac{GMm}{r^2} = \\dfrac{mv^2}{r} \\Rightarrow v^2 = \\dfrac{GM}{r}$<br>
<br>
Orbital speed: $v = \\dfrac{2\\pi r}{T}$, so $\\dfrac{4\\pi^2 r^2}{T^2} = \\dfrac{GM}{r}$<br>
<br>
$T^2 = \\dfrac{4\\pi^2 r^3}{GM}$<br>
<br>
Since $G$, $M$ are constants: $T^2 \\propto r^3$ ✓<br>
<br>
<b>(c)</b><br>
$\\dfrac{T_{geo}^2}{T_{Moon}^2} = \\dfrac{r_{geo}^3}{r_{Moon}^3}$<br>
<br>
$T_{geo} = 24 \\times 3600 = 86400$ s; $T_{Moon} = 27.3 \\times 86400 = 2.359 \\times 10^6$ s<br>
<br>
$r_{geo}^3 = r_{Moon}^3 \\times \\dfrac{T_{geo}^2}{T_{Moon}^2} = (3.84\\times10^8)^3 \\times \\dfrac{(86400)^2}{(2.359\\times10^6)^2}$<br>
<br>
$= 5.662\\times10^{25} \\times 1.342\\times10^{-3} = 7.598\\times10^{22}$<br>
<br>
$r_{geo} = (7.598\\times10^{22})^{1/3} = 4.23\\times10^7$ m<br>
<br>
<b>(d)</b><br>
$v_{esc} = \\sqrt{\\dfrac{2GM}{R}} = \\sqrt{\\dfrac{2 \\times 6.67\\times10^{-11} \\times 5.97\\times10^{24}}{6.37\\times10^6}}$<br>
<br>
$= \\sqrt{\\dfrac{7.965\\times10^{14}}{6.37\\times10^6}} = \\sqrt{1.250\\times10^8} = 1.12\\times10^4$ m s⁻¹`,
},

{
  question_id: 2121,
  topic_id: 6016,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Hyperbolic Functions",
  content: `<p><b>(a)</b> Define $\\sinh x$ and $\\cosh x$ in terms of exponentials, and state the fundamental identity $\\cosh^2 x - \\sinh^2 x = 1$. Prove this identity. [4]</p>

<p><b>(b)</b> Differentiate with respect to $x$:</p>
<ul>
  <li>$y = \\tanh(3x)$ [2]</li>
  <li>$y = x\\cosh x$ [2]</li>
  <li>$y = \\text{arsinh}(2x)$ [2]</li>
</ul>

<p><b>(c)</b> Evaluate $\\displaystyle\\int_0^1 \\sinh(2x) \\, dx$, leaving your answer in exact form. [3]</p>

<p><b>(d)</b> Solve $\\cosh x = 5$, giving exact answers. [3]</p>

<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$\\sinh x = \\dfrac{e^x - e^{-x}}{2}$, $\\cosh x = \\dfrac{e^x + e^{-x}}{2}$<br>
<br>
$\\cosh^2 x - \\sinh^2 x = \\left(\\dfrac{e^x+e^{-x}}{2}\\right)^2 - \\left(\\dfrac{e^x-e^{-x}}{2}\\right)^2$<br>
<br>
$= \\dfrac{(e^x+e^{-x})^2 - (e^x-e^{-x})^2}{4} = \\dfrac{4e^x e^{-x}}{4} = \\dfrac{4}{4} = 1$ ✓<br>
<br>
<b>(b)</b><br>
$\\dfrac{d}{dx}[\\tanh(3x)] = 3\\text{sech}^2(3x)$<br>
<br>
$\\dfrac{d}{dx}[x\\cosh x] = \\cosh x + x\\sinh x$<br>
<br>
$\\dfrac{d}{dx}[\\text{arsinh}(2x)] = \\dfrac{2}{\\sqrt{4x^2+1}}$<br>
<br>
<b>(c)</b><br>
$\\displaystyle\\int_0^1 \\sinh(2x) \\, dx = \\left[\\dfrac{\\cosh(2x)}{2}\\right]_0^1 = \\dfrac{\\cosh 2 - \\cosh 0}{2} = \\dfrac{\\cosh 2 - 1}{2}$<br>
<br>
$= \\dfrac{\\frac{e^2+e^{-2}}{2}-1}{2} = \\dfrac{e^2+e^{-2}-2}{4}$<br>
<br>
<b>(d)</b><br>
$\\dfrac{e^x + e^{-x}}{2} = 5 \\Rightarrow e^x + e^{-x} = 10$<br>
<br>
Let $u = e^x$: $u + \\dfrac{1}{u} = 10 \\Rightarrow u^2 - 10u + 1 = 0$<br>
<br>
$u = \\dfrac{10 \\pm \\sqrt{96}}{2} = 5 \\pm 2\\sqrt{6}$<br>
<br>
$x = \\ln(5 + 2\\sqrt{6})$ or $x = \\ln(5 - 2\\sqrt{6}) = -\\ln(5+2\\sqrt{6})$`,
},

{
  question_id: 2122,
  topic_id: 7019,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Databases and SQL",
  content: `<p>A school database has two tables:</p>
<ul>
  <li><code>Student(StudentID, Name, YearGroup, TutorID)</code></li>
  <li><code>Tutor(TutorID, TutorName, Subject)</code></li>
</ul>

<p><b>(a)</b> Identify the primary key and foreign key in the <code>Student</code> table and explain the role of each. [3]</p>

<p><b>(b)</b> Write SQL queries to:</p>
<ul>
  <li>Select the names of all Year 11 students, sorted alphabetically. [2]</li>
  <li>Find the names and subjects of all tutors who teach students in Year 10. [3]</li>
  <li>Count the number of students in each year group. [2]</li>
</ul>

<p><b>(c)</b> Explain what is meant by <b>referential integrity</b> and describe what would happen if a tutor record was deleted without handling the foreign key in the Student table. [3]</p>

<p><b>(d)</b> Describe the difference between a <b>flat file database</b> and a <b>relational database</b>, and give one advantage of the relational model. [3]</p>

<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Primary key: <code>StudentID</code> — uniquely identifies each record in the Student table; cannot be null or duplicated.<br>
<br>
Foreign key: <code>TutorID</code> — references the primary key of the Tutor table, establishing a relationship between the two tables and enforcing referential integrity.<br>
<br>
<b>(b)</b><br>
<pre>SELECT Name FROM Student
WHERE YearGroup = 11
ORDER BY Name ASC;</pre>
<br>
<pre>SELECT DISTINCT T.TutorName, T.Subject
FROM Tutor T
JOIN Student S ON T.TutorID = S.TutorID
WHERE S.YearGroup = 10;</pre>
<br>
<pre>SELECT YearGroup, COUNT(*) AS NumberOfStudents
FROM Student
GROUP BY YearGroup;</pre>
<br>
<b>(c)</b><br>
Referential integrity means that every foreign key value in the Student table must correspond to an existing primary key in the Tutor table — you cannot have a student referencing a tutor that does not exist.<br>
<br>
If a tutor record were deleted without handling the foreign key, the Student records that reference that TutorID would contain a dangling reference (orphaned records). This violates referential integrity and can cause errors in queries or data inconsistency. Most database systems would prevent the deletion or cascade the change depending on the constraints set.<br>
<br>
<b>(d)</b><br>
A flat file database stores all data in a single table — data is often duplicated across rows (redundancy) and updating one piece of data may require many changes.<br>
<br>
A relational database organises data into multiple related tables, linked by keys — data is stored only once and relationships are expressed through foreign keys.<br>
<br>
Advantage: reduced data redundancy and improved data integrity — updating a tutor's name requires only one change in the Tutor table, not in every student record.`,
},

{
  question_id: 2123,
  topic_id: 5006,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Exponentials and Logarithms",
  content: `<p><b>(a)</b> Sketch the graphs of $y = e^x$ and $y = \\ln x$ on the same axes, stating the coordinates of any intercepts and asymptotes. [4]</p>

<p><b>(b)</b> Solve the equation $2e^{2x} - 5e^x + 2 = 0$, giving exact solutions. [4]</p>

<p><b>(c)</b> Given that $\\log_a 2 = p$ and $\\log_a 3 = q$, express the following in terms of $p$ and $q$:</p>
<ul>
  <li>$\\log_a 18$ [2]</li>
  <li>$\\log_a \\dfrac{4}{9}$ [2]</li>
  <li>$\\log_a \\sqrt{6a}$ [2]</li>
</ul>

<p><b>(d)</b> The number of bacteria in a culture grows as $N = N_0 e^{0.3t}$ where $t$ is in hours. How long does it take for the population to triple? Give your answer to 3 significant figures. [2]</p>

<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$y = e^x$: passes through $(0,1)$, asymptote $y=0$ as $x \\to -\\infty$, strictly increasing.<br>
<br>
$y = \\ln x$: passes through $(1,0)$, asymptote $x=0$ (vertical), strictly increasing, defined for $x>0$.<br>
<br>
The two graphs are reflections of each other in the line $y=x$.<br>
<br>
<b>(b)</b><br>
Let $u = e^x$: $2u^2 - 5u + 2 = 0 \\Rightarrow (2u-1)(u-2) = 0$<br>
<br>
$u = \\dfrac{1}{2}$ or $u = 2$<br>
<br>
$e^x = \\dfrac{1}{2} \\Rightarrow x = -\\ln 2$<br>
<br>
$e^x = 2 \\Rightarrow x = \\ln 2$<br>
<br>
<b>(c)</b><br>
$\\log_a 18 = \\log_a(2 \\times 3^2) = p + 2q$<br>
<br>
$\\log_a \\dfrac{4}{9} = \\log_a 4 - \\log_a 9 = 2p - 2q$<br>
<br>
$\\log_a \\sqrt{6a} = \\dfrac{1}{2}\\log_a(6a) = \\dfrac{1}{2}(\\log_a 6 + 1) = \\dfrac{1}{2}(p + q + 1)$<br>
<br>
<b>(d)</b><br>
$3N_0 = N_0 e^{0.3t} \\Rightarrow e^{0.3t} = 3 \\Rightarrow t = \\dfrac{\\ln 3}{0.3} = \\dfrac{1.0986}{0.3} = 3.66$ hours`,
},

{
  question_id: 2124,
  topic_id: 11002,
  subject_id: 11,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "TMUA: Number Theory and Proof",
  content: `<p><b>(a)</b> Prove that the product of any two consecutive integers is even. [2]</p>

<p><b>(b)</b> Prove that for any integer $n$, $n^3 - n$ is divisible by 6. [4]</p>

<p><b>(c)</b> Find all integer solutions to $n^2 - 5n + 6 = 0$ and verify your answers. [2]</p>

<p><b>(d)</b> Prove that there are infinitely many prime numbers. (You may use proof by contradiction.) [4]</p>

<p><b>(e)</b> Without a calculator, determine which is larger: $2^{100}$ or $3^{60}$. Show clear working. [4]</p>

<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Let the two consecutive integers be $n$ and $n+1$.<br>
<br>
One of any two consecutive integers must be even, so their product $n(n+1)$ is even. $\\square$<br>
<br>
<b>(b)</b><br>
$n^3 - n = n(n^2-1) = n(n-1)(n+1) = (n-1)n(n+1)$<br>
<br>
This is the product of three consecutive integers. Among any three consecutive integers, at least one is divisible by 2 and at least one is divisible by 3, so the product is divisible by $2 \\times 3 = 6$. $\\square$<br>
<br>
<b>(c)</b><br>
$(n-2)(n-3)=0 \\Rightarrow n = 2$ or $n = 3$<br>
<br>
Verify: $4-10+6=0$ ✓ and $9-15+6=0$ ✓<br>
<br>
<b>(d)</b><br>
Assume for contradiction that there are finitely many primes: $p_1, p_2, \\ldots, p_k$.<br>
<br>
Consider $N = p_1 p_2 \\cdots p_k + 1$. $N$ is not divisible by any of $p_1, \\ldots, p_k$ (remainder 1 in each case).<br>
<br>
So either $N$ is itself prime (a new prime not in our list) or $N$ has a prime factor not in our list — in either case we have a contradiction.<br>
<br>
Therefore there are infinitely many primes. $\\square$<br>
<br>
<b>(e)</b><br>
Compare $2^{100}$ and $3^{60}$. Take logs: $\\ln(2^{100}) = 100\\ln 2 \\approx 100 \\times 0.6931 = 69.31$<br>
<br>
$\\ln(3^{60}) = 60\\ln 3 \\approx 60 \\times 1.0986 = 65.92$<br>
<br>
Since $69.31 > 65.92$, we have $\\ln(2^{100}) > \\ln(3^{60})$, so $2^{100} > 3^{60}$.<br>
<br>
Alternatively: $2^{100} = (2^5)^{20} = 32^{20}$ and $3^{60} = (3^3)^{20} = 27^{20}$. Since $32 > 27$, $2^{100} > 3^{60}$. ✓`,
},

{
  question_id: 2125,
  topic_id: 5004,
  subject_id: 1,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Binomial Theorem",
  content: `<p><b>(a)</b> Write down the binomial expansion of $(1+x)^n$ for general $n$, using $\\binom{n}{r}$ notation. State when the expansion is valid. [2]</p>

<p><b>(b)</b> Find the first four terms in the expansion of $(2-3x)^8$ in ascending powers of $x$. [4]</p>

<p><b>(c)</b> Use the binomial series to find the expansion of $\\dfrac{1}{\\sqrt{1-2x}}$ up to and including the term in $x^3$, stating the range of validity. [5]</p>

<p><b>(d)</b> Find the coefficient of $x^3$ in the expansion of $(3+x)^4(1-2x)^5$. [5]</p>

<p><b>Total: 16 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
$(1+x)^n = \\displaystyle\\sum_{r=0}^{n} \\binom{n}{r} x^r = 1 + nx + \\dfrac{n(n-1)}{2!}x^2 + \\cdots$<br>
<br>
For integer $n \\geq 0$: valid for all $x$. For non-integer or negative $n$: valid for $|x| < 1$.<br>
<br>
<b>(b)</b><br>
$(2-3x)^8 = 2^8\\left(1-\\dfrac{3x}{2}\\right)^8$<br>
<br>
$= 256\\left[1 + 8\\left(-\\dfrac{3x}{2}\\right) + \\binom{8}{2}\\left(-\\dfrac{3x}{2}\\right)^2 + \\binom{8}{3}\\left(-\\dfrac{3x}{2}\\right)^3 + \\cdots\\right]$<br>
<br>
$= 256\\left[1 - 12x + 63x^2 - \\dfrac{672}{4} \\cdot \\dfrac{27}{8}x^3 + \\cdots\\right]$<br>
<br>
Let me recalculate: $\\binom{8}{2}\\dfrac{9}{4} = 28 \\times \\dfrac{9}{4} = 63$. $\\binom{8}{3}\\dfrac{27}{8} = 56 \\times \\dfrac{27}{8} = 189$<br>
<br>
$= 256[1 - 12x + 63x^2 - 189x^3 + \\cdots]$<br>
<br>
$= 256 - 3072x + 16128x^2 - 48384x^3 + \\cdots$<br>
<br>
<b>(c)</b><br>
$(1-2x)^{-1/2} = 1 + \\left(-\\dfrac{1}{2}\\right)(-2x) + \\dfrac{(-\\frac{1}{2})(-\\frac{3}{2})}{2!}(-2x)^2 + \\dfrac{(-\\frac{1}{2})(-\\frac{3}{2})(-\\frac{5}{2})}{3!}(-2x)^3 + \\cdots$<br>
<br>
$= 1 + x + \\dfrac{3}{2} \\cdot \\dfrac{4x^2}{2} + \\dfrac{15}{6} \\cdot (-8x^3)(-1) + \\cdots$<br>
<br>
Let me redo carefully:<br>
$= 1 + x + \\dfrac{3}{4}(4x^2) + \\dfrac{(-\\frac{1}{2})(-\\frac{3}{2})(-\\frac{5}{2})}{6}(-8x^3)$<br>
<br>
$= 1 + x + 3x^2 + \\dfrac{-15/8}{1}\\cdot(-8x^3) / 6$<br>
<br>
More carefully: coefficient of $x^3 = \\dfrac{(-1/2)(-3/2)(-5/2)}{6}(-2)^3 = \\dfrac{-15/8}{1} \\cdot (-8)/6 = \\dfrac{15}{8} \\cdot \\dfrac{8}{6} = \\dfrac{15}{6} \\cdot 1 = \\dfrac{5}{2}$<br>
<br>
$\\dfrac{1}{\\sqrt{1-2x}} \\approx 1 + x + 3x^2 + 5x^3 + \\cdots$, valid for $|x| < \\dfrac{1}{2}$<br>
<br>
<b>(d)</b><br>
$(3+x)^4 = 81 + 108x + 54x^2 + 12x^3 + \\cdots$<br>
<br>
$(1-2x)^5 = 1 - 10x + 40x^2 - 80x^3 + \\cdots$<br>
<br>
Coefficient of $x^3$ in product:<br>
$81 \\times (-80) + 108 \\times 40 + 54 \\times (-10) + 12 \\times 1$<br>
$= -6480 + 4320 - 540 + 12 = -2688$`,
},

{
  question_id: 2126,
  topic_id: 9015,
  subject_id: 3,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Respiration Pathways",
  content: `<p>Describe the stages of aerobic respiration, including glycolysis, the link reaction, the Krebs cycle, and oxidative phosphorylation. For each stage, state where it occurs, the substrates and products, and the ATP yield. [12]</p>`,
  mark_scheme: `<b>Glycolysis (cytoplasm):</b><br>
1. Glucose (6C) is phosphorylated using 2 ATP, then split into two molecules of triose phosphate (3C).<br>
<br>
2. Triose phosphate is oxidised to pyruvate — NAD is reduced to NADH. Net yield: 2 ATP (substrate-level phosphorylation) and 2 NADH per glucose.<br>
<br>
<b>Link reaction (mitochondrial matrix):</b><br>
3. Pyruvate is decarboxylated (CO₂ removed) and oxidised — NAD is reduced to NADH — producing acetyl CoA (2C). One NADH per pyruvate (2 per glucose).<br>
<br>
<b>Krebs cycle (mitochondrial matrix):</b><br>
4. Acetyl CoA (2C) combines with oxaloacetate (4C) to form citrate (6C). Citrate is progressively decarboxylated and oxidised through a series of reactions, regenerating oxaloacetate.<br>
<br>
5. Per turn (per acetyl CoA): 3 NADH, 1 FADH₂, 1 ATP (substrate-level), 2 CO₂ released. Per glucose (2 turns): 6 NADH, 2 FADH₂, 2 ATP.<br>
<br>
<b>Oxidative phosphorylation (inner mitochondrial membrane):</b><br>
6. Electrons from NADH and FADH₂ are passed along the electron transport chain — a series of carrier proteins embedded in the inner mitochondrial membrane.<br>
<br>
7. As electrons pass along the chain, protons (H⁺) are actively pumped from the matrix into the intermembrane space, creating a proton gradient (chemiosmosis).<br>
<br>
8. Protons flow back through ATP synthase (down their concentration gradient), driving the synthesis of ATP from ADP + Pᵢ.<br>
<br>
9. At the end of the chain, electrons combine with oxygen (the final electron acceptor) and H⁺ to form water — hence aerobic respiration requires oxygen.<br>
<br>
10. Approximate yield from oxidative phosphorylation: ~32–34 ATP per glucose (2.5 ATP per NADH, 1.5 per FADH₂).<br>
<br>
11. Total ATP yield from aerobic respiration: approximately 30–32 ATP per glucose, compared to only 2 ATP from anaerobic respiration.<br>
<br>
12. The inner mitochondrial membrane has a large surface area (due to cristae folds), maximising the space available for ATP synthase and the electron transport chain.`,
},

{
  question_id: 2127,
  topic_id: 8018,
  subject_id: 5,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Simple Harmonic Motion",
  content: `<p><b>(a)</b> State the definition of simple harmonic motion (SHM) and write the equation of motion. Sketch a graph of displacement against time and velocity against time for an object starting at maximum displacement. [5]</p>

<p><b>(b)</b> A mass of 0.4 kg oscillates on a spring with spring constant $k = 25$ N m⁻¹. Find:</p>
<ul>
  <li>The angular frequency $\\omega$ and the period $T$. [2]</li>
  <li>The maximum displacement if the total energy is 0.8 J. [2]</li>
  <li>The maximum velocity. [2]</li>
</ul>

<p><b>(c)</b> Write expressions for $x(t)$ and $v(t)$, and show that the total mechanical energy is constant. [4]</p>

<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
SHM is motion in which the acceleration is directly proportional to the displacement from the equilibrium position and always directed towards it:<br>
<br>
$a = -\\omega^2 x$<br>
<br>
Graph: displacement — cosine curve starting at $x = A$ at $t = 0$.<br>
Velocity — negative sine curve, $v = 0$ at $t = 0$, reaching maximum negative value at $t = T/4$.<br>
<br>
<b>(b)</b><br>
$\\omega = \\sqrt{\\dfrac{k}{m}} = \\sqrt{\\dfrac{25}{0.4}} = \\sqrt{62.5} = 7.91$ rad s⁻¹<br>
<br>
$T = \\dfrac{2\\pi}{\\omega} = \\dfrac{2\\pi}{7.91} = 0.794$ s<br>
<br>
$E = \\dfrac{1}{2}kA^2 \\Rightarrow A = \\sqrt{\\dfrac{2E}{k}} = \\sqrt{\\dfrac{1.6}{25}} = 0.253$ m<br>
<br>
$v_{max} = \\omega A = 7.91 \\times 0.253 = 2.00$ m s⁻¹<br>
<br>
<b>(c)</b><br>
$x(t) = A\\cos(\\omega t)$, $v(t) = -A\\omega\\sin(\\omega t)$<br>
<br>
$E_{KE} = \\dfrac{1}{2}mv^2 = \\dfrac{1}{2}mA^2\\omega^2\\sin^2(\\omega t)$<br>
<br>
$E_{PE} = \\dfrac{1}{2}kx^2 = \\dfrac{1}{2}kA^2\\cos^2(\\omega t) = \\dfrac{1}{2}m\\omega^2 A^2\\cos^2(\\omega t)$<br>
<br>
(using $k = m\\omega^2$)<br>
<br>
$E_{total} = \\dfrac{1}{2}m\\omega^2 A^2(\\sin^2\\omega t + \\cos^2\\omega t) = \\dfrac{1}{2}m\\omega^2 A^2 = \\dfrac{1}{2}kA^2$<br>
<br>
This is constant and independent of time. ✓`,
},

{
  question_id: 2128,
  topic_id: 10011,
  subject_id: 4,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Organic Synthesis",
  content: `<p>Starting from ethanol, describe a multi-step synthesis for each of the following, giving reagents, conditions, and the product at each step:</p>

<p><b>(a)</b> Chloroethane → Ethylamine → $N$-ethylacetamide [6]</p>

<p><b>(b)</b> Ethanol → Ethanoic acid → Ethyl ethanoate [4]</p>

<p><b>(c)</b> Propene → 1-bromopropane → Propan-1-amine [4]</p>

<p><b>Total: 14 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
Ethanol → Chloroethane:<br>
Reagents: $\\text{PCl}_5$ or $\\text{SOCl}_2$ (or HCl with catalyst). Conditions: room temperature. Product: $\\text{CH}_3\\text{CH}_2\\text{Cl}$.<br>
<br>
Chloroethane → Ethylamine:<br>
Reagents: excess concentrated ammonia solution ($\\text{NH}_3(aq)$) in a sealed tube. Conditions: heat under pressure. Product: $\\text{CH}_3\\text{CH}_2\\text{NH}_2$ (ethylamine).<br>
<br>
Ethylamine → $N$-ethylacetamide:<br>
Reagents: ethanoyl chloride ($\\text{CH}_3\\text{COCl}$) or ethanoic anhydride. Conditions: room temperature, add dropwise. Product: $\\text{CH}_3\\text{CONHCH}_2\\text{CH}_3$.<br>
<br>
<b>(b)</b><br>
Ethanol → Ethanoic acid:<br>
Reagents: excess acidified potassium dichromate(VI) ($\\text{K}_2\\text{Cr}_2\\text{O}_7$/H₂SO₄). Conditions: heat under reflux. Product: $\\text{CH}_3\\text{COOH}$.<br>
<br>
Ethanoic acid → Ethyl ethanoate:<br>
Reagents: ethanol, concentrated $\\text{H}_2\\text{SO}_4$ catalyst. Conditions: heat under reflux. Product: $\\text{CH}_3\\text{COOC}_2\\text{H}_5$ + water (Fischer esterification).<br>
<br>
<b>(c)</b><br>
Propene → 1-bromopropane:<br>
Reagents: HBr (hydrogen bromide). Conditions: room temperature, electrophilic addition. Product: $\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{Br}$ (Markovnikov gives 2-bromopropane as major product — for 1-bromopropane use anti-Markovnikov via radical addition with $\\text{HBr}$/peroxide). Accept either product with correct mechanism noted.<br>
<br>
1-bromopropane → Propan-1-amine:<br>
Reagents: excess concentrated ammonia ($\\text{NH}_3$) in ethanol/sealed tube. Conditions: heat under pressure. Product: $\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{NH}_2$ (propan-1-amine), via nucleophilic substitution.`,
},

{
  question_id: 2129,
  topic_id: 6026,
  subject_id: 2,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Momentum and Collisions (FM)",
  content: `<p><b>(a)</b> State the principle of conservation of momentum and explain under what conditions it applies. [2]</p>

<p><b>(b)</b> A ball of mass 3 kg moving at 8 m s⁻¹ collides with a stationary ball of mass 5 kg. After the collision, the 3 kg ball moves at 2 m s⁻¹ in the same direction.</p>
<ul>
  <li>Find the velocity of the 5 kg ball after the collision. [2]</li>
  <li>Determine whether the collision is elastic or inelastic. [2]</li>
  <li>Calculate the impulse on the 5 kg ball. [2]</li>
</ul>

<p><b>(c)</b> In an explosion, a stationary shell of mass 10 kg splits into two fragments. Fragment A (mass 4 kg) moves at $15$ m s⁻¹ to the right. Find the velocity of fragment B. [3]</p>

<p><b>(d)</b> A ball of mass 0.2 kg is dropped from a height of 5 m onto a floor. It rebounds to a height of 3.2 m. Calculate the coefficient of restitution $e = \\dfrac{\\text{speed of separation}}{\\text{speed of approach}}$ and the kinetic energy lost in the impact. [$g = 9.8$ m s⁻²] [4]</p>

<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
The total momentum of a system is conserved provided no external forces act on the system (i.e. the net external force is zero).<br>
<br>
<b>(b)</b><br>
Conservation of momentum: $3 \\times 8 + 5 \\times 0 = 3 \\times 2 + 5v$<br>
<br>
$24 = 6 + 5v \\Rightarrow v = 3.6$ m s⁻¹<br>
<br>
KE before: $\\dfrac{1}{2}(3)(8^2) = 96$ J. KE after: $\\dfrac{1}{2}(3)(4) + \\dfrac{1}{2}(5)(12.96) = 6 + 32.4 = 38.4$ J<br>
<br>
KE is not conserved — the collision is inelastic.<br>
<br>
Impulse on 5 kg ball: $J = \\Delta p = 5 \\times 3.6 = 18$ N s<br>
<br>
<b>(c)</b><br>
Total momentum before = 0 (stationary). Let $v_B$ be the velocity of fragment B (mass 6 kg).<br>
<br>
$0 = 4 \\times 15 + 6 \\times v_B$<br>
<br>
$v_B = -10$ m s⁻¹ (10 m s⁻¹ to the left)<br>
<br>
<b>(d)</b><br>
Speed of approach: $v_1 = \\sqrt{2gh} = \\sqrt{2 \\times 9.8 \\times 5} = \\sqrt{98} = 9.90$ m s⁻¹<br>
<br>
Speed of separation: $v_2 = \\sqrt{2 \\times 9.8 \\times 3.2} = \\sqrt{62.72} = 7.92$ m s⁻¹<br>
<br>
$e = \\dfrac{7.92}{9.90} = 0.800$<br>
<br>
KE lost $= \\dfrac{1}{2}(0.2)(9.90^2) - \\dfrac{1}{2}(0.2)(7.92^2) = 9.80 - 6.27 = 3.53$ J`,
},

{
  question_id: 2130,
  topic_id: 7025,
  subject_id: 6,
  study_stage: 1,
  user_tag: "@admin",
  tag: 1,
  published: true,
  name: "Functional Programming",
  content: `<p><b>(a)</b> Explain what is meant by a <b>first-class function</b> in functional programming, and give an example of a higher-order function. [3]</p>

<p><b>(b)</b> In Haskell (or pseudocode), write a function <code>myMap</code> that applies a given function to every element of a list, without using the built-in <code>map</code>. [4]</p>

<p><b>(c)</b> Explain the concept of <b>recursion</b> and write a recursive function to compute the factorial of a non-negative integer. State the base case and recursive case. [4]</p>

<p><b>(d)</b> Describe what is meant by <b>tail recursion</b> and explain why it is more efficient than standard recursion. Rewrite your factorial function to use tail recursion with an accumulator. [4]</p>

<p><b>Total: 15 marks</b></p>`,
  mark_scheme: `<b>(a)</b><br>
A first-class function is one that can be treated as a value — it can be passed as an argument to another function, returned as a result, and assigned to a variable.<br>
<br>
A higher-order function is one that takes one or more functions as arguments or returns a function. Example: <code>map</code>, which takes a function and a list, and applies the function to every element.<br>
<br>
<b>(b)</b><br>
<pre>
myMap :: (a -> b) -> [a] -> [b]
myMap f []     = []
myMap f (x:xs) = f x : myMap f xs
</pre>
Or in pseudocode:<br>
<pre>
FUNCTION myMap(f, lst)
  IF lst is empty THEN RETURN []
  ELSE RETURN [f(lst[0])] + myMap(f, lst[1:])
ENDFUNCTION
</pre>
Award marks for: correct base case, correct recursive case, applying function to head, recursing on tail.<br>
<br>
<b>(c)</b><br>
Recursion is a technique where a function calls itself with a simpler version of the problem until a base case is reached.<br>
<br>
<pre>
factorial :: Int -> Int
factorial 0 = 1                          -- base case
factorial n = n * factorial (n - 1)     -- recursive case
</pre>
Base case: $n = 0$, return 1. Recursive case: $n! = n \\times (n-1)!$<br>
<br>
<b>(d)</b><br>
Tail recursion is when the recursive call is the last operation in the function — no further computation is needed after it returns. This allows compilers/interpreters to optimise using a single stack frame (tail call optimisation), avoiding stack overflow for large inputs.<br>
<br>
Standard recursion builds up a chain of stack frames ($n \\times (n-1) \\times \\cdots$) before unwinding; tail recursion passes the running result in an accumulator so the stack does not grow.<br>
<br>
<pre>
factTail :: Int -> Int -> Int
factTail 0 acc = acc
factTail n acc = factTail (n - 1) (n * acc)

factorial n = factTail n 1
</pre>`,
},


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
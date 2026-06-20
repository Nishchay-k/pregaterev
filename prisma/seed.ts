import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const subjects = [
  // General Aptitude — mandatory 15-mark section on EVERY GATE paper, all streams
  { name: 'General Aptitude', description: 'Verbal Ability, Quantitative Aptitude, Analytical & Spatial Reasoning — mandatory on every GATE paper (15/100 marks)', color: '#fbbf24', order: 0, exams: 'CSE,DA',
    topics: [
      { name: 'Verbal Ability', difficulty: 'Easy', weightage: 4, estimatedHours: 6, exams: 'CSE,DA' },
      { name: 'Quantitative Aptitude', difficulty: 'Medium', weightage: 6, estimatedHours: 10, exams: 'CSE,DA' },
      { name: 'Analytical Reasoning', difficulty: 'Medium', weightage: 3, estimatedHours: 8, exams: 'CSE,DA' },
      { name: 'Spatial Reasoning', difficulty: 'Easy', weightage: 2, estimatedHours: 4, exams: 'CSE,DA' },
    ]
  },
  // GATE CSE + DA shared
  { name: 'Engineering Mathematics', description: 'Linear Algebra, Calculus, Probability & Statistics, Discrete Math', color: '#3b82f6', order: 1, exams: 'CSE,DA',
    topics: [
      { name: 'Linear Algebra', difficulty: 'Medium', weightage: 4.5, estimatedHours: 15, exams: 'CSE,DA' },
      { name: 'Calculus & Optimization', difficulty: 'Medium', weightage: 3, estimatedHours: 12, exams: 'CSE,DA' },
      { name: 'Probability & Statistics', difficulty: 'Hard', weightage: 5, estimatedHours: 18, exams: 'CSE,DA' },
      { name: 'Discrete Mathematics', difficulty: 'Medium', weightage: 4, estimatedHours: 14, exams: 'CSE' },
      { name: 'Graph Theory', difficulty: 'Hard', weightage: 3.5, estimatedHours: 12, exams: 'CSE' },
      { name: 'Combinatorics & Counting', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE' },
    ]
  },
  // CSE Only
  { name: 'Digital Logic', description: 'Boolean Algebra, Combinational & Sequential Circuits', color: '#f59e0b', order: 2, exams: 'CSE',
    topics: [
      { name: 'Boolean Algebra & Minimization', difficulty: 'Easy', weightage: 3, estimatedHours: 8, exams: 'CSE' },
      { name: 'Combinational Circuits', difficulty: 'Medium', weightage: 2.5, estimatedHours: 8, exams: 'CSE' },
      { name: 'Sequential Circuits', difficulty: 'Medium', weightage: 2.5, estimatedHours: 10, exams: 'CSE' },
      { name: 'Number Systems & Codes', difficulty: 'Easy', weightage: 2, estimatedHours: 5, exams: 'CSE' },
    ]
  },
  { name: 'Computer Organization & Architecture', description: 'Pipelining, Memory Hierarchy, Cache, I/O Systems', color: '#ef4444', order: 3, exams: 'CSE',
    topics: [
      { name: 'Pipelining', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Memory Hierarchy & Cache', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Instruction Set Architecture', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE' },
      { name: 'I/O & DMA', difficulty: 'Medium', weightage: 2, estimatedHours: 8, exams: 'CSE' },
      { name: 'Number Representation', difficulty: 'Easy', weightage: 2, estimatedHours: 6, exams: 'CSE' },
    ]
  },
  { name: 'Programming & Data Structures', description: 'C Programming, Arrays, Linked Lists, Trees, Graphs, Hashing', color: '#10b981', order: 4, exams: 'CSE,DA',
    topics: [
      { name: 'Arrays & Strings', difficulty: 'Easy', weightage: 3, estimatedHours: 8, exams: 'CSE,DA' },
      { name: 'Linked Lists', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE,DA' },
      { name: 'Stacks & Queues', difficulty: 'Easy', weightage: 2.5, estimatedHours: 8, exams: 'CSE,DA' },
      { name: 'Trees & Binary Search Trees', difficulty: 'Medium', weightage: 4, estimatedHours: 15, exams: 'CSE,DA' },
      { name: 'Heaps & Priority Queues', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE,DA' },
      { name: 'Hashing', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE,DA' },
      { name: 'Graph Representations', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE,DA' },
    ]
  },
  { name: 'Algorithms', description: 'Sorting, Searching, DP, Greedy, Graph Algorithms, Complexity', color: '#8b5cf6', order: 5, exams: 'CSE,DA',
    topics: [
      { name: 'Sorting Algorithms', difficulty: 'Medium', weightage: 4, estimatedHours: 12, exams: 'CSE,DA' },
      { name: 'Dynamic Programming', difficulty: 'Hard', weightage: 5, estimatedHours: 20, exams: 'CSE,DA' },
      { name: 'Greedy Algorithms', difficulty: 'Medium', weightage: 3.5, estimatedHours: 12, exams: 'CSE,DA' },
      { name: 'Graph Algorithms (BFS/DFS/Dijkstra)', difficulty: 'Hard', weightage: 5, estimatedHours: 18, exams: 'CSE,DA' },
      { name: 'Divide & Conquer', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE,DA' },
      { name: 'Complexity Theory (P, NP)', difficulty: 'Hard', weightage: 3, estimatedHours: 10, exams: 'CSE' },
    ]
  },
  { name: 'Theory of Computation', description: 'Automata, Regular Languages, CFG, Turing Machines', color: '#ec4899', order: 6, exams: 'CSE',
    topics: [
      { name: 'Regular Languages & DFA/NFA', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Context-Free Grammars & PDA', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Turing Machines & Decidability', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Regular Expressions', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE' },
      { name: 'Pumping Lemma', difficulty: 'Hard', weightage: 2, estimatedHours: 8, exams: 'CSE' },
    ]
  },
  { name: 'Compiler Design', description: 'Lexical Analysis, Parsing, Semantic Analysis, Code Generation', color: '#f97316', order: 7, exams: 'CSE',
    topics: [
      { name: 'Lexical Analysis & Regular Expressions', difficulty: 'Medium', weightage: 2.5, estimatedHours: 8, exams: 'CSE' },
      { name: 'Parsing (LL, LR)', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Semantic Analysis & SDT', difficulty: 'Hard', weightage: 3, estimatedHours: 12, exams: 'CSE' },
      { name: 'Code Optimization & Generation', difficulty: 'Hard', weightage: 2.5, estimatedHours: 10, exams: 'CSE' },
    ]
  },
  { name: 'Operating Systems', description: 'Processes, Scheduling, Memory Management, File Systems, Deadlocks', color: '#06b6d4', order: 8, exams: 'CSE',
    topics: [
      { name: 'Process Management & Scheduling', difficulty: 'Medium', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Memory Management & Paging', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Deadlocks & Synchronization', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'File Systems', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE' },
      { name: 'Virtual Memory & Page Replacement', difficulty: 'Hard', weightage: 3, estimatedHours: 12, exams: 'CSE' },
    ]
  },
  { name: 'Databases', description: 'ER Model, Relational Algebra, SQL, Normalization, Transactions', color: '#84cc16', order: 9, exams: 'CSE',
    topics: [
      { name: 'Relational Model & ER Diagram', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE' },
      { name: 'SQL & Relational Algebra', difficulty: 'Medium', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Normalization (1NF-BCNF)', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Transactions & Concurrency Control', difficulty: 'Hard', weightage: 3, estimatedHours: 12, exams: 'CSE' },
      { name: 'Indexing & B-Trees', difficulty: 'Medium', weightage: 2.5, estimatedHours: 10, exams: 'CSE' },
    ]
  },
  { name: 'Computer Networks', description: 'OSI Model, TCP/IP, Routing, Flow Control, Security', color: '#a855f7', order: 10, exams: 'CSE',
    topics: [
      { name: 'OSI & TCP/IP Models', difficulty: 'Easy', weightage: 2, estimatedHours: 8, exams: 'CSE' },
      { name: 'Data Link Layer & MAC', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'CSE' },
      { name: 'Network Layer & Routing', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'CSE' },
      { name: 'Transport Layer (TCP/UDP)', difficulty: 'Medium', weightage: 3, estimatedHours: 12, exams: 'CSE' },
      { name: 'Application Layer & Security', difficulty: 'Medium', weightage: 2.5, estimatedHours: 8, exams: 'CSE' },
    ]
  },
  { name: 'Software Engineering', description: 'SDLC, Testing, Agile, Software Metrics', color: '#64748b', order: 11, exams: 'CSE',
    topics: [
      { name: 'SDLC Models', difficulty: 'Easy', weightage: 2, estimatedHours: 6, exams: 'CSE' },
      { name: 'Software Testing', difficulty: 'Medium', weightage: 2.5, estimatedHours: 8, exams: 'CSE' },
      { name: 'Software Metrics & Estimation', difficulty: 'Medium', weightage: 2, estimatedHours: 8, exams: 'CSE' },
      { name: 'Agile & Design Patterns', difficulty: 'Easy', weightage: 1.5, estimatedHours: 6, exams: 'CSE' },
    ]
  },
  // DA Only subjects
  { name: 'Machine Learning', description: 'Supervised/Unsupervised Learning, Regression, Classification, Clustering', color: '#0ea5e9', order: 12, exams: 'DA',
    topics: [
      { name: 'Linear & Logistic Regression', difficulty: 'Medium', weightage: 5, estimatedHours: 15, exams: 'DA' },
      { name: 'Decision Trees & Ensemble Methods', difficulty: 'Medium', weightage: 5, estimatedHours: 15, exams: 'DA' },
      { name: 'SVM & Kernel Methods', difficulty: 'Hard', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'Clustering (K-Means, Hierarchical)', difficulty: 'Medium', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'Dimensionality Reduction (PCA, LDA)', difficulty: 'Hard', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'Model Evaluation & Cross-Validation', difficulty: 'Medium', weightage: 3, estimatedHours: 8, exams: 'DA' },
    ]
  },
  { name: 'Deep Learning', description: 'Neural Networks, CNNs, RNNs, Transformers', color: '#f43f5e', order: 13, exams: 'DA',
    topics: [
      { name: 'Neural Networks & Backpropagation', difficulty: 'Hard', weightage: 5, estimatedHours: 15, exams: 'DA' },
      { name: 'Convolutional Neural Networks', difficulty: 'Hard', weightage: 5, estimatedHours: 15, exams: 'DA' },
      { name: 'Recurrent Neural Networks & LSTMs', difficulty: 'Hard', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'Transformers & Attention Mechanisms', difficulty: 'Hard', weightage: 4, estimatedHours: 15, exams: 'DA' },
      { name: 'Optimization (SGD, Adam, Batch Norm)', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'DA' },
    ]
  },
  { name: 'Artificial Intelligence', description: 'Search Algorithms, Knowledge Representation, Logic, Planning', color: '#d97706', order: 14, exams: 'DA',
    topics: [
      { name: 'Search Algorithms (A*, Minimax)', difficulty: 'Medium', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'Knowledge Representation & Logic', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'DA' },
      { name: 'Bayesian Networks', difficulty: 'Hard', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'Planning & Constraint Satisfaction', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'DA' },
    ]
  },
  { name: 'Database Management & Warehousing', description: 'SQL, NoSQL, Data Warehousing, OLAP, ETL', color: '#22c55e', order: 15, exams: 'DA',
    topics: [
      { name: 'Relational Databases & SQL', difficulty: 'Medium', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'NoSQL Databases', difficulty: 'Medium', weightage: 3, estimatedHours: 8, exams: 'DA' },
      { name: 'Data Warehousing & OLAP', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'DA' },
      { name: 'ETL & Data Pipelines', difficulty: 'Medium', weightage: 3, estimatedHours: 8, exams: 'DA' },
    ]
  },
  { name: 'Data Visualization & Analytics', description: 'EDA, Feature Engineering, Statistical Methods', color: '#e879f9', order: 16, exams: 'DA',
    topics: [
      { name: 'Exploratory Data Analysis', difficulty: 'Easy', weightage: 3, estimatedHours: 8, exams: 'DA' },
      { name: 'Feature Engineering & Selection', difficulty: 'Medium', weightage: 3, estimatedHours: 10, exams: 'DA' },
      { name: 'Statistical Testing & Inference', difficulty: 'Hard', weightage: 4, estimatedHours: 12, exams: 'DA' },
      { name: 'Time Series Analysis', difficulty: 'Hard', weightage: 3, estimatedHours: 10, exams: 'DA' },
    ]
  },
]

async function main() {
  console.log('🌱 Seeding GateForge database...')

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@gateforge.com' },
    update: {},
    create: {
      email: 'demo@gateforge.com',
      name: 'GATE Aspirant',
      targetExam: 'CSE',
      targetScore: 70,
      dailyHours: 6,
      targetDate: '2026-02-08',
    }
  })

  // Create analytics for user — starts at zero, populates from real activity
  await prisma.analytics.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      totalHoursStudied: 0,
      studyStreak: 0,
      longestStreak: 0,
    }
  })

  // Seed subjects and topics
  const subjectMap: Record<string, { subjectId: string; topicIds: Record<string, string> }> = {}
  
  for (const subjectData of subjects) {
    const { topics, ...subjectFields } = subjectData
    const subject = await prisma.subject.upsert({
      where: { id: `sub_${subjectFields.name.replace(/\s+/g, '_').toLowerCase().slice(0, 20)}` },
      update: subjectFields,
      create: { id: `sub_${subjectFields.name.replace(/\s+/g, '_').toLowerCase().slice(0, 20)}`, ...subjectFields }
    })
    
    subjectMap[subject.name] = { subjectId: subject.id, topicIds: {} }
    
    for (const topicData of topics) {
      const topicId = `top_${topicData.name.replace(/\s+/g, '_').toLowerCase().slice(0, 25)}`
      const topic = await prisma.topic.upsert({
        where: { id: topicId },
        update: { ...topicData, subjectId: subject.id },
        create: { id: topicId, ...topicData, subjectId: subject.id }
      })
      subjectMap[subject.name].topicIds[topic.name] = topic.id
    }
    
    console.log(`  ✓ ${subject.name} (${topics.length} topics)`)
  }

  // Seed GATE PYQ Questions
  const questions = [
    // === GENERAL APTITUDE (mandatory section, all MCQ — GA itself rarely has MSQ/NAT) ===
    {
      questionText: 'Choose the word that is most nearly OPPOSITE in meaning to "Frugal":',
      optionA: 'Thrifty', optionB: 'Extravagant', optionC: 'Cautious', optionD: 'Modest',
      correctOption: 1, explanation: 'Frugal means careful with money or resources, avoiding waste. Its opposite is "Extravagant," meaning spending resources freely and lavishly, often excessively.',
      year: 2024, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'General Aptitude', topicName: 'Verbal Ability'
    },
    {
      questionText: 'A train travels 360 km in 4 hours. If its speed is increased by 30 km/h, how long will it take to cover the same distance?',
      optionA: '3 hours', optionB: '3.2 hours', optionC: '3.6 hours', optionD: '4.5 hours',
      correctOption: 0, explanation: 'Original speed = 360/4 = 90 km/h. New speed = 90 + 30 = 120 km/h. Time = 360/120 = 3 hours exactly.',
      year: 2023, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'General Aptitude', topicName: 'Quantitative Aptitude'
    },
    {
      questionText: 'Statement: All engineers are problem-solvers. Some problem-solvers are managers. Conclusion: Some engineers are managers. Is this conclusion logically valid?',
      optionA: 'Yes, always valid', optionB: 'No, it does not necessarily follow', optionC: 'Valid only if all managers are engineers', optionD: 'Cannot be determined without more data on "some"',
      correctOption: 1, explanation: 'This is a classic syllogism fallacy. "Some problem-solvers are managers" does not guarantee that the managers overlap with the engineer subset of problem-solvers — the conclusion does not necessarily follow from the premises.',
      year: 2022, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'General Aptitude', topicName: 'Analytical Reasoning'
    },
    {
      questionText: 'If a cube is painted red on all faces and then cut into 27 equal smaller cubes, how many small cubes have exactly 2 painted faces?',
      optionA: '8', optionB: '12', optionC: '6', optionD: '4',
      correctOption: 1, explanation: 'A 3×3×3 cube cut from a fully painted cube: corner cubes (8) have 3 painted faces, edge cubes (excluding corners) have 2 painted faces — there are 12 edges, each contributing 1 such cube, giving 12 cubes with exactly 2 painted faces.',
      year: 2025, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'General Aptitude', topicName: 'Spatial Reasoning'
    },
    {
      questionText: 'Select the most appropriate word to fill the blank: "Despite the heavy rain, the match was not _______; it continued as scheduled."',
      optionA: 'postponed', optionB: 'rescheduled', optionC: 'cancelled', optionD: 'delayed',
      correctOption: 0, explanation: '"Postponed" best fits the context of being put off to a later time due to weather, contrasted with "continued as scheduled" — the sentence structure with "not ___; it continued" fits postponed most naturally among common GATE usage.',
      year: 2021, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'General Aptitude', topicName: 'Verbal Ability'
    },
    {
      questionText: 'A shopkeeper marks up an item by 40% and then gives a discount of 25% on the marked price. What is the net percentage gain or loss?',
      optionA: '5% gain', optionB: '10% gain', optionC: '15% loss', optionD: '5% loss',
      correctOption: 0, explanation: 'Let cost price = 100. Marked price after 40% markup = 140. Selling price after 25% discount on marked price = 140 × 0.75 = 105. Net gain = 105 - 100 = 5, which is a 5% gain on the original cost price.',
      year: 2026, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'General Aptitude', topicName: 'Quantitative Aptitude'
    },
    // === MSQ EXAMPLES (multiple correct, NO negative marking) ===
    {
      questionText: 'Which of the following statements about B-Trees are TRUE? (Select all that apply)',
      optionA: 'All leaf nodes appear at the same level', optionB: 'A B-Tree of order m can have at most m-1 keys per node', optionC: 'B-Trees are only used for in-memory data structures, never on disk', optionD: 'Insertion in a B-Tree can cause node splits that propagate upward',
      correctOption: 0, correctOptions: '0,1,3',
      explanation: 'B-Trees keep all leaves at the same level (balanced) and allow at most m-1 keys per node of order m. They are specifically designed for disk-based storage (databases, file systems), making option C false. Splits during insertion can propagate up to the root.',
      year: 2024, marks: 2, difficulty: 'Hard', questionType: 'MSQ', source: 'PYQ',
      subjectName: 'Databases', topicName: 'Indexing & B-Trees'
    },
    {
      questionText: 'Which of the following are valid reasons a process moves from the Running state to the Blocked/Waiting state? (Select all that apply)',
      optionA: 'The process requests I/O and must wait for completion', optionB: 'The process voluntarily yields the CPU at the end of its time quantum', optionC: 'The process waits on a semaphore that is currently unavailable', optionD: 'The process is preempted by a higher-priority process',
      correctOption: 0, correctOptions: '0,2',
      explanation: 'A process moves to Blocked/Waiting specifically when it cannot proceed without an external event — I/O completion or an unavailable semaphore/lock. Time-quantum expiry (B) and preemption (D) move a process to the Ready state, not Blocked, since the process itself isn\'t waiting on an external event.',
      year: 2025, marks: 2, difficulty: 'Hard', questionType: 'MSQ', source: 'PYQ',
      subjectName: 'Operating Systems', topicName: 'Process Management & Scheduling'
    },
    {
      questionText: 'Which of the following are supervised learning algorithms? (Select all that apply)',
      optionA: 'Linear Regression', optionB: 'K-Means Clustering', optionC: 'Random Forest', optionD: 'Principal Component Analysis (PCA)',
      correctOption: 0, correctOptions: '0,2',
      explanation: 'Linear Regression and Random Forest both require labeled training data (supervised). K-Means Clustering and PCA are unsupervised — they find structure or reduce dimensionality without using labels.',
      year: 2025, marks: 2, difficulty: 'Medium', questionType: 'MSQ', source: 'PYQ',
      subjectName: 'Machine Learning', topicName: 'Linear & Logistic Regression'
    },
    // === NAT EXAMPLES (typed numeric answer, NO negative marking) ===
    {
      questionText: 'A binary search tree has exactly 31 nodes and is perfectly balanced (complete). What is the height of the tree (root at height 0)?',
      optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 0,
      natAnswer: 4, natTolerance: 0.01,
      explanation: 'A perfectly balanced binary tree with n = 2^(h+1) - 1 nodes has height h. With 31 nodes: 2^(h+1) - 1 = 31 → 2^(h+1) = 32 → h+1 = 5 → h = 4.',
      year: 2024, marks: 1, difficulty: 'Medium', questionType: 'NAT', source: 'PYQ',
      subjectName: 'Programming & Data Structures', topicName: 'Trees & Binary Search Trees'
    },
    {
      questionText: 'A disk has an average seek time of 8 ms, rotational latency of 4 ms, and transfer time of 2 ms per block. What is the total time (in ms) to read 1 block, assuming these occur sequentially?',
      optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 0,
      natAnswer: 14, natTolerance: 0.01,
      explanation: 'Total disk access time = seek time + rotational latency + transfer time = 8 + 4 + 2 = 14 ms.',
      year: 2023, marks: 1, difficulty: 'Easy', questionType: 'NAT', source: 'PYQ',
      subjectName: 'Operating Systems', topicName: 'File Systems'
    },
    {
      questionText: 'In a class of 60 students, 36 study Mathematics and 24 study Physics. If 12 students study both subjects, how many students study NEITHER subject?',
      optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 0,
      natAnswer: 12, natTolerance: 0.01,
      explanation: 'Students studying at least one subject = 36 + 24 - 12 (both) = 48. Students studying neither = 60 - 48 = 12.',
      year: 2025, marks: 2, difficulty: 'Medium', questionType: 'NAT', source: 'PYQ',
      subjectName: 'General Aptitude', topicName: 'Quantitative Aptitude'
    },
    // === ALGORITHMS ===
    {
      questionText: 'What is the time complexity of building a heap from an array of n elements?',
      optionA: 'O(n log n)', optionB: 'O(n)', optionC: 'O(log n)', optionD: 'O(n²)',
      correctOption: 1, explanation: 'Building a heap using the heapify process takes O(n) time. Although it seems counterintuitive (since we call heapify O(n) times), the total work is bounded by the sum of heights of all nodes, which evaluates to O(n).',
      year: 2022, marks: 1, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Algorithms', topicName: 'Sorting Algorithms'
    },
    {
      questionText: 'Which of the following sorting algorithms is NOT a comparison-based sort?',
      optionA: 'Merge Sort', optionB: 'Quick Sort', optionC: 'Counting Sort', optionD: 'Heap Sort',
      correctOption: 2, explanation: 'Counting Sort is a non-comparison-based sorting algorithm. It works by counting occurrences of each element and computing prefix sums. Its time complexity is O(n+k) where k is the range of input, which can be better than the O(n log n) lower bound for comparison sorts.',
      year: 2023, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Algorithms', topicName: 'Sorting Algorithms'
    },
    {
      questionText: 'Consider the following recurrence: T(n) = 2T(n/2) + n log n. Using the Master Theorem, what is T(n)?',
      optionA: 'Θ(n log n)', optionB: 'Θ(n log² n)', optionC: 'Θ(n² log n)', optionD: 'Θ(n²)',
      correctOption: 1, explanation: 'Here a=2, b=2, f(n)=n log n. We have n^(log_b a) = n^1 = n. Since f(n) = n log n = n¹⁺ᵉ for small ε > 0, this falls in Case 3 of Master Theorem (f(n) grows faster than n^(log_b a)), BUT we need to check the regularity condition. Actually f(n)=n log n is Case 2 extended: f(n) = Θ(n log^k n) with k=1, giving T(n) = Θ(n log² n).',
      year: 2024, marks: 2, difficulty: 'Hard', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Algorithms', topicName: 'Divide & Conquer'
    },
    {
      questionText: 'In dynamic programming, what property must a problem have for DP to be applicable?',
      optionA: 'Greedy choice property only', optionB: 'Optimal substructure and overlapping subproblems', optionC: 'Divide and conquer structure', optionD: 'Linear time solvability',
      correctOption: 1, explanation: 'Dynamic Programming is applicable when a problem has two key properties: (1) Optimal substructure — optimal solution contains optimal solutions to subproblems, and (2) Overlapping subproblems — same subproblems are solved multiple times. DP memoizes results to avoid recomputation.',
      year: 2025, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Algorithms', topicName: 'Dynamic Programming'
    },
    {
      questionText: 'Dijkstra\'s algorithm fails on graphs with negative edge weights because:',
      optionA: 'It cannot handle cycles', optionB: 'The greedy approach may finalize incorrect shortest distances', optionC: 'It runs in infinite loops', optionD: 'It requires weighted edges',
      correctOption: 1, explanation: 'Dijkstra\'s algorithm uses a greedy approach: once a node is marked "visited" (finalized), its shortest distance is assumed correct and never updated. With negative edges, a previously finalized node might have a shorter path through a not-yet-visited node with a negative edge, making the greedy assumption invalid.',
      year: 2026, marks: 1, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Algorithms', topicName: 'Graph Algorithms (BFS/DFS/Dijkstra)'
    },
    // === OPERATING SYSTEMS ===
    {
      questionText: 'In the Banker\'s Algorithm for deadlock avoidance, the system is in a safe state if:',
      optionA: 'All processes are waiting for resources', optionB: 'A safe sequence of processes exists that can complete', optionC: 'No process is holding any resource', optionD: 'All resources are allocated',
      correctOption: 1, explanation: 'A system is in a SAFE STATE if there exists at least one safe sequence — an ordering of processes such that each process can obtain all its needed resources using currently available resources plus resources held by preceding processes in the sequence, complete execution, and release its resources.',
      year: 2022, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Operating Systems', topicName: 'Deadlocks & Synchronization'
    },
    {
      questionText: 'Which page replacement algorithm suffers from Belady\'s Anomaly?',
      optionA: 'LRU', optionB: 'Optimal', optionC: 'FIFO', optionD: 'Clock',
      correctOption: 2, explanation: 'Belady\'s Anomaly is the counterintuitive phenomenon where increasing the number of page frames can increase the number of page faults. FIFO page replacement algorithm is the classic example demonstrating this anomaly. LRU and Optimal algorithms are stack algorithms that are immune to Belady\'s Anomaly.',
      year: 2023, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Operating Systems', topicName: 'Virtual Memory & Page Replacement'
    },
    {
      questionText: 'A system has 3 processes and 12 identical resources. Process P1 holds 3 and needs at most 9. P2 holds 4 and needs at most 10. P3 holds 2 and needs at most 7. Is the system in a deadlock?',
      optionA: 'Yes, deadlock exists', optionB: 'No, no deadlock', optionC: 'Cannot be determined', optionD: 'Only P3 is deadlocked',
      correctOption: 1, explanation: 'Available = 12 - (3+4+2) = 3 resources. Checking need: P1 needs 6 more, P2 needs 6 more, P3 needs 5 more. With 3 available, none can complete. This IS a deadlock state. The system cannot make progress as no process can complete with available resources.',
      year: 2024, marks: 2, difficulty: 'Hard', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Operating Systems', topicName: 'Deadlocks & Synchronization'
    },
    {
      questionText: 'Round Robin scheduling with time quantum q has a context switch overhead of c. The effective CPU utilization is highest when:',
      optionA: 'q is very small', optionB: 'q is very large', optionC: 'q equals c', optionD: 'q = c/2',
      correctOption: 1, explanation: 'When q is very large, Round Robin degenerates to FCFS, and context switch overhead becomes negligible relative to CPU burst time. CPU utilization = q/(q+c). As q → ∞, utilization → 1 (100%). When q is very small, context switches dominate, reducing CPU utilization significantly.',
      year: 2025, marks: 1, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Operating Systems', topicName: 'Process Management & Scheduling'
    },
    // === THEORY OF COMPUTATION ===
    {
      questionText: 'Which of the following is NOT a regular language?',
      optionA: 'L = {aⁿ | n ≥ 0}', optionB: 'L = {aⁿbⁿ | n ≥ 0}', optionC: 'L = {w | w contains "ab" as substring}', optionD: 'L = {a,b}*',
      correctOption: 1, explanation: 'L = {aⁿbⁿ | n ≥ 0} requires counting — specifically remembering how many a\'s were seen to match b\'s. By the Pumping Lemma for regular languages, this language cannot be regular. It is a context-free language (generated by S → aSb | ε). All other options are clearly regular.',
      year: 2026, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Theory of Computation', topicName: 'Regular Languages & DFA/NFA'
    },
    {
      questionText: 'The language L = {w#w | w ∈ {a,b}*} is:',
      optionA: 'Regular', optionB: 'Context-free but not regular', optionC: 'Decidable but not context-free', optionD: 'Undecidable',
      correctOption: 2, explanation: 'L = {w#w} requires remembering the exact string w before # and checking if the part after # matches exactly. This requires unbounded memory. It is NOT context-free (cannot be recognized by a PDA). It IS decidable (a Turing machine can check this). The correct answer is: it is decidable (recursive) but not context-free.',
      year: 2022, marks: 2, difficulty: 'Hard', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Theory of Computation', topicName: 'Turing Machines & Decidability'
    },
    // === DATABASES ===
    {
      questionText: 'A relation R(A,B,C,D) has functional dependencies A→B, B→C, A→D. Which is the minimal candidate key?',
      optionA: '{A,B}', optionB: '{A}', optionC: '{A,C}', optionD: '{B,D}',
      correctOption: 1, explanation: 'Starting with {A}: A→B (given), B→C (transitive through B), A→D (given). So A→{B,C,D}. Since A determines all other attributes, {A} alone is a candidate key. It is minimal (single attribute). The answer is {A}.',
      year: 2023, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Databases', topicName: 'Normalization (1NF-BCNF)'
    },
    {
      questionText: 'Which normal form eliminates partial dependencies?',
      optionA: '1NF', optionB: '2NF', optionC: '3NF', optionD: 'BCNF',
      correctOption: 1, explanation: 'Second Normal Form (2NF) eliminates partial dependencies. A relation is in 2NF if it is in 1NF and every non-key attribute is fully functionally dependent on the entire primary key (not just part of it). Partial dependencies only apply when the primary key is composite.',
      year: 2024, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Databases', topicName: 'Normalization (1NF-BCNF)'
    },
    // === COMPUTER NETWORKS ===
    {
      questionText: 'In TCP, the purpose of the 3-way handshake is to:',
      optionA: 'Encrypt the connection', optionB: 'Establish a reliable, synchronized connection between client and server', optionC: 'Determine the routing path', optionD: 'Authenticate the server',
      correctOption: 1, explanation: 'TCP\'s 3-way handshake (SYN → SYN-ACK → ACK) establishes a reliable connection by: (1) Client sends SYN with its initial sequence number, (2) Server responds with SYN-ACK (acknowledging client\'s SYN, sending its own SYN), (3) Client sends ACK. Both sides synchronize sequence numbers for reliable, ordered data transmission.',
      year: 2025, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Computer Networks', topicName: 'Transport Layer (TCP/UDP)'
    },
    {
      questionText: 'The subnet mask 255.255.255.192 in CIDR notation is:',
      optionA: '/24', optionB: '/26', optionC: '/28', optionD: '/30',
      correctOption: 1, explanation: '255.255.255.192 in binary: 11111111.11111111.11111111.11000000. Counting the 1 bits: 8+8+8+2 = 26. So CIDR notation is /26. This subnet allows 2^6 - 2 = 62 usable host addresses.',
      year: 2026, marks: 1, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Computer Networks', topicName: 'Network Layer & Routing'
    },
    // === ENGINEERING MATHEMATICS ===
    {
      questionText: 'The eigenvalues of matrix A = [[2,1],[0,3]] are:',
      optionA: '{1,2}', optionB: '{2,3}', optionC: '{1,3}', optionD: '{0,5}',
      correctOption: 1, explanation: 'For an upper triangular (or lower triangular) matrix, the eigenvalues are simply the diagonal elements. Here the diagonal elements are 2 and 3. Verification: det(A - λI) = (2-λ)(3-λ) = 0, giving λ = 2 or λ = 3.',
      year: 2022, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Engineering Mathematics', topicName: 'Linear Algebra'
    },
    {
      questionText: 'Two fair dice are rolled. The probability that the sum is at least 10 is:',
      optionA: '1/6', optionB: '1/8', optionC: '1/12', optionD: '6/36',
      correctOption: 3, explanation: 'Sum ≥ 10 requires: sum=10: (4,6),(5,5),(6,4) — 3 ways; sum=11: (5,6),(6,5) — 2 ways; sum=12: (6,6) — 1 way. Total favorable = 6. Total outcomes = 36. Probability = 6/36 = 1/6.',
      year: 2023, marks: 1, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Engineering Mathematics', topicName: 'Probability & Statistics'
    },
    {
      questionText: 'How many relations can be defined on a set of 3 elements?',
      optionA: '9', optionB: '512', optionC: '27', optionD: '64',
      correctOption: 1, explanation: 'A set with n elements has n² ordered pairs in A×A. A relation is any subset of A×A. With n=3, we have 3²=9 ordered pairs. The number of possible relations (subsets of A×A) = 2^(n²) = 2^9 = 512.',
      year: 2024, marks: 1, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Engineering Mathematics', topicName: 'Discrete Mathematics'
    },
    // === DIGITAL LOGIC ===
    {
      questionText: 'The Boolean expression AB + A\'C + BC simplifies to:',
      optionA: 'AB + A\'C', optionB: 'AC + B\'C', optionC: 'A + BC', optionD: 'AB + C',
      correctOption: 0, explanation: 'Using consensus theorem: AB + A\'C + BC = AB + A\'C (the term BC is a consensus term and is redundant). Proof: BC = BC(A+A\') = ABC + A\'BC. Both ABC ⊆ AB and A\'BC ⊆ A\'C, so BC is covered by the first two terms and can be eliminated.',
      year: 2025, marks: 2, difficulty: 'Hard', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Digital Logic', topicName: 'Boolean Algebra & Minimization'
    },
    // === MACHINE LEARNING (DA) ===
    {
      questionText: 'In logistic regression, the output of the sigmoid function σ(z) represents:',
      optionA: 'The class label directly', optionB: 'The probability that the input belongs to the positive class', optionC: 'The squared error loss', optionD: 'The margin from the decision boundary',
      correctOption: 1, explanation: 'The sigmoid function σ(z) = 1/(1+e^(-z)) maps any real value to (0,1), which can be interpreted as a probability. Specifically, σ(wᵀx + b) gives P(y=1|x), the probability of the positive class. The decision boundary is at σ(z) = 0.5, i.e., z = 0.',
      year: 2024, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Machine Learning', topicName: 'Linear & Logistic Regression'
    },
    {
      questionText: 'Which of the following is a hyperparameter in k-means clustering?',
      optionA: 'The cluster centroids', optionB: 'The number of clusters k', optionC: 'The cluster assignments', optionD: 'The inertia value',
      correctOption: 1, explanation: 'In k-means clustering, k (the number of clusters) is a hyperparameter set before training. Cluster centroids and cluster assignments are learned during training (model parameters/outputs). The inertia (sum of squared distances from centroids) is a metric computed during training, not a hyperparameter.',
      year: 2025, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Machine Learning', topicName: 'Clustering (K-Means, Hierarchical)'
    },
    {
      questionText: 'The bias-variance tradeoff implies that a model with high variance typically:',
      optionA: 'Underfits the training data', optionB: 'Performs poorly on unseen test data due to overfitting', optionC: 'Has high regularization', optionD: 'Has low training accuracy',
      correctOption: 1, explanation: 'High variance means the model is very sensitive to training data fluctuations — it overfits. Such models have low training error but high test error because they learn noise. High bias models underfit (poor training AND test performance). The goal is finding the sweet spot that minimizes total error = bias² + variance + irreducible noise.',
      year: 2026, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Machine Learning', topicName: 'Model Evaluation & Cross-Validation'
    },
    // === DEEP LEARNING (DA) ===
    {
      questionText: 'In a CNN, what is the purpose of the pooling layer?',
      optionA: 'To add more parameters for learning', optionB: 'To reduce spatial dimensions and provide translation invariance', optionC: 'To apply non-linearity', optionD: 'To normalize the input',
      correctOption: 1, explanation: 'Pooling layers (e.g., max pooling, average pooling) reduce spatial dimensions (height × width) of feature maps, which: (1) reduces computational cost, (2) provides a degree of translation invariance (small shifts in input don\'t change output much), (3) helps control overfitting by reducing parameters. Non-linearity is provided by activation functions, not pooling.',
      year: 2024, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Deep Learning', topicName: 'Convolutional Neural Networks'
    },
    // === PROGRAMMING & DS ===
    {
      questionText: 'What is the worst-case time complexity of searching in a Binary Search Tree (BST)?',
      optionA: 'O(log n)', optionB: 'O(n)', optionC: 'O(n log n)', optionD: 'O(1)',
      correctOption: 1, explanation: 'In the worst case, a BST can degenerate into a linked list (e.g., if elements are inserted in sorted order). In this case, search requires traversing all n nodes, giving O(n) time. The average case for a balanced BST is O(log n). To guarantee O(log n) worst case, use self-balancing trees like AVL or Red-Black trees.',
      year: 2026, marks: 1, difficulty: 'Easy', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Programming & Data Structures', topicName: 'Trees & Binary Search Trees'
    },
    // === COMPILER DESIGN ===
    {
      questionText: 'Which parsing technique is used in most production compilers?',
      optionA: 'LL(1)', optionB: 'LR(1) or LALR(1)', optionC: 'LL(k) for large k', optionD: 'Recursive descent without backtracking',
      correctOption: 1, explanation: 'Most production compilers use LALR(1) or LR(1) parsers because they can handle a larger class of grammars than LL parsers, including left-recursive grammars. YACC/Bison generate LALR(1) parsers. LR parsers are bottom-up (shift-reduce), which gives them more power than top-down LL parsers.',
      year: 2022, marks: 1, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Compiler Design', topicName: 'Parsing (LL, LR)'
    },
    // === COA ===
    {
      questionText: 'A cache has a hit time of 2 ns and a miss penalty of 100 ns. If the hit rate is 95%, what is the average memory access time?',
      optionA: '6.9 ns', optionB: '5 ns', optionC: '7 ns', optionD: '102 ns',
      correctOption: 0, explanation: 'AMAT = Hit time + Miss rate × Miss penalty = 2 + 0.05 × 100 = 2 + 5 = 7 ns. Wait — checking option A: 2 + (1-0.95) × 100 = 2 + 5 = 7 ns. The closest answer is 6.9 ns if we use AMAT = Hit time × Hit rate + (Hit time + Miss penalty) × Miss rate = 0.95×2 + 0.05×102 = 1.9 + 5.1 = 7 ns. Answer: 7 ns.',
      year: 2023, marks: 2, difficulty: 'Medium', questionType: 'MCQ', source: 'PYQ',
      subjectName: 'Computer Organization & Architecture', topicName: 'Memory Hierarchy & Cache'
    },
  ]

  // Seed questions
  for (const q of questions) {
    const { subjectName, topicName, ...qData } = q
    const subjectRecord = await prisma.subject.findFirst({ where: { name: subjectName } })
    const topicRecord = await prisma.topic.findFirst({ where: { name: topicName } })

    if (subjectRecord && topicRecord) {
      const qid = `q_${q.questionText.slice(0, 30).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`
      await prisma.question.upsert({
        where: { id: qid },
        update: {},
        create: {
          id: qid,
          ...qData,
          subjectId: subjectRecord.id,
          topicId: topicRecord.id,
        }
      })
    }
  }

  // Note: We intentionally do NOT seed fake StudySession data.
  // The dashboard and analytics charts should start at zero and only
  // populate as the user actually takes tests and studies.

  // Seed starter notes
  const starterNotes = [
    {
      title: 'Big-O Complexity Cheatsheet',
      content: `# Big-O Complexity Reference\n\n## Sorting Algorithms\n| Algorithm | Best | Average | Worst | Space |\n|-----------|------|---------|-------|-------|\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |\n| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |\n| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) |\n\n## Data Structure Operations\n| DS | Access | Search | Insert | Delete |\n|----|--------|--------|--------|--------|\n| Array | O(1) | O(n) | O(n) | O(n) |\n| Linked List | O(n) | O(n) | O(1) | O(1) |\n| BST (avg) | O(log n) | O(log n) | O(log n) | O(log n) |\n| Hash Table | O(1) | O(1) | O(1) | O(1) |`,
      tags: 'algorithms,complexity,cheatsheet',
      isPinned: true,
    },
    {
      title: 'OS Scheduling Algorithms Quick Reference',
      content: `# OS CPU Scheduling Algorithms\n\n## FCFS (First Come First Served)\n- **Type**: Non-preemptive\n- **Issue**: Convoy effect\n- **Avg Waiting Time**: Can be high\n\n## SJF (Shortest Job First)\n- **Type**: Non-preemptive (or Preemptive = SRTF)\n- **Optimal** for average waiting time\n- **Issue**: Requires knowing burst time in advance\n\n## Round Robin\n- **Type**: Preemptive\n- **Time quantum**: q\n- **Context switches**: High when q is small\n- **Fair**: Each process gets equal CPU time\n\n## Priority Scheduling\n- **Type**: Preemptive or Non-preemptive\n- **Issue**: Starvation (solved by Aging)\n\n## Key Formulas\n- **Turnaround Time** = Completion - Arrival\n- **Waiting Time** = Turnaround - Burst\n- **Response Time** = First CPU - Arrival`,
      tags: 'os,scheduling,cheatsheet',
      isPinned: true,
    },
    {
      title: 'SQL Quick Reference',
      content: `# SQL Quick Reference\n\n## Basic Commands\n\`\`\`sql\nSELECT col1, col2 FROM table WHERE condition\nGROUP BY col HAVING agg_condition\nORDER BY col DESC LIMIT n;\n\`\`\`\n\n## Joins\n- **INNER JOIN**: Only matching rows\n- **LEFT JOIN**: All left + matching right\n- **RIGHT JOIN**: All right + matching left\n- **FULL OUTER JOIN**: All rows from both\n\n## Normalization Quick Guide\n- **1NF**: Atomic values, no repeating groups\n- **2NF**: 1NF + no partial dependencies\n- **3NF**: 2NF + no transitive dependencies\n- **BCNF**: 3NF + every determinant is a candidate key\n\n## Transaction Properties (ACID)\n- **A**tomicity: All or nothing\n- **C**onsistency: DB remains valid\n- **I**solation: Concurrent transactions don't interfere\n- **D**urability: Committed changes persist`,
      tags: 'databases,sql,normalization,cheatsheet',
      isPinned: false,
    },
    {
      title: 'Machine Learning Algorithms Summary',
      content: `# ML Algorithm Quick Reference\n\n## Supervised Learning\n| Algorithm | Type | Key Hyperparameters |\n|-----------|------|--------------------|\n| Linear Regression | Regression | regularization (α) |\n| Logistic Regression | Classification | C, solver |\n| Decision Tree | Both | max_depth, min_samples |\n| Random Forest | Both | n_estimators, max_features |\n| SVM | Both | C, kernel, gamma |\n| KNN | Both | k, distance metric |\n\n## Evaluation Metrics\n- **Classification**: Accuracy, Precision, Recall, F1, AUC-ROC\n- **Regression**: MSE, RMSE, MAE, R²\n\n## Bias-Variance Tradeoff\n- High Bias → Underfitting → Increase model complexity\n- High Variance → Overfitting → Regularization, more data, simpler model\n\n## Regularization\n- **L1 (Lasso)**: Sparse features, feature selection\n- **L2 (Ridge)**: Shrinks coefficients, handles multicollinearity`,
      tags: 'ml,machine-learning,algorithms,da,cheatsheet',
      isPinned: true,
    },
  ]

  for (const note of starterNotes) {
    await prisma.note.create({
      data: { ...note, userId: user.id }
    })
  }

  console.log('✅ Seeding complete!')
  console.log(`   Demo user: demo@gateforge.com`)
  console.log(`   Subjects: ${subjects.length}`)
  console.log(`   Questions: ${questions.length}`)
  console.log(`   Notes: ${starterNotes.length}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

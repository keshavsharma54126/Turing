export const dummyTests = [
    {
      id: "test-1",
      title: "Introduction to JavaScript",
      date: "2024-03-15",
      difficulty: "medium",
      numQuestions: 5,
      score: 80,
      topic: "Programming",
      questions: [
        {
          question: "What is the output of console.log(typeof [])?",
          options: ["array", "object", "undefined", "null"],
          correctAnswer: "object",
          explanation: "In JavaScript, arrays are actually objects. The typeof operator returns 'object' for arrays.",
          type: "comprehension"
        },
        {
          question: "Which method is used to add elements to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correctAnswer: "push()",
          explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
          type: "knowledge"
        },
        // Add more questions...
      ]
    },
    {
      id: "test-2",
      title: "Data Structures Fundamentals",
      date: "2024-03-14",
      difficulty: "hard",
      numQuestions: 8,
      score: 75,
      topic: "Computer Science",
      questions: [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
          correctAnswer: "O(log n)",
          explanation: "Binary search has logarithmic time complexity as it divides the search interval in half with each step.",
          type: "analysis"
        },
        // Add more questions...
      ]
    },
    {
      id: "test-3",
      title: "Python Basics",
      date: "2024-03-13",
      difficulty: "easy",
      numQuestions: 6,
      topic: "Programming",
      questions: [
        {
          question: "What is the correct way to create a list in Python?",
          options: ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)", "<1, 2, 3>"],
          correctAnswer: "[1, 2, 3]",
          explanation: "Square brackets [] are used to create lists in Python.",
          type: "basic"
        },
        // Add more questions...
      ]
    },
    {
      id: "test-4",
      title: "Web Development Fundamentals",
      date: "2024-03-12",
      difficulty: "medium",
      numQuestions: 10,
      score: 90,
      topic: "Web Development",
      questions: [
        {
          question: "Which HTML tag is used to create a hyperlink?",
          options: ["<link>", "<a>", "<href>", "<url>"],
          correctAnswer: "<a>",
          explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML.",
          type: "basic"
        },
        // Add more questions...
      ]
    }
  ];
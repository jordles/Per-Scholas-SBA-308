const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.
  try{
    // Validate Course Info
    validateCourseInfo(course);
    
    // Validate Assignment Group
    validateAssignmentGroup(ag);

    // Validate Learner Submissions
    validateLearnerSubmissions(submissions);

    if(course.id !== ag.course_id) throw new Error('Course IDs not valid');
    const result = submissions.reduce((acc, { learner_id, assignment_id, submission }) => {
      let learner = acc.find(item => item.id == learner_id); //look for the learner on the accumulator array
      if(!learner){ //if not found, create a new learner
        learner = { id: learner_id, avg: 0 };
        learner.id = learner_id;
        learner.totalScore = 0;
        learner.totalScorePossible = 0; 
        learner.avg = 0;
        acc.push(learner);
      }

      for(let assign of ag.assignments){
        if(assign.id == assignment_id){
          let latePenalty = 0;
          const notDue = new Date(assign.due_at) > new Date();
          const late = new Date(submission.submitted_at) > new Date(assign.due_at);
          if(notDue) continue; //if the assignment is not due yet, skip the rest of the logic
          if(late) {latePenalty = assign.points_possible * 0.1;}
          learner[assignment_id] = getAverage(submission.score, assign.points_possible, latePenalty);
          learner.totalScore += submission.score - latePenalty;
          learner.totalScorePossible += assign.points_possible;
          
        }
      }
      
      learner.avg = getAverage(learner.totalScore, learner.totalScorePossible);

      return acc;
    }, [])
    result.map(learner => { //to fulfill the requirement of 'removing items from an array or properties of an object'
      delete learner.totalScore;
      delete learner.totalScorePossible;
    });
    return result;

    //validation helper functions
    function validateCourseInfo(course) {
      const expectedTypes = {
        id: 'number',
        name: 'string'
      }
      for(const [key, value] of Object.entries(course)){
        if(typeof value !== expectedTypes[key]) throw new Error(`Course ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`);
      }
    }
    
    function validateAssignmentGroup(ag) {
      const expectedTypes = {
        id: 'number',
        name: 'string',
        course_id: 'number',
        group_weight: 'number',
        due_at: 'string',
        points_possible: 'number'
      }
      for(const [key, value] of Object.entries(ag)){
        if(typeof value !== expectedTypes[key]) throw new Error(`Assignment Group ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`);
        if (!Array.isArray(ag.assignments)) throw new Error('Assignment Group Assignments should be an array');
      }
      
      for(const [key, value] of Object.entries(ag.assignments)){
        if(typeof value !== expectedTypes[key]) throw new Error(`Assignment ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`);
        if(key === 'due_at' && typeof value !== expectedTypes[key]) throw new Error(`Assignment ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`);
        else if (!dateValidator(value)) throw new Error(`Assignment ${key} should be a valid date, use the format YYYY-MM-DD`);
      }
    }
    
    function validateLearnerSubmissions(submissions) {
      if (!Array.isArray(submissions)) throw new Error('Submissions should be an array');
    
      submissions.forEach(submission => {
        if (typeof submission.learner_id !== 'number') throw new Error('Learner id should be a number');
        if (typeof submission.assignment_id !== 'number') throw new Error('Assignment id should be a number');
        if (typeof submission.submission !== 'object') throw new Error('Submission should be an object');
        if (typeof submission.submission.submitted_at !== 'string') throw new Error('Submission submitted_at should be a string');
        else if (!dateValidator(submission.submission.submitted_at)) throw new Error('Submission submitted_at should be a valid date, use the format YYYY-MM-DD');
        if (typeof submission.submission.score !== 'number') throw new Error('Submission score should be a number');
      });
    }

    function dateValidator(date) {
      return /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date);
    }
    //helper function for finding the average
    function getAverage(score, pointsPossible, latePenalty = 0){
      if(pointsPossible === 0) throw new Error('Error: Listed Assignment is worth 0 points');
      return parseFloat(((score - latePenalty)/pointsPossible).toFixed(3));
    }
  }catch(err){
    console.log(err);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

/* const result = [
  {
    id: 125,
    avg: 0.985, // (47 + 150) / (50 + 150)
    1: 0.94, // 47 / 50
    2: 1.0 // 150 / 150
  },
  {
    id: 132,
    avg: 0.82, // (39 + 125) / (50 + 150)
    1: 0.78, // 39 / 50
    2: 0.833 // late: (140 - 15) / 150
  }
]; */

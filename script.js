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

/* -------------------------------------------------------------------------- */
/*                              START OF FUNCTION                             */
/* -------------------------------------------------------------------------- */

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
        learner = {};
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

    /* ---------------------------------------------------------------------- */
    /*                            HELPER FUNCTIONS                            */
    /* ---------------------------------------------------------------------- */

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
        assignments: 'array',
        due_at: 'string',
        points_possible: 'number'
      }
      for(const [key, value] of Object.entries(ag)){
        if(key === 'assignments'){
          if(!Array.isArray(value)) throw new Error('Assignment Group Assignments should be an array');
        }
        else if(typeof value !== expectedTypes[key]) {
          throw new Error(`Assignment Group ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`)
        };
      }
      
      ag.assignments.forEach(assign => {
        for(const [key, value] of Object.entries(assign)){
          if(typeof value !== expectedTypes[key]) {
            throw new Error(`Assignment ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`);
          }
          if(key === 'due_at' && !dateValidator(value)){
            throw new Error(`Assignment ${key} should be a valid date, use the format YYYY-MM-DD - ${key}: ${value}`);
          }
        }
      });
    }
    
    function validateLearnerSubmissions(submissions) {
      const expectedTypes = {
        learner_id: 'number',
        assignment_id: 'number',
        submission: 'object',
        submitted_at: 'string',
        score: 'number'
      }
      if (!Array.isArray(submissions)) throw new Error('Submissions should be an array');
      submissions.forEach(submission => {
        for (const [key, value] of Object.entries(submission)){
          if(key === 'submission'){
            if(typeof value !== 'object') throw new Error('Submission should be an object');
            for(const [key, val] of Object.entries(value)){
              if(typeof val !== expectedTypes[key]) throw new Error(`Submission ${key} should be a ${expectedTypes[key]} - ${key}: ${val}`);
            }
          }
          else if(typeof value !== expectedTypes[key]) throw new Error(`Submission ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`);
        }
      })
    }

    function dateValidator(date) {
      return /^(\d{4})(-|\/)(0[1-9]|1[0-2])(-|\/)(0[1-9]|[12]\d|3[01])$/.test(date);
      //check for any 4 digits representing the year, check for any 2 digit representing the month going up to 12, and check for any 2 digit representing the day going up to 31. Delimiters can be - or /
    }
    //helper function for finding the average
    function getAverage(score, pointsPossible, latePenalty = 0){
      if(pointsPossible === 0) throw new Error('Error: Listed Assignment is worth 0 points');
      return parseFloat(((score - latePenalty)/pointsPossible).toFixed(3));
    }
  }catch(err){
    console.error(err);
  }
}

/* -------------------------------------------------------------------------- */
/*                               END OF FUNCTION                              */
/* -------------------------------------------------------------------------- */

console.group('Answer');
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
console.groupEnd();

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

/* -------------------------------------------------------------------------- */
/*                            TESTING CASE EXAMPLES                           */
/* -------------------------------------------------------------------------- */
function deepClone(obj){
  return JSON.parse(JSON.stringify(obj))
}


function test(obj, key, value){
  // Deep clone the relevant objects, because objects are passed by reference and we don't want to mutate our original objects during testing. 

  let clonedCourseInfo = deepClone(CourseInfo);
  let clonedAssignmentGroup = deepClone(AssignmentGroup);
  let clonedLearnerSubmissions = deepClone(LearnerSubmissions);

  let clonedObj;
  switch (obj){
    case CourseInfo:
      clonedObj = clonedCourseInfo;
      break;
    case AssignmentGroup:
      clonedObj = clonedAssignmentGroup;
      break;
    case LearnerSubmissions:
      clonedObj = clonedLearnerSubmissions;
      break;
    default:
      throw new Error('Invalid object name'); 
  }
  const keys = key.split('.');
  let temp = clonedObj;
  while(keys.length > 1){ // while there are more nested keys, traverse the object to get the final key
    temp = temp[keys.shift()];
  }
  temp[keys[0]] = value; // Set the desired value to the last key; we know temp references the same object so changing temp will also change the clonedObj.

  /* clonedObj[key] = value; */
  const test = getLearnerData(clonedCourseInfo, clonedAssignmentGroup, clonedLearnerSubmissions);
}

console.group('Testing Case Examples');
test(CourseInfo, 'id', 123) //test if ids are matching between course info and assignment group
test(CourseInfo, 'id', '451') //test if ids are exactly numbers
test(AssignmentGroup, 'assignments.0.points_possible', 0); //test if points_possible are 0
test(LearnerSubmissions, '0.submission.score', '16'); //test if scores are a number

console.groupEnd();
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
    
    result.forEach(learner => { //to fulfill the requirement of 'removing items from an array or properties of an object'
      delete learner.totalScore;
      delete learner.totalScorePossible;
    });

    return result;

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
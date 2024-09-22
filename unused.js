function validateCourseInfo(course) {
  if (typeof course.id !== 'number') throw new Error(`Course id should be a number: ${id} ${course.id}`);
  /* else if (isNaN(+course.id)) */
  if (typeof course.name !== 'string') throw new Error('Course name should be a string');
}

function validateAssignmentGroup(ag) {
  if (typeof ag.id !== 'number') throw new Error('Assignment group id should be a number');
  if (typeof ag.name !== 'string') throw new Error('Assignment group name should be a string');
  if (typeof ag.course_id !== 'number') throw new Error('Assignment group course_id should be a number');
  if (!Array.isArray(ag.assignments)) throw new Error('Assignments should be an array');

  ag.assignments.forEach(assign => {
    if (typeof assign.id !== 'number') throw new Error('Assignment id should be a number');
    if (typeof assign.name !== 'string') throw new Error('Assignment name should be a string');
    if (typeof assign.due_at !== 'string') throw new Error('Assignment due_at should be a string');
    else if (!dateValidator(assign.due_at)) throw new Error('Assignment due_at should be a valid date, use the format YYYY-MM-DD');
    if (typeof assign.points_possible !== 'number') throw new Error('Assignment points_possible should be a number');
  });
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
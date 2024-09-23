# Per Scholas SBA 308 Javascript Fundamentals

This assignment aims to achieve the same result array given to us, by grapping data from the following objects:   
CourseInfo, AssignmentGroup, & LearnerSubmissions

[Live  Demo](https://jordles.github.io/Per-Scholas-SBA-308/)

```
const result = [
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
];
```

Entries of the learners are only logged in our results if the due date has passed its date in reference to today. 

## Requirements/Tracking

| Requirement | Weight | Finished |
| :-- | :--: | :--: |
| Declare variables properly using let and const where appropriate. | 5% | ✅ |
| Use operators to perform calculations on variables and literals. | 5% | ✅ |
| Use strings, numbers, and Boolean values cached within variables. | 5% | ✅ |
| Use at least two if/else statements to control program flow. Optionally, use at least one switch statement. | 10% | ✅ |
| Use try/catch statements to manage potential errors in the code, such as incorrectly formatted or typed data being fed into your program. | 5% | ✅ |
| Utilize at least two different types of loops. | 5% | ✅ |
| Utilize at least one loop control keyword such as break or continue. | 3% | ✅ |
| Create and/or manipulate arrays and objects. | 10% | ✅ |
| Demonstrate the retrieval, manipulation, and removal of items in an array or properties in an object. | 5% | ✅ |
| Use functions to handle repeated tasks. | 10% | ✅ |
| Program outputs processed data as described above. Partial credit will be earned depending on the level of adherence to the described behavior. | 20% | ✅ |
| Ensure that the program runs without errors (comment out things that do not work, and explain your blockers - you can still receive partial credit). | 10% | ✅ |
| Commit frequently to the git repository. | 5% | ✅ |
| Include a README file that contains a description of your application. | 2% | ✅ |


## Process

In my code, i use functions for reusable logic, incorporated various if and else statements for control flow, manipulate and traverse the objects to grab and display data efficiently through loops. I use a variety of data types and understand the differences between them and when to use them. 

I made an extensive and thorough type checking list, which i refactored further later on. 

```
function validateCourseInfo(course) {
  if (typeof course.id !== 'number') throw new Error('Course id should be a number');
  if (typeof course.name !== 'string') throw new Error('Course name should be a string');
}
```

to...

```
function validateCourseInfo(course) {
  for(const [key, value] of Object.entries(course)){
    if (key === 'id' && typeof value !== 'number') throw new Error(`Course id should be a number - ${key}: ${value}`);
    if (key === 'name' && typeof value !== 'string') throw new Error(`Course name should be a string - ${key}: ${value}`);
  }
}
```

to...

```
function validateCourseInfo(course) {
  const expectedTypes = {
    id: 'number',
    name: 'string'
  }
  for(const [key, value] of Object.entries(course)){
    if(typeof value !== expectedTypes[key]) throw new Error(`Course ${key} should be a ${expectedTypes[key]} - ${key}: ${value}`);
  }
}
```


## Testing

I also made a testing function, which must use dot notation for its second argument if we're traversing down the nesting arrays/objects. 

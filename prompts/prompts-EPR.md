Cursor project rules for AI created to apply best practices.

#1
@README.md @backend
Create the next endpoint:
GET /positions/:id/candidates
This endpoint will collect all candidates in process for a specific position, that is, all applications for a given positionID. It must provide the following basic information:
- Full name of the candidate (from the candidate table).
- current_interview_step: which phase of the process the candidate is in (from the application table).
- The average score of the candidate. Remember that each interview (interview) conducted by the candidate has a score.

Before applying any code ask for any clarifictation you need.
Also list the steps you are going to take.

#2
Clarify how to calculate the average score.
Clarify if the endpoint needs pagination.

#3
@README.md @backend
Create the next endpoint:
PUT /candidates/:id/stage
This endpoint will update the stage of the moved candidate. It lets you modify the current stage of the interview the candidate is on.

#4
Instead of importing prisma in @candidateService.ts better use the findOne static funcion in @Candidate.ts 

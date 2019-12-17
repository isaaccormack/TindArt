---
Title: Marking Rubric - Project
Authors: Neil Ernst
---

# Running Total (this will change each milestone):   40.5

NB: for all milestones, basic clean coding style: comments, standardized indentation, lack of code smells, is expected. Your submission and repository should show the following: 
	- Travis CI is being used (M3+)
	- a static analysis tool and linter has been applied (M3+)
	- Typescript project best practices are followed (M3+)

# Milestone 1    9 / 10

## Marking Guide	
- ASRs complete and capture
  - need to persist data
  - need to manage user state and cookies
  - security and privacy
  - usability
  - performance and latency
  - async issues

Marks deducted:
- scenarios seem to have little to no connection with the project (-2)
- poor technical writing  (-2)
- Quality of scenarios (clear analysis of stimulus, response, response measure)

## Notes M1
(explaining why marks were deducted)
-----
- I think a few user stories - particularly location ones - could have been expressed so this feature requirement was more obvious. It would be hard to see how to take this user story and start work on the implementation. 
- more comments in the issues themselves



# Milestone 2   16 / 20

## Marking Guide

- technical writing is clear and concise (key decisions are documented; organization is easy to follow; basic English spelling and writing conventions adhered to)
- design follows basic principles like cohesion/coupling, single responsibility, open/closed
- design addresses QAR from M1
- design provides path for implementing user stories in M1
- design models follow conventions for class and sequence diagrams
- design justifies technology choices
- ADRs (3+) explain why decision was taken, what the context is, and what alternatives were rejected
- ADRs don't capture trivial design decisions

## Notes M2

(explaining why marks were deducted)
-----

- Did not follow the convention of a class diagram. (-1)
- The Sequence diagram only outlines Webserver but is not broken down into modules or small chunks which are responsible for the implementation 
  of the user stories (-2)
- again neither the Sequence nor the class diagram has any rationale behind it and the individual responsibilities and design choices are not well 
  described (-1)

# Milestone 3 15.5 / 20

## Marking Guide

- code compiles
- code conventions/CI from above (commented, code style, design principles)
- working demo
- clear explanation of what user stories were satisfied in this iteration
- design as implemented follows design doc, or change rationale is present in README
- async is async when necessary
- TSLint does not complain
- test suite present/part of CI
- test coverage reasonable and meaningful


Marks deducted:

- Test suite is not present. (-2)
- Linter complains. (-0.5)
- Asynchronous programming was not followed everywhere. (-1)
- Coding convention and good coding design was not followed properly. (-1)

## Notes M3

(explaining why marks were deducted)
-----

- Test coverage is not present for the stories.
- Linter complains for some trivial problems. (ex. "")
- Asynchronous programming was only done to connect to database. The read/write operation could also be implemented Asynchronously.
- The methods are large. The database connection could be moved somewhere else to avoid having large methods.

# Milestone 4 23 / 30

## Marking Guide

- code compiles
- code conventions/CI from above (commented, code style, design principles)
- working demo
- clear explanation of what user stories were satisfied in this iteration
- design as implemented follows design doc, or change rationale is present in README
- async is async when necessary
- TSLint does not complain
- test suite present/part of CI
- test coverage reasonable and meaningful
- explanation of how you are automating testing 3 QAS from your list in M1
- explanation of integration testing and CI pipeline


Marks deducted:

- Does not follow the design principles properly. (-2)
- Linter complaines. (-0.5)
- Test Coverage. (-1.5)
- Does not fully comply with the QASs in the implementation(-3) 


## Notes M3

(explaining why marks were deducted)
-----

- Error messages could be a little bit more specific. Industry standard error codes could be used. Reduces maintability.
- Linter gives away some **line size** and **duplication** warning.
- Test coverage could be a little higher. Build report says it is only 57%
- I am not very sure about how session variable can contribute to security.

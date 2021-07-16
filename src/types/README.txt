For implementing calibration logic, the biggest obstacle to code 
readability is the types of objects. I find TypeScript to be too 
strict for building interfaces. Thus, C-like data structures have 
been implemented in this file to improve readability and ease 
expansion. 

These classes simply manipulate plain javascript objects. They are
completely serializable (for redux) and purely stylistic.
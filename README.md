https://rubicon2.github.io/odin-battleship/

## Challenges
A big challenge in this project was knowing what to test and how. So much so, that I am going to go through all the Odin testing material again and try to get a better grasp of it.

The way I felt I should design the game conflicted with the tests, and often found myself writing extra methods in my classes just to be able to test things. It is likely the design is bad, and the code (the less said about index.js, the better) certainly looks that way, although TDD is supposed to encourage simplicity. I can only conclude that I have been using the tests in the wrong way, testing the wrong things, etc. I will take another look at Sandi Metz's talk on the subject of _what_ to test. 

A unit test should test only one thing. However, for example: if you have a class with a private field and two methods that set/get those private fields, how are you supposed to test the class without using both of the methods at once? It doesn't seem possible in this example. Is the solution to not test that class at all, as there are no public side effects other than those obtainable by using the get method? 

Also, mocking? I understand the need to not spam an API when running tests, but I don't get why we don't just create a fake result to use in our test, instead of pretending to call a function that will return the same result. So I am going to dive deep into that. 

## To Do
- Revise both Odin lessons on testing
- Go through the fun fun function lessons again
- Watch Sandi Metz's talk again
- Find some other resources on testing and mocking
- Make a small project that adheres strictly to TDD principles (ideas?)

## Useful Resources
- [Article on mocking in jest](https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c)
- [Talk on mocks](https://www.youtube.com/watch?v=Af4M8GMoxi4)

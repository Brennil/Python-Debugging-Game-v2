
import type { QuizQuestion } from '../types';

export const QUESTION_BANK: QuizQuestion[] = [
    // Syntax Errors
    {
        id: 'syn-01',
        code: 'def my_function()\n  print("Hello")',
        errorLine: 1,
        correctLineText: 'def my_function():',
        explanation: 'Syntax Error: A function definition must end with a colon (:).',
        errorType: 'SyntaxError',
    },
    {
        id: 'syn-02',
        code: 'name = "Alice"\nif name == "Alice"\n  print("Hi Alice!")',
        errorLine: 2,
        correctLineText: 'if name == "Alice":',
        explanation: 'Syntax Error: An if statement requires a colon (:) at the end of the line.',
        errorType: 'SyntaxError',
    },
    {
        id: 'syn-03',
        code: '# Python 3 code\nprint "Hello, world!"',
        errorLine: 2,
        correctLineText: 'print("Hello, world!")',
        explanation: "SyntaxError: In Python 3, print is a function and requires parentheses.",
        errorType: 'SyntaxError'
    },
    {
        id: 'syn-04',
        code: 'message = "Hello, world\'\nprint(message)',
        errorLine: 1,
        correctLineText: 'message = "Hello, world"',
        explanation: "SyntaxError: You started the string with a double quote but ended with a single quote.",
        errorType: 'SyntaxError'
    },
    // Indentation Error
    {
        id: 'ind-01',
        code: 'def say_hello():\nprint("Welcome")',
        errorLine: 2,
        correctLineText: '  print("Welcome")',
        explanation: 'IndentationError: The code inside a function must be indented.',
        errorType: 'IndentationError',
    },
    // Name Error
    {
        id: 'nam-01',
        code: 'message = "Hello World"\nprint(mesage)',
        errorLine: 2,
        correctLineText: 'print(message)',
        explanation: 'NameError: The variable "mesage" is not defined. It\'s likely a typo for "message".',
        errorType: 'NameError',
    },
    // Type Error
    {
        id: 'typ-01',
        code: 'count = 5\nmessage = "You have " + count + " new messages."\nprint(message)',
        errorLine: 2,
        correctLineText: 'message = "You have " + str(count) + " new messages."',
        explanation: 'TypeError: You cannot concatenate a string with an integer. Use str() to convert the number to a string first.',
        errorType: 'TypeError',
    },
    // Index Error
    {
        id: 'idx-01',
        code: 'letters = ["a", "b", "c"]\nprint(letters[3])',
        errorLine: 2,
        correctLineText: 'print(letters[2])',
        explanation: 'IndexError: The list index is out of range. The last item is at index 2.',
        errorType: 'IndexError',
    },
    // Key Error
    {
        id: 'key-01',
        code: 'student = {"name": "Bob", "age": 20}\nprint(student["grade"])',
        errorLine: 2,
        correctLineText: 'print(student["age"])',
        explanation: 'KeyError: The key "grade" does not exist in the dictionary.',
        errorType: 'KeyError',
    },
    // Value Error
    {
        id: 'val-01',
        code: 'number_str = "ten"\nnumber_int = int(number_str)',
        errorLine: 2,
        correctLineText: 'number_str = "10"',
        explanation: 'ValueError: The int() function cannot convert the string "ten" to an integer.',
        errorType: 'ValueError',
    },
    // Logical Error
    {
        id: 'log-01',
        code: 'numbers = [1, 2, 3, 4, 5]\nfor num in numbers:\n  if num % 2 == 1:\n    print(f"{num} is an even number.")',
        errorLine: 3,
        correctLineText: '  if num % 2 == 0:',
        explanation: 'Logical Error: The condition for an even number is `num % 2 == 0`, not 1.',
        errorType: 'Logical Error',
    },
    {
        id: 'log-02',
        code: 'x = 10\nif x = 5:\n  print("x is 5")',
        errorLine: 2,
        correctLineText: 'if x == 5:',
        explanation: "SyntaxError: Use `==` for comparison and `=` for assignment. This line should be `if x == 5:`.",
        errorType: 'SyntaxError'
    },
    // ZeroDivisionError
    {
        id: 'zer-01',
        code: 'numerator = 10\ndenominator = 0\nresult = numerator / denominator',
        errorLine: 3,
        correctLineText: 'denominator = 1',
        explanation: 'ZeroDivisionError: You cannot divide a number by zero.',
        errorType: 'ZeroDivisionError'
    },
    // AttributeError
    {
        id: 'att-01',
        code: 'my_list = [1, 2, 3]\nmy_list.append(4)\nmy_list.sort()\nprint(my_list.length)',
        errorLine: 4,
        correctLineText: 'print(len(my_list))',
        explanation: "AttributeError: List objects don't have a 'length' attribute. Use the len() function to get the length of a list.",
        errorType: 'AttributeError'
    },
];

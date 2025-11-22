# Node.js Theory Notes

## 1. Introduction
Node.js is a JavaScript runtime built on Chrome's V8 engine, allowing server-side scripting and building scalable network applications.

## 2. Event Loop
The event loop enables non-blocking I/O operations, making Node.js highly scalable.

### Example:
```js
console.log('Start');
setTimeout(() => {
	console.log('Timeout');
}, 1000);
console.log('End');
```

## 3. Modules
Modules help organize code. Use `require` or `import` to include modules.

### Example:
```js
// math.js
module.exports.add = (a, b) => a + b;

// app.js
const math = require('./math');
console.log(math.add(2, 3));
```

## 4. Express for APIs
Express is a popular Node.js framework for building RESTful APIs.

### Example:
```js
const express = require('express');
const app = express();

app.get('/api', (req, res) => {
	res.send('Hello API');
});

app.listen(3000, () => console.log('Server running'));
```

## 5. Middleware
Middleware functions process requests before they reach the endpoint.

### Example:
```js
function logger(req, res, next) {
	console.log(req.method, req.url);
	next();
}
app.use(logger);
```

## 6. File System Operations
Node.js provides fs module for file operations.

### Example:
```js
const fs = require('fs');

// Read file
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write file
fs.writeFile('file.txt', 'Hello World', (err) => {
  if (err) throw err;
  console.log('File written');
});
```

## 7. Streams
Streams are objects that let you read data from a source or write data to a destination in continuous fashion.

### Example:
```js
const fs = require('fs');
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);
```

## 8. Useful Exam Patterns
- Use modules for code organization
- Use event loop for async operations
- Build RESTful APIs with Express
- Use middleware for logging/authentication

## 9. Sample Exam Q&A
**Q: What is the event loop?**
A: Mechanism for non-blocking async operations in Node.js.

**Q: How do you create a RESTful API?**
A: Use Express to define endpoints and handle requests.

**Q: What are streams in Node.js?**
A: Objects for reading/writing data in continuous fashion.

**Q: How do you handle file operations?**
A: Use the fs module.

## 10. Debugging Tips
- Use Node.js debugger with --inspect flag
- Monitor event loop blocking
- Check for memory leaks
- Review asynchronous code patterns

## 11. Sample Exam Tasks
- Explain the Node.js event loop
- Describe module system and require()
- Discuss streams and their types
- Explain file system operations

---
Refer to your slides (Express_Node-Backend.pptx.pdf) for diagrams and more examples.

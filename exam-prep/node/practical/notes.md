# Node.js Practical Notes

## 1. Create a RESTful API with Express
### Example:
```js
const express = require('express');
const app = express();

app.get('/api', (req, res) => {
	res.send('Hello API');
});

app.listen(3000, () => console.log('Server running'));
```

## 2. Add Middleware
### Example:
```js
function logger(req, res, next) {
	console.log(req.method, req.url);
	next();
}
app.use(logger);
```

## 3. Protect Endpoints
### Example:
```js
function auth(req, res, next) {
	if (req.headers.authorization) next();
	else res.status(401).send('Unauthorized');
}
app.get('/protected', auth, (req, res) => {
	res.send('Protected route');
});
```

## 4. Common Pitfalls
- Blocking the event loop with synchronous operations
- Not handling promise rejections
- Memory leaks from unclosed connections

## 5. Debugging Tips
- Use `node --inspect` for debugging
- Use `console.log` for logging
- Check for unhandled promise rejections

## 6. Sample Exam Tasks
- Create a RESTful API endpoint
- Add logging middleware
- Protect endpoint with authentication middleware
- Handle file uploads

## 7. Full Example: File Upload API
```js
const express = require('express');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

app.listen(3000, () => console.log('Server running'));
```

---
Refer to your codebase and slides for more examples.

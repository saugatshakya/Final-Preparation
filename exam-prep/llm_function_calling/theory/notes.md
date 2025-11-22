# LLM Function Calling Theory Notes

## 1. Introduction
Large Language Models (LLMs) like GPT can perform function calling, allowing them to interact with external systems and APIs to provide more accurate and dynamic responses.

## 2. What is Function Calling?
Function calling enables LLMs to:
- Call external functions or APIs
- Retrieve real-time data
- Perform calculations
- Interact with databases
- Execute custom logic

## 3. How It Works
1. Define available functions with schemas
2. LLM decides which function to call based on user query
3. System executes the function
4. LLM receives results and generates response

## 4. Function Schema
Functions are defined with:
- Name
- Description
- Parameters (type, required, etc.)

### Example Schema:
```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name"
      }
    },
    "required": ["location"]
  }
}
```

## 5. Integration in Full Stack Apps
- Backend: Handle function calls, execute logic
- Frontend: Display results, handle user interactions
- Security: Validate function calls, rate limiting

## 6. Benefits
- Dynamic responses based on real data
- Reduced hallucinations
- Enhanced user experience
- Automation of complex tasks

## 7. Key Takeaways
- LLM function calling enables dynamic interactions with external systems
- Functions are defined with JSON schemas including name, description, and parameters
- Backend handles function execution and result processing
- Security considerations include input validation and rate limiting

## 8. Advanced Concepts
### Parallel Function Calling
```js
// Multiple functions in one request
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: messages,
  functions: [getWeatherFunction, getLocationFunction],
  function_call: 'auto' // or 'none' or specific function name
});
```

### Function Result Processing
```js
if (response.choices[0].finish_reason === 'function_call') {
  const functionCalls = response.choices[0].message.function_call;
  
  // Handle multiple function calls
  if (Array.isArray(functionCalls)) {
    const results = await Promise.all(
      functionCalls.map(async (call) => {
        const result = await executeFunction(call.name, call.arguments);
        return {
          role: 'function',
          name: call.name,
          content: JSON.stringify(result)
        };
      })
    );
    
    // Send all results back
    messages.push(...results);
  }
}
```

### Error Handling in Functions
```js
async function safeExecuteFunction(name, args) {
  try {
    // Validate arguments
    const validatedArgs = validateFunctionArgs(name, args);
    
    // Execute function
    const result = await executeFunction(name, validatedArgs);
    
    return result;
  } catch (error) {
    console.error(`Function ${name} failed:`, error);
    return { error: 'Function execution failed', details: error.message };
  }
}
```

## 9. Integration Patterns
### Database Queries
```js
const databaseFunctions = [
  {
    name: 'query_database',
    description: 'Execute a database query',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'SQL or MongoDB query' },
        collection: { type: 'string', description: 'Database collection/table' }
      },
      required: ['query']
    }
  }
];
```

### API Calls
```js
const apiFunctions = [
  {
    name: 'call_external_api',
    description: 'Make HTTP request to external API',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'API endpoint URL' },
        method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
        headers: { type: 'object', description: 'Request headers' },
        body: { type: 'object', description: 'Request body' }
      },
      required: ['url', 'method']
    }
  }
];
```

## 10. Security Best Practices
- Validate all function arguments
- Implement rate limiting per user/API key
- Use allowlists for permitted functions
- Sanitize inputs to prevent injection attacks
- Log function calls for auditing
- Implement timeout for function execution

## 11. Common Exam Scenarios
- Define function schemas for specific use cases
- Implement function execution logic
- Handle function results and error cases
- Integrate with chat interfaces
- Secure function calling endpoints

---
Refer to your slides (FunctionCalling.pptx.pdf) for diagrams and more examples.
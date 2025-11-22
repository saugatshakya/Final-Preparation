# LLM Function Calling Practical Notes

## 1. Setting Up Function Calling

### Backend (Node.js/Express):

```js
const functions = [
  {
    name: "get_user_info",
    description: "Get user information by ID",
    parameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
      },
      required: ["userId"],
    },
  },
];

// In your LLM integration
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: messages,
  functions: functions,
  function_call: "auto",
});
```

## 2. Handling Function Calls

### Example:

```js
if (response.choices[0].finish_reason === "function_call") {
  const functionCall = response.choices[0].message.function_call;
  const functionName = functionCall.name;
  const args = JSON.parse(functionCall.arguments);

  let result;
  if (functionName === "get_user_info") {
    result = await getUserInfo(args.userId);
  }

  // Send result back to LLM
  const secondResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      ...messages,
      response.choices[0].message,
      {
        role: "function",
        name: functionName,
        content: JSON.stringify(result),
      },
    ],
  });
}
```

## 3. Frontend Integration

### React Example:

```jsx
function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    setIsLoading(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, functions }),
    });
    const data = await response.json();
    setMessages([...messages, { role: "user", content: message }, data]);
    setIsLoading(false);
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} className={msg.role}>
          {msg.content}
        </div>
      ))}
      {isLoading && <div>AI is thinking...</div>}
    </div>
  );
}
```

## 4. Security Considerations

- Validate function parameters
- Implement rate limiting
- Use API keys securely
- Sanitize inputs

## 5. Sample Exam Tasks

- Implement a function for LLM calling
- Handle function call responses
- Integrate with frontend chat interface
- Add security measures

## 13. Troubleshooting Guide

### Common Issues:

- **Function not called:** Check function schema format
- **Invalid arguments:** Validate parameter definitions
- **API errors:** Check OpenAI API key and model availability
- **Result processing failed:** Handle different response formats

### Debugging Steps:

1. Test function schemas independently
2. Log function call requests and responses
3. Verify argument parsing
4. Check error handling in function execution

## 14. Full Integration Example

### Backend API with Function Calling

```js
const express = require("express");
const { OpenAI } = require("openai");
const app = express();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// Function definitions
const functions = [
  {
    name: "get_weather",
    description: "Get current weather for a city",
    parameters: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name" },
      },
      required: ["city"],
    },
  },
  {
    name: "calculate",
    description: "Perform mathematical calculations",
    parameters: {
      type: "object",
      properties: {
        expression: { type: "string", description: "Math expression" },
      },
      required: ["expression"],
    },
  },
];

// Function executors
const functionExecutors = {
  get_weather: async (args) => {
    // Mock weather API call
    const weatherData = {
      [args.city]: {
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)],
      },
    };
    return weatherData;
  },

  calculate: (args) => {
    try {
      // Simple eval for demo (use a proper math library in production)
      const result = eval(args.expression);
      return { result };
    } catch (error) {
      return { error: "Invalid expression" };
    }
  },
};

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      functions: functions,
      function_call: "auto",
    });

    const message = response.choices[0].message;

    if (message.function_call) {
      const { name, arguments: args } = message.function_call;
      const parsedArgs = JSON.parse(args);

      const result = await functionExecutors[name](parsedArgs);

      // Send result back to OpenAI
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          ...messages,
          message,
          {
            role: "function",
            name: name,
            content: JSON.stringify(result),
          },
        ],
      });

      res.json({
        message: secondResponse.choices[0].message.content,
        functionCalled: name,
      });
    } else {
      res.json({ message: message.content });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Frontend React Chat Interface

```jsx
import { useState, useRef, useEffect } from "react";

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.message,
        functionCalled: data.functionCalled,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>AI Assistant with Function Calling</h1>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: msg.role === "user" ? "#007bff" : "#f1f1f1",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "70%",
              }}
            >
              {msg.content}
              {msg.functionCalled && (
                <div
                  style={{ fontSize: "0.8em", marginTop: "4px", opacity: 0.7 }}
                >
                  (Called function: {msg.functionCalled})
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: "left", marginBottom: "10px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#f1f1f1",
              }}
            >
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about weather or calculations..."
          style={{ flex: 1, padding: "8px" }}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{ padding: "8px 16px" }}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
        Try: "What's the weather like in New York?" or "Calculate 15 * 23"
      </div>
    </div>
  );
}

export default ChatApp;
```

## 15. Best Practices

- Define clear, specific function descriptions
- Validate all function arguments
- Implement proper error handling
- Use environment variables for API keys
- Monitor function call usage
- Cache frequently requested data
- Implement rate limiting

---

Refer to your slides (FunctionCalling.pptx.pdf) for diagrams and more examples.

import React, { useEffect, useState } from "react";
import "./styles.css";

const API_BASE = "http://localhost:3001";

const tools = [
  {
    id: "chat",
    name: "AI Chat",
    description: "Ask anything",
    icon: "✦",
    color: "purple",
  },
  {
    id: "code",
    name: "Code Lab",
    description: "Build & debug",
    icon: "</>",
    color: "blue",
  },
  {
    id: "image",
    name: "Image Studio",
    description: "Create visuals",
    icon: "◈",
    color: "pink",
  },
];

function App() {
  const [activeTool, setActiveTool] = useState("chat");

  // =========================
  // BACKEND STATUS
  // =========================

  const [backendOnline, setBackendOnline] = useState(false);

  // =========================
  // CHAT
  // =========================

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey! I'm Codie AI. What would you like to create today?",
    },
  ]);

  // =========================
  // CODE LAB
  // =========================

  const [code, setCode] = useState(
`// Type or paste your code here in any language
function helloWorld() {
  console.log("Hello, Codie!");
}`
  );

  const [codeLanguage, setCodeLanguage] = useState("");
  const [codeQuestion, setCodeQuestion] = useState("");
  const [codeResponse, setCodeResponse] = useState("");

  // =========================
  // IMAGE STUDIO
  // =========================

  const [imagePrompt, setImagePrompt] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [imageStyle, setImageStyle] = useState("Cinematic");

  // =========================
  // GENERAL
  // =========================

  const [loading, setLoading] = useState(false);

  const active = tools.find((tool) => tool.id === activeTool);

  // =========================
  // CHECK BACKEND
  // =========================

  useEffect(() => {
    checkBackend();

    const interval = setInterval(() => {
      checkBackend();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function checkBackend() {
    try {
      const response = await fetch(`${API_BASE}/api/health`);

      if (response.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch (error) {
      setBackendOnline(false);
    }
  }

  // =========================
  // CLEAN UP IMAGE URL
  // =========================

  useEffect(() => {
    return () => {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  // =========================
  // CHAT FUNCTIONS
  // =========================

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The chatbot request failed."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.response ||
            "I wasn't able to generate a response.",
        },
      ]);

      setBackendOnline(true);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "Sorry, I couldn't connect to the AI service. Make sure your Codie backend is running and your Hugging Face token is configured correctly.",
        },
      ]);

      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // CODE FUNCTIONS
  // =========================

  async function explainCode() {
    if (loading) return;

    setLoading(true);
    setCodeResponse("");

    try {
      const response = await fetch(`${API_BASE}/api/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          action: "explain",
          language: codeLanguage || "Auto-detect",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The coding AI request failed."
        );
      }

      setCodeResponse(
        data.response ||
          "I wasn't able to analyze the code."
      );

      setBackendOnline(true);
    } catch (error) {
      console.error("Explain code error:", error);

      setCodeResponse(
        "I couldn't connect to the coding AI. Make sure your backend is running and your Hugging Face token is configured correctly."
      );

      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }

  async function findBugs() {
    if (loading) return;

    setLoading(true);
    setCodeResponse("");

    try {
      const response = await fetch(`${API_BASE}/api/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          action: "bugs",
          language: codeLanguage || "Auto-detect",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The coding AI request failed."
        );
      }

      setCodeResponse(
        data.response ||
          "I wasn't able to analyze the code."
      );

      setBackendOnline(true);
    } catch (error) {
      console.error("Find bugs error:", error);

      setCodeResponse(
        "I couldn't connect to the coding AI. Make sure your backend is running and your Hugging Face token is configured correctly."
      );

      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }

  async function optimizeCode() {
    if (loading) return;

    setLoading(true);
    setCodeResponse("");

    try {
      const response = await fetch(`${API_BASE}/api/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          action: "optimize",
          language: codeLanguage || "Auto-detect",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The coding AI request failed."
        );
      }

      setCodeResponse(
        data.response ||
          "I wasn't able to analyze the code."
      );

      setBackendOnline(true);
    } catch (error) {
      console.error("Optimize code error:", error);

      setCodeResponse(
        "I couldn't connect to the coding AI. Make sure your backend is running and your Hugging Face token is configured correctly."
      );

      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }

  async function askAboutCode() {
    if (!codeQuestion.trim() || loading) return;

    const question = codeQuestion.trim();

    setLoading(true);
    setCodeResponse("");

    try {
      const response = await fetch(`${API_BASE}/api/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          question,
          action: "ask",
          language: codeLanguage || "Auto-detect",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The coding AI request failed."
        );
      }

      setCodeResponse(
        data.response ||
          "I wasn't able to answer your question."
      );

      setCodeQuestion("");
      setBackendOnline(true);
    } catch (error) {
      console.error("Ask code question error:", error);

      setCodeResponse(
        "I couldn't connect to the coding AI. Make sure your backend is running and your Hugging Face token is configured correctly."
      );

      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // IMAGE FUNCTIONS
  // =========================

  async function generateImage() {
    if (!imagePrompt.trim() || loading) return;

    setLoading(true);
    setGenerated(false);

    if (generatedImage) {
      URL.revokeObjectURL(generatedImage);
      setGeneratedImage(null);
    }

    try {
      // FIX: Combine the prompt and the style together into one enhanced string
      const enhancedPrompt = `${imagePrompt}, ${imageStyle} style`;

      const response = await fetch(`${API_BASE}/api/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: enhancedPrompt, // Send the enhanced prompt containing the style
          aspectRatio,
          style: imageStyle,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Image generation failed.";

        try {
          const data = await response.json();

          if (data.error) {
            errorMessage = data.error;
          }
        } catch (error) {}

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      const imageUrl = URL.createObjectURL(blob);

      setGeneratedImage(imageUrl);
      setGenerated(true);
      setBackendOnline(true);
    } catch (error) {
      console.error("Image generation error:", error);

      setGenerated(false);

      alert(
        "Image generation failed.\n\nMake sure your backend is running and your Hugging Face token is configured correctly."
      );

      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }

  function selectAspectRatio(ratio) {
    setAspectRatio(ratio);
    setGenerated(false);

    if (generatedImage) {
      URL.revokeObjectURL(generatedImage);
      setGeneratedImage(null);
    }
  }

  function selectImageStyle(style) {
    setImageStyle(style);
    setGenerated(false);

    if (generatedImage) {
      URL.revokeObjectURL(generatedImage);
      setGeneratedImage(null);
    }
  }

  const selectedButtonStyle = {
    background: "rgba(236, 72, 153, 0.20)",
    border: "1px solid #ec4899",
    color: "#ffffff",
    boxShadow: "0 0 18px rgba(236, 72, 153, 0.30)",
    transform: "translateY(-1px)",
  };

  const normalButtonStyle = {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.10)",
    color: "#a1a1aa",
    boxShadow: "none",
    transform: "none",
  };

  return (
    <div className="app">

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            C
          </div>

          <div>
            <h1>Codie</h1>
            <span>AI WORKSPACE</span>
          </div>

        </div>

        <div className="sidebar-section">

          <p className="section-label">
            WORKSPACE
          </p>

          {tools.map((tool) => (

            <button
              key={tool.id}
              className={`tool-button ${
                activeTool === tool.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveTool(tool.id);
                setGenerated(false);
                setCodeResponse("");
              }}
            >

              <span className={`tool-icon ${tool.color}`}>
                {tool.icon}
              </span>

              <span className="tool-info">

                <strong>
                  {tool.name}
                </strong>

                <small>
                  {tool.description}
                </small>

              </span>

              {activeTool === tool.id && (
                <span className="active-dot"></span>
              )}

            </button>

          ))}

        </div>

        <div className="sidebar-bottom">

          <div className="status-card">

            <div
              className="status-dot"
              style={{
                background: backendOnline
                  ? "#22c55e"
                  : "#ef4444",
                boxShadow: backendOnline
                  ? "0 0 10px #22c55e"
                  : "0 0 10px #ef4444",
              }}
            ></div>

            <div>

              <strong>
                {backendOnline
                  ? "AI Systems Online"
                  : "Backend Offline"}
              </strong>

              <span>
                {backendOnline
                  ? "Ready to assist"
                  : "Start the Codie server"}
              </span>

            </div>

          </div>

          <div className="creator">

            <span>
              Created by
            </span>

            <strong>
              Mason
            </strong>

          </div>

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div>

            <div className="breadcrumb">

              Codie Final Project

              <span>
                /
              </span>

              {active.name}

            </div>

            <h2>
              {active.name}
            </h2>

          </div>

          <div className="topbar-right">

            <div className="model-status">

              <span
                className="status-dot"
                style={{
                  background: backendOnline
                    ? "#22c55e"
                    : "#ef4444",
                  boxShadow: backendOnline
                    ? "0 0 10px #22c55e"
                    : "0 0 10px #ef4444",
                }}
              ></span>

              {backendOnline
                ? "AI Ready"
                : "Backend Offline"}

            </div>

            <div className="avatar">
              M
            </div>

          </div>

        </header>

        <section className="workspace">

          {activeTool === "chat" && (

            <div className="chat-workspace">

              <div className="hero">

                <div className="hero-icon purple-icon">
                  ✦
                </div>

                <div>

                  <h3>
                    What can I help you with?
                  </h3>

                  <p>
                    Ask questions, brainstorm ideas,
                    learn something new, or start a
                    conversation.
                  </p>

                </div>

              </div>

              <div className="messages">

                {messages.map((msg, index) => (

                  <div
                    key={index}
                    className={`message-row ${msg.role}`}
                  >

                    <div
                      className={`message-avatar ${msg.role}`}
                    >

                      {msg.role === "ai"
                        ? "✦"
                        : "M"}

                    </div>

                    <div className="message">

                      <span className="message-name">

                        {msg.role === "ai"
                          ? "Codie AI"
                          : "You"}

                      </span>

                      <p>
                        {msg.text}
                      </p>

                    </div>

                  </div>

                ))}

                {loading && activeTool === "chat" && (

                  <div className="message-row ai">

                    <div className="message-avatar ai">
                      ✦
                    </div>

                    <div className="typing">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                )}

              </div>

              <div className="input-area">

                <div className="input-wrapper">

                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {

                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        sendMessage();
                      }

                    }}
                    placeholder="Message Codie AI..."
                    disabled={loading}
                  />

                  <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={loading}
                  >
                    ↑
                  </button>

                </div>

                <div className="input-hint">

                  <span>
                    ↵ Enter to send
                  </span>

                  <span>
                    AI responses may contain mistakes
                  </span>

                </div>

              </div>

            </div>

          )}

          {activeTool === "code" && (

            <div className="code-workspace">

              <div className="tool-heading">

                <div>

                  <div className="heading-icon blue-icon">
                    &lt;/&gt;
                  </div>

                  <div>

                    <h3>
                      Code Lab
                    </h3>

                    <p>
                      Write, explain, debug, and
                      improve code across any language.
                    </p>

                  </div>

                </div>

                <div className="language-select-wrapper">
                  <span className="lang-label">Language:</span>
                  <input
                    type="text"
                    className="language-input"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    placeholder="Any language (optional)"
                  />
                </div>

              </div>

              <div className="code-layout">

                <div className="editor-panel">

                  <div className="panel-header">

                    <div className="window-controls">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                    <span className="file-name">
                      Code Editor {codeLanguage ? `(${codeLanguage})` : ""}
                    </span>

                  </div>

                  <div className="editor">

                    <div className="line-numbers">

                      {code.split("\n").map((_, i) => (

                        <span key={i}>
                          {i + 1}
                        </span>

                      ))}

                    </div>

                    <textarea
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value)
                      }
                      spellCheck="false"
                      placeholder="Paste or type your code here..."
                    />

                  </div>

                </div>

                <div className="ai-code-panel">

                  <div className="panel-title">

                    <span className="blue-text">
                      ✦
                    </span>

                    Codie Coding Assistant

                  </div>

                  <div className="suggestion">

                    <span>
                      ✦
                    </span>

                    <div>

                      <strong>
                        Ready to help
                      </strong>

                      <p>
                        Ask me to explain your code,
                        find bugs, or optimize it.
                      </p>

                    </div>

                  </div>

                  <div className="code-actions">

                    <button
                      onClick={explainCode}
                      disabled={loading}
                    >
                      Explain code
                    </button>

                    <button
                      onClick={findBugs}
                      disabled={loading}
                    >
                      Find bugs
                    </button>

                    <button
                      onClick={optimizeCode}
                      disabled={loading}
                    >
                      Optimize
                    </button>

                  </div>

                  {loading && activeTool === "code" && (

                    <div className="code-response loading-response">

                      <span className="response-icon">
                        ✦
                      </span>

                      Codie AI is thinking...

                    </div>

                  )}

                  {codeResponse && !loading && (

                    <div className="code-response">

                      <div className="response-header">

                        <span className="response-icon">
                          ✦
                        </span>

                        <strong>
                          Codie AI
                        </strong>

                      </div>

                      <p>
                        {codeResponse}
                      </p>

                    </div>

                  )}

                  <div className="code-input">

                    <input
                      value={codeQuestion}
                      onChange={(e) =>
                        setCodeQuestion(e.target.value)
                      }
                      onKeyDown={(e) => {

                        if (e.key === "Enter") {
                          e.preventDefault();
                          askAboutCode();
                        }

                      }}
                      placeholder="Ask about your code..."
                      disabled={loading}
                    />

                    <button
                      onClick={askAboutCode}
                      disabled={loading}
                    >
                      ↑
                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}

          {activeTool === "image" && (

            <div className="image-workspace">

              <div className="image-header">

                <div>

                  <div className="heading-icon pink-icon">
                    ◈
                  </div>

                  <h3>
                    Image Studio
                  </h3>

                  <p>
                    Turn your ideas into beautiful
                    images with AI.
                  </p>

                </div>

              </div>

              <div className="image-layout">

                <div className="image-preview">

                  {!generated || !generatedImage ? (

                    <div className="empty-image">

                      <div className="image-symbol">
                        ◈
                      </div>

                      <h4>
                        Your creation will appear here
                      </h4>

                      <p>
                        Describe what you want to
                        generate and let AI bring
                        it to life.
                      </p>

                    </div>

                  ) : (

                    <div className="generated-image">

                      <img
                        src={generatedImage}
                        alt={imagePrompt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          aspectRatio: aspectRatio.replace(":", "/"),
                          maxHeight: "500px",
                          maxWidth: "100%",
                          borderRadius: "8px",
                        }}
                      />

                      <div className="generated-label">

                        AI Generated

                        <span>
                          {imageStyle}
                        </span>

                        <small>
                          {aspectRatio}
                        </small>

                      </div>

                    </div>

                  )}

                </div>

                <div className="image-controls">

                  <label>
                    Describe your image
                  </label>

                  <textarea
                    value={imagePrompt}
                    onChange={(e) =>
                      setImagePrompt(e.target.value)
                    }
                    placeholder="A futuristic city floating above the clouds at sunset..."
                    disabled={loading}
                  />

                  <label>
                    Aspect Ratio
                  </label>

                  <div className="ratio-options">

                    <button
                      type="button"
                      onClick={() =>
                        selectAspectRatio("16:9")
                      }
                      style={
                        aspectRatio === "16:9"
                          ? selectedButtonStyle
                          : normalButtonStyle
                      }
                      disabled={loading}
                    >
                      <span className="ratio-box landscape"></span>
                      16:9
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectAspectRatio("1:1")
                      }
                      style={
                        aspectRatio === "1:1"
                          ? selectedButtonStyle
                          : normalButtonStyle
                      }
                      disabled={loading}
                    >
                      <span className="ratio-box square"></span>
                      1:1
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectAspectRatio("9:16")
                      }
                      style={
                        aspectRatio === "9:16"
                          ? selectedButtonStyle
                          : normalButtonStyle
                      }
                      disabled={loading}
                    >
                      <span className="ratio-box portrait"></span>
                      9:16
                    </button>

                  </div>

                  <label>
                    Style
                  </label>

                  <div className="style-options">

                    <button
                      type="button"
                      onClick={() =>
                        selectImageStyle("Cinematic")
                      }
                      style={
                        imageStyle === "Cinematic"
                          ? selectedButtonStyle
                          : normalButtonStyle
                      }
                      disabled={loading}
                    >
                      ✨ Cinematic
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectImageStyle("Artistic")
                      }
                      style={
                        imageStyle === "Artistic"
                          ? selectedButtonStyle
                          : normalButtonStyle
                      }
                      disabled={loading}
                    >
                      🎨 Artistic
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        selectImageStyle("Photorealistic")
                      }
                      style={
                        imageStyle === "Photorealistic"
                          ? selectedButtonStyle
                          : normalButtonStyle
                      }
                      disabled={loading}
                    >
                      📷 Photorealistic
                    </button>

                  </div>

                  <button
                    className="generate-button"
                    onClick={generateImage}
                    disabled={loading || !imagePrompt.trim()}
                  >

                    {loading ? (
                      "Creating..."
                    ) : (
                      <>
                        <span>
                          ✦
                        </span>

                        Generate Image
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          )}

        </section>

        <footer>

          <span>
            Codie Final Project
          </span>

          <span>
            •
          </span>

          <span>
            Created by Mason
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;
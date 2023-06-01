import React, { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import clipboard from "clipboard";

import "./styles.css"; // Import custom CSS file for styling

function App() {
  const [input, setInput] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [fileError, setFileError] = useState("");

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError("");
    setErrorDetails("");
  };

  const handleValidateClick = () => {
    try {
      const parsedJSON = JSON.parse(input);
      const formatted = JSON.stringify(parsedJSON, null, 2);
      setFormattedJSON(formatted);
      setError("");
      setErrorDetails("");
    } catch (e) {
      setFormattedJSON("");
      setError("Invalid JSON");
      setErrorDetails(e.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        setInput(fileContent);
        handleInputChange({ target: { value: fileContent } });
      };
      reader.onerror = () => {
        setFileError("Error reading file");
      };
      reader.readAsText(file);
    }
  };

  const handleCopyJSON = () => {
    clipboard.writeText(formattedJSON);
  };

  const handleCopyError = () => {
    clipboard.writeText(errorDetails);
  };

  return (
    <div className="container">
      <h1 className="title">JSON Validator</h1>
      <div className="content">
        <div className="column">
          <div className="input-panel">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} />
            <button
              className="upload-button"
              onClick={() => fileInputRef.current.click()}
            >
              Upload JSON File
            </button>
            {fileError && <p className="error">{fileError}</p>}
            <textarea
              className="input-area"
              placeholder="Enter JSON here"
              value={input}
              onChange={handleInputChange}
            />
            <button className="validate-button" onClick={handleValidateClick}>
              Validate
            </button>
            {error && <p className="error">{error}</p>}
            {errorDetails && <p className="error-details">{errorDetails}</p>}
          </div>
        </div>
        <div className="column">
          {formattedJSON && (
            <div className="output-panel">
              <h2 className="output-title">Formatted JSON:</h2>
              <div className="output-area">
                <SyntaxHighlighter language="json" style={vscDarkPlus}>
                  {formattedJSON}
                </SyntaxHighlighter>
              </div>
              <button className="copy-button" onClick={handleCopyJSON}>
                Copy JSON
              </button>
            </div>
          )}
          {error && (
            <div className="output-panel">
              <h2 className="output-title">Error Details:</h2>
              <div className="output-area">
                <pre>{error}</pre>
              </div>
              <button className="copy-button" onClick={handleCopyError}>
                Copy Error
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

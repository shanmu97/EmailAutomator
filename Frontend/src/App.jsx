import React, { useState, useEffect } from "react";
import EditorComponent from "./Components/Editor";
import { FaTrash, FaEye, FaEdit } from "react-icons/fa"; // Eye, Trash, Edit icons\
import Input from "./Components/Input";
import './App.css'; // Import your CSS file
import { ReactMultiEmail, isEmail } from "react-multi-email";
import MultiEmailInput from './Components/MultiEmailInputComponent'

const App = () => {
  const [editorContent, setEditorContent] = useState("<p>Start typing...</p>");
  const [savedTitles, setSavedTitles] = useState([]);
  const [viewContent, setViewContent] = useState(""); // For modal view
  const [showModal, setShowModal] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const [emails, setEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  useEffect(() => {
    const titles = JSON.parse(localStorage.getItem("savedTitles")) || [];
    setSavedTitles(titles);
  }, []);

  const handleContentChange = (content) => {
    setEditorContent(content);
  };

  const handleSave = () => {
    const title = prompt("Enter a title for this content:");
    if (title) {
      const savedContent = JSON.parse(localStorage.getItem("savedContent")) || {};
      savedContent[title] = editorContent;

      localStorage.setItem("savedContent", JSON.stringify(savedContent));

      const updatedTitles = savedTitles.includes(title)
        ? savedTitles
        : [...savedTitles, title];
      setSavedTitles(updatedTitles);
      localStorage.setItem("savedTitles", JSON.stringify(updatedTitles));
    }
  };

  // 1. Set content in editor
const handleSetContent = (title) => {
  const savedContent = JSON.parse(localStorage.getItem("savedContent")) || {};
  const contentToAppend = savedContent[title] || "";
  // Append to current editor content
  setSubject(title)
  setEditorContent((prevContent) => {
    // Remove trailing </p> from prevContent and leading <p> from contentToAppend if needed
    // to avoid broken HTML structure.
    // A simple way is to just concatenate with a line break:
    return prevContent.replace(/<\/p>$/, "") + "<br/>" + contentToAppend;
  });
};


  // 2. View content in modal
  const handleViewContent = (title) => {
    const savedContent = JSON.parse(localStorage.getItem("savedContent")) || {};
    const content = savedContent[title] || "<p>No content found.</p>";
    setViewContent(content);
    setShowModal(true);
  };

  // 3. Delete saved title
  const handleDelete = (title) => {
    const savedContent = JSON.parse(localStorage.getItem("savedContent")) || {};
    const updatedContent = { ...savedContent };
    delete updatedContent[title];
    localStorage.setItem("savedContent", JSON.stringify(updatedContent));

    const updatedTitles = savedTitles.filter((savedTitle) => savedTitle !== title);
    setSavedTitles(updatedTitles);
    localStorage.setItem("savedTitles", JSON.stringify(updatedTitles));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!emails.length) {
      alert("Please add at least one recipient email.");
      return;
    }
    if (!subject.trim()) {
      alert("Please enter a subject.");
      return;
    }
    if (!editorContent || editorContent === "<p>Start typing...</p>") {
      alert("Please enter email content.");
      return;
    }
  
    const formData = new FormData();
    formData.append("emails", emails.join(","));
    formData.append("subject", subject);
    formData.append("text", editorContent);
  
    files.forEach((file) => {
      formData.append("attachments", file);
    });
  
    try {
      const response = await fetch("https://emailautomator.onrender.com/api/email/send", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Email sent successfully!");
        // Optionally reset form:
        setEmails([]);
        setSubject("");
        setFiles([]);
        setEditorContent("<p>Start typing...</p>");
      } else {
        alert("Failed to send email: " + data.message);
      }
    } catch (error) {
      alert("Error sending email: " + error.message);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleSubmit}>
      <MultiEmailInput label="To (Emails)" emails={emails} setEmails={setEmails} />
        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Attach Files
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          {files.length > 0 && (
            <ul className="mt-2 text-xs text-gray-700 dark:text-black">
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <label htmlFor="editorContent">Content</label>
        <EditorComponent initialContent={editorContent} onChange={handleContentChange} />

        <div>
          <button type="submit" className="p-1 border bg-blue-600 text-white rounded-md">Submit</button>
        </div>
      </form>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave} className="p-1 bg-green-500 text-white rounded">
          Save Content
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Saved Titles</h3>
        {savedTitles.length === 0 ? (
          <p>No saved titles.</p>
        ) : (
          savedTitles.map((title, index) => (
            <div key={index} className="flex items-center space-x-2" style={{ marginBottom: 8 }}>
              {/* 1. Set Content Button */}
              <button
                onClick={() => handleSetContent(title)}
                className="m-2 p-2 bg-blue-500 text-white rounded flex items-center"
                title="Set as Editor Content"
              >
                <FaEdit style={{ marginRight: 4 }} /> {title}
              </button>
              {/* 2. Eye/View Button */}
              <button
                onClick={() => handleViewContent(title)}
                className="p-2 bg-gray-500 text-white rounded"
                title="View Content"
              >
                <FaEye />
              </button>
              {/* 3. Delete Button */}
              <button
                onClick={() => handleDelete(title)}
                className="p-2 bg-red-500 text-white rounded"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for viewing content */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 300,
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
            }}
          >
            <h4>Saved Content</h4>
            <div
              style={{
                border: "1px solid #eee",
                padding: 12,
                marginBottom: 16,
                background: "#fafafa"
              }}

              dangerouslySetInnerHTML={{ __html: viewContent }}
            />
            <button onClick={() => setShowModal(false)} className="p-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

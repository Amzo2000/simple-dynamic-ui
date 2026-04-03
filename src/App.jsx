import { useState, useRef } from "react";

const VARIABLES = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Full Name", key: "fullName" },
  { label: "Age", key: "age" },
];

function resolveText(template, values, transforms) {
  let result = template;
  result = result.replace(/\[First Name\]/g, values.firstName || "[First Name]");
  result = result.replace(/\[Last Name\]/g, values.lastName || "[Last Name]");
  result = result.replace(/\[Full Name\]/g, values.fullName || "[Full Name]");
  result = result.replace(/\[Age\]/g, values.age || "[Age]");
  if (transforms.uppercase) result = result.toUpperCase();
  return result;
}

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [template, setTemplate] = useState("Hello [First Name], your full name is [Full Name] and you are [Age] years old.");
  const [transforms, setTransforms] = useState({
    uppercase: false,
    hideIfMinor: false,
  });
  const textareaRef = useRef(null);

  const insertVariable = (key) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const label = VARIABLES.find((v) => v.key === key)?.label;
    const newText =
      template.substring(0, start) + `[${label}]` + template.substring(end);
    setTemplate(newText);
    setTimeout(() => {
      textarea.selectionStart = start + `[${label}]`.length;
      textarea.selectionEnd = start + `[${label}]`.length;
      textarea.focus();
    }, 0);
  };

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const values = { firstName, lastName, fullName, age };
  const preview = resolveText(template, values, transforms);
  const isMinor = parseInt(age) < 18;
  const showPreview = transforms.hideIfMinor ? !isMinor : true;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <main style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Dynamic Text Builder</h1>
        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
          Fill in the fields below. Your text updates automatically.
        </p>

        <label style={labelStyle}>
          First Name
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label style={labelStyle}>
          Last Name
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

        <label style={labelStyle}>
          Age
          <input
            style={inputStyle}
            type="number"
            placeholder="Enter age"
            min={0}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Actions
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={transforms.uppercase}
              onChange={(e) => setTransforms((t) => ({ ...t, uppercase: e.target.checked }))}
            />
            Convert to UPPERCASE
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={transforms.hideIfMinor}
              onChange={(e) => setTransforms((t) => ({ ...t, hideIfMinor: e.target.checked }))}
            />
            Hide preview if age is under 18
          </label>
        </div>

        <div style={{ marginTop: 16, padding: 20, background: "#f0f4ff", borderRadius: 10, border: "1px solid #d0d8ff" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Live Preview
          </p>
          {showPreview ? (
            <div style={{
              margin: 0,
              fontSize: "1.1rem",
              color: "#222",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap"
            }}>
              {preview}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#aaa", fontStyle: "italic" }}>
              Hidden — user is under 18
            </p>
          )}
        </div>
      </main>

      <aside style={{
        width: 420,
        borderLeft: "1px solid #e0e0e0",
        background: "#f9f9f9",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        <h2 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888", margin: 0 }}>
          Text Template
        </h2>

        <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
          Click a button to insert a variable at your cursor position.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {VARIABLES.map((v) => (
            <button
              key={v.key}
              onClick={() => insertVariable(v.key)}
              style={chipStyle}
            >
              + {v.label}
            </button>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          style={{ ...inputStyle, minHeight: 140, resize: "vertical", fontFamily: "monospace", fontSize: "0.95rem" }}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Write your text here..."
        />

        <div style={{ background: "#fff", borderRadius: 8, padding: 12, border: "1px solid #e0e0e0" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "0.75rem", color: "#aaa", textTransform: "uppercase" }}>
            Available variables
          </p>
          {VARIABLES.map((v) => (
            <p key={v.key} style={{ margin: "2px 0", fontSize: "0.85rem", color: "#555" }}>
              <code style={{ background: "#f0f0f0", padding: "1px 6px", borderRadius: 4 }}>[{v.label}]</code>
              {" "} = {values[v.key] || <span style={{ color: "#bbb" }}>not filled yet</span>}
            </p>
          ))}
        </div>
      </aside>
    </div>
  );
}

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: "0.9rem",
  color: "#444",
  maxWidth: 320,
};

const inputStyle = {
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: "1rem",
};

const chipStyle = {
  padding: "6px 14px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 20,
  fontSize: "0.85rem",
  cursor: "pointer",
  fontWeight: 500,
};
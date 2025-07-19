

import React, { useState } from "react";
import FieldList from "./components/FieldList";
import JsonPreview from "./components/JsonPreview";
import GeneratedForm from "./components/GeneratedForm";

function App() {
  const [fields, setFields] = useState([]);
  const [uploadedSchema, setUploadedSchema] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // Build JSON Schema recursively from field list
  const buildSchema = (fieldsArray) => {
    const schema = {};
    fieldsArray.forEach((field) => {
      if (!field.name || !field.type) return;

      if (field.type === "object") {
        schema[field.name.trim()] = {
          type: "object",
          properties: buildSchema(field.children || []),
        };
      } else {
        schema[field.name.trim()] = { type: field.type };
      }
    });
    return schema;
  };

  // Download JSON schema
  const handleDownload = () => {
    const schema = buildSchema(fields);
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Upload and parse JSON schema
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (typeof json !== "object") throw new Error("Not a valid JSON schema");
        setUploadedSchema(json);
        setUploadError("");
      } catch (err) {
        console.error(err);
        setUploadError("❌ Invalid JSON file. Please upload a valid schema.");
        setUploadedSchema(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex p-6 gap-6 flex-col lg:flex-row">
      {/* Left Column - Schema Builder */}
      <div className="lg:w-1/2">
        <h2 className="text-xl font-semibold mb-2">🧱 JSON Schema Builder</h2>
        <FieldList fields={fields} setFields={setFields} />

        <div className="mt-4 flex gap-4 items-center">
          <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">
            ⬇️ Download Schema
          </button>
          <input type="file" accept=".json" onChange={handleUpload} />
        </div>

        {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}

        {uploadedSchema && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">📋 Form from Uploaded Schema</h3>
            <GeneratedForm schema={uploadedSchema} />
          </div>
        )}
      </div>

      {/* Right Column - JSON Preview */}
      <div className="lg:w-1/2 bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-medium mb-2">📦 JSON Preview</h3>
        <JsonPreview fields={fields} />
      </div>
    </div>
  );
}

export default App;




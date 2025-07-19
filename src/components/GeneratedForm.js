

import React, { useState } from "react";

// Helper: update nested value in object using a path (e.g., "address.street")
const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  let current = obj;

  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  });
  return { ...obj };
};

const GeneratedForm = ({ schema }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (path, value) => {
    setFormData((prev) => setNestedValue({ ...prev }, path, value));
  };

  const renderFields = (properties, parentKey = "") => {
    return Object.entries(properties).map(([key, config]) => {
      const fullPath = parentKey ? `${parentKey}.${key}` : key;

      if (config.type === "object") {
        return (
          <fieldset key={fullPath} className="mb-4 p-2 border rounded">
            <legend className="font-semibold">{key}</legend>
            {renderFields(config.properties || {}, fullPath)}
          </fieldset>
        );
      }

      return (
        <div key={fullPath} className="mb-3">
          <label className="block mb-1 font-medium">
            {key}:
            <input
              type={config.type === "number" ? "number" : "text"}
              value={
                fullPath
                  .split(".")
                  .reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ""), formData) || ""
              }
              onChange={(e) =>
                handleChange(
                  fullPath,
                  config.type === "number" ? Number(e.target.value) : e.target.value
                )
              }
              className="mt-1 block w-full p-2 border rounded"
            />
          </label>
        </div>
      );
    });
  };

  return (
    <form className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Generated Form</h3>
      {renderFields(schema)}
      <hr className="my-4" />
      <h4 className="text-md font-semibold mb-2">Form Data Preview</h4>
      <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(formData, null, 2)}</pre>
    </form>
  );
};

export default GeneratedForm;


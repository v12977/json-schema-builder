
import React from "react";

export default function FieldList({ fields, setFields }) {
  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;

    // If type is changed to object, initialize children
    if (key === "type" && value === "object" && !updated[index].children) {
      updated[index].children = [];
    }

    // If type is not object, remove children
    if (key === "type" && value !== "object") {
      delete updated[index].children;
    }

    setFields(updated);
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "string" }]);
  };

  const deleteField = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const updateChildFields = (index, childFields) => {
    const updated = [...fields];
    updated[index].children = childFields;
    setFields(updated);
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={field.name}
            placeholder="Field Name"
            onChange={(e) => handleFieldChange(index, "name", e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, "type", e.target.value)}
            style={{ marginRight: "0.5rem" }}
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
          </select>
          <button onClick={() => deleteField(index)} style={{ color: "red" }}>
            Delete
          </button>

          {/* If type is object, render nested FieldList */}
          {field.type === "object" && (
            <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
              <strong>Fields inside "{field.name}"</strong>
              <FieldList
                fields={field.children || []}
                setFields={(newChildren) => updateChildFields(index, newChildren)}
              />
            </div>
          )}
        </div>
      ))}

      <button onClick={addField}>Add Field</button>
    </div>
  );
}



import React from "react";

export default function JsonPreview({ fields }) {
  const buildSchema = (fieldsArray) => {
    const schema = {};
    fieldsArray.forEach((field) => {
      if (!field.name || !field.type) return;
      if (field.type === "object") {
        schema[field.name.trim()] = {
          type: "object",
          properties: buildSchema(field.children || [])
        };
      } else {
        schema[field.name.trim()] = { type: field.type };
      }
    });
    return schema;
  };

  const schema = buildSchema(fields);

  return (
    <div style={{ background: "#f8f8f8", padding: "1rem" }}>
      <h2>JSON Preview</h2>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
    </div>
  );
}

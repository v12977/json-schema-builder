import React from "react";
import { Input, Select, Button, Space } from "antd";

const { Option } = Select;

const Field = ({ field, onChange, onDelete }) => {
  const handleKeyChange = (e) => {
    onChange({ ...field, key: e.target.value });
  };

  const handleTypeChange = (value) => {
    const updatedField = { ...field, type: value };
    if (value === "Nested" && !field.children) {
      updatedField.children = [];
    }
    onChange(updatedField);
  };

  return (
    <Space style={{ marginBottom: 8 }} align="start">
      <Input
        placeholder="Field Name"
        value={field.key}
        onChange={handleKeyChange}
        style={{ width: 200 }}
      />
      <Select
        value={field.type}
        onChange={handleTypeChange}
        style={{ width: 120 }}
      >
        <Option value="String">String</Option>
        <Option value="Number">Number</Option>
        <Option value="Nested">Nested</Option>
      </Select>
      <Button danger onClick={() => onDelete(field.id)}>
        Delete
      </Button>
    </Space>
  );
};

export default Field;

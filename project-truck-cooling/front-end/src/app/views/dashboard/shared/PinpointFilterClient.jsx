import React, { useState } from "react";

const PinpointFilterClient = ({ filterData, onFilterChange }) => {
  const initialFilters = {
    minTemperature: "",
    maxTemperature: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    onFilterChange({ ...filters, [name]: value });
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters); // Reset the filter values in the parent component
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label>
        Min Temperature (C):
        <input
          type="number"
          name="minTemperature"
          value={filters.minTemperature}
          onChange={handleChange}
        />
      </label>

      <label style={{ marginLeft: "20px" }}>
        Max Temperature (C):
        <input
          type="number"
          name="maxTemperature"
          value={filters.maxTemperature}
          onChange={handleChange}
        />
      </label>

      <button style={{ marginLeft: "20px" }} onClick={handleReset}>
        Reset Filters
      </button>
    </div>
  );
};

export default PinpointFilterClient;

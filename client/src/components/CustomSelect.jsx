import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CustomSelect = ({
  name = "",
  disabled = false,
  value = "",
  error = false,
  options = [],
  label = "",
}) => {
  return (
    <FormControl fullWidth size="small" disabled={disabled} error={error}>
      <InputLabel id="demo-simple-select-label">
        {error ? "Incorrect Answer" : label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        defaultValue={value}
        label={error ? "Incorrect Answer" : label}
        name={name}
        disabled={disabled}
        inputProps={{ "aria-label": "Without label" }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;

import { TextField } from "@mui/material";

const Search = ({ onSearch, searchTerm }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (<TextField
    hiddenLabel
    size="small"
    placeholder="Buscar archivos... (usa * y ? para wildcards)"
    value={searchTerm}
    onChange={handleChange}
    sx={{
      '.MuiInputBase-input': {
        padding: '2.5px 14px'
      }
    }}
  />
  )
}

export default Search;
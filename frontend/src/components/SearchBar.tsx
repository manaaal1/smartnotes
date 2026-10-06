interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <input
    type="text"
    placeholder="Search your notes..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="search-input"
  />
);

export default SearchBar;
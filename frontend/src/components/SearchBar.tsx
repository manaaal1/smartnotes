interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <input
    type="text"
    placeholder="Search notes..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 rounded p-2 w-full"
  />
);

export default SearchBar;

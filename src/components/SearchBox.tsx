import { SearchIcon } from './Icons'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultLabel?: string
}

export function SearchBox({ value, onChange, placeholder = 'Search', resultLabel }: SearchBoxProps) {
  return (
    <div>
      <div className="search-box glass">
        <SearchIcon size={17} stroke="var(--sub)" />
        <input
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="text-button"
            style={{ padding: '4px 8px', fontSize: 12 }}
            onClick={() => onChange('')}
          >
            Clear
          </button>
        ) : null}
      </div>
      {value && resultLabel ? (
        <div className="muted" style={{ padding: '8px 6px 0' }} role="status" aria-live="polite">
          {resultLabel}
        </div>
      ) : null}
    </div>
  )
}

import { colors } from '../constants';

export function Card({ title, children, style }) {
  return (
    <div style={{ 
      background: colors.card, 
      border: `1px solid ${colors.border}`, 
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(55, 55, 55, 0.08)",
      ...style 
    }}>
      {title && (
        <div style={{ 
          padding: "14px 20px", 
          borderBottom: `1px solid ${colors.border}`, 
          fontSize: 14, 
          fontWeight: 600, 
          color: colors.text,
          background: colors.sky,
        }}>
          {title}
        </div>
      )}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

export function Field({ label, children, width }) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: 6, 
      flex: width ? `0 0 ${width}` : 1, 
      minWidth: 0 
    }}>
      {label && (
        <label style={{ 
          fontSize: 11, 
          fontWeight: 600, 
          color: colors.ebony, 
          textTransform: "uppercase", 
          letterSpacing: "0.06em" 
        }}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export function Input({ value, onChange, type = "text", placeholder, style: extra, min, max, step }) {
  const numberInputPadding = type === "number" ? { paddingRight: 18 } : {};
  
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      style={{
        background: colors.inputBg,
        border: `1px solid ${colors.inputBorder}`,
        borderRadius: 6,
        padding: "9px 12px",
        color: colors.text,
        fontSize: 13,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        transition: "border-color 0.15s, box-shadow 0.15s",
        ...numberInputPadding,
        ...extra,
      }}
      onFocus={e => {
        e.target.style.borderColor = colors.matrixBlue;
        e.target.style.boxShadow = `0 0 0 3px ${colors.accentGlow}`;
      }}
      onBlur={e => {
        e.target.style.borderColor = colors.inputBorder;
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

export function Select({ value, onChange, options, style: extra }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: colors.inputBg,
        border: `1px solid ${colors.inputBorder}`,
        borderRadius: 6,
        padding: "9px 12px",
        color: colors.text,
        fontSize: 13,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        ...extra,
      }}
      onFocus={e => {
        e.target.style.borderColor = colors.matrixBlue;
        e.target.style.boxShadow = `0 0 0 3px ${colors.accentGlow}`;
      }}
      onBlur={e => {
        e.target.style.borderColor = colors.inputBorder;
        e.target.style.boxShadow = 'none';
      }}
    >
      {options.map(o => (
        <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
  );
}

export function Button({ children, onClick, variant = "primary", disabled, style: extra }) {
  const baseStyles = {
    borderRadius: 6,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    border: "none",
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      background: colors.matrixBlue,
      color: colors.white,
    },
    secondary: {
      background: colors.accentGlow,
      color: colors.matrixBlue,
      border: `1px solid ${colors.matrixBlue}`,
    },
    danger: {
      background: "transparent",
      color: colors.red,
      border: `1px solid ${colors.red}`,
    },
    ghost: {
      background: "transparent",
      color: colors.textMuted,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...extra,
      }}
    >
      {children}
    </button>
  );
}
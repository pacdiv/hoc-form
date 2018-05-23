import React from 'react';

const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  error: {
    bottom: '1em',
    color: 'crimson',
    fontSize: '.8em',
    position: 'absolute',
  },
  field: {
    border: '1px solid lightgrey',
    borderColor: 'lightgrey',
    borderRadius: '.3em',
    fontSize: '1em',
    fontWeight: 300,
    height: '2em',
    marginBottom: '2em',
    padding: '.5em 1em',
  },
  invalidField: {
    borderColor: 'crimson',
  },
  label: {
    fontWeight: 300,
    marginBottom: '.5em',
  },
};

function Input({
  error = null,
  input = {},
  label = '',
  meta = {},
  placeholder = '',
  type = 'text',
}) {
  return (
    <div style={style.container}>
      <label style={style.label}>
        {label}
      </label>
      <input
        placeholder={placeholder}
        type={type}
        {...input}
        onChange={e => input.onChange(e.target.value)}
        style={{
          ...style.field,
          ...(meta.error ? style.invalidField : {}),
        }}
      />
      {meta.error && <span style={style.error}>
        {meta.error}
      </span>}
    </div>
  );
}

export default Input;

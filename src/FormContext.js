import React from 'react';

export default React.createContext({
  onChange: () => true,
  state: {
    errors: {},
    isValid: false,
    values: {},
  },
});
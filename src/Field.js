import React from 'react';

import { FormContext } from './HocForm';
import ContextedField from './ContextedField';

function Field({ name, props, component }) {
  return (
    <FormContext.Consumer>
      {({ state, onChange }) => (
        <ContextedField
          {...props}
          component={component}
          input={{
            name,
            onChange: value => onChange(name, value),
            value: state.values[name] || undefined,
          }}
          meta={{
            error: state.errors[name] || undefined,
            touched: true,
          }}
        />
      )}
    </FormContext.Consumer>
  );
}

export default Field;

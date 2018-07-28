import React from 'react';

import { FormContext } from './HocForm';
import ContextedField from './ContextedField';

function Field({ name, props, component }) {
  return (
    <FormContext.Consumer>
      {({ state, setError, setValue, unsetError }) => (
        <ContextedField
          {...props}
          component={component}
          input={{
            name,
            onChange: value => setValue(name, value),
            value: state.values[name] || undefined,
            ...(props.onBlur
              ? { onBlur: value => props.onBlur(value, state.values)
                    .then(() => unsetError(name))
                    .catch(error => setError(name, error))
              }
              : {}),
          }}
          meta={{ error: state.errors[name] || undefined }}
        />
      )}
    </FormContext.Consumer>
  );
}

export default Field;

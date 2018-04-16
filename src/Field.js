import React, { Component } from 'react';

import { FormContext } from './HocForm';
import ContextedField from './ContextedField';

export class Field extends Component {
  render() {
    const { name, props, component } = this.props;

    return (
      <FormContext.Consumer>
        {({ state, onChange, registerField }) => (
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
            registerField={registerField}
          />
        )}
      </FormContext.Consumer>
    );
  }
}

export default Field;

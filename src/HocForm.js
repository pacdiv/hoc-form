import React, { Component } from 'react';

export const FormContext = React.createContext({});

const HOC = hocProps => WrappedComponent => {
  return class Form extends Component {
    static removeObjectEntry = function(name, values) {
      return Object
        .entries(values)
        .reduce((acc, [key, value]) => ({
          ...acc,
          ...(key !== name ? { [key]: value } : {}),
        }), {});
    }

    constructor(props) {
      super(props);
      const initialValues = hocProps.initialValues || props.initialValues;
      this.state = {
        errors: {},
        isValid: false,
        values: {
          ...(initialValues ? { ...initialValues } : {})
        },
      };

      this.onSubmit = this.onSubmit.bind(this);
      this.setError = this.setError.bind(this);
      this.setValue = this.setValue.bind(this);
      this.unsetError = this.unsetError.bind(this);

      this.validate = hocProps.validate || this.props.validate;
    }

    onSubmit(e) {
      e && e.preventDefault();
      const { errors, values } = this.state;

      if (!this.validate) {
        this.props.onSubmit(values);
        return;
      }

      this.validate(values)
        .then(() => {
          this.setState({ errors: {}, isValid: true });
          this.props.onSubmit(values);
        })
        .catch(errors => this.setState({ errors, isValid: false }));
    }

    setError(key, error) {
      this.setState({
        errors: {
          ...this.state.errors,
          [key]: error,
        },
      });
    }

    setValue(key, value) {
      this.setState({
        values: {
          ...this.state.values,
          [key]: value,
        },
      });
    }

    unsetError(key) {
      const errors = Form.removeObjectEntry(key, this.state.errors);
      this.setState({ errors });
    }

    render() {
      return (
        <FormContext.Provider
          value={{
            setError: this.setError,
            setValue: this.setValue,
            state: { ...this.state },
            unsetError: this.unsetError,
          }}
        >
          <WrappedComponent
            {...this.props}
            hocFormState={{ ...this.state }}
            onSubmit={this.onSubmit}
          />
        </FormContext.Provider>
      );
    }
  }
}

export default HOC;

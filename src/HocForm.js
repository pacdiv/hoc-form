import React, { Component } from 'react';

export const FormContext = React.createContext({
  onChange: null,
  state: {
    errors: {},
    isValid: false,
    values: {},
  },
});

const HOC = hocProps => WrappedComponent => {
  return class Form extends Component {
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

      this.asyncValidate = this.asyncValidate.bind(this);
      this.onBlur = hocProps.validateOnBlur && this.onBlur.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.runSyncValidation = this.runSyncValidation.bind(this);
      this.setIsValid = this.setIsValid.bind(this);

      this.validate = hocProps.validate || this.props.validate;
    }

    asyncValidate(values) {
      return new Promise((resolve, reject) => {
        const { asyncValidate } = hocProps;

        if (!asyncValidate) return resolve({});

        return asyncValidate(values, this.props)
          .then(errors => resolve(errors))
          .catch(err => reject(err));
      });
    }

    onChange(key, value) {
      this.setState({
        ...this.state,
        values: { ...this.state.values, [key]: value },
      }, () => {
        if (this.state.errors[key]) this.runSyncValidation();
      });
    }

    async onSubmit(e) {
      e && e.preventDefault();

      if (Object.keys(this.runSyncValidation()).length) return;

      try {
        const errors = await this.asyncValidate(this.state.values);

        this.setState({ isValid: true }, () => {
          this.props.onSubmit(this.state.values);
        });
      } catch (err) {
        this.setIsValid({ ...err });
      }
    }
  
    onBlur(key) {
      if (!this.validate) return {};

      const errors = {
        ...this.state.errors,
        [key]: this.validate(this.state.values, this.props)[key],
      };
      this.setIsValid(errors);
    }

    runSyncValidation(values = this.state.values) {
      const validate = hocProps.validate || this.props.validate;

      if (!this.validate) return {};

      const errors = this.validate(values, this.props);
      this.setIsValid(errors);

      return errors;
    }

    setIsValid(errors) {
      this.setState({
        errors,
        isValid: !!Object.keys(errors).length,
      });
    }

    render() {
      const { errors, isValid, values } = this.state;

      return (
        <FormContext.Provider
          value={{
            onChange: this.onChange,
            state: { ...this.state },
            ...(this.onBlur && { onBlur: this.onBlur } || {}),
          }}
        >
          <WrappedComponent
            {...this.props}
            hocFormState={{ errors, isValid, values }}
            onSubmit={this.onSubmit}
          />
        </FormContext.Provider>
      );
    }
  }
}

export default HOC;

import React, { Component } from 'react';

export const FormContext = React.createContext({});

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
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.runSyncValidation = this.runSyncValidation.bind(this);
      this.setInvalid = this.setInvalid.bind(this);
      this.validate = this.validate.bind(this);
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
        this.setInvalid({ ...err });
      }
    }

    runSyncValidation(values = this.state.values) {
      const errors = this.validate(values);

      if (Object.keys(errors).length) {
        this.setInvalid({ ...errors });
      }

      return errors;
    }

    setInvalid(errors) {
      this.setState({ errors, isValid: false });
    }

    validate(values) {
      const validate = hocProps.validate || this.props.validate;

      if (!validate) return {};

      const errors = validate(values, this.props);
      if (errors !== {}) {
        this.setInvalid({ ...errors });
      }

      return errors;
    }

    render() {
      return (
        <FormContext.Provider
          value={{
            onChange: this.onChange,
            state: { ...this.state },
          }}
        >
          <WrappedComponent
            {...this.props}
            isFormValid={this.state.isValid}
            onSubmit={this.onSubmit}
          />
        </FormContext.Provider>
      );
    }
  }
}

export default HOC;

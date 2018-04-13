import React, { Component } from 'react';

export const FormContext = React.createContext({
  onChange: () => { },
  registerField: () => { },
  state: {},
});

function HOC(hocProps, WrappedComponent) {
  return class Form extends Component {
    constructor(props) {
      super(props);
      this.state = {
        errors: {},
        isValid: false,
        values: {
          ...(props.initialValues
            ? { ...props.initialValues }
            : {}
          )
        },
      };
      this.registeredFields = {};

      this.asyncValidate = this.asyncValidate.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.registerField = this.registerField.bind(this);
      this.runSyncValidation = this.runSyncValidation.bind(this);
      this.setInvalid = this.setInvalid.bind(this);
      this.validate = this.validate.bind(this);
    }

    componentDidMount() {
      this.setState({
        ...this.state,
        values: {
          ...this.state.values,
          ...this.registeredFields,
        },
      });
    }

    asyncValidate(values) {
      return new Promise((resolve, reject) => {
        const asyncValidate = hocProps.asyncValidate || this.props.asyncValidate;

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
      e.preventDefault();

      if (Object.keys(this.runSyncValidation()).length) return;

      try {
        const errors = await this.asyncValidate(this.state.values);
        if (Object.keys(errors).length) {
          this.setInvalid({ ...errors });
          return;
        }

        this.setState({ idValid: true }, () => {
          this.props.onSubmit(this.state.values);
        });
      } catch (err) {
        this.setInvalid({ ...err });
      }
    }

    registerField(key) {
      this.registeredFields = {
        ...this.registeredFields,
        [key]: this.state.values[key] || null,
      };
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
            registerField: this.registerField,
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

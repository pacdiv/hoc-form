import React from 'react';
import hocForm, { Field } from './lib/hoc-form';
import Input from './Input';

const style = {
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    margin: 'auto',
    width: '18em',
  },
  submitButton: {
    background: 'mediumseagreen',
    color: 'white',
    border: '0',
    borderRadius: '.3em',
    cursor: 'pointer',
    fontSize: '.9em',
    fontWeight: '300',
    height: '3.5em',
    width: '100%',
  },
};

// Our tiny component
export function Form({
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate style={style.form}>
      <Field
        name="login"
        component={Input}
        props={{
          label: 'Login',
          placeholder: 'elonmusk',
          type: 'string',
        }}
      />
      <Field
        name="pwd"
        component={Input}
        props={{
          label: 'Password',
          type: 'password',
        }}
      />
      <button style={style.submitButton} type="submit">
        Sign in
      </button>
    </form>
  );
}

// Here's how we use hocForm
export default hocForm({
  name: 'my-form',
  validate(values, props) {
    let errors = {};

    if (!values.login) {
      errors = {
        ...errors,
        login: 'Please enter a login',
      };
    }

    if (!values.pwd) {
      errors = {
        ...errors,
        pwd: 'Please enter a password',
      };
    }
  
    return errors;
  }
})(Form);

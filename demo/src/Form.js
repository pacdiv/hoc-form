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

const unavailableUsernames = [
  'elonmusk',
  'ironman',
  'lukeskywalker',
];

function validateLogin(value = '') {
  if (value.trim() === '') {
    return Promise.reject('Please enter an username');
  }

  return unavailableUsernames.includes(value)
    ? Promise.reject('This username is unavailable')
    : Promise.resolve()
}

function validatePassword(value = '') {
  if (value.trim() === '') {
    return Promise.reject('Please enter a password');
  } else if (value.trim().length < 6) {
    return Promise.reject('Password must contain 6 characters or more');
  } else {
    return Promise.resolve();
  }
}

function validatePasswordConfirmation(value = '', password = '') {
  if (value.trim() === '') {
    return Promise.reject('Please enter a password');
  } else if (value !== password) {
    return Promise.reject('Please enter the same password as below');
  } else {
    return Promise.resolve();
  }
}

export function Form({
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate style={style.form}>
      <Field
        name="login"
        component={Input}
        props={{
          label: 'Login *',
          onBlur: value => validateLogin(value),
          placeholder: 'elonmusk',
          type: 'string',
        }}
      />
      <Field
        name="pwd"
        component={Input}
        props={{
          label: 'Password *',
          onBlur: value => validatePassword(value),
          type: 'password',
        }}
      />
      <Field
        name="confirmPwd"
        component={Input}
        props={{
          label: 'Password confirmation *',
          onBlur: (value, { pwd }) => validatePasswordConfirmation(value, pwd),
          type: 'password',
        }}
      />
      <Field
        name="referrer"
        component={Input}
        props={{
          label: 'How did you find us? *',
          placeholder: 'Google Search, Facebook or else',
          type: 'string',
        }}
      />
      <button style={style.submitButton} type="submit">
        Sign up
      </button>
    </form>
  );
}

export default hocForm({
  validate(values, props) {
    let errors = {};
    const errorCatcher = (key, callback, ...args) => (
      callback(values[key], args)
        .catch(error => ({ [key]: error }))
    );

    return Promise.all([
      errorCatcher('login', validateLogin),
      errorCatcher('pwd', validatePassword),
      errorCatcher('confirmPwd', validatePasswordConfirmation, values.pwd),
    ]).then((errors) => {
      if (!values.referrer) {
        errors = errors.concat({ referrer: 'Please give us something! 😇🙏' });
      }

      const results = errors.reduce((acc, item) => ({ ...acc, ...item }), {});
      return Object.keys(results).length ? Promise.reject(results) : Promise.resolve();
    });
  }
})(Form);

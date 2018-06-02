import React from 'react';

import { Field } from '../index';
import Input from '../demo/src/Input';

export function asyncValidate(values, props) {
  return values.login === 'starman'
    ? Promise.resolve({})
    : Promise.reject({ login: 'You’re not authorized. Bye!' })
}

export function Form({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      {singleField()}
      <button type="submit">
        Sign in
      </button>
    </form>
  );
}

export function singleField() {
  return (
    <Field
      name="login"
      component={Input}
      props={{
        label: 'Login',
        placeholder: 'elonmusk',
        type: 'string',
      }}
    />
  );
}

export function validate(values, props) {
  let errors = {};

  if (!values.login) {
    errors = {
      ...errors,
      login: 'Please enter a login',
    };
  }

  return errors;
}
# hoc-form • ![Travis](https://img.shields.io/travis/pacdiv/hoc-form.svg) ![Coveralls github](https://img.shields.io/coveralls/github/pacdiv/hoc-form.svg) ![npm](https://img.shields.io/npm/v/hoc-form.svg) ![license](https://img.shields.io/github/license/pacdiv/hoc-form.svg)

React higher-order component enabling to handle form validation. 

Get form validation without handling any state or other solution you might write! The time when we stop managing state or other solution to know whether our form is valid or not has come! 🚀

*« Why should we prepare a smoothie the hand-made way when we can use a blender? »*

## Requirements
HocForm needs at least react@16.3.1 and react-dom@16.3.1 to work.

## Getting started
Install HocForm using `yarn`:
```
yarn add hoc-form
```
Or using `npm`:
```
npm install --save hoc-form
```

HocForm needs three parts to run:
 - A form component to wrap in HocForm
 - Each field of this form component must be wrapped in a HocForm.Field
 - A validation function.

Here's a tiny demo of what you can do with HocForm:
```javascript
import React from 'react';
import hocForm, { Field } from 'hoc-form';

// First, we need a text input component to render our text field
function Input({
  input = {},
  label = '',
  meta = {},
  placeholder = '',
  type = 'text',
}) {
  return (
    <div>
      <label>
        {label}
      </label>
      <input
        placeholder={placeholder}
        type={type}
        {...input}
        onBlur={e => input.onBlur && input.onBlur(e.target.value)}
        onChange={e => input.onChange(e.target.value)}
      />
      {meta.error && <span>{meta.error}</span>}
    </div>
  );
}

// Then, we need to create our form component and its helpers
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
    ? Promise.reject('This username is unavaible')
    : Promise.resolve()
}

function validatePassword(value = '') {
  if (value.trim().length < 6) {
    return Promise.reject('Password must contain 6 characters or more');
  }
  
  return Promise.resolve();
}

function Form({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} noValidate>
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
          type: 'password',
        }}
      />
      <button type="submit">Sign up</button>
    </form>
  );
}

// Finally, an export of our wrapped form component
// with a validation function
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
    ]).then((errors) => {
      const results = errors.reduce((acc, item) => ({ ...acc, ...item }), {});
      return Object.keys(results).length ? Promise.reject(results) : Promise.resolve();
    });
  }
})(Form);
```
Please check out the [complete demo](https://github.com/pacdiv/hoc-form/tree/master/demo)!

## Documentation
You can find the full documentation [here](https://pacdiv.gitbook.io/hoc-form/).

## License
HocForm is [MIT licensed](https://github.com/pacdiv/hoc-form/blob/master/LICENSE).

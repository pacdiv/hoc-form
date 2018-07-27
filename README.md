
# hoc-form • ![Travis](https://img.shields.io/travis/pacdiv/hoc-form.svg) ![Coveralls github](https://img.shields.io/coveralls/github/pacdiv/hoc-form.svg) ![npm](https://img.shields.io/npm/v/hoc-form.svg) ![license](https://img.shields.io/github/license/pacdiv/hoc-form.svg)

React higher-order component enabling to handle form validation. 

Get form validation without handling any state or other solution you might write! The time when we stop managing state or other solution to know whether our form is valid or not has come! 🚀

*« Why should we prepare a hand-made smoothie when we can use a blender? »*

# Requirements
hocForm needs at least react@16.3.1 and react-dom@16.3.1 to work.

# Installation
Install hocForm using `yarn`:
```
yarn add hoc-form
```
Or using `npm`:
```
npm install --save hoc-form
```

# Usage
HocForm needs three parts to run:
 - A form component to wrap in hocForm
 - Each field of this form component must be wrapped in a hocForm.Field
 - A validation function.

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
    ? Promise.reject('This username is unavailable')
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
Please check out the [complete demo](https://github.com/pacdiv/hoc-form/tree/2.0.0-beta/demo)! 🚀

# API

## `hocForm({ options })(MyFormComponent) => React.Component`
Renders your `MyFormComponent` contexted with `hocForm`.

Two arguments are required:
- An `options` object to define the `validate` function and optional `initialValues`
- A form `React.Component` to render.

### `options.validate(values, props) => Promise`
Validates the form on submit.

Arguments:
1. `values` (`Object`): An object containing all fields keys and their value.
2. `props` (`Object`): An object containing all props provided to `MyFormComponent`.

Returns:
- A promise:
  - On success, your must return `Promise.resolve()`
  - In case of failure, your must return `Promise.reject({})`. The object parameter must contain every field key with its error (type of string or else, depends on how your components used with `Field` are designed).

Example, with errors as strings:
```javascript
function validate(values, props) {
  let errors = {};

  if (values.username) {
    if (!props.isUsernameAvailable(values.username)) {
      errors = { ...errors, username: 'This username is unavailable' };
    }
  } else {
    errors = { ...errors, username: 'Please enter an username' };
  }

  if (!values.password) {
    errors = { ...errors, password: 'Please enter a password' };
  }

  return Object.keys(errors).length
    ? Promise.reject(errors)
    : Promise.resolve();
}
```

### `options.initialValues: Object`
Object containing all initial values following fields keys.

Example:
```javascript
initialValues: {
  country: 'United Kingdom',
  phone: '+44',
}
```

### `MyFormComponent: React.Component`
A `React.Component` rendering a form including some `hocForm.Field` items.

Example:
```javascript
function Form({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Field
        name="login"
        component={Input}
        props={{
          label: 'Login *',
          type: 'string',
        }}
      />
    />
  );
}
```

Please check out a [complete example here](https://github.com/pacdiv/hoc-form/tree/2.0.0-beta/demo).

## `Field({ options }) => React.Component`
Renders a form field, contexted with `hocForm`.

### `options.name: String`
The name used in your `options.validate` function.

Example:
```javascript
<Field
  name="login"
/>
```

### `options.component: React.Component`
The `React.Component` rendered by `Field`.

Example:
```javascript
<Field
  component={Input}
/>
```

### `options.props: Object`
The properties provided to the `component` parameter.

Example:
```javascript
<Field
  props={{
    label: 'Login *',
    onBlur: (value, otherValues) => Promise.resolve(),
    placeholder: 'elonmusk',
    type: 'string',
  }}
/>
```

Please check out a [complete example here](https://github.com/pacdiv/hoc-form/tree/2.0.0-beta/demo).

## Which extra-props my components receive from `Field`?
Components used in `Field` must handle the two following properties: `input` and `meta`. Please check out the description below.

### `input.onChange(value: *)`
Allows to dispatch the new value of the field to the `hocForm` state. With this, all you have to do is to run `input.onChange(theNewValue)` to allow `hocForm` to use this new value at validation.

Example:
```javascript
function TextInput({
  input = {},
}) {
  return (
    <input
      type="text"
      onChange={e => input.onChange(e.target.value)}
    />
  );
}
```

### `input.onBlur(value: *, values: Object) => Promise`
Allows to run a validation on blur, the `onBlur` callback setted as property of the `Field`.

Example:
```javascript
function TextInput({
  input = {},
}) {
  return (
    <input
      type="text"
      onBlur={e => input.onBlur && input.onBlur(e.target.value)}
    />
  );
}
```

**Note:**
When `Field` runs the optional `onBlur` callback received from its `props` property, it runs this callback with two arguments:
- `value: *`, which is the current value of the `Field`;
- `values: Object`, object containing all fields keys with their respective value. As example, this argument can be useful if you need to compare a « confirmation password » field with a previous « create password » field.

This callback must a return a Promise:
- `Promise.resolve()` if this blur validation succeeds;
- `Promise.reject(error)` in case of failure.

Example:
```javascript
<Field
  name="confirmPwd"
  component={Input}
  props={{
    label: 'Password confirmation *',
    type: 'password',
    onBlur: (currentValue, values) => (
      currentValue.trim() !== values.firstPassword)
        ? Promise.reject('Please enter the same password as below')
        : Promise.resolve()
    ),
  }}
/>
```

### `options.meta: Object`

Object containing about a potential error on the field.

Example:
```javascript
function TextInput({
  meta = {},
  input = {},
}) {
  return (
    <React.Fragment>
      <input
        type="text"
        onBlur={e => input.onBlur && input.onBlur(e.target.value)}
      />
      {meta.error && <span>{meta.error}</span>}
    </React.Fragment>
  );
}
```

Please check out a [complete example here](https://github.com/pacdiv/hoc-form/tree/2.0.0-beta/demo).

# License
hocForm is [MIT licensed](https://github.com/pacdiv/hoc-form/blob/master/LICENSE).

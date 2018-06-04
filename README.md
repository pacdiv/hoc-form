
# hoc-form • ![Travis](https://img.shields.io/travis/pacdiv/hoc-form.svg) ![Coveralls github](https://img.shields.io/coveralls/github/pacdiv/hoc-form.svg) ![npm](https://img.shields.io/npm/v/hoc-form.svg) ![license](https://img.shields.io/github/license/pacdiv/hoc-form.svg)

React high-order component enabling to handle form validation. 

Get form validation without handling any state or other solution you might write! The time when we stop managing state or other solution to know whether our form is valid or not has come! 🚀

![Why should we prepare a smoothie with our hands when we can use a blender?](https://unsplash.com/photos/m741tj4Cz7M)

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
  error = null,
  input = {},
  label = '',
  meta = {},
  placeholder = '',
  type = 'text',
}) {
  return (
    <div>
      <label>{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        {...input}
        onChange={e => input.onChange(e.target.value)}
      />
      {meta.error && <span>{meta.error}</span>}
    </div>
  );
}

// Then, here is our form component
function Form({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Field
        name="login"
        component={Input}
        props={{
          error: 'Please enter a valid login',
          label: 'Login',
          placeholder: 'elonmusk',
          type: 'text',
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Finally, an export of our wrapped form component
// with a validation function
export default hocForm({
  validate(values, props) {
    return !values.login
      ? { login: 'Please enter a login' }
      : {};
  }
})(Form);
```

## Documentation
You can find the full documentation [here](https://pacdiv.gitbook.io/hoc-form/).

  

## License
HocForm is [MIT licensed](https://github.com/pacdiv/hoc-form/blob/master/LICENSE).
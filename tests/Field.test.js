import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import hocForm, { Field } from '../index';
import Input from '../demo/src/Input';

Enzyme.configure({ adapter: new Adapter() });

function Form({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Field
        name="login"
        component={Input}
        props={{
          label: 'Login',
          placeholder: 'elonmusk',
          type: 'string',
        }}
      />
      <button type="submit">
        Sign in
      </button>
    </form>
  );
}

const LoginForm = hocForm({
  validate(values, props) {
    let errors = {};

    if (!values.login) {
      errors = {
        ...errors,
        login: 'Please enter a login',
      };
    }

    return errors;
  },
  asyncValidate(values, props) {
    console.warn('asyncValidate:', values, props);
    return values.login === 'starman'
      ? Promise.resolve({})
      : Promise.reject({ login: 'Unknown login. Please enter another login.' })
  }
})(Form);

describe('HocForm()()', () => {
  function getNewValues(login) {
    return {
      values: {
        login,
      },
    };
  }

  // it('render HocForm mounted', () => {
  //   const wrapper = mount(
  //     <LoginForm
  //       onSubmit={values => values}
  //     />
  //   );

  //   expect(wrapper).toMatchSnapshot();
  // });

  it('renders HocForm shallowed', () => {
    const wrapper = shallow(
      <LoginForm
        onSubmit={values => values}
      />
    );

    // expect(wrapper.render()).toMatchSnapshot();

    const form = wrapper.find(Form).first().dive();
    const field = form.find(Field).first();
    const action = form.find('button').first();

    // Testing invalid syncValidate
    form.simulate('submit');

    // Testing valid syncValidate then invalid asyncValidate
    wrapper.setState(getNewValues('ironman'));
    form.simulate('submit');

    // Testing both valid syncValidate and asyncValidate
    wrapper.setState(getNewValues('starman'));
    form.simulate('submit');
  });
});

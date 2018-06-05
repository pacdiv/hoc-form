import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import hocForm, { Field } from '../index';
import {
  asyncValidate,
  Form,
  singleField,
  validate,
} from './helpers';

Enzyme.configure({ adapter: new Adapter() });

const LoginForm = hocForm({
  initialValues: {
    login: 'hulk',
  },
  validate,
  asyncValidate,
  validateOnBlur: true,
})(Form);

const LoginFormWithoutValidation = hocForm({
  validateOnBlur: true,
})(Form);

describe('HocForm()()', () => {
  const event = {
    preventDefault: value => value,
  };
  function submitWithNewLogin(wrapper, form, event, login) {
    wrapper.setState({
      values: {
        login,
      },
    }, () => form.simulate('submit', event));
  }

  it('shallows HocForm with sync and async validations', () => {
    const formWrapper = shallow(
      <LoginForm
        onSubmit={values => values}
      />,
    );

    formWrapper.setState({
      errors: {
        login: 'Please enter a login',
      },
    }, () => formWrapper.instance().onChange('login', ''));
    formWrapper.instance().onBlur('login');

    const form = formWrapper.find(Form).first().dive();
    [
      '',           // Testing invalid syncValidate
      'ironman',    // Testing valid syncValidate then invalid asyncValidate
      'starman',    // Testing both valid syncValidate and asyncValidate
    ].forEach(key => submitWithNewLogin(formWrapper, form, event, key));

    expect(formWrapper.render()).toMatchSnapshot();
  });

  it('shallows HocForm without sync or async validation', () => {
    const formWrapper = shallow(
      <LoginFormWithoutValidation
        onSubmit={values => values}
      />,
    );

    const form = formWrapper.find(Form).first().dive();
    formWrapper.instance().onBlur('login');
    submitWithNewLogin(formWrapper, form, event, 'starman');
  })
});

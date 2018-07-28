import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import hocForm, { Field } from '../index';
import {
  Form,
  validate,
} from './helpers';

Enzyme.configure({ adapter: new Adapter() });

const LoginForm = hocForm({
  initialValues: {
    login: 'hulk',
  },
  validate,
})(Form);

const LoginFormWithoutValidation = hocForm({})(Form);

describe('HocForm()()', () => {
  const event = {
    preventDefault: value => value,
  };
  let spy;
  const onSubmit = jest.fn(values => values);
  function submitWithNewLogin(wrapper, form, event, login, times) {
    wrapper.setState({
      values: {
        login,
      },
    }, () => {
      Promise.resolve(form.simulate('submit', event))
        .then(() => expect(spy).toHaveBeenCalledTimes(times))
        .catch(() => ({}));
    });
  }

  afterEach(() => {
    spy.mockRestore();
  });

  it('shallows HocForm with validation', () => {
    const formWrapper = shallow(
      <LoginForm
        onSubmit={onSubmit}
      />,
    );
    spy = jest.spyOn(formWrapper.instance().props, 'onSubmit');

    formWrapper.instance().setError('login', 'Please enter a login');
    formWrapper.instance().unsetError('login');
    formWrapper.instance().setValue('login', '');

    const form = formWrapper.find(Form).first().dive();
    submitWithNewLogin(formWrapper, form, event, '', 1);
    submitWithNewLogin(formWrapper, form, event, 'starman', 2);
    expect(formWrapper.render()).toMatchSnapshot();
  });

  it('shallows HocForm without sync or async validation', () => {
    const onSubmit = jest.fn(values => values)
    const formWrapper = shallow(
      <LoginFormWithoutValidation
        onSubmit={onSubmit}
      />,
    );
    const spy = jest.spyOn(formWrapper.instance().props, 'onSubmit');

    const form = formWrapper.find(Form).first().dive();
    formWrapper.instance().setValue('login', 'hulk');
    submitWithNewLogin(formWrapper, form, event, 'starman', 1);
  });
});

import React, { Component } from 'react';

class ContextedField extends Component {
  componentDidMount() {
    const { registerField, input } = this.props;
    registerField(input.name);
  }

  render() {
    const {
      component: CustomComponent,
      ...props,
    } = this.props;

    return <CustomComponent {...props} />;
  }
}

export default ContextedField;

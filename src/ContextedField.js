import React from 'react';

function ContextedField({ component: CustomComponent, ...props }) {
  return <CustomComponent {...props} />;
}

export default ContextedField;

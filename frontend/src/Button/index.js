import React, { Component } from 'react';
import styled from 'styled-components';

class Button extends Component {
  render() {
    return <StyledButton />;
  }
}

const StyledButton = styled.button`
  color: tomato;
`;

export default Button;

import React from 'react';
import { render } from 'react-dom';
import { MyWidget } from './src/widget/MyWidget';
import Frame from './mocking/components/Frame/Frame';

render(
  <Frame>
    <MyWidget />
  </Frame>,
  document.getElementById('root'),
);

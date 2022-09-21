import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from 'components/Button';

test('renders correctly', () => {
  const tree = renderer.create(
    <Button onPress={() => console.log('Tested!')} />
  )
  .toJSON();
  expect(tree).toMatchSnapshot();
});

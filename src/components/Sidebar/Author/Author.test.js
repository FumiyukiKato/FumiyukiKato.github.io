// @flow strict
import React from 'react';
import renderer from 'react-test-renderer';
import Author from './Author';

jest.mock("@reach/router", () => ({
  ...jest.requireActual("@reach/router"),
  useLocation: () => ({
    pathname: "/"
  })
}));

describe('Author', () => {
  const props = {
    author: {
      name: 'test',
      photo: '/fumilemon.png',
      bio: 'test'
    },
    isIndex: false
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Author {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

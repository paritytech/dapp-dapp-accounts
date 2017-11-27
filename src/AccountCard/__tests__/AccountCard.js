// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import { shallowToJson } from 'enzyme-to-json';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';

import { shallowWithIntl } from '../../setupTests';
import AccountCard from '../AccountCard';

// Mock props
const props = {
  address: '123',
  account: {
    name: 'Foo',
    meta: {
      description: 'Bar'
    }
  },
  isVisible: true,
  onMakeDefault: () => {},
  onToggleVisible: () => {}
};

// Mock bond
jest.mock('oo7-parity', () => ({
  bonds: {
    balance: address => `Bond of ${address}`
  }
}));

test('should render correctly in when isDefault', () => {
  const component = shallowWithIntl(<AccountCard {...props} isDefault />);

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should render correctly in when hidden', () => {
  const component = shallowWithIntl(
    <AccountCard {...props} isVisible={false} />
  );

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should handle onMakeDefault click', () => {
  const onMakeDefault = jest.fn();

  const component = shallowWithIntl(
    <AccountCard {...props} onMakeDefault={onMakeDefault} />
  );

  component
    .find(Button)
    .first()
    .simulate('click');
  expect(onMakeDefault).toHaveBeenCalledWith('123');
});

test('should handle onToggleVisibility click when visible', () => {
  const onToggleVisible = jest.fn();

  const component = shallowWithIntl(
    <AccountCard {...props} onToggleVisible={onToggleVisible} />
  );

  component
    .find(Button)
    .last()
    .simulate('click');
  expect(onToggleVisible).toHaveBeenCalledWith('123');
});

test('should handle onToggleVisibility click when hidden', () => {
  const onToggleVisible = jest.fn();

  const component = shallowWithIntl(
    <AccountCard
      {...props}
      onToggleVisible={onToggleVisible}
      isVisible={false}
    />
  );

  component.simulate('click');
  expect(onToggleVisible).toHaveBeenCalledWith('123');
});

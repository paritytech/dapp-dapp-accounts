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

import { shallowWithIntl } from '../setupTests';
import App from '../App';
import AccountCard from '../AccountCard';

const props = {
  // Mock store
  store: {
    accounts: {
      foo: {
        name: 'FooName',
        meta: {}
      },
      bar: {
        name: 'BarName',
        meta: {}
      },
      baz: {
        name: 'BazName',
        meta: {}
      }
    },
    visible: ['foo', 'bar'],
    default: 'foo'
  }
};

test('should render correctly', () => {
  const component = shallowWithIntl(<App {...props} />);

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should render correctly when no account', () => {
  const component = shallowWithIntl(<App store={{ accounts: {} }} />);

  expect(shallowToJson(component)).toMatchSnapshot();
});

test('should call store.showAccount when we toggle visibility on a hidden app', () => {
  const showAccount = jest.fn();
  const component = shallowWithIntl(
    <App store={{ ...props.store, showAccount }} />
  );

  component
    .find(AccountCard)
    .last() // baz is hidden
    .props()
    .onToggleVisible();

  expect(showAccount).toHaveBeenCalled();
});

test('should call store.hideAccount when we toggle visibility on a visible app', () => {
  const hideAccount = jest.fn();
  const component = shallowWithIntl(
    <App store={{ ...props.store, hideAccount }} />
  );

  const componentProps = component
    .find(AccountCard)
    .at(1) // bar is shown
    .props();

  componentProps.onToggleVisible(componentProps.address);

  expect(hideAccount).toHaveBeenCalled();
});

test('should call store.saveDefault when we make an account default', () => {
  const saveDefault = jest.fn();
  const component = shallowWithIntl(
    <App store={{ ...props.store, saveDefault }} />
  );

  const componentProps = component
    .find(AccountCard)
    .at(1) // bar not default
    .props();

  componentProps.onMakeDefault(componentProps.address);

  expect(saveDefault).toHaveBeenCalled();
});

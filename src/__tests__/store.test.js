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

import Store from '../store';

const mockAccounts = {
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
};
const visible = ['foo', 'bar'];
const defaultAddress = 'foo';

const mockApi = {
  parity: {
    allAccountsInfo: () => Promise.resolve(),
    getNewDappsAddresses: () => Promise.resolve(),
    getNewDappsDefaultAddress: () => Promise.resolve(),
    setNewDappsAddresses: () => Promise.resolve(),
    setNewDappsDefaultAddress: () => Promise.resolve()
  }
};

test('should correctly load()', () => {
  const store = new Store({
    parity: {
      ...mockApi.parity,
      allAccountsInfo: () => Promise.resolve(mockAccounts),
      getNewDappsAddresses: () => Promise.resolve(visible),
      getNewDappsDefaultAddress: () => Promise.resolve(defaultAddress)
    }
  });
  expect.assertions(3);
  return store.load().then(() => {
    expect(store.accounts).toEqual(mockAccounts);
    expect(store.visible).toHaveLength(2);
    expect(store.default).toEqual(defaultAddress);
  });
});

test('should handle setAccounts', () => {
  const store = new Store(mockApi);
  store.setAccounts(mockAccounts);

  expect(store.accounts).toEqual(mockAccounts);
});

test('should handle setVisible', () => {
  const store = new Store(mockApi);
  store.setVisible(visible);

  expect(store.visible).toHaveLength(2);
});

test('should handle setVisible when null', () => {
  const store = new Store(mockApi);
  store.setAccounts(mockAccounts);
  store.setVisible(null); // Everything visible

  expect(store.visible).toHaveLength(3);
});

test('should handle setDefault', () => {
  const store = new Store(mockApi);
  store.setDefault(defaultAddress);

  expect(store.default).toEqual(defaultAddress);
});

test('should handle showAccount', () => {
  const store = new Store(mockApi);
  store.saveVisible = jest.fn();
  store.showAccount('baz');

  expect(store.saveVisible).toHaveBeenCalledWith(['baz']);
});

test('should handle hideAccount', () => {
  const store = new Store(mockApi);
  store.saveVisible = jest.fn();
  store.setVisible(visible);
  store.hideAccount('bar');

  expect(store.saveVisible).toHaveBeenCalledWith(['foo']);
});

test('should handle saveVisible', () => {
  const setNewDappsAddresses = jest.fn();
  const store = new Store({
    parity: {
      ...mockApi.parity,
      setNewDappsAddresses
    }
  });
  store.saveVisible(visible);

  expect(setNewDappsAddresses).toHaveBeenCalledWith(visible);
});

test('should handle saveDefault', () => {
  const setNewDappsDefaultAddress = jest.fn();
  const store = new Store({
    parity: {
      ...mockApi.parity,
      setNewDappsDefaultAddress
    }
  });
  store.saveDefault(defaultAddress);

  expect(setNewDappsDefaultAddress).toHaveBeenCalledWith(defaultAddress);
});

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

import { action, extendObservable } from 'mobx';

export default class Store {
  constructor(api) {
    this._api = api;

    extendObservable(this, {
      accounts: {}, // All accounts with info (maps address to account info)
      visible: [], // Array of visible accounts' addresses
      default: null // Default account address
    });

    this.load();
  }

  // FIXME: Hardware accounts are not showing up here
  setAccounts = action(accounts => {
    this.accounts = accounts;
  });

  setDefault = action(address => {
    this.default = address;
  });

  saveDefault = action(address => {
    this.setDefault(address);
    return this._api.parity.setNewDappsDefaultAddress(address);
  });

  setVisible = action(visible => {
    this.visible = visible === null ? Object.keys(this.accounts) : visible; // If visible is null, it means all dapps are visible
  });

  saveVisible = action(visible => {
    this.setVisible(visible);
    this._api.parity.setNewDappsAddresses(visible);
  });

  showAccount = action(address => {
    this.saveVisible(this.visible.concat(address));
  });

  hideAccount = action(address => {
    this.saveVisible(this.visible.filter(a => a !== address));
  });

  load() {
    return Promise.all([
      this._api.parity.allAccountsInfo(),
      this._api.parity.getNewDappsAddresses(),
      this._api.parity.getNewDappsDefaultAddress()
    ]).then(([accounts, visible, defaultAddress]) => {
      this.setAccounts(accounts);
      this.setVisible(visible);
      this.setDefault(defaultAddress);
    });
  }
}

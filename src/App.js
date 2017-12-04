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

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Page from '@parity/ui/lib/Page';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

import styles from './App.css';
import AccountCard from './AccountCard';

class App extends Component {
  handleMakeDefault = address => {
    const { store } = this.props;
    store.saveDefault(address);
  };

  handleToggleVisible = address => {
    const { store } = this.props;
    if (store.visible.includes(address)) {
      store.hideAccount(address);
    } else {
      store.showAccount(address);
    }
  };

  render() {
    const { store } = this.props;

    if (!Object.keys(store.accounts) || !store.default) return null;

    return (
      <Page
        title={
          <FormattedMessage
            id="dapps.accounts.title"
            defaultMessage="Accounts Visible to Dapps"
          />
        }
      >
        <div className={styles.section}>
          <Header as="h4">Default Account</Header>
          <span>
            This is your default account to be used in the Dapps. It is also the
            account shown on the top bar.
          </span>
          <Card.Group className={styles.cardGroup}>
            <AccountCard
              isDefault
              isVisible
              account={store.accounts[store.default]}
              address={store.default}
            />
          </Card.Group>
        </div>
        <div className={styles.section}>
          <Header as="h4">Other Accounts</Header>
          <span>
            These are the other accounts that can be accessed by Dapps. Toggle
            them to make them visible/hidden for Dapps.
          </span>
          <Card.Group className={styles.cardGroup}>
            {Object.keys(store.accounts)
              .filter(address => address !== store.default)
              .map(address => (
                <AccountCard
                  key={address}
                  address={address}
                  account={store.accounts[address]}
                  isVisible={store.visible.includes(address)}
                  onMakeDefault={this.handleMakeDefault}
                  onToggleVisible={this.handleToggleVisible}
                />
              ))}
          </Card.Group>
        </div>
      </Page>
    );
  }
}

export default observer(App);

App.propTypes = {
  store: PropTypes.object.isRequired
};

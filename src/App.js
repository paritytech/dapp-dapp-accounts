import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { bonds } from 'oo7-parity';
import EtherBalance from 'parity-reactive-ui/src/EtherBalance';

import styles from './App.css';

class App extends PureComponent {
  render() {
    return (
      <div className={styles.layout}>
        <h3>
          <FormattedMessage
            id="dapps.accounts.title"
            defaultMessage="Accounts visible to Dapps"
          />
        </h3>
        <EtherBalance address="2" />
      </div>
    );
  }
}

export default App;

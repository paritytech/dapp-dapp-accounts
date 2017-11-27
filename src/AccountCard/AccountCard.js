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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { bonds } from 'oo7-parity';

// TODO Wait for PR#18 on parity-reactive-ui for dependency
import EtherBalance from '../vendor/EtherBalance';

import IdentityIcon from '@parity/ui/lib/IdentityIcon';
import { IdentityName } from '@parity/ui/lib/IdentityName/identityName';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

import styles from './AccountCard.css';

class AccountCard extends PureComponent {
  render() {
    const {
      account,
      address,
      isDefault,
      isVisible,
      onMakeDefault,
      onToggleVisible
    } = this.props;

    return (
      <Card
        className={[styles.accountCard, !isVisible ? styles.hidden : ''].join(
          ' '
        )}
        onClick={isVisible ? null : () => onToggleVisible(address)}
      >
        <Card.Content>
          <Image
            as={IdentityIcon}
            floated="right"
            size="mini"
            address={address}
          />
          <Card.Header>
            <IdentityName address={address} name={account.name} unknown />
          </Card.Header>
          <Card.Meta>{address}</Card.Meta>
          <Card.Description>
            {account.meta.description && <p>{account.meta.description}</p>}
            <p>
              <FormattedMessage
                id="dapp.accounts.balance"
                defaultMessage="Balance"
              />: <EtherBalance balance={bonds.balance(address)} />
            </p>
          </Card.Description>
        </Card.Content>
        {!isDefault && (
          <Card.Content extra textAlign="center">
            {isVisible ? (
              <Button.Group widths="2">
                <Button basic primary onClick={() => onMakeDefault(address)}>
                  Make Default
                </Button>
                <Button
                  basic
                  color="grey"
                  onClick={() => onToggleVisible(address)}
                >
                  Hide
                </Button>
              </Button.Group>
            ) : (
              <Label>
                <FormattedMessage
                  id="dapp.accounts.hidden"
                  defaultMessage="Hidden"
                />
              </Label>
            )}
          </Card.Content>
        )}
      </Card>
    );
  }
}

export default AccountCard;

AccountCard.propTypes = {
  account: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  isDefault: PropTypes.bool,
  isVisible: PropTypes.bool.isRequired,
  onMakeDefault: PropTypes.func,
  onToggleVisible: PropTypes.func
};

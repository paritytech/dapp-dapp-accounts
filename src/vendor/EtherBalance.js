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
import { BigNumber } from 'bignumber.js';
import { ReactiveComponent } from 'oo7-react';

// keeps balance of ether up to date
class EtherBalance extends ReactiveComponent {
  constructor() {
    super(['balance']);
  }

  render() {
    if (typeof this.state.balance === 'undefined') {
      return <span>-</span>;
    }
    let ethdiv = new BigNumber('1e+18');
    let ethVal = this.state.balance.div(ethdiv);

    return <span>{ethVal.toFormat(5)} ETH</span>;
  }
}

export default EtherBalance;

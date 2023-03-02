import React from "react";

import CreateOrder from './CreateOrder';
import FillOrder from './FillOrder';
import OrderList from './OrderList';
import Rebase from './Rebase';

function Trade() {
  return (
    <div className="container">
      <h2>Trade TheRisk / mockUSDT</h2>

      <div className="row">
        <div className='col-md-4'>
          <CreateOrder />
        </div>
        <div className='col-md-4'>
          <FillOrder />
        </div>
        <div className='col-md-4'>
          <Rebase />
        </div>
      </div>

      <OrderList />
    </div>
  )
}

export default Trade;

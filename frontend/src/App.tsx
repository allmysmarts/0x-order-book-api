import React from 'react';

import Header from './Components/Header';
import CreateOrder from './Components/CreateOrder';
import FillOrder from './Components/FillOrder';
import OrderList from './Components/OrderList';
import Rebase from './Components/Rebase';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
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
    </div>
  );
}

export default App;

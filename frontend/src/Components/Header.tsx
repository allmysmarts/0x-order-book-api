import React from "react"

function Header() {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
      <h5 className="my-0 mr-md-auto font-weight-normal">0x-Orderbook-API</h5>
      
      <nav className="my-2 my-md-0 mr-md-3">
        <a className="p-2 text-dark" href="#">Mainnet</a>
        <a className="p-2 text-dark" href="#">0xabcd...890</a>
      </nav>
      <a className="btn btn-outline-primary" href="#">
        Connect Wallet
      </a>
    </div>
  )
}

export default Header;

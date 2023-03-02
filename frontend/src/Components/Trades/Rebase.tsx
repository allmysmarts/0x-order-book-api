import React from "react";

function Rebase() {
  return (
    <form className="border rounded p-4 my-2">
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">
          Rebase Factor (%)
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <small id="emailHelp" className="form-text text-muted">
          All holders balances will be rebased.
        </small>
      </div>
      
      <button className="btn btn-primary">
        Rebase
      </button>
    </form>
  );
}

export default Rebase;

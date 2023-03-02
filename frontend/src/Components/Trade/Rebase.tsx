import React from "react";

function Rebase() {
  return (
    <form className="border rounded p-4 my-2">
      <div className="form-group">
        <label htmlFor="rebase-factor">
          Rebase Factor (%)
        </label>
        <input
          type="number"
          className="form-control"
          id="rebase-factor"
          aria-describedby="rebase-factor-help"
        />
        <small id="rebase-factor-help" className="form-text text-muted">
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

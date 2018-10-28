import React from "react";
import "./Form.css"
export const FormBtn = props => (
  <button {...props} className="button btn btn-success">
    {props.children}
  </button>
);

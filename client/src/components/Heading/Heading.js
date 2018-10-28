import React from "react";
import "./Heading.css";

const Heading = props => (
    <h5 className="heading">
    {props.children}
    </h5>
  );

export default Heading;
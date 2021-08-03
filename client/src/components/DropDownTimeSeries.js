import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import FormControl from "react-bootstrap/FormControl";
import "../style/Panel.css";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);

const DropDownTimeSeries = ({
  ids,
  locationid,
  timeSerieUrl,
  setTimeSerieUrl,
  setIsHidden,
}) => {
  const dateSelectHandler = (value) => {
    setTimeSerieUrl(value);
    setIsHidden(false);
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          Time series date
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {ids.map((id) => {
            const endpoint = `https://hydro-web.herokuapp.com/v1/timeseries/?filter=${id}&location=${locationid}`;
            return (
              <Dropdown.Item
                eventKey={endpoint}
                Key={id}
                onClick={() => dateSelectHandler(endpoint)}
              >
                {id.slice(1, 80)}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropDownTimeSeries;

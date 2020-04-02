import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
class Navbar extends Component {
    render() {
        return ( 
<nav className="navbar navbar-light bg-light">
  <span className="navbar-brand mb-0 h1">{this.props.account}</span>
</nav>
        )}}
export default Navbar;
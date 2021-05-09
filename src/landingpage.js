import React, { Component } from "react";
import './css/bootstrap.min.css'
import './css/cover.css'
import logo from './css/logo.png'

class LandingPage extends Component {
  render() {
    return (
    <div className="text-center">
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <header className="masthead mb-auto" id="hello"></header>
        <img src= {logo} />
        <main role="main" className="inner cover">
          <h1 className="cover-heading">Privacy in your control</h1>
          <p className="lead">
            Secure-flow was designed for users to have control of their own
            data, protects privacy and prevent organizations from using your
            data without permission
          </p>

          <a className="btn btn-lg btn-secondary">Sign in</a>
          <a className="btn btn-lg btn-secondary">Sign Up</a>
        </main>

        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>
              2021 TOhacks
              <a href="https://devpost.com/software/secureflow"> Devpost</a>
            </p>
          </div>
        </footer>
      </div>
    </div>);
  }
}

export default LandingPage
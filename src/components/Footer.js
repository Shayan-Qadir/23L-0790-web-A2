import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} EventHub — Web Programming Assignment 2</p>
      </div>
    </footer>
  );
}

export default Footer;

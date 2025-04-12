import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="wrapper">
      <p>Copyright |  2016 - {year}</p>
    </footer>
  )
};

export default Footer;

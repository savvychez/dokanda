import React from 'react';

const TableRow = ({ header, content, className }) => {
  return (
    <div className={`tablerow ${className}`} >
      <h1> {header}</h1>
      <h2>{content}</h2>
    </div>
  )
}

export default TableRow;
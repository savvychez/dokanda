import React from 'react';

const TableRow = ({ header, content, className }) => {
  return (
    <div className={`tablerow ${className}`} >
      <h1> {header}</h1>
      <h2>{content.slice(0,3).join(', ')} ...</h2>
    </div>
  )
}

export default TableRow;
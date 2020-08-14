import React from 'react';
import '../styles/MobileTable.css'
import TableRow from './TableRow';

const MobileTable = ({ contents }) => {
  contents = [
    {
      "disease": "Corona",
      "symptoms": "Death, dying, pain"
    },
    {
      "disease": "Swine Flu",
      "symptoms": "Cheese, ball, explosion"
    }
  ]
  return (
    <div className="table">
      {contents.map((entry, i) => (
        <TableRow className={i != contents.length-1 && "leading"} header={entry.disease} content={entry.symptoms}/>
      ))}
    </div>
  )
}

export default MobileTable;
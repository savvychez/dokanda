import React from 'react';
import '../styles/MobileTable.css'
import TableRow from './TableRow';
import Scrollbars from 'react-custom-scrollbars';

const MobileTable = ({ results }) => {
  // results = [
  //   {
  //     "name": "Corona",
  //     "symptoms": "Death, dying, pain"
  //   },
  //   {
  //     "name": "Swine Flu",
  //     "symptoms": "Cheese, ball, explosion"
  //   }
  // ]
  return (
    <div className="table">
      <Scrollbars>
        {results.map((entry, i) => (
          <TableRow className={i != results.length - 1 ? "leading" : ""} header={entry.name} content={entry.symptoms} />
        ))}
      </Scrollbars>
    </div>
  )
}

export default MobileTable;
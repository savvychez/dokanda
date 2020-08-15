import React from 'react';
import '../styles/MobileTable.css'
import TableRow from './TableRow';
import Scrollbars from 'react-custom-scrollbars';

const MobileTable = ({ results }) => {
  return (
    <div className="table">
      <Scrollbars>
        {results.length ? results.map((entry, i) => (
          <TableRow key={i} className={i != results.length - 1 ? "leading" : ""} header={entry.name} content={entry.symptoms} />
        )) : <h2 className="empty">No Results.</h2>}
      </Scrollbars>
    </div>
  )
}

export default MobileTable;
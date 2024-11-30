import React, { useState } from "react";
import Pagination from "./Pagination"; // Import the new Pagination component

const Table = (props) => {
  const initDataShow =
    props.limit && props.bodyData
      ? props.bodyData.slice(0, Number(props.limit))
      : props.bodyData;

  const [dataShow, setDataShow] = useState(initDataShow);
  const [currPage, setCurrPage] = useState(0);
  const totalPages =
    Math.ceil(props.bodyData.length / Number(props.limit)) || 1;

  const selectPage = (page) => {
    const start = Number(props.limit) * page;
    const end = start + Number(props.limit);
    setDataShow(props.bodyData.slice(start, end));
    setCurrPage(page);
  };

  return (
    <div>
      <div className="table-wrapper">
        <table>
          {props.headData && props.renderHead ? (
            <thead>
              <tr>
                {props.headData.map((item, index) =>
                  props.renderHead(item, index)
                )}
              </tr>
            </thead>
          ) : null}
          {props.bodyData && props.renderBody ? (
            <tbody>
              {dataShow.map((item, index) => props.renderBody(item, index))}
            </tbody>
          ) : null}
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currPage}
          totalPages={totalPages}
          onPageChange={selectPage}
        />
      )}
      <br />
    </div>
  );
};

export default Table;

import React from "react";
import { AutoSizer, Collection } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

// Collection data as an array of objects
const list = [
  { name: "cell 1", x: 13, y: 34, width: 123, height: 80 },
  { name: "cell 2", x: 123, y: 340, width: 123, height: 80 },
  { name: "最右边的Cell ", x: 1200, y: 340, width: 123, height: 80 },
  { name: "最下边的Cell ", x: 600, y: 700, width: 123, height: 80 },
  // And so on...
];

function cellRenderer({ index, key, style }: any) {
  return (
    <div key={key} style={style} className="cell">
      {list[index].name}
    </div>
  );
}

function cellSizeAndPositionGetter({ index }: any) {
  const datum = list[index];

  return {
    height: datum.height,
    width: datum.width,
    x: datum.x,
    y: datum.y,
  };
}

function Basic() {
  return (
    <>
      <h2>基础</h2>
      <div className="wrapper">
        <AutoSizer>
          {({ height, width }) => (
            <Collection
              cellCount={list.length}
              cellRenderer={cellRenderer}
              cellSizeAndPositionGetter={cellSizeAndPositionGetter}
              height={height}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    </>
  );
}

export default Basic;

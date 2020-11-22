import React, { useState } from "react";
import { AutoSizer, Collection } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once
import { useScrollControl } from "./useScrollControl";

// Collection data as an array of objects
const list = [
  { name: "cell 1", x: 13, y: 34, width: 100, height: 80 },
  { name: "cell 2", x: 123, y: 340, width: 100, height: 80 },
  { name: "cell 3", x: 1000, y: 34, width: 100, height: 80 },
  { name: "cell 4", x: 503, y: 800, width: 100, height: 80 },
  { name: "最右边的Cell ", x: 1500, y: 540, width: 100, height: 80 },
  { name: "最下边的Cell ", x: 300, y: 1000, width: 100, height: 80 },
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

function DragAble() {
  const [containerSize, setContainerSize] = useState<[number, number]>([0, 0]);
  const { scrollLeft, scrollTop, onScroll, dragHandler } = useScrollControl(containerSize);

  return (
    <>
    <h2>可拖拽</h2>
    <div className="wrapper"  id="dragable">
    <AutoSizer>
      {({ height, width }) => {
        const [containerWidth, containerHeight] = containerSize;
        if (containerWidth !== width || containerHeight !== height) {
          setContainerSize([width, height]);
        }
        return (
          <div
            onMouseDown={(event) => {
              dragHandler(event);
            }}
          >
            <Collection
              cellCount={list.length}
              cellRenderer={cellRenderer}
              cellSizeAndPositionGetter={cellSizeAndPositionGetter}
              height={height}
              width={width}
              scrollLeft={scrollLeft}
              scrollTop={scrollTop}
              onScroll={onScroll}
            />
          </div>
        );
      }}
    </AutoSizer>
    </div>
    </>
  );
}

export default DragAble;

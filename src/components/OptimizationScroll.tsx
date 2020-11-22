/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef, memo } from "react";
import {
  AutoSizer,
  Collection,
  CollectionCellRenderer,
} from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once
import {generateRandomList} from "../util";
import { isEqual } from "lodash";

interface Cell {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroudColor: string;
  name: string;
}

const CellComp = ({ style, cell, index }: any) => {
  // console.log("Cell render:", index);
  return (
    <div style={style} className="cell">
      index: {index}
      <br />
      {cell?.name}
    </div>
  );
};

const MemoedCell = memo(CellComp, (a, b) => {
  for (const key in a) {
    if (a[key] !== b[key]) {
      console.log(`${key} 的引用值变了`);
    }
  }
  return isEqual(a, b);
});

function OptimizationScroll() {
  const [cellList, setCellList] = useState<Cell[]>([]);
  const collectionRef = useRef<Collection>(null);

  useEffect(() => {
    setCellList(generateRandomList(30));
  }, []);

  // 无优化
  const cellRenderer = ({ index, key, style }: any) => {
    return (
      <CellComp key={key} cell={cellList[index]} style={style} index={index} />
    );
  };

  /**
   * 缓存优化 - 1
   * 如果 map 中存在这个 key 值，那就直接返回缓存的 cellRenderer 结果
   */
  const memoCellRender1 = ({ index, key, style }: any) => {
    return (
      <MemoedCell
        key={key}
        cell={cellList[index]}
        style={style}
        index={index}
      />
    );
  };

/**
 * 缓存优化 - 2
 * 如果 map 中存在这个 key 值，那就直接返回缓存的 cellRenderer 结果
 */
// 当卡片的位置变化时要清空缓存，保证缓存结果正确
const cacheMap = new Map();
const memoCellRender2: CollectionCellRenderer = (props) => {
  const { key } = props;
  const cacheCell = cacheMap.get(key);
  // 有缓存
  if (cacheCell) return cacheCell;
  // 没缓存
  const cell = cellRenderer(props);
  cacheMap.set(key, cell);
  return cell;
};

  //  获取 Cell 的 style
  const cellSizeAndPositionGetter = ({ index }: any) => {
    console.log("cellSizeAndPositionGetter");
    const datum = cellList[index];
    return {
      height: datum.height,
      width: datum.width,
      x: datum.x,
      y: datum.y,
    };
  };

  return (
    <>
      <h2>滚动时优化</h2>
      react-virtualised 会在每次 scroll 时将可见范围内所有的 Cell
      组件内部逻辑都执行一次，如果 Cell
      组件中逻辑较为复杂，这里就有一定的性能损耗（ Cell 组件 React.creatElement
      的执行耗时）。
      <br />
      当优化开启时，滚动视图，可在控制台中看到可减少很多次 Cell 组件的执行
      <br />
      <button
        onClick={() => {
          // 重新生成 list，注意在 list 更新后需要手动触发 recomputeCellSizesAndPositions 函数
          setCellList(generateRandomList(50));
          collectionRef.current?.recomputeCellSizesAndPositions();
        }}
        style={{ margin: "5px 20px 5px 0" }}
      >
        重新生成 Cell
      </button>
      <div className="wrapper">
        <AutoSizer>
          {({ height, width }) => (
            <Collection
              ref={collectionRef}
              cellCount={cellList.length}
              cellRenderer={
                cellRenderer
                // memoCellRender1
                // memoCellRender2
              }
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

export default OptimizationScroll;

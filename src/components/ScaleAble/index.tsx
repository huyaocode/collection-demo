import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { AutoSizer, Collection } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once
import { generateRelativeRandomList } from "../../util";
import Toolbox from "./Toolbox";
import { useScrollControl } from "./useScrollControl";
interface Cell {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroudColor?: string;
  name?: string;
}
// 相对边界，最左、最右、最上、最下
export type RelativeBoundery = Record<
  "minX" | "maxX" | "minY" | "maxY",
  number
>;

const InitRelativeBoundery = {
  minX: 0,
  minY: 0,
  maxX: 0,
  maxY: 0,
};

const CellComp = ({ style, cell, index }: any) => {
  return (
    <div style={style} className="cell">
      index: {index}
      <br />
      {cell?.name}
    </div>
  );
};

type ContainerSize = [number, number];

const ScaleAble = () => {
  const [relativeCellList, setRelativeCellList] = useState<Cell[]>([]);
  const [relativeBoundery, setRelativeBoundery] = useState<RelativeBoundery>(
    InitRelativeBoundery
  );
  const [absoluteCellList, setAbsoluteCellList] = useState<Cell[]>([]);
  const [containerSize, setContainerSize] = useState<ContainerSize>([0, 0]);
  const [zoom, setZoom] = useState(100);

  const collectionRef = useRef<Collection>(null);
  const { scrollLeft, scrollTop, onScroll,fixShakeOnZoomRef } = useScrollControl(zoom);

  // 生成相对坐标
  useEffect(() => {
    const relativeCellList = generateRelativeRandomList(30);
    const relativeBoundery = relativeCellList.reduce((boundery, cell) => {
      return {
        minX: Math.min(boundery.minX, cell.x),
        minY: Math.min(boundery.minY, cell.y),
        maxX: Math.max(boundery.maxX, cell.x + cell.width),
        maxY: Math.max(boundery.maxY, cell.y + cell.height),
      };
    }, InitRelativeBoundery);
    setRelativeCellList(relativeCellList);
    setRelativeBoundery(relativeBoundery);
  }, []);

  // 生成绝对坐标
  useLayoutEffect(() => {
    const [containerW, containerH] = containerSize;
    const { minX, minY, maxX, maxY } = relativeBoundery;

    const offsetX = -minX + containerW / 2;
    const offsetY = -minY + containerH / 2;

    const list = relativeCellList.map((cell) => ({
      ...cell,
      x: cell.x + offsetX,
      y: cell.y + offsetY,
    }));

    // 插入右下角定位点
    list.push({
      index: list.length,
      x: maxX - minX + containerW,
      y: maxY - minY + containerH,
      width: 1,
      height: 1,
    });

    setAbsoluteCellList(list);

    collectionRef.current?.recomputeCellSizesAndPositions();
  }, [containerSize, relativeBoundery, relativeCellList]);

  useLayoutEffect(() => {
    fixShakeOnZoomRef.current!();
    /**
     * 为什么这里不写zoom？依赖项中写 zoom 会在视图缩小时偶发闪一下
     * zoom 变了之后，要先更新 ContianerSize，再更新 absoluteCellList，
     * 而 absoluteCellList 变化的时候才会更新右下角点的坐标，这个时候才有足够的宽度支持 Scroll 
     */
  }, [fixShakeOnZoomRef, absoluteCellList]);

  const cellRenderer = ({ index, key, style }: any) => {
    return (
      <CellComp
        key={key}
        cell={absoluteCellList[index]}
        style={style}
        index={index}
      />
    );
  };

  const cellSizeAndPositionGetter = ({ index }: any) => {
    const datum = absoluteCellList[index];
    return {
      height: datum.height,
      width: datum.width,
      x: datum.x,
      y: datum.y,
    };
  };

  return (
    <>
      <h2>缩放 、 相对坐标 & 绝对坐标 </h2>
      <Toolbox
        zoom={zoom}
        zoomStep={25}
        zoomMin={25}
        zoomMax={150}
        onChangeOfZoom={(newZoom: number) => {
          setZoom(newZoom);
        }}
      />
      <div className="wrapper">
        <AutoSizer>
          {({ height, width }) => {
            const enlargeZoom = 100 / zoom;
            const enlargeWidth = (width * enlargeZoom) >> 0;
            const enlargeHeight = (height * enlargeZoom) >> 0;
            const [containerWidth, containerHeight] = containerSize;
            if (
              containerWidth !== enlargeWidth ||
              containerHeight !== enlargeHeight
            ) {
              setContainerSize([enlargeWidth, enlargeHeight]);
            }

            return (
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                  height: (height * 100) / zoom,
                  width: (width * 100) / zoom,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <Collection
                  ref={collectionRef}
                  cellCount={absoluteCellList.length}
                  cellRenderer={cellRenderer}
                  cellSizeAndPositionGetter={({ index }) =>
                    cellSizeAndPositionGetter(absoluteCellList[index])
                  }
                  height={enlargeHeight}
                  width={enlargeWidth}
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
};

export default ScaleAble;

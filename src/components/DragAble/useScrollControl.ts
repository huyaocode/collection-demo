import { useState, useCallback } from "react";
import { throttle, clamp } from "lodash";

export const useScrollControl = (containerSize: [number, number]) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // 用户滚动回掉函数
  const onScroll = useCallback(
    ({
      scrollLeft: newScrollLeft,
      scrollTop: newScrollTop,
    }: {
      scrollLeft: number;
      scrollTop: number;
    }) => {
      setScrollTop(newScrollTop);
      setScrollLeft(newScrollLeft);
    },
    []
  );

  // 拖拽
  const dragHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button === 2) return; // 屏蔽右键点击

    const startLeft = event.clientX;
    const startTop = event.clientY;
    const startScrollLeft = scrollLeft;
    const startScrollTop = scrollTop;

    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX - startLeft) >> 0;
      const moveY = (e.clientY - startTop) >> 0;

      const newScrollLeft = startScrollLeft - moveX;
      const newScrollTop = startScrollTop - moveY;

      const [containerWidth, containerHeight] = containerSize;

      // 内容区宽度，在demo这里写个定值，你可以试着把他改的大一些来观察有什么情况
      const contentWidth = 1500 + 100;
      const contentHeight = 1000 + 80;

      //  Math.min(Math.max()) 是让值控制在 0 到 (总内容区宽高 - containerWidth/containerHeight)
      setScrollLeft(
        clamp(newScrollLeft, 0, contentWidth - containerWidth)
      );
      setScrollTop(
        clamp(newScrollTop, 0, contentHeight - containerHeight)
      );
    };

    const throttledHandleMouseMove = throttle(handleMouseMove, 20, {
      trailing: true,
    });

    // 添加一个正在拖拽的 className，用来做一些样式
    const wrapperClassList = document.getElementById('dragable')!.classList;
    const GRABBING_CLASSNAME = "grabbing";
    if (!wrapperClassList.contains(GRABBING_CLASSNAME)) {
        wrapperClassList.add(GRABBING_CLASSNAME);
    }

    const handleMouseUp = () => {
        wrapperClassList.remove(GRABBING_CLASSNAME);
      // 解绑
      window.removeEventListener("mousemove", throttledHandleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // 注册
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", throttledHandleMouseMove);
  };

  return { scrollLeft, scrollTop, onScroll, dragHandler };
};

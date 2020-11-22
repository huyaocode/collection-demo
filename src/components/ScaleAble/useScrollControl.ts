import { useState, useCallback, useRef } from "react";

export const useScrollControl = (zoom: number) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [lastZoom, setLastZoom] = useState(100); // 记录上一次缩放值
  const fixShakeOnZoomRef = useRef<() => void>();

  // 用户滚动回掉函数
  const onScroll = useCallback(
    ({
      scrollLeft: newScrollLeft,
      scrollTop: newScrollTop,
    }: {
      scrollLeft: number;
      scrollTop: number;
    }) => {
      if (zoom !== lastZoom) {
        setLastZoom(zoom);
        fixShakeOnZoomRef.current!();
      }
      setScrollTop(newScrollTop);
      setScrollLeft(newScrollLeft);
    },
    [lastZoom, zoom]
  );

  /**
   * 处理这种情况：
   *    缩小之后 scrollLeft 突然就变为 0 了
   * 需要手动把正常的 scrollLeft 设置上去
   * 但是 react-virtualized 内部应该有做缓存，直接设置原来的scrollLeft无效，需要设置一个不同的值
   */
  fixShakeOnZoomRef.current = () => {
    if (zoom === lastZoom) return;
    const fixScrollValue = (zoom < lastZoom ? 1 : -1) * 0.01;

    setScrollTop(scrollTop + fixScrollValue);
    setScrollLeft(scrollLeft + fixScrollValue);
    setTimeout(() => {
      setScrollTop(Math.round(scrollTop));
      setScrollLeft(Math.round(scrollLeft));
    });
  };

  return { scrollLeft, scrollTop, onScroll, fixShakeOnZoomRef };
};

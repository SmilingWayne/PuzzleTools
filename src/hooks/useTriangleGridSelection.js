import { useState } from "react";

/**
 * 自定义钩子，用于管理三角形网格选择状态
 */
const useTriangleGridSelection = (initialSize = { width: 8, height: 8 }) => {
  const [gridSize, setGridSize] = useState(initialSize);
  const [selectedTriangles, setSelectedTriangles] = useState([]);
  const [shapes, setShapes] = useState([]);
  
  // 切换单个三角形的选择状态
  const toggleTriangle = (x, y, z, isSelected) => {
    if (isSelected) {
      setSelectedTriangles(prev => [...prev, [x, y, z]]);
    } else {
      setSelectedTriangles(prev => prev.filter(tri => 
        !(tri[0] === x && tri[1] === y && tri[2] === z)
      ));
    }
  };

  // 处理多选操作
  const handleMultiSelect = (triangles, isSelected) => {
    if (isSelected) {
      // 添加新选中的三角形，避免重复
      const newTriangles = triangles.filter(([x, y, z]) => 
        !selectedTriangles.some(tri => tri[0] === x && tri[1] === y && tri[2] === z)
      );
      setSelectedTriangles(prev => [...prev, ...newTriangles]);
    } else {
      // 移除取消选中的三角形
      setSelectedTriangles(prev => 
        prev.filter(([x, y, z]) => 
          !triangles.some(tri => tri[0] === x && tri[1] === y && tri[2] === z)
        )
      );
    }
  };

  // 清除所有选择
  const clearSelection = () => {
    setSelectedTriangles([]);
    setShapes([]);
  };

  // 导入形状数据
  const importShapes = (shapesData) => {
    // 清除原有选择
    setSelectedTriangles([]);
    setShapes(shapesData);
  };

  // 增加网格尺寸
  const increaseGridSize = (dimension) => {
    setGridSize(prev => ({
      ...prev,
      [dimension]: prev[dimension] + 1
    }));
  };

  // 减少网格尺寸
  const decreaseGridSize = (dimension) => {
    setGridSize(prev => ({
      ...prev,
      [dimension]: Math.max(5, prev[dimension] - 1)
    }));
  };

  return {
    gridSize,
    selectedTriangles,
    shapes,
    toggleTriangle,
    handleMultiSelect,
    clearSelection,
    importShapes,
    increaseGridSize,
    decreaseGridSize
  };
};

export default useTriangleGridSelection;

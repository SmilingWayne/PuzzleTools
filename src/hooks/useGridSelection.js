import { useState } from "react";

/**
 * 自定义钩子，用于管理网格选择状态
 */
const useGridSelection = (initialSize = { width: 10, height: 10 }) => {
  const [gridSize, setGridSize] = useState(initialSize);
  const [selectedCells, setSelectedCells] = useState([]);
  const [shapes, setShapes] = useState([]);
  
  // 切换单个单元格的选择状态
  const toggleCell = (x, y, isSelected) => {
    if (isSelected) {
      setSelectedCells(prev => [...prev, [x, y]]);
    } else {
      setSelectedCells(prev => prev.filter(cell => !(cell[0] === x && cell[1] === y)));
    }
  };

  // 处理多选操作
  const handleMultiSelect = (cells, isSelected) => {
    if (isSelected) {
      // 添加新选中的单元格，避免重复
      const newCells = cells.filter(([x, y]) => 
        !selectedCells.some(cell => cell[0] === x && cell[1] === y)
      );
      setSelectedCells(prev => [...prev, ...newCells]);
    } else {
      // 移除取消选中的单元格
      setSelectedCells(prev => 
        prev.filter(([x, y]) => 
          !cells.some(cell => cell[0] === x && cell[1] === y)
        )
      );
    }
  };

  // 清除所有选择
  const clearSelection = () => {
    setSelectedCells([]);
    setShapes([]);
  };

  // 导入形状数据
  const importShapes = (shapesData) => {
    // 清除原有选择
    setSelectedCells([]);
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
    selectedCells,
    shapes,
    toggleCell,
    handleMultiSelect,
    clearSelection,
    importShapes,
    increaseGridSize,
    decreaseGridSize
  };
};

export default useGridSelection;

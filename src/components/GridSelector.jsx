import { useState, useRef, useEffect } from "react";

const GridSelector = ({ 
  width, 
  height, 
  selectedCells, 
  shapes = [],
  onCellToggle, 
  onMultiSelect 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  const [selectionMode, setSelectionMode] = useState(null); // 'add' or 'remove'
  const gridRef = useRef(null);

  // 生成形状颜色
  const getShapeColors = () => {
    const colors = [
      // 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      // 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
      // 'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
      'bg-red-800',     'bg-orange-200',
      'bg-amber-800',   'bg-lime-200',
      'bg-green-800',   'bg-teal-200',
      'bg-cyan-800',    'bg-sky-200',
      'bg-blue-800',    'bg-indigo-200',
      'bg-violet-800',  'bg-fuchsia-200',
      'bg-pink-800',    'bg-rose-200',
      'bg-purple-800',  'bg-yellow-200',
      'bg-emerald-800', 'bg-cyan-200',
      'bg-teal-800',    'bg-lime-200',
      'bg-sky-800',     'bg-blue-200',
      'bg-indigo-800',  'bg-violet-200',
      'bg-fuchsia-800', 'bg-pink-200',
      'bg-rose-800',    'bg-red-200',
      'bg-orange-800',  'bg-amber-200',
      'bg-lime-800',    'bg-green-200',
      'bg-yellow-800',  'bg-emerald-200',
      'bg-stone-800',   'bg-slate-200',
      'bg-gray-800',    'bg-neutral-200'
    ];
    return colors;
  };

  // 获取单元格所属的形状索引
  const getCellShapeIndex = (x, y) => {
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      for (let j = 0; j < shape.length; j++) {
        if (shape[j][0] === x && shape[j][1] === y) {
          return i;
        }
      }
    }
    return -1;
  };

  // 检查单元格是否被选中
  const isCellSelected = (x, y) => {
    return selectedCells.some(cell => cell[0] === x && cell[1] === y);
  };

  // 检查单元格是否属于某个形状
  const isCellInShape = (x, y) => {
    return getCellShapeIndex(x, y) !== -1;
  };

  // 处理鼠标按下事件
  const handleMouseDown = (e, x, y) => {
    if (e.button !== 0) return; // 只处理左键点击
    
    const isSelected = isCellSelected(x, y);
    setSelectionMode(isSelected ? 'remove' : 'add');
    setIsDragging(true);
    setStartCell([x, y]);
    setEndCell([x, y]);
    
    // 如果不是多选操作，则切换单元格状态
    if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
      onCellToggle(x, y, !isSelected);
    }
    
    // 防止拖动时选择文本
    e.preventDefault();
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e, x, y) => {
    if (!isDragging) return;
    setEndCell([x, y]);
  };

  // 处理鼠标抬起事件
  const handleMouseUp = () => {
    if (!isDragging || !startCell || !endCell) {
      setIsDragging(false);
      return;
    }
    
    // 计算选择区域
    const minX = Math.min(startCell[0], endCell[0]);
    const maxX = Math.max(startCell[0], endCell[0]);
    const minY = Math.min(startCell[1], endCell[1]);
    const maxY = Math.max(startCell[1], endCell[1]);
    
    // 如果是拖动选择（不是单击）
    if (minX !== maxX || minY !== maxY) {
      const selectedArea = [];
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          selectedArea.push([x, y]);
        }
      }
      
      onMultiSelect(selectedArea, selectionMode === 'add');
    }
    
    setIsDragging(false);
    setStartCell(null);
    setEndCell(null);
  };

  // 计算当前选择区域
  const getSelectionArea = () => {
    if (!isDragging || !startCell || !endCell) return null;
    
    const minX = Math.min(startCell[0], endCell[0]);
    const maxX = Math.max(startCell[0], endCell[0]);
    const minY = Math.min(startCell[1], endCell[1]);
    const maxY = Math.max(startCell[1], endCell[1]);
    
    return { minX, maxX, minY, maxY };
  };

  // 检查单元格是否在当前选择区域内
  const isCellInSelectionArea = (x, y) => {
    const area = getSelectionArea();
    if (!area) return false;
    
    return x >= area.minX && x <= area.maxX && y >= area.minY && y <= area.maxY;
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startCell, endCell]);

  // 计算单元格大小
  const cellSize = 40; // 单元格大小（像素）
  const gridWidth = width * cellSize;
  const gridHeight = height * cellSize;
  const shapeColors = getShapeColors();

  return (
    <div 
      ref={gridRef}
      className="relative"
      style={{
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
      }}
      onMouseLeave={handleMouseUp}
    >
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 bg-gray-100"
        style={{
          backgroundSize: `${cellSize}px ${cellSize}px`,
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
        }}
      />
      
      {/* X轴标签 */}
      <div className="absolute left-0 bottom-100 w-full">
        {Array.from({ length: width }).map((_, x) => (
          <div 
            key={`x-${x}`} 
            className="absolute text-xs text-gray-500 text-center"
            style={{
              left: `${x * cellSize + cellSize / 2}px`,
              bottom: '2px',
              width: `${cellSize}px`,
            }}
          >
            {x}
          </div>
        ))}
      </div>
      
      {/* Y轴标签 */}
      <div className="absolute bottom-0 left-0 h-full">
        {Array.from({ length: height }).map((_, y) => (
          <div 
            key={`y-${y}`} 
            className="absolute text-xs text-gray-500"
            style={{
              bottom: `${y * cellSize + cellSize / 2}px`,
              left: '2px',
              height: `${cellSize}px`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {y}
          </div>
        ))}
      </div>
      
      {/* 单元格 */}
      {Array.from({ length: width }).map((_, x) => (
        Array.from({ length: height }).map((_, y) => {
          const isSelected = isCellSelected(x, y);
          const isInSelectionArea = isCellInSelectionArea(x, y);
          const shapeIndex = getCellShapeIndex(x, y);
          const isInShape = shapeIndex !== -1;
          
          let cellClass = "absolute cursor-pointer transition-colors duration-100 border border-gray-200";
          
          if (isInShape) {
            // 如果属于某个形状，使用形状颜色
            const colorClass = shapeColors[shapeIndex % shapeColors.length];
            cellClass += ` ${colorClass}`;
          } else if (isSelected) {
            // 如果被手动选中，使用蓝色
            cellClass += " bg-blue-500";
          } else {
            // 默认状态
            cellClass += " bg-white hover:bg-blue-100";
          }
          
          if (isInSelectionArea) {
            cellClass += selectionMode === 'add' ? ' bg-blue-300' : ' bg-red-300';
          }
          
          return (
            <div
              key={`${x}-${y}`}
              className={cellClass}
              style={{
                left: `${x * cellSize}px`,
                bottom: `${y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, x, y)}
              onMouseMove={(e) => handleMouseMove(e, x, y)}
            />
          );
        })
      ))}
    </div>
  );
};

export default GridSelector;

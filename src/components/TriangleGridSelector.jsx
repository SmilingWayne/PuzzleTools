import { useState, useRef, useEffect } from "react";

const TriangleGridSelector = ({ 
  width, 
  height, 
  selectedTriangles, 
  shapes = [],
  onTriangleToggle, 
  onMultiSelect 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startTriangle, setStartTriangle] = useState(null);
  const [endTriangle, setEndTriangle] = useState(null);
  const [selectionMode, setSelectionMode] = useState(null); // 'add' or 'remove'
  const gridRef = useRef(null);

  // 生成形状颜色
  const getShapeColors = () => {
    const colors = [
      // 'fill-red-600', 'fill-blue-600', 'fill-green-600', 'fill-yellow-600', 
      // 'fill-purple-600', 'fill-pink-600', 'fill-indigo-600', 'fill-orange-600',
      // 'fill-teal-600', 'fill-cyan-600', 'fill-lime-600', 'fill-amber-600',
      // 'fill-purple-300', 'fill-pink-300', 'fill-indigo-300', 'fill-orange-300',
      // 'fill-teal-300', 'fill-cyan-300', 'fill-lime-300', 'fill-amber-300'
      'fill-red-800',     'fill-orange-200',
      'fill-amber-800',   'fill-lime-200',
      'fill-green-800',   'fill-teal-200',
      'fill-cyan-800',    'fill-sky-200',
      'fill-blue-800',    'fill-indigo-200',
      'fill-violet-800',  'fill-fuchsia-200',
      'fill-pink-800',    'fill-rose-200',
      'fill-purple-800',  'fill-yellow-200',
      'fill-emerald-800', 'fill-cyan-200',
      'fill-teal-800',    'fill-lime-200',
      'fill-sky-800',     'fill-blue-200',
      'fill-indigo-800',  'fill-violet-200',
      'fill-fuchsia-800', 'fill-pink-200',
      'fill-rose-800',    'fill-red-200',
      'fill-orange-800',  'fill-amber-200',
      'fill-lime-800',    'fill-green-200',
      'fill-yellow-800',  'fill-emerald-200',
      'fill-stone-800',   'fill-slate-200',
      'fill-gray-800',    'fill-neutral-200'
    ];
    return colors;
  };

  // 获取三角形所属的形状索引
  const getTriangleShapeIndex = (x, y, z) => {
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      for (let j = 0; j < shape.length; j++) {
        if (shape[j][0] === x && shape[j][1] === y && shape[j][2] === z) {
          return i;
        }
      }
    }
    return -1;
  };

  // 检查三角形是否被选中
  const isTriangleSelected = (x, y, z) => {
    return selectedTriangles.some(tri => tri[0] === x && tri[1] === y && tri[2] === z);
  };

  // 检查三角形是否属于某个形状
  const isTriangleInShape = (x, y, z) => {
    return getTriangleShapeIndex(x, y, z) !== -1;
  };

  // 处理鼠标按下事件
  const handleMouseDown = (e, x, y, z) => {
    if (e.button !== 0) return; // 只处理左键点击
    
    const isSelected = isTriangleSelected(x, y, z);
    setSelectionMode(isSelected ? 'remove' : 'add');
    setIsDragging(true);
    setStartTriangle([x, y, z]);
    setEndTriangle([x, y, z]);
    
    // 如果不是多选操作，则切换三角形状态
    if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
      onTriangleToggle(x, y, z, !isSelected);
    }
    
    // 防止拖动时选择文本
    e.preventDefault();
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e, x, y, z) => {
    if (!isDragging) return;
    setEndTriangle([x, y, z]);
  };

  // 处理鼠标抬起事件
  const handleMouseUp = () => {
    if (!isDragging || !startTriangle || !endTriangle) {
      setIsDragging(false);
      return;
    }
    
    // 计算选择区域内的所有三角形
    const selectedArea = getTrianglesInSelectionArea();
    
    if (selectedArea.length > 1) {
      onMultiSelect(selectedArea, selectionMode === 'add');
    }
    
    setIsDragging(false);
    setStartTriangle(null);
    setEndTriangle(null);
  };

  // 获取选择区域内的所有三角形
  const getTrianglesInSelectionArea = () => {
    if (!startTriangle || !endTriangle) return [];
    
    // 计算选择区域的边界
    const minX = Math.min(startTriangle[0], endTriangle[0]);
    const maxX = Math.max(startTriangle[0], endTriangle[0]);
    const minY = Math.min(startTriangle[1], endTriangle[1]);
    const maxY = Math.max(startTriangle[1], endTriangle[1]);
    const startZ = startTriangle[2]
    const endZ = endTriangle[2]
    // console.log(minX, maxX, minY, maxY)
    // 收集区域内的所有三角形
    const triangles = [];
    if (startZ != endZ) {
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          // 对于每个坐标位置，检查两个可能的三角形（z=0和z=1）
          if (isTriangleInSelectionBounds(x, y, 0)) {
            triangles.push([x, y, 0]);
          }
          if (isTriangleInSelectionBounds(x, y, 1)) {
            triangles.push([x, y, 1]);
          }
        }
      }
    }
    else if (startZ === 1 && endZ === 1) {
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          if (x === minX && y === minY ) {
            if (isTriangleInSelectionBounds(x, y, 1)) {
              triangles.push([x, y, 1]);
            }
          }
          else {
          // 对于每个坐标位置，检查两个可能的三角形（z=0和z=1）
            if (isTriangleInSelectionBounds(x, y, 0)) {
              triangles.push([x, y, 0]);
            }
            if (isTriangleInSelectionBounds(x, y, 1)) {
              triangles.push([x, y, 1]);
            }
          }
        }
      }
    }
    else if (startZ === 0 && endZ === 0) {
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          if (x === maxX && y === maxY ) {
            if (isTriangleInSelectionBounds(x, y, 0)) {
              triangles.push([x, y, 0]);
            }
          }
          else {
          // 对于每个坐标位置，检查两个可能的三角形（z=0和z=1）
            if (isTriangleInSelectionBounds(x, y, 0)) {
              triangles.push([x, y, 0]);
            }
            if (isTriangleInSelectionBounds(x, y, 1)) {
              triangles.push([x, y, 1]);
            }
          }
        }
      }
    }
    
    return triangles;
  };

  // 判断三角形是否在选择区域内
  const isTriangleInSelectionBounds = (x, y, z) => {
    if (!startTriangle || !endTriangle) return false;
    
    const minX = Math.min(startTriangle[0], endTriangle[0]);
    const maxX = Math.max(startTriangle[0], endTriangle[0]);
    const minY = Math.min(startTriangle[1], endTriangle[1]);
    const maxY = Math.max(startTriangle[1], endTriangle[1]);
    
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  };

  // 检查三角形是否在当前选择区域内
  const isTriangleInSelectionArea = (x, y, z) => {
    if (!isDragging) return false;
    return isTriangleInSelectionBounds(x, y, z);
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
  }, [isDragging, startTriangle, endTriangle]);

  // 计算三角形网格的尺寸和位置
  const triangleSize = 40; // 三角形边长（像素）
  const triangleHeight = triangleSize * Math.sin(Math.PI / 3); // 三角形高度
  const horizontalSpacing = triangleSize * 0.5; // 水平间距（三角形宽度的一半）
  const verticalSpacing = triangleHeight; // 垂直间距
  
  // 计算网格总尺寸
  const gridWidth = width * triangleSize + triangleSize * 0.5;
  const gridHeight = height * verticalSpacing + triangleHeight;
  const shapeColors = getShapeColors();

  // 生成三角形的顶点坐标
  const getTrianglePoints = (x, y, z) => {
    // 计算三角形的基础位置
    // 每一行的偏移：奇数行向右偏移0.5个位置
    const rowOffset = y * 0.5 * triangleSize;
    const baseX = x * triangleSize + rowOffset;
    const baseY = y * triangleHeight;
    
    if (z === 1) { // 正三角形（尖朝上）
      return [
        [baseX + triangleSize * 1.5, baseY], // 顶点
        [baseX + triangleSize, baseY + triangleHeight], // 左下角
        [baseX + triangleSize * 2, baseY + triangleHeight] // 右下角
      ];
    } else { // 倒三角形（尖朝下）
      return [
        [baseX + triangleSize, baseY + triangleHeight] , // 底部顶点
        [baseX + triangleSize * 0.5, baseY], // 左上角
        [baseX + triangleSize * 1.5, baseY] // 右上角
      ];
    }
  };

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
      <div className="absolute inset-0 bg-gray-50"></div>
      
      {/* X轴标签 */}
      <div className="absolute left-0 bottom-100 w-full">
        {Array.from({ length: width }).map((_, x) => (
          <div 
            key={`x-${x}`} 
            className="absolute text-xs text-gray-500 text-center"
            style={{
              left: `${x * triangleSize + triangleSize / 2}px`,
              bottom: '2px',
              width: `${triangleSize}px`,
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
              bottom: `${y * triangleHeight + triangleHeight / 2}px`,
              left: '2px',
              height: `${triangleHeight}px`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {height - y - 1}
          </div>
        ))}
      </div>
      
      {/* 三角形网格 */}
      <svg
        className="absolute inset-0"
        width={gridWidth}
        height={gridHeight}
        style={{ pointerEvents: 'none' }}
      >
        {Array.from({ length: width }).map((_, x) => (
          Array.from({ length: height }).map((_, y) => (
            <>
              {/* 正三角形 (z=0) */}
              {(() => {
                const z = 0;
                const isSelected = isTriangleSelected(x, y, z);
                const isInSelectionArea = isTriangleInSelectionArea(x, y, z);
                const shapeIndex = getTriangleShapeIndex(x, y, z);
                const isInShape = shapeIndex !== -1;
                const points = getTrianglePoints(x, y, z);
                const pointsStr = points.map(p => `${p[0]},${p[1]}`).join(' ');
                
                let fillClass = 'fill-white hover:fill-blue-100';
                
                if (isInShape) {
                  // 如果属于某个形状，使用形状颜色
                  const colorClass = shapeColors[shapeIndex % shapeColors.length];
                  fillClass = colorClass;
                } else if (isSelected) {
                  // 如果被手动选中，使用蓝色
                  fillClass = 'fill-blue-500';
                }
                
                if (isInSelectionArea) {
                  fillClass = selectionMode === 'add' ? 'fill-blue-300' : 'fill-red-300';
                }
                
                return (
                  <polygon
                    key={`${x}-${y}-${z}`}
                    points={pointsStr}
                    className={`
                      transition-colors duration-100 stroke-gray-400 stroke-1 cursor-pointer
                      ${fillClass}
                    `}
                    style={{ pointerEvents: 'auto' }}
                    onMouseDown={(e) => handleMouseDown(e, x, y, z)}
                    onMouseMove={(e) => handleMouseMove(e, x, y, z)}
                  />
                );
              })()}
              
              {/* 倒三角形 (z=1) */}
              {(() => {
                const z = 1;
                const isSelected = isTriangleSelected(x, y, z);
                const isInSelectionArea = isTriangleInSelectionArea(x, y, z);
                const shapeIndex = getTriangleShapeIndex(x, y, z);
                const isInShape = shapeIndex !== -1;
                const points = getTrianglePoints(x, y, z);
                const pointsStr = points.map(p => `${p[0]},${p[1]}`).join(' ');
                
                let fillClass = 'fill-white hover:fill-blue-100';
                
                if (isInShape) {
                  // 如果属于某个形状，使用形状颜色
                  const colorClass = shapeColors[shapeIndex % shapeColors.length];
                  fillClass = colorClass;
                } else if (isSelected) {
                  // 如果被手动选中，使用蓝色
                  fillClass = 'fill-blue-500';
                }
                
                if (isInSelectionArea) {
                  fillClass = selectionMode === 'add' ? 'fill-blue-300' : 'fill-red-300';
                }
                
                return (
                  <polygon
                    key={`${x}-${y}-${z}`}
                    points={pointsStr}
                    className={`
                      transition-colors duration-100 stroke-gray-400 stroke-1 cursor-pointer
                      ${fillClass}
                    `}
                    style={{ pointerEvents: 'auto' }}
                    onMouseDown={(e) => handleMouseDown(e, x, y, z)}
                    onMouseMove={(e) => handleMouseMove(e, x, y, z)}
                  />
                );
              })()}
            </>
          ))
        ))}
      </svg>
    </div>
  );
};

export default TriangleGridSelector;
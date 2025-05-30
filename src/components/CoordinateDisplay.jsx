import { Card } from "@/components/ui/card";

const CoordinateDisplay = ({ selectedCells }) => {
  // 格式化选中的单元格为Python列表格式
  const formatSelectedCells = () => {
    if (selectedCells.length === 0) return "[]";
    
    const sortedCells = [...selectedCells].sort((a, b) => {
      if (a[0] !== b[0]) return a[0] - b[0];
      return a[1] - b[1];
    });
    
    const cellsStr = sortedCells.map(([x, y]) => `(${x},${y})`).join(', ');
    return `[${cellsStr}]`;
  };

  return (
    <Card className="p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4">选择结果</h2>
      
      <div className="mb-4">
        <div className="text-sm font-medium mb-1">已选择单元格数量:</div>
        <div className="text-3xl font-bold">{selectedCells.length}</div>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-1">坐标列表 (Python格式):</div>
        <textarea
          className="w-full h-40 p-3 border rounded-md font-mono text-sm bg-gray-50"
          value={formatSelectedCells()}
          readOnly
        />
      </div>
    </Card>
  );
};

export default CoordinateDisplay;

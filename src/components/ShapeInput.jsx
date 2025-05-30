import { useState } from "react";
import { Button } from "@/components/ui/button";

const ShapeInput = ({ onShapesImport }) => {
  const [inputText, setInputText] = useState("");

  const handleImport = () => {
    if (!inputText.trim()) {
      alert("请输入形状数据");
      return;
    }

    try {
      // 解析输入的文本为JavaScript对象
      const shapes = eval(inputText.trim());
      
      // 验证格式
      if (!Array.isArray(shapes)) {
        alert("输入格式错误：应该是一个数组");
        return;
      }

      // 验证每个形状都是数组
      for (let i = 0; i < shapes.length; i++) {
        if (!Array.isArray(shapes[i])) {
          alert(`输入格式错误：第${i + 1}个形状不是数组`);
          return;
        }
        
        // 验证每个坐标都是二元组
        for (let j = 0; j < shapes[i].length; j++) {
          const coord = shapes[i][j];
          if (!Array.isArray(coord) || coord.length !== 2 || 
              typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
            alert(`输入格式错误：第${i + 1}个形状的第${j + 1}个坐标格式不正确`);
            return;
          }
        }
      }

      onShapesImport(shapes);
      setInputText("");
      alert("形状导入成功！");
    } catch (error) {
      alert("输入格式错误：无法解析输入内容");
    }
  };

  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold mb-3">导入形状</h3>
      <div className="space-y-3">
        <textarea
          className="w-full h-24 p-3 border rounded-md font-mono text-sm resize-none"
          placeholder="格式：[[(0,0), (0,1), (1,1)], [(3,4), (4,3)]]"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button 
          onClick={handleImport}
          className="w-full"
          disabled={!inputText.trim()}
        >
          导入并显示形状
        </Button>
      </div>
    </div>
  );
};

export default ShapeInput;

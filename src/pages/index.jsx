import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GridSelector from "@/components/GridSelector";
import GridControls from "@/components/GridControls";
import ShapeInput from "@/components/ShapeInput";
import TriangleGridSelector from "@/components/TriangleGridSelector";
import TriangleGridControls from "@/components/TriangleGridControls";
import TriangleShapeInput from "@/components/TriangleShapeInput";
import useGridSelection from "@/hooks/useGridSelection";
import useTriangleGridSelection from "@/hooks/useTriangleGridSelection";
import useFormatCoordinates from "@/hooks/useFormatCoordinates";
import useTriangleFormatCoordinates from "@/hooks/useTriangleFormatCoordinates";


const Index = () => {
  // 直角坐标系网格选择状态
  const {
    gridSize,
    selectedCells,
    shapes,
    toggleCell,
    handleMultiSelect,
    clearSelection,
    importShapes,
    increaseGridSize,
    decreaseGridSize
  } = useGridSelection();
  
  const { formatAsPythonList } = useFormatCoordinates();

  // 三角形网格选择状态
  const {
    gridSize: triangleGridSize,
    selectedTriangles,
    shapes: triangleShapes,
    toggleTriangle,
    handleMultiSelect: handleTriangleMultiSelect,
    clearSelection: clearTriangleSelection,
    importShapes: importTriangleShapes,
    increaseGridSize: increaseTriangleGridSize,
    decreaseGridSize: decreaseTriangleGridSize
  } = useTriangleGridSelection();
  
  const { formatAsPythonList: formatTriangleAsPythonList } = useTriangleFormatCoordinates();

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">谜题生成工具</h1>
        
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="grid" className="flex-1">直角坐标系网格</TabsTrigger>
            <TabsTrigger value="triangle" className="flex-1">三角形网格</TabsTrigger>
          </TabsList>
          
          {/* 直角坐标系网格 */}
          <TabsContent value="grid">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-4 shadow-md">
                  <GridControls 
                    gridSize={gridSize}
                    onIncreaseSize={increaseGridSize}
                    onDecreaseSize={decreaseGridSize}
                    onClearSelection={clearSelection}
                  />
                  
                  <div className="border rounded-lg p-4 bg-white overflow-auto">
                    <GridSelector 
                      width={gridSize.width} 
                      height={gridSize.height} 
                      selectedCells={selectedCells}
                      shapes={shapes}
                      onCellToggle={toggleCell}
                      onMultiSelect={handleMultiSelect}
                    />
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className="p-4 shadow-md h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-4">选择结果</h2>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">已选择单元格数量:</div>
                    <div className="text-3xl font-bold">{selectedCells.length}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">坐标列表 (Python格式):</div>
                    <div className="relative">
                      <textarea
                        className="w-full h-40 p-3 border rounded-md font-mono text-sm bg-gray-50"
                        value={formatAsPythonList(selectedCells)}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <ShapeInput onShapesImport={importShapes} />
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* 三角形网格 */}
          <TabsContent value="triangle">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-4 shadow-md">
                  <TriangleGridControls 
                    gridSize={triangleGridSize}
                    onIncreaseSize={increaseTriangleGridSize}
                    onDecreaseSize={decreaseTriangleGridSize}
                    onClearSelection={clearTriangleSelection}
                  />
                  
                  <div className="border rounded-lg p-4 bg-white overflow-auto">
                    <TriangleGridSelector 
                      width={triangleGridSize.width} 
                      height={triangleGridSize.height} 
                      selectedTriangles={selectedTriangles}
                      shapes={triangleShapes}
                      onTriangleToggle={toggleTriangle}
                      onMultiSelect={handleTriangleMultiSelect}
                    />
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className="p-4 shadow-md h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-4">选择结果</h2>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">已选择三角形数量:</div>
                    <div className="text-3xl font-bold">{selectedTriangles.length}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">坐标列表 (Python格式):</div>
                    <div className="relative">
                      <textarea
                        className="w-full h-40 p-3 border rounded-md font-mono text-sm bg-gray-50"
                        value={formatTriangleAsPythonList(selectedTriangles)}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <TriangleShapeInput onShapesImport={importTriangleShapes} />
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

/**
 * 自定义钩子，用于格式化三角形坐标数据
 */
const useTriangleFormatCoordinates = () => {
    // 格式化选中的三角形为Python列表格式
    const formatAsPythonList = (coordinates) => {
      if (!coordinates || coordinates.length === 0) return "[]";
      
      const sortedCoords = [...coordinates].sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        if (a[1] !== b[1]) return a[1] - b[1];
        return a[2] - b[2];
      });
      
      const coordsStr = sortedCoords.map(([x, y, z]) => `[${x},${y},${z}]`).join(', ');
      return `[${coordsStr}]`;
    };
  
    return {
      formatAsPythonList
    };
  };
  
  export default useTriangleFormatCoordinates;
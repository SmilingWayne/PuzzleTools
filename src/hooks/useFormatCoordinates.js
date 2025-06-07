/**
 * 自定义钩子，用于格式化坐标数据
 */
const useFormatCoordinates = () => {
    // 格式化选中的单元格为Python列表格式
    const formatAsPythonList = (coordinates) => {
      if (!coordinates || coordinates.length === 0) return "[]";
      
      const sortedCoords = [...coordinates].sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        return a[1] - b[1];
      });
      
      const coordsStr = sortedCoords.map(([x, y]) => `[${x},${y}]`).join(', ');
      return `[${coordsStr}]`;
    };
  
    return {
      formatAsPythonList
    };
  };
  
  export default useFormatCoordinates;
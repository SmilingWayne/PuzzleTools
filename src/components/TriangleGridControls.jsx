import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, TrashIcon } from "lucide-react";

const TriangleGridControls = ({ 
  gridSize, 
  onIncreaseSize, 
  onDecreaseSize, 
  onClearSelection 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Grid size:</span>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onDecreaseSize('width')}
            className="h-8 w-8"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="mx-2">{gridSize.width}×{gridSize.height}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onIncreaseSize('width')}
            className="h-8 w-8"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Height:</span>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onDecreaseSize('height')}
            className="h-8 w-8"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onIncreaseSize('height')}
            className="h-8 w-8"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={onClearSelection}
        className="flex items-center"
      >
        <TrashIcon className="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>
  );
};

export default TriangleGridControls;

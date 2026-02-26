import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: [number, number];
  onValueCommit?: (value: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  showLabels?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueCommit, min, max, step = 1, className, showLabels = true }, ref) => {
    const [localValue, setLocalValue] = React.useState<[number, number]>(value);
    const localValueRef = React.useRef(localValue);

    React.useEffect(() => {
      setLocalValue(value);
      localValueRef.current = value;
    }, [value]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.min(Number(e.target.value), localValue[1] - step);
      const newValue: [number, number] = [newMin, localValue[1]];
      setLocalValue(newValue);
      localValueRef.current = newValue;
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.max(Number(e.target.value), localValue[0] + step);
      const newValue: [number, number] = [localValue[0], newMax];
      setLocalValue(newValue);
      localValueRef.current = newValue;
    };

    const handleCommit = () => {
      onValueCommit?.(localValueRef.current);
    };

    const rangePercent = {
      left: ((localValue[0] - min) / (max - min)) * 100,
      right: ((max - localValue[1]) / (max - min)) * 100,
    };

    return (
      <div 
        ref={ref} 
        className={cn("relative h-10 w-full", className)}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
      >
        <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full rounded-full bg-gray-600" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-red-600"
          style={{
            left: `${rangePercent.left}%`,
            right: `${rangePercent.right}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-600 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-red-600 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:shadow-lg"
          style={{ zIndex: localValue[0] > max - 10 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-600 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-red-600 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:shadow-lg"
          style={{ zIndex: 4 }}
        />
        {showLabels && (
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-muted-foreground">
            <span>${localValue[0]}</span>
            <span>${localValue[1]}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };

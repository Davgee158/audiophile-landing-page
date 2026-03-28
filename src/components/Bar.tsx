const Bar = ({
  onQuantity,
  onSetQuantity,
  width = "w-32",
  height = "h-12",
  top = "top-3",
  left = "left-4",
  right = "right-4",
}: {
  onQuantity: number;
  onSetQuantity: (quantity: number) => void;
  width?: string;
  height?: string;
  top?: string;
  left?: string;
  right?: string;

}) => {
  function IncreaseValue() {
    onSetQuantity(onQuantity + 1);
  }

  function DecreaseValue() {
    onSetQuantity(Math.max(1, onQuantity - 1));
  }
  return (
    <div className="relative">
      <span
        className={`absolute ${top} ${left} opacity-50 cursor-pointer hover:text-[#D87D4A] transition-all duration-300`}
        onClick={DecreaseValue}
      >
        -
      </span>
      <input
        type="number"
        min="1"
        value={onQuantity}
        readOnly
        className={`${width} ${height} bg-gray-100 font-bold text-center cursor-default`}
      />
      <span
        className={`absolute ${top} ${right} opacity-50 cursor-pointer hover:text-[#D87D4A] transition-all duration-300`}
        onClick={IncreaseValue}
      >
        +
      </span>
    </div>
  );
};

export default Bar;

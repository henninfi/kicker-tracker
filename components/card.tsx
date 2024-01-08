import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isActive?: boolean;
}

function Card({ children, isActive = false, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={`${
        isActive ? "bg-white shadow-lg border-2 hover:bg-gray-100 border-blue-600 shadow-blue-200" : "bg-white shadow-lg border-2 hover:bg-gray-100 border-blue-600 shadow-blue-200"
      } rounded-2xl p-2 text-black transition-colors duration-150 ${className || ""}`}
      >
      {children}
    </div>
  );
}

export default Card;


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
        isActive ? "bg-slate-600 hover:bg-slate-500" : "bg-slate-700 hover:bg-slate-600"
      } rounded-2xl p-2 text-slate-100 transition-colors duration-150 ${className || ""}`}
      >
      {children}
    </div>
  );
}

export default Card;


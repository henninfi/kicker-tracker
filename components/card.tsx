import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isActive?: boolean;
}

function Card({ children, isActive = false, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={`rounded-lg 
                  ${isActive ? "bg-slate-500" : "bg-slate-700"}
                  text-slate-100 hover:bg-slate-600 ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default Card;

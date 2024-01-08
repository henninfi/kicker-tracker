import { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  tooltip?: string;
}

function Pill({ children, className, tooltip, ...props }: Props) {
  return (
    <div
      {...props}
      className={`bg-gray-300 rounded-full px-2 py-1 relative shadow-lg border-2 hover:bg-gray-400 border-blue-600 shadow-blue-200 ${
        className || ""
      }`}
    >
      {children}
      <div className="group absolute top-0 left-0 right-0 bottom-0 flex justify-center items-start hover:-top-7">
        <div className="rounded-md text-transparent text-xs text-center px-2 py-1 group-hover:bg-slate-600 group-hover:text-white">
          {tooltip}
        </div>
      </div>
    </div>
  );
}

export default Pill;

import { Link } from "react-router-dom";
import { Rotate3D } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex items-center gap-2 opacity-50">
          <Rotate3D className="size-5 text-[dodgerblue]" />
          <span className="text-lg font-semibold tracking-tight">spara</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404
          </h1>
          <p className="text-muted-foreground font-light tracking-wide">
            This page doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="relative group py-1 text-sm font-medium transition-colors hover:text-[dodgerblue] transition ease-in-out duration-300"
        >
          <span>Return to dashboard</span>
          <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[dodgerblue] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-in-out" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import { useSelector } from "react-redux";
import {
  LogOut,
  Rotate3D,
  Menu,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useLogoutMutation } from "../../slices/auth-api-slice";
import { logout as logoutAction } from "../../slices/auth-slice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ModeToggle } from "../theme/mode-toggle";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center justify-between px-6 md:px-8 py-4 bg-background">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Rotate3D className="size-6 text-[dodgerblue]" />
          <span className="text-xl font-semibold tracking-tight">spara</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link to={"/settings"} className="relative group py-1">
          <span className="text-sm font-light tracking-wide text-[#5D5D5D] dark:text-white/70">
            {userInfo?.email || "jane@doe.com"}
          </span>
          <span className="absolute left-0 bottom-0 w-full h-[1px] bg-current scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-in-out" />
        </Link>
        <div className="h-6 w-[1px] bg-border"></div>
        <LogoutButton />
        <ModeToggle />
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-3">
        <ModeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-transparent"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] flex flex-col px-0">
            <SheetHeader className="text-left px-6 pb-6 pt-4">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <Rotate3D className="size-6 text-[dodgerblue]" />
                spara
              </SheetTitle>
              <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                  Account
                </p>
                <p className="text-sm font-medium truncate opacity-90">
                  {userInfo?.email}
                </p>
              </div>
            </SheetHeader>

            <div className="flex flex-col px-2 flex-1">
              <SheetClose asChild>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all duration-200 ${
                    isActive("/dashboard")
                      ? "bg-[dodgerblue]/10 text-[dodgerblue] font-semibold"
                      : "hover:bg-muted font-medium text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  to="/settings"
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all duration-200 ${
                    isActive("/settings")
                      ? "bg-[dodgerblue]/10 text-[dodgerblue] font-semibold"
                      : "hover:bg-muted font-medium text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Settings size={20} />
                  Settings
                </Link>
              </SheetClose>
            </div>

            <div className="px-6 pb-8">
              <Separator className="mb-6" />
              <LogoutButton isMobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

const LogoutButton = ({ isMobile }: { isMobile?: boolean }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAction());
      toast.success("We hate to see you go.", {
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (err) {
      toast.error("Oops! Something went wrong.", {
        description:
          "We're having trouble logging you out. Please try again shortly.",
      });
    }
  };

  return (
    <button
      className={`flex items-center hover:cursor-pointer gap-3 text-sm transition-colors duration-300 disabled:opacity-50
        ${
          isMobile
            ? "w-full px-4 py-3 rounded-md font-medium text-destructive hover:bg-destructive/10 transition-all"
            : "font-normal dark:text-white hover:text-[dodgerblue] dark:hover:text-[dodgerblue]"
        }`}
      disabled={isLoading}
      onClick={logoutHandler}
    >
      <LogOut size={20} className={!isMobile ? "rotate-180" : ""} />
      <span>Sign out</span>
    </button>
  );
};

export default Navbar;

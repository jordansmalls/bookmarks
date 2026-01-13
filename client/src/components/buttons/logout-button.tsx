import { useLogoutMutation } from "../../slices/auth-api-slice";
import { logout as logoutAction } from "../../slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAction());
      toast.success("Logged out successfully.", {
        description: "We'll see you soon, right?",
      });
      navigate("/login");
    } catch (err: any) {
      alert(err?.data?.message || "Logout failed.");
    }
  };

  return (
    <>
      <Button
        onClick={logoutHandler}
        disabled={isLoading}
        variant={"destructive"}
      >
        Logout
      </Button>
    </>
  );
};

export default LogoutButton;

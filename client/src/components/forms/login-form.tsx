import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../slices/auth-slice";
import { useLoginMutation } from "../../slices/auth-api-slice";
import { toast } from "sonner";
import { SpinnerButton } from "../buttons/spinner-button";

import { Rotate3D } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Login successful.", {
        description: "Welcome back, let's get back to it.",
      });
      navigate("/dashboard");
    } catch (err) {
      console.log("Login err:", err);
      toast.error("Something went wrong.", {
        description: "We're having trouble logging you in, please try again.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Rotate3D className="size-6 text-[dodgerblue]" />
              </div>
              <span className="sr-only">spara</span>
            </a>
            <h1 className="text-xl font-bold">Welcome Back, We Missed You.</h1>
            <p className="text-xs text-muted-foreground">
              Enter your email and password to pick up where you left off.
            </p>
          </div>
          <Field>
            {/* email input */}
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="jane@doe.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          {/* password input */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field>
            <SpinnerButton
              isLoading={isLoading}
              loadingText={"Loading"}
              className="transition ease-in-out duration-300 hover:cursor-pointer"
            >
              Login
            </SpinnerButton>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Don't have an account?{" "}
        <Link to={"/signup"} className="transition ease-in-out duration-300">
          Sign up
        </Link>
      </FieldDescription>
    </div>
  );
}

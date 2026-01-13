import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "../ui/spinner";
import { setCredentials } from "../../slices/auth-slice";
import {
  useFetchEmailAvailabilityMutation,
  useSignupMutation,
} from "../../slices/auth-api-slice";
import { toast } from "sonner";
import { SpinnerButton } from "../buttons/spinner-button";
import { Rotate3D } from "lucide-react";
import { cn } from "@/lib/utils";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const emailMessage = (
  <div className="flex items-center gap-2">
    <Spinner />
    <p>Checking availability</p>
  </div>
);

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailStatus, setEmailStatus] = useState<{
    message: string;
    isAvailable: boolean | null;
  }>({
    message: "Please enter an email",
    isAvailable: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [checkEmail, { isLoading: isChecking }] =
    useFetchEmailAvailabilityMutation();

  useEffect(() => {
    if (!email) {
      setEmailStatus({ message: "Please enter an email", isAvailable: null });
      return;
    }

    if (email.length < 3) {
      setEmailStatus({ message: "Email too short", isAvailable: null });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await checkEmail(email).unwrap();

        if (res.taken) {
          setEmailStatus({
            message: "Email is taken, please try another.",
            isAvailable: false,
          });
        } else {
          setEmailStatus({
            message: "Email is available!",
            isAvailable: true,
          });
        }
      } catch (err) {
        setEmailStatus({
          message: "Error checking email.",
          isAvailable: false,
        });
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [email, checkEmail]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailStatus.isAvailable !== true) {
      toast.error("Oops!", {
        description:
          emailStatus.isAvailable === false
            ? emailStatus.message
            : "Please enter a valid email first.",
      });
      return;
    }

    try {
      const res = await signup({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("You're in.", { description: "Welcome to the platform!" });
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Signup failed.";
      toast.error("Oops!", { description: errorMessage });
    }
  };

  const statusBorderColor = isChecking
    ? "border-yellow-500 focus-visible:ring-yellow-500"
    : emailStatus.isAvailable === true
      ? "border-green-500 focus-visible:ring-green-500"
      : emailStatus.isAvailable === false
        ? "border-red-500 focus-visible:ring-red-500"
        : "border-input";

  const statusTextColor = isChecking
    ? "text-yellow-600"
    : emailStatus.isAvailable === true
      ? "text-green-600"
      : emailStatus.isAvailable === false
        ? "text-red-600"
        : "text-gray-500";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignup}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Rotate3D className="size-6 text-[dodgerblue]" />
            </div>
            <h1 className="text-xl font-bold">Welcome to Spara</h1>
            <p className="text-xs text-muted-foreground">
              Provide a valid email and an 8 character password to get started.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="jane@doe.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn("transition-colors", statusBorderColor)}
            />

            <p
              className={cn("text-xs mt-1 transition-colors", statusTextColor)}
            >
              {isChecking ? emailMessage : emailStatus.message}
            </p>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field>
            <SpinnerButton
              type="submit"
              className="w-full transition ease-in-out duration-300 hover:cursor-pointer"
              isLoading={isSigningUp}
              loadingText={"Creating account..."}
            >
              Sign Up
            </SpinnerButton>
          </Field>
        </FieldGroup>
      </form>

      <div className="px-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="underline underline-offset-4 hover:text-[dodgerblue] transition ease-in-out duration-300"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

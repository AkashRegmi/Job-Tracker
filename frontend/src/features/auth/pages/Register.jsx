import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegister } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import AuthLayout from "../../../components/layout/AuthLayout.jsx";
import { getError } from "../../../utils/errorHandler";
import { registerSchema } from "../schemas/auth.schema";
import { Input } from "../../../components/ui/Input";
import Button from "../../../components/ui/Button.jsx";
const Register = () => {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data) => {
    registerUser(data, {
      onSuccess: (responseData) => {
        toast.success(
          responseData?.message ||
            "Registration successful. Check your email for the verification code.",
        );

        navigate("/verify-otp", {
          state: {
            email: data.email,
          },
        });
      },

      onError: (error) => {
        toast.error(getError(error));
      },
    });
  };

  return (
    <AuthLayout>
      {" "}
      {/* Card */}
      <div>
        <h1 className="text-center text-2xl font-bold text-finance-dark">
          Create your account
        </h1>

        <p className="mt-2 text-center text-sm text-finance-muted">
          Create an account to keep your job search organized.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 space-y-5"
        >
          <Input
            id="name"
            label="Full name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" loading={isPending} className="w-full">
            Create account
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-finance-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#176b87] transition hover:text-[#0d4c63]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;

import * as Form from "@radix-ui/react-form";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation, type Location } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { loginSchema } from "../validation/auth";

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const location = useLocation() as Location & { state?: { from?: Location } };
  const redirectTo = location.state?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((s) => !s);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const f = parsed.error.format() as z.ZodFormattedError<LoginInput>;
      const first =
        f._errors[0] ?? f.email?._errors?.[0] ?? f.password?._errors?.[0];

      setError(first ?? "Validation error.");
      return;
    }

    try {
      await login(parsed.data.email, parsed.data.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof Error && err.message === "WRONG_EMAIL_OR_PASSWORD") {
        setError("Wrong email or password.");
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] p-[24px]">
      <div className="w-full max-w-[520px] overflow-hidden border border-[#e7e7e7] bg-[rgb(246,246,246)] shadow-[0_2px_6px_rgba(0,0,0,0.08),0_25px_50px_rgba(0,0,0,0.10)]">
        <div className="p-[32px]">
          <h1 className="mb-[24px] text-center text-[44px] font-[200] leading-[1] text-[rgb(184,63,69)]">
            Sign in
          </h1>

          <Form.Root onSubmit={onSubmit}>
            <Form.Field name="email" className="mb-[16px]">
              <div className="mb-[8px] text-[14px] font-[300] text-[#6b6b6b]">
                Email address
              </div>
              <Form.Control asChild>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="block w-full border border-[#dcdcdc] bg-white pb-[14px] pl-[16px] pr-[16px] pt-[14px] text-[15px] text-[#4a4a4a] outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-[#b9b9b9] focus:border-[#b83f45] focus:shadow-[0_0_0_3px_rgba(184,63,69,0.18)]"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="password" className="mb-[16px]">
              <div className="mb-[8px] text-[14px] font-[300] text-[#6b6b6b]">
                Password
              </div>

              <div className="relative">
                <Form.Control asChild>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="block w-full border border-[#dcdcdc] bg-white pb-[14px] pl-[16px] pr-[44px] pt-[14px] text-[15px] text-[#4a4a4a] outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-[#b9b9b9] focus:border-[#b83f45] focus:shadow-[0_0_0_3px_rgba(184,63,69,0.18)]"
                    aria-label="Password"
                  />
                </Form.Control>

                <button
                  type="button"
                  onClick={toggleShowPassword}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-[10px] top-1/2 flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-[8px] border border-transparent text-[#8a8a8a] transition-[background-color,border-color,transform,opacity] duration-150 will-change-transform hover:bg-[#f1f1f1] focus-visible:border-[#b83f45] focus-visible:shadow-[0_0_0_2px_rgba(184,63,69,0.12)] active:scale-105 motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M12 6c5.18 0 9.63 3.28 11.31 8C21.63 18.72 17.18 22 12 22S2.37 18.72.69 14C2.37 9.28 6.82 6 12 6Zm0 2C7.82 8 4.14 10.68 2.76 14 4.14 17.32 7.82 20 12 20s7.86-2.68 9.24-6C19.86 10.68 16.18 8 12 8Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 12 12Z"
                      />
                      <line
                        x1="4"
                        y1="20"
                        x2="20"
                        y2="7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M12 6c5.18 0 9.63 3.28 11.31 8C21.63 18.72 17.18 22 12 22S2.37 18.72.69 14C2.37 9.28 6.82 6 12 6Zm0 2C7.82 8 4.14 10.68 2.76 14 4.14 17.32 7.82 20 12 20s7.86-2.68 9.24-6C19.86 10.68 16.18 8 12 8Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 12 12Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </Form.Field>

            <Form.Submit asChild>
              <button
                type="submit"
                className="mt-[24px] w-full cursor-pointer border-none bg-[rgb(184,63,69)] pb-[14px] pl-[20px] pr-[20px] pt-[14px] text-[16px] font-[400] tracking-[0.2px] text-[#fff] shadow-[0_6px_14px_rgba(184,63,69,0.28)] transition-transform duration-150 hover:brightness-95 active:translate-y-[1px]"
              >
                Continue
              </button>
            </Form.Submit>

            {error && (
              <div className="mt-[12px] rounded-[10px] border border-[#ffd0d4] bg-[#fff3f4] p-[12px] text-[13px] text-[#b83f45]">
                {error}
              </div>
            )}
          </Form.Root>
        </div>
      </div>
    </div>
  );
}

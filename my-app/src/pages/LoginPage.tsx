import * as Form from "@radix-ui/react-form";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = location?.state?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate(redirectTo, { replace: true });
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
              <Form.Control asChild>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full border border-[#dcdcdc] bg-white pb-[14px] pl-[16px] pr-[16px] pt-[14px] text-[15px] text-[#4a4a4a] outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-[#b9b9b9] focus:border-[#b83f45] focus:shadow-[0_0_0_3px_rgba(184,63,69,0.18)]"
                />
              </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
              <button
                type="submit"
                className="mt-[24px] w-full cursor-pointer border-none bg-[rgb(184,63,69)] pb-[14px] pl-[20px] pr-[20px] pt-[14px] text-[16px] font-[400] tracking-[0.2px] text-[#fff] shadow-[0_6px_14px_rgba(184,63,69,0.28)] transition-transform duration-150 hover:brightness-95 active:translate-y-[1px]"
              >
                Continue
              </button>
            </Form.Submit>
          </Form.Root>
        </div>
      </div>
    </div>
  );
}

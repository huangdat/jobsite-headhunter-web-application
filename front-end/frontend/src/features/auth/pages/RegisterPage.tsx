import { useParams } from "react-router-dom";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export function RegisterPage() {
  const { role } = useParams();

  return <RegisterForm role={role} />;
}

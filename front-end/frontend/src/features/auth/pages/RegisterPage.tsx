import { useParams } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  const { role } = useParams();

  return <RegisterForm role={role} />;
}

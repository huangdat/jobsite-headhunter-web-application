import { CandidateRegister } from "@/features/auth/components/CandidateRegister";

type Props = React.ComponentProps<typeof CandidateRegister>;

export function CollaboratorRegister(props: Props) {
  return <CandidateRegister {...props} />;
}

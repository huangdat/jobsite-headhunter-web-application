import { CandidateRegister } from "./CandidateRegister";

type Props = React.ComponentProps<typeof CandidateRegister>;

export function CollaboratorRegister(props: Props) {
  return <CandidateRegister {...props} />;
}

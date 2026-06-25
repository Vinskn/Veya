export type IdentityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => void;
};

export type SubmitData = {
  username: string;
  roomID: string;
}
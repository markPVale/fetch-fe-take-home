export interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string; // Allow custom styles
  children?: React.ReactNode; // Allow children as alternative to label
}
export interface Task {
  _id: string | undefined;
  userId?: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

export interface User {
  _id: string;
  email: string;
  password: string;
}

export interface InputType {
  lable: string;
  type: string;
  placeholder?: string;
  onChange: (e: any) => void;
  required: boolean;
  value?: string;
  readOnly?: boolean;
  defaultValue?: string;
  className?: string;
}

export interface ButtonTypes {
  text: string;
  onClick: (e: any) => void;
  disabled?: boolean;
  className?: string;
  type: "button" | "submit" | "reset" | undefined;
}

export interface ParamProps {
  params: { id: string };
}

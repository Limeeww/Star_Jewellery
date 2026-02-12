import React from "react";


interface PasswordStrengthCheckerProps {
  password: string;
  isFocused: boolean;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({
  password,
  isFocused,
}) => {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  if (!isFocused || password.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 text-sm space-y-1">
      <li className={hasMinLength ? "text-green-600" : "text-red-600"}>
        ✔ Minimum 8 characters
      </li>
      <li className={hasNumber ? "text-green-600" : "text-red-600"}>
        ✔ At least one number
      </li>
      <li className={hasUppercase ? "text-green-600" : "text-red-600"}>
        ✔ At least one uppercase letter
      </li>
      <li className={hasLowercase ? "text-green-600" : "text-red-600"}>
        ✔ At least one lowercase letter
      </li>
      <li className={hasSpecialChar ? "text-green-600" : "text-red-600"}>
        ✔ At least one special character
      </li>
    </ul>
  );
};

export default PasswordStrengthChecker;

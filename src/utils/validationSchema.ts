import * as yup from "yup";

export const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(/^(?=.*[0-9])/, "At least one number")
    .matches(/^(?=.*[A-Z])/, "At least one uppercase letter")
    .matches(/^(?=.*[a-z])/, "At least one lowercase letter")
    .matches(/^(?=.*[^a-zA-Z0-9])/, "At least one special character")
    .min(8, "Minimum 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords do not match")
    .required("Please confirm your password"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .test("valid-phone", "Invalid phone number", (value) => {
      return !!(value && value.replace(/\D/g, "").length >= 7);
    }),
  birthDay: yup.string().optional(),
  birthMonth: yup.string().optional(),
  birthYear: yup.string().optional(),
  gender: yup.string().optional(),
  relationshipStatus: yup.string().optional(),
  anniversaryDay: yup.string().optional(),
  anniversaryMonth: yup.string().optional(),
  anniversaryYear: yup.string().optional(),
  marketingConsent: yup.boolean().optional(),
});



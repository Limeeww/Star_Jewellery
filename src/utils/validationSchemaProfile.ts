import * as yup from "yup";

export const validationSchemaProfile = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
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

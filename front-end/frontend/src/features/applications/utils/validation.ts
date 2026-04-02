import * as yup from "yup";

// Schema factory để có thể dùng i18n messages
export const createValidationSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    cvSnapshotUrl: yup
      .string()
      .required(t("applications.validation.cvRequired")),
    fullName: yup
      .string()
      .required(t("applications.validation.fullNameRequired"))
      .min(2, t("applications.validation.fullNameMinLength")),
    email: yup
      .string()
      .email(t("applications.validation.emailInvalid"))
      .required(t("applications.validation.emailRequired")),
    phone: yup
      .string()
      .required(t("applications.validation.phoneRequired"))
      .min(9, t("applications.validation.phoneInvalid")),
    coverLetter: yup.string().nullable(),
    salaryExpectation: yup.string().nullable(),
  });
};

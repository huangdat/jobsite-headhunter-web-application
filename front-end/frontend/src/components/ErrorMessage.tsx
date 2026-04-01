import { useMessagesTranslation } from "@/shared/hooks";

export function ErrorMessage() {
  const { t } = useMessagesTranslation();
  return <>{t("errors.editorFailedToLoad")}</>;
}

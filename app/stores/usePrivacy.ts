export const usePrivacy = defineStore("privacy-store", () => {
  const isPrivacyAccepted = ref(false);

  const setPrivacyAccepted = () => {
    isPrivacyAccepted.value = !isPrivacyAccepted.value;
  };

  return {
    isPrivacyAccepted,
    setPrivacyAccepted,
  };
});

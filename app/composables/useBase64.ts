export const useBase64Image = () => {
  const base64Image = ref<string | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        base64Image.value = result;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return {
    base64Image,
    convertToBase64,
  };
};

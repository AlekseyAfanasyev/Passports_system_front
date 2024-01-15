import axios from 'axios';

export const uploadPassportImage = async (userToken: string | undefined, imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axios.post<string>(`/api/passports/upload_image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
};
export const changePassportStatus = async (passport_name: string): Promise<void> => {
  try {
    const response = await fetch(`api/change_passport_availibility/${passport_name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("chOrSt");
    if (response.status === 200) {
    } else {
      throw new Error('Ошибка при изменении статуса паспорта');
    }
  } catch (error) {
    throw new Error('Ошибка при изменении статуса паспорта');
  }
};

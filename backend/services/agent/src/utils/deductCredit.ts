import axios from 'axios';

export const deductCredit = async (userId: string, agent: string) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE}/deduct-credits`,
      { userId, agent }
    );
    return data;
  } catch (error) {
    console.error('Error deducting credit:', error);
    return null;
  }
};

export default deductCredit;

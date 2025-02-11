import axios from "axios";

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export const fetchWordDetails = async (word: string) => {
  try {
    const response = await axios.get(`${API_URL}${word}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar palavra:", error);
    return null;
  }
};

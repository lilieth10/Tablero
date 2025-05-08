// src/api/cards.ts
import axios from "axios";
import { Card } from "../types/kanban";

const API = "http://localhost:3000/cards";

export const getCards = async (): Promise<Card[]> => {
  const res = await axios.get(API);
  return res.data;
};

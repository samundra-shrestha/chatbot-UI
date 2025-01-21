import axios from "axios";
import { API } from "../config/apis";
import { _axios } from "../config/axios";
import { THistoryDetails, TQueryResponse } from "../types";
import { TDatabaseData, TQueryData } from "./types";
import { DATABASE_API } from "../config/config";
export async function makeQuery(url:string, data: TQueryData) {
    try {
        const response = await _axios.post<TQueryResponse>(url, {
            query: data.query,
        })
        await saveChat({ question: data.query, answer: response.data.answer, unique_key: data.unique_key, totalResponseTime: "" })
        return response.data.answer
    } catch {
        throw new Error("Error in making query")
    }
}

export async function getChatHistory() {
    try {
        const response = await _axios.get(API.CHAT_HISTORY)
        return response.data
    } catch {
        throw new Error("Error in getting chat history")
    }
}

export async function saveChat(data: TDatabaseData) { 
    try {
       const response=  await axios.post(DATABASE_API, data)
       console.log("🚀 ~ saveChat ~ response:", response)
       return response.data
    } catch {
        throw new Error("Error in saving chat")
    }
 }

export const data: THistoryDetails[] = [{
    question: "what is islington?",
    message: "Islington College Master's degree in Msc IT and MBA Programmes Specialisation in various disciplines"
},
{
    question: "who is the chairman of islington?",
    message: "Sulav Budhathoki is the Chairman of Islington College."
},
{
    question: "what is cell wall?",
    message: "There is no mention of 'cell wall' in the provided document."
}
]

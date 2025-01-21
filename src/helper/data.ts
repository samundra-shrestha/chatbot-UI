import { TURLData } from "./types";

export const URLData:TURLData[] =[
    {
        url: `query_without_reranking/islington/`,
        label: "Base Local Modal"
    },
    {
        url: `query_with_reranking/islington/`,
        label: "Base Local Modal with Reranking"
    },
    {
        url: `query_with_full_context/islington/`,
        label: "Gemini Full Context"
    },
    {
        url: `query_with_gemini_reranking/islington/`,
        label: "Gemini Reranking"
    },
    {
        url: `query_with_gemini_no_reranking/islington/`,
        label: "Gemini No Reranking"
    },
    //  in case, any new api are added in the future, you can add them here
    // they will be automatically added to the chatbot as buttons where user can can on one of those to change the api endpoint
    // THANK YOU!!!
]
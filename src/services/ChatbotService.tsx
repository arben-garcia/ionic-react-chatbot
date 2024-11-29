import { useState, useEffect } from "react"
import OpenAI from "openai";

let errorResponse = "Unable to receive response from the assistant at this time. Please try again.";

const ChatbotService = () => {
    const [assistant, setAssistant] = useState(null);
    const [thread, setThread] = useState(null);
    const [openai, setOpenai] = useState(null);

    useEffect(() => {
        initChatBot();
    }, []); 

    const initChatBot = async () => {
        const openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
        });
        
        // Create an assistant
        const assistant = await openai.beta.assistants.retrieve(import.meta.env.VITE_OPEN_AI_ASSISTANT_ID);
        
        // Create a thread
        const thread = await openai.beta.threads.create();
    
        setOpenai(openai);
        setAssistant(assistant);
        setThread(thread);
    };

    const getResponse = async (input) => {
        if (!openai) {
            initChatBot();
            return errorResponse;
        }

        // Send a message to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: input,
        });
    
        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id,
        });
    
        // Create a response
        let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        // Wait for the response to be ready
        while (response.status === "in_progress" || response.status === "queued") {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        if (response.status === "failed") {
            return errorResponse;
        }

        // Get the messages for the thread
        const messageList = await openai.beta.threads.messages.list(thread.id);

        // Find the last message for the current run
        const lastMessage = messageList.data
            .filter((message) => message.run_id === run.id && message.role === "assistant")
            .pop();

        // Return the last message coming from the assistant        
        return lastMessage.content[0].text.value;        
    }

    return {
        getResponse
    }
};

export default ChatbotService;
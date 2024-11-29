import { IonContent, IonInput, IonItem, IonButton, IonGrid, IonCol, IonRow, IonIcon, IonSpinner, IonImg } from "@ionic/react";
import { useState, useRef, useEffect, createRef } from "react";
import ChatbotService from "../../services/ChatbotService"
import Markdown from 'react-markdown';
import logo from '../../assets/images/chatbot.png';
import "./Chatbot.css";
import { paperPlaneOutline } from 'ionicons/icons';

const Chatbot = () => {
    const localStorageKey = "philtour-chatbot-messages"
    const welcomeMessage = "Hello! How can I assist you today? If you have any questions about tourism in the Philippines, feel free to ask!";
    const inputRef = useRef();
    const buttonRef = useRef();
    const contentRef = createRef();
    const [status, setStatus] = useState('typing');
    const [question, setQuestion] = useState("");
    const [prompt, setPrompt] = useState(false);
    const [lazyLoading, setLazyLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const {getResponse} = ChatbotService();

    const sendMessage = (newMessage) => {
        setQuestion(newMessage);
        setLazyLoading(true);

        if (question.trim()) {
            setChatHistory(chatHistory => [...chatHistory, {type: "user", message: question}] );
            setQuestion("");
            contentRef.current?.scrollToBottom(500);
        }

        return new Promise((resolve) => {
            setTimeout(async () => {
                if (newMessage.trim()) {
                    const answer = await getResponse(newMessage);
                    setChatHistory(chatHistory => [...chatHistory, {type: "chatbot", message: answer}] );
                    setLazyLoading(false);
                }
                resolve();
            }, 200);
        });
    }

    useEffect(() => {
        if (localStorage.getItem(localStorageKey)) {
            const savedMessages = JSON.parse(localStorage.getItem(localStorageKey))
            if (savedMessages !== null) {
                setChatHistory(savedMessages)
            }
        }
    }, []);
    
    useEffect(() => {
        if (!inputRef.current?.disabled) {
            inputRef.current?.focus();
        }
    }, [status]);
    
    useEffect(() => {
        if (chatHistory.length > 0) {
            setTimeout(()=>{
                localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
                contentRef.current?.scrollToBottom(400);
            }, 10); // hack to inconsistent delay when displaying latest message
        }
    }, [chatHistory]);

    useEffect(() => {
        buttonRef.current.click();        
        setQuestion("");
        setPrompt(false);
    }, [prompt]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        await sendMessage(question)
            .then(() => {
                setStatus('sent');
            })
            .catch(() => {
                setStatus('typing');
            });
    }

    const handleInputChange = (e) => {
        setQuestion(e.target.value);
    }
  
    return (
        <>
            <IonContent
                className="ion-padding chatbot-page"
                ref={contentRef}
            >
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonImg
                            src={logo}
                            alt="logo"
                        />
                    </IonCol>
                </IonRow>                
            </IonGrid>
            {chatHistory.length > 0 ? 
                <div className="chat-history">
                    <IonGrid>
                        {chatHistory.map((item, i) => {
                            let chatBubble;
                            if (item.type === "user") {
                                chatBubble = 
                                    <IonCol className="clearfix">
                                        <div className="message user-message ion-float-right">
                                            { item.message }
                                        </div>
                                    </IonCol>;
                            } else {
                                chatBubble = 
                                <IonCol className="clearfix">
                                    <div className="message chatbot-message">
                                        <Markdown>{ item.message }</Markdown>
                                    </div>
                                </IonCol>;
                            }

                            return (
                                <IonRow key={i}>{ chatBubble }</IonRow>
                            )
                        })}

                        {lazyLoading ?
                            <IonRow>
                                <IonCol className="clearfix">                                    
                                    <IonSpinner name="dots"></IonSpinner>
                                </IonCol>
                            </IonRow>
                        : null}

                    </IonGrid>
                </div> : 
                
                <div className="chat-history">
                    <IonGrid>
                        <IonRow className="ion-justify-content-center">
                            <IonCol className="clearfix" size="12">
                                <div className="message chatbot-message">
                                    <p>{ welcomeMessage }</p>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                }
            </IonContent>
            <div className="messagebox">
                <IonItem className="ion-justify-content-center">
                    <IonInput 
                        aria-label="Chat Message"
                        fill="outline"
                        value={question}
                        onIonInput={handleInputChange}
                        disabled={status === 'submitting'}
                        placeholder="Ask me anything..."
                        ref={inputRef}
                        autofocus
                        >
                    </IonInput>
                    <IonButton
                        shape="round"
                        fill="clear"
                        ref={buttonRef}
                        disabled={
                            question.length === 0 ||
                            status === 'submitting'
                        }
                        onClick={handleSubmit}>
                        <IonIcon slot="icon-only" icon={paperPlaneOutline} size="large"></IonIcon>
                    </IonButton>
                </IonItem>
            </div>
        </>
    );
  };

  export default Chatbot;
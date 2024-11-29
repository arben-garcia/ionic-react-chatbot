import { IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonText, IonImg, IonHeader, IonToolbar, IonButtons, IonModal, createAnimation } from '@ionic/react';
import welcomeImage from '../../assets/images/chatbot.png';
import { useState, useEffect } from 'react';
import Chatbot from "./Chatbot";
import './ChatbotWelcome.css';
import { chatbubbles, arrowBack } from 'ionicons/icons';

const ChatbotWelcome = () => {
    const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

    useEffect(() => {

    }, []);

    const startChat = () => {
        setHasSeenWelcome(true);
    }

    return (
        <>
        {!hasSeenWelcome ? 
            <IonContent className="ion-padding chatbot-page">
                <IonGrid className="ion-align-self-center">
                    <IonRow class="ion-justify-content-center" className="chatbot-title">
                        <IonCol size="auto">
                            <IonIcon icon={chatbubbles} size="large" />
                        </IonCol>
                        <IonCol size="auto">                            
                            <div style={{ width: '240px' }}>
                                <IonText>
                                    <h2>TRAVEL CHAT ASSISTANT</h2>
                                </IonText>
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center" >
                        <IonCol size="auto">
                        <IonImg
                            src={welcomeImage}
                            alt="Travel Assistant"
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center">
                        <IonCol size="auto">
                            <div style={{ width: '320px' }}>
                                <p className="poppins-regular">
                                    Ask your travel questions and receive a recommendation from us
                                </p>  
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center">
                        <IonCol size="auto">
                            <IonButton 
                                onClick={startChat}
                                shape="round">
                                    <p className="poppins-regular">
                                        Get started
                                    </p>  
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            : 
            <Chatbot />
        }
        </>
    );
};

export default ChatbotWelcome;
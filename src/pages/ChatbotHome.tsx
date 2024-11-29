import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import './ChatbotHome.css';
import ChatbotWelcome from '../components/Chatbot/ChatbotWelcome'

const ChatbotHome: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <ChatbotWelcome />
    </IonPage>
  );
};

export default ChatbotHome;

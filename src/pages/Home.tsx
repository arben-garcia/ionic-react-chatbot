import { useRef } from 'react';
import { IonApp, IonContent, IonHeader, IonToolbar, IonIcon, IonItem, IonButton, IonButtons, IonModal, createAnimation} from '@ionic/react';
import './Home.css';
import ChatbotWelcome from '../components/Chatbot/ChatbotWelcome';
import { chatbubbles, arrowBack } from 'ionicons/icons';

const Home: React.FC = () => {

  const modal = useRef(null);

  const enterAnimation = (baseEl) => {
      const root = baseEl.shadowRoot;

      const backdropAnimation = createAnimation()
          .addElement(root?.querySelector('ion-backdrop'))
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = createAnimation()
          .addElement(root?.querySelector('.modal-wrapper'))
          .keyframes([
              { offset: 0, opacity: '0', transform: 'scale(0)' },
              { offset: 1, opacity: '0.99', transform: 'scale(1)' },
          ]);

      return createAnimation()
          .addElement(baseEl)
          .easing('ease-out')
          .duration(300)
          .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl) => {
      return enterAnimation(baseEl).direction('reverse');
  };

  return (
    <IonApp>
      <IonContent className="ion-padding">
        <div>
          <p>
            This is a sample content page to show the floating action button and the corresponding chatbot modal to be displayed.
          </p>
        </div>
        <IonButton id="open-modal" shape="round" size="large" slot="fixed" fill="outline" className="chatbot-button">
          <IonIcon slot="icon-only" size="large" icon={chatbubbles}></IonIcon>
        </IonButton>
      </IonContent>
      <IonModal ref={modal} trigger="open-modal" enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot="start">
                      <IonButton onClick={() => modal.current?.dismiss()} routerLink="/tab1">
                          <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
                      </IonButton>
                  </IonButtons>
              </IonToolbar>
          </IonHeader>
          <ChatbotWelcome />
      </IonModal>
    </IonApp>
  );
};

export default Home;

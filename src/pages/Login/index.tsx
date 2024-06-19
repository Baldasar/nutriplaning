import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonInput,
  IonButton,
} from "@ionic/react";
import packageJson from "../../../package.json";
import toast from "react-simple-toasts";
import LocalStorageHelper from "../../components/LocalStorageHelper";

import "./styles.css";
import { environment } from "../../environments/environment";

const Login = () => {
  const version = packageJson.version;
  const history = useHistory();

  const { getItem, setItem } = LocalStorageHelper();

  const [email, setEmail] = useState("lucaspaquelin@gmail.com");
  const [senha, setSenha] = useState("123456");

  const handleLogin = async () => {
    if (!email || !senha) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("senha", senha);
      formData.append("id_pessoa", "2");

      const response =  await fetch(`${environment.apiUrl}/api/loginUsuario`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if(!responseData.success) {
        toast('Erro ao fazer login!', {
          clickClosable: true,
          duration: 2500,
          position: "top-center",
          theme: "failure",
        });

        return;
      }

      toast('Login feito com sucesso!', {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "success",
      });

      setItem("userId", responseData.id);

      history.push("/home");
    } catch (error) {
      toast('Erro ao fazer login!', {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "failure",
      });
    }
  };

  const handleRegister = () => {
    history.push("/register");
  };

  useEffect(() => {
    const userId = getItem("userId");

    if (userId) {
      history.push("/home");
    }
  }, []);

  return (
    <IonContent>
      <div className="container">
        <IonCard className="ion-padding" style={{ width: "80%" }}>
          <IonCardContent>
            <IonCardTitle className="ion-text-center">
              Faça login em sua conta
            </IonCardTitle>
            <IonItem>
              <IonInput
                label="Email"
                labelPlacement="floating"
                placeholder="Digite seu email"
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonInput
                label="Senha"
                labelPlacement="floating"
                placeholder="Digite sua senha"
                type="password"
                value={senha}
                onIonChange={(e) => setSenha(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>
            <div className="button-container">
              <IonButton
                expand="block"
                type="submit"
                onClick={handleRegister}
                style={{ width: "50%" }}
              >
                Registrar
              </IonButton>
              <IonButton
                expand="block"
                type="submit"
                disabled={!email || !senha}
                onClick={handleLogin}
                style={{ width: "50%" }}
              >
                Entrar
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
        <div className="version-container">
          <label>Versão: {version}</label>
        </div>
      </div>
    </IonContent>
  );
};

export default Login;

import { useState } from "react";
import { useHistory } from "react-router";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import toast from "react-simple-toasts";

import "./styles.css";

const Register = () => {
  const history = useHistory();

  const [nome, setNome] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [senha, setSenha] = useState<any>(null);
  const [confirmarSenha, setConfirmarSenha] = useState<any>(null);
  const [altura, setAltura] = useState<any>(null);
  const [peso, setPeso] = useState<any>(null);
  const [idade, setIdade] = useState<any>(null);
  const [nivelAtividade, setNivelAtividade] = useState<any>(null);
  const [sexo, setSexo] = useState<any>(null);

  const isValidEmail = (email: any) => /\S+@\S+\.\S+/.test(email);
  const isValidInteger = (value: any) => /^\d+$/.test(value);

  const handleRegister = async () => {
    if (
      !nome ||
      !email ||
      !senha ||
      !confirmarSenha ||
      !altura ||
      !peso ||
      !idade ||
      !nivelAtividade ||
      !sexo
    ) {
      toast("Preencha todos os campos!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "warning",
      });
      return;
    }

    if (senha !== confirmarSenha) {
      toast("As senhas não coincidem!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "warning",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast("Email inválido!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "warning",
      });
      return;
    }

    if (
      !isValidInteger(altura) ||
      !isValidInteger(peso) ||
      !isValidInteger(idade)
    ) {
      toast("Altura, peso e idade devem ser números inteiros!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "warning",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("senha", senha);
      formData.append("altura", altura);
      formData.append("peso", peso);
      formData.append("idade", idade);
      formData.append("atividade", nivelAtividade);
      formData.append("genero", sexo);

      await fetch("http://localhost:8000/api/registrarUsuario", {
        method: "POST",
        body: formData,
      });

      toast("Usuário cadastrado com sucesso!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "success",
      });

      history.push("/login");
    } catch (error) {
      toast("Erro ao cadastrar usuário!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "failure",
      });
    }
  };

  const backToLogin = () => {
    history.push("/login");
  };

  return (
    <IonContent fullscreen>
      <IonFab slot="fixed" vertical="top" horizontal="start">
        <IonFabButton onClick={backToLogin}>
          <IonIcon icon={arrowBack}></IonIcon>
        </IonFabButton>
      </IonFab>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <h2>Cadastro</h2>
        <div style={{ width: "90%", maxWidth: "500px" }}>
          <IonItem>
            <IonInput
              label="Nome"
              labelPlacement="floating"
              placeholder="Digite seu nome"
              type="text"
              value={nome}
              onIonChange={(e) => setNome(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Email"
              labelPlacement="floating"
              placeholder="Digite seu email"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
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
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Confirmar Senha"
              labelPlacement="floating"
              placeholder="Confirme sua senha"
              type="password"
              value={confirmarSenha}
              onIonChange={(e) => setConfirmarSenha(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Altura (cm)"
              labelPlacement="floating"
              placeholder="Digite sua altura"
              type="number"
              value={altura}
              onIonChange={(e) => setAltura(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Peso (kg)"
              labelPlacement="floating"
              placeholder="Digite seu peso"
              type="number"
              value={peso}
              onIonChange={(e) => setPeso(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Idade"
              labelPlacement="floating"
              placeholder="Digite sua idade"
              type="number"
              value={idade}
              onIonChange={(e) => setIdade(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect
              value={nivelAtividade}
              onIonChange={(e) => setNivelAtividade(e.detail.value!)}
              label="Nível de Atividade"
              placeholder="Selecione"
            >
              <IonSelectOption value="1.2">Sedentário</IonSelectOption>
              <IonSelectOption value="1.375">Leve</IonSelectOption>
              <IonSelectOption value="1.55">Moderado</IonSelectOption>
              <IonSelectOption value="1.725">Ativo</IonSelectOption>
              <IonSelectOption value="1.9">Muito Ativo</IonSelectOption>
            </IonSelect>
          </IonItem>
          {/* <IonItem>
            <IonSelect
              label="Plano Alimentar"
              placeholder="Selecione"
            >
              <IonSelectOption value="1">Onívoro</IonSelectOption>
              <IonSelectOption value="2">Vegetariano</IonSelectOption>
              <IonSelectOption value="3">Vegano</IonSelectOption>
            </IonSelect>
          </IonItem> */}
          <IonItem>
            <IonSelect
              value={nivelAtividade}
              onIonChange={(e) => setSexo(e.detail.value!)}
              label="Sexo"
              placeholder="Selecione"
            >
              <IonSelectOption value="m">Masculino</IonSelectOption>
              <IonSelectOption value="f">Feminino</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonButton expand="block" onClick={handleRegister}>
            Cadastrar
          </IonButton>
        </div>
      </div>
    </IonContent>
  );
};

export default Register;
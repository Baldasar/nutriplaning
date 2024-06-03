import { useEffect, useState } from "react";
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonLoading,
  useIonAlert,
} from "@ionic/react";
import { useHistory } from "react-router";
import { home, logOut, person } from "ionicons/icons";
import LocalStorageHelper from "../../components/LocalStorageHelper";
import toast from "react-simple-toasts";

import "./styles.css";

const EditProfile = () => {
  const history = useHistory();

  const [presentAlert] = useIonAlert();

  const { getItem } = LocalStorageHelper();

  const [selectedSegment, setSelectedSegment] = useState<any>("1");

  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>({});
  const [altura, setAltura] = useState<any>(null);
  const [peso, setPeso] = useState<any>(null);
  const [idade, setIdade] = useState<any>(null);
  const [nivelAtividade, setNivelAtividade] = useState<any>(null);
  const [sexo, setSexo] = useState<any>(null);

  const handleSegmentChange = (value: any) => {
    setSelectedSegment(value);
    switch (value) {
      case "1":
        break;
      case "2":
        history.push("/home");
        break;
      case "3":
        history.push("/login");
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    const userId = getItem("userId");

    const formData = new FormData();
    formData.append("id", userId);
    formData.append("altura", altura);
    formData.append("peso", peso);
    formData.append("idade", idade);
    formData.append("atividade", nivelAtividade);
    formData.append("genero", sexo);

    try {
      await fetch("http://localhost:8000/api/atualizarUsuario", {
        method: "POST",
        body: formData,
      });

      toast("Perfil atualizado com sucesso!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "success",
      });
    } catch (error) {
      toast("Erro ao atualizar perfil!", {
        clickClosable: true,
        duration: 2500,
        position: "top-center",
        theme: "failure",
      });
    }
  };

  const getProfileData = async (id: any) => {
    const formData = new FormData();
    formData.append("id", id);

    try {
      const response = await fetch("http://localhost:8000/api/pessoa", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      setAltura("" + responseData.pessoa.altura);
      setPeso("" + responseData.pessoa.peso);
      setIdade("" + responseData.pessoa.idade);
      setNivelAtividade("" + responseData.pessoa.atividadeFisica);
      setSexo("" + responseData.pessoa.genero);

      setInitialData({
        altura: responseData.pessoa.altura,
        peso: responseData.pessoa.peso,
        idade: responseData.pessoa.idade,
        nivelAtividade: responseData.pessoa.atividadeFisica,
        sexo: responseData.pessoa.genero,
      });
    } catch (error) {
      console.error(error);
      presentAlert({
        header: "Erro",
        message:
          "Ocorreu um erro ao carregar os dados do perfil, verifique sua conexão com a internet e tente novamente.",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              history.push("/home");
            },
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasChanged =
      altura != initialData.altura ||
      peso != initialData.peso ||
      idade != initialData.idade ||
      nivelAtividade != initialData.nivelAtividade ||
      sexo != initialData.sexo;

    setIsSaveButtonEnabled(hasChanged);
  }, [altura, peso, idade, nivelAtividade, sexo]);

  useEffect(() => {
    const userId = getItem("userId");

    getProfileData(userId);
  }, []);

  return (
    <IonContent fullscreen>
      {loading && <IonLoading isOpen={loading} message={"Carregando..."} />}

      <div className="grid-container">
        <div className="top-section">
          <h2>Atualizar Informaçoes</h2>
          <IonCard className="update-card">
            <IonCardContent>
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
                  label="Nível de Atividade"
                  value={nivelAtividade}
                  placeholder="Selecione"
                  onIonChange={(e) => setNivelAtividade(e.detail.value!)}
                >
                  <IonSelectOption value="1.2">Sedentário</IonSelectOption>
                  <IonSelectOption value="1.375">Leve</IonSelectOption>
                  <IonSelectOption value="1.55">Moderado</IonSelectOption>
                  <IonSelectOption value="1.725">Ativo</IonSelectOption>
                  <IonSelectOption value="1.9">Muito Ativo</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonSelect
                  label="Sexo"
                  value={sexo}
                  placeholder="Selecione"
                  onIonChange={(e) => setSexo(e.detail.value!)}
                >
                  <IonSelectOption value="m">Masculino</IonSelectOption>
                  <IonSelectOption value="f">Feminino</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonButton
                expand="block"
                onClick={handleSave}
                disabled={!isSaveButtonEnabled}
              >
                Salvar
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
        <div className="bottom-section">
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => handleSegmentChange(e.detail.value)}
          >
            <IonSegmentButton value="1">
              <IonLabel>Perfil</IonLabel>
              <IonIcon icon={person}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="2">
              <IonLabel>Refeições</IonLabel>
              <IonIcon icon={home}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="3">
              <IonLabel>Sair</IonLabel>
              <IonIcon icon={logOut}></IonIcon>
            </IonSegmentButton>
          </IonSegment>
        </div>
      </div>
    </IonContent>
  );
};

export default EditProfile;

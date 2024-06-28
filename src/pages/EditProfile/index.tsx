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
import { environment } from "../../environments/environment";

const EditProfile = () => {
  const history = useHistory();

  const [presentAlert] = useIonAlert();

  const { getItem } = LocalStorageHelper();

  const [userId, setUserId] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState<any>("1");

  const [loading, setLoading] = useState(true);
  const [altura, setAltura] = useState<any>(null);
  const [peso, setPeso] = useState<any>(null);
  const [idade, setIdade] = useState<any>(null);
  const [nivelAtividade, setNivelAtividade] = useState<any>(null);
  const [sexo, setSexo] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Cereais e derivados",
    "Verduras, hortaliças e derivados",
    "Frutas e derivados",
    "Gorduras e óleos",
    "Pescados e frutos do mar",
    "Carnes e derivados",
    "Leite e derivados",
    "Bebidas (alcoólicas e não alcoólicas)",
    "Ovos e derivados",
    "Produtos açucarados",
    "Miscelâneas",
    "Outros alimentos industrializados",
    "Alimentos preparados",
    "Leguminosas e derivados",
    "Nozes e sementes",
  ]);

  const isValidInteger = (value: any) => /^\d+$/.test(value);

  const categories = [
    "Cereais e derivados",
    "Verduras, hortaliças e derivados",
    "Frutas e derivados",
    "Gorduras e óleos",
    "Pescados e frutos do mar",
    "Carnes e derivados",
    "Leite e derivados",
    "Bebidas (alcoólicas e não alcoólicas)",
    "Ovos e derivados",
    "Produtos açucarados",
    "Miscelâneas",
    "Outros alimentos industrializados",
    "Alimentos preparados",
    "Leguminosas e derivados",
    "Nozes e sementes",
  ];

  const handleSelectionChange = (event: any) => {
    setSelectedCategories(event.detail.value);
  };

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
    if (!altura || !peso || !idade || !nivelAtividade || !sexo) {
      toast("Preencha todos os campos!", {
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

    const body = {
      id_usuario: userId,
      altura: parseFloat(altura),
      peso: parseFloat(peso),
      genero: sexo,
      idade: parseInt(idade),
      atividade: parseFloat(nivelAtividade),
      black_list: categories.filter(
        (category) => !selectedCategories.includes(category)
      ),
      debug: true,
    };

    try {
      const response = await fetch(
        `${environment.apiUrl}api/atualizar-usuario`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error("Falha ao atualizar perfil!");
      }

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
    try {
      const body = {
        id_usuario: id,
      };

      const response = await fetch(`${environment.apiUrl}api/pessoa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const pessoaData = await response.json();

      if (!pessoaData.success) {
        throw new Error("Falha ao obter dados da pessoa");
      }

      const pessoa = pessoaData.pessoa;

      setAltura("" + pessoa.altura);
      setPeso("" + pessoa.peso);
      setIdade("" + pessoa.idade);
      setNivelAtividade("" + pessoa.atividadeFisica);
      setSexo("" + pessoa.genero);
      setSelectedCategories(
        selectedCategories.filter((cat) => !pessoa.blackList.includes(cat))
      );
    } catch (error) {
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
    const userId = getItem("userId");
    setUserId(userId);
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
                  label="Categorias"
                  placeholder="Selecione"
                  multiple={true}
                  onIonChange={handleSelectionChange}
                  value={selectedCategories}
                >
                  {categories.map((category, index) => (
                    <IonSelectOption key={index} value={category}>
                      {category}
                    </IonSelectOption>
                  ))}
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
              <IonButton expand="block" onClick={handleSave}>
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

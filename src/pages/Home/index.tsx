import { useEffect, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonRange,
  IonSegment,
  IonSegmentButton,
  useIonAlert,
} from "@ionic/react";
import { home, logOut, person } from "ionicons/icons";
import { useHistory } from "react-router";
import LocalStorageHelper from "../../components/LocalStorageHelper";

import "./styles.css";

const Home = () => {
  const history = useHistory();

  const [presentAlert] = useIonAlert();

  const { getItem, clear } = LocalStorageHelper();

  const [loading, setLoading] = useState(false);

  const [selectedSegment, setSelectedSegment] = useState<any>("2");
  const [refeicoes, setRefeicoes] = useState<any>([]);
  const [refeicoesGeradas, setRefeicoesGeradas] = useState<any>([]);

  const calcularTotais = () => {
    let totalCarboidrato = 0;
    let totalProteina = 0;
    let totalGordura = 0;

    refeicoesGeradas.forEach((refeicao: any) => {
      refeicao.comidas.forEach((comida: any) => {
        totalCarboidrato += comida.carboidrato;
        totalProteina += comida.proteina;
        totalGordura += comida.gordura;
      });
    });

    return { totalCarboidrato, totalProteina, totalGordura };
  };

  const { totalCarboidrato, totalProteina, totalGordura } = calcularTotais();

  const confirmLogout = () => {
    presentAlert({
      header: "Sair",
      message: "Deseja realmente sair?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            setSelectedSegment("2");
          },
        },
        {
          text: "Sair",
          handler: () => {
            clear();
            history.push("/");
          },
        },
      ],
    });
  };

  const handleSegmentChange = (value: any) => {
    setSelectedSegment(value);
    switch (value) {
      case "1":
        history.push("/edit-profile");
        break;
      case "2":
        break;
      case "3":
        confirmLogout();
        break;
      default:
        break;
    }
  };

  const gerarRefeicoes = async () => {
    setLoading(true);

    setRefeicoes([]);

    setTimeout(() => {
      setRefeicoesGeradas([
        {
          refeicao: 1,
          comidas: [
            {
              id: 8,
              nome: "Comida 8",
              quantidade: 140,
              carboidrato: 24,
              proteina: 8,
              gordura: 10,
            },
            {
              id: 12,
              nome: "Comida 12",
              quantidade: 210,
              carboidrato: 38,
              proteina: 14,
              gordura: 16,
            },
            {
              id: 2,
              nome: "Comida 2",
              quantidade: 150,
              carboidrato: 30,
              proteina: 10,
              gordura: 12,
            },
          ],
        },
        {
          refeicao: 2,
          comidas: [
            {
              id: 1,
              nome: "Comida 1",
              quantidade: 100,
              carboidrato: 22,
              proteina: 8,
              gordura: 8,
            },
            {
              id: 4,
              nome: "Comida 4",
              quantidade: 200,
              carboidrato: 35,
              proteina: 12,
              gordura: 15,
            },
            {
              id: 6,
              nome: "Comida 6",
              quantidade: 130,
              carboidrato: 20,
              proteina: 6,
              gordura: 7,
            },
          ],
        },
        {
          refeicao: 3,
          comidas: [
            {
              id: 3,
              nome: "Comida 3",
              quantidade: 120,
              carboidrato: 25,
              proteina: 7,
              gordura: 9,
            },
            {
              id: 5,
              nome: "Comida 5",
              quantidade: 180,
              carboidrato: 28,
              proteina: 9,
              gordura: 11,
            },
            {
              id: 7,
              nome: "Comida 7",
              quantidade: 170,
              carboidrato: 32,
              proteina: 11,
              gordura: 13,
            },
          ],
        },
        {
          refeicao: 4,
          comidas: [
            {
              id: 9,
              nome: "Comida 9",
              quantidade: 160,
              carboidrato: 27,
              proteina: 10,
              gordura: 12,
            },
            {
              id: 11,
              nome: "Comida 11",
              quantidade: 110,
              carboidrato: 18,
              proteina: 5,
              gordura: 6,
            },
            {
              id: 10,
              nome: "Comida 10",
              quantidade: 190,
              carboidrato: 33,
              proteina: 13,
              gordura: 14,
            },
          ],
        },
      ]);
    }, 1000);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleAddRefeicao = () => {
    const novaRefeicao = {
      id: refeicoes.length + 1,
      inputValue: 0,
    };
    setRefeicoes([...refeicoes, novaRefeicao]);
  };

  const handleRemoveRefeicao = (id: number) => {
    const novasRefeicoes = refeicoes.filter(
      (refeicao: any) => refeicao.id !== id
    );
    setRefeicoes(novasRefeicoes);
  };

  useEffect(() => {
    const userId = getItem("userId");

    if (!userId) {
      history.push("/login");
    }
  }, []);

  return (
    <IonContent fullscreen>
      {loading && <IonLoading isOpen={loading} message={"Carregando..."} />}

      <div className="grid-home">
        <div>
          <h2 className="text-center">Plano Alimentar</h2>
          {!refeicoesGeradas.length ? (
            <>
              <IonButton
                shape="round"
                expand="full"
                onClick={handleAddRefeicao}
              >
                Adicionar refeição
              </IonButton>
              {refeicoes.length > 0 && (
                <IonButton
                  shape="round"
                  expand="full"
                  color={"success"}
                  onClick={gerarRefeicoes}
                >
                  Gerar refeição
                </IonButton>
              )}
            </>
          ) : (
            <>
              <div className="total-container">
                <div className="total-item">
                  <h3 className="color-carbo">Carboidratos</h3>
                  <p>{totalCarboidrato}</p>
                </div>
                <div className="total-item">
                  <h3 className="color-proteina">Proteínas</h3>
                  <p>{totalProteina}</p>
                </div>
                <div className="total-item">
                  <h3 className="color-gord">Gorduras</h3>
                  <p>{totalGordura}</p>
                </div>
                <div className="total-item">
                  <h3>Calorias</h3>
                  <p>2100</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="card-container">
          {!refeicoesGeradas.length ? (
            <>
              {refeicoes.map((refeicao: any) => (
                <IonCard key={refeicao.id} className="ion-margin">
                  <IonCardHeader>
                    <IonCardTitle>Refeição {refeicao.id}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem>
                      <IonInput
                        type="number"
                        label="Porcentagem"
                        labelPlacement="floating"
                        placeholder="Digite o valor"
                        value={refeicao.inputValue}
                        onIonChange={(e) => {
                          const newValue = parseInt(e.detail.value!, 10) || 0;
                          const updatedRefeicoes = refeicoes.map((ref: any) =>
                            ref.id === refeicao.id
                              ? { ...ref, inputValue: newValue }
                              : ref
                          );
                          setRefeicoes(updatedRefeicoes);
                        }}
                      />
                    </IonItem>
                    <IonRange
                      min={0}
                      max={100}
                      step={5}
                      snaps={true}
                      value={refeicao.inputValue}
                      onIonChange={(e: any) => {
                        const newValue = parseInt(e.detail.value!, 10) || 0;
                        const updatedRefeicoes = refeicoes.map((ref: any) =>
                          ref.id === refeicao.id
                            ? { ...ref, inputValue: newValue }
                            : ref
                        );
                        setRefeicoes(updatedRefeicoes);
                      }}
                    >
                      <IonLabel slot="start">0</IonLabel>
                      <IonLabel slot="end">100</IonLabel>
                    </IonRange>
                    <IonButton
                      expand="full"
                      onClick={() => handleRemoveRefeicao(refeicao.id)}
                    >
                      Remover
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          ) : (
            <>
              {refeicoesGeradas.map((refeicao: any) => (
                <IonCard key={refeicao.refeicao} className="ion-margin">
                  <IonCardHeader>
                    <IonCardTitle>Refeição {refeicao.refeicao}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="card-content">
                    <IonList>
                      {refeicao.comidas.map((comida: any) => (
                        <IonItem key={comida.id}>
                          <IonLabel>
                            <h2>{comida.nome}</h2>
                            <p>Qntd: {comida.quantidade}g</p>
                          </IonLabel>
                          <div className="badge-container">
                            <IonBadge className="badge-item" color={"success"}>
                              {comida.carboidrato}
                            </IonBadge>
                            <IonBadge className="badge-item">
                              {comida.proteina}
                            </IonBadge>
                            <IonBadge className="badge-item" color={"danger"}>
                              {comida.gordura}
                            </IonBadge>
                          </div>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          )}
        </div>
        <div>
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

export default Home;

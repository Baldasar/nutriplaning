import { useEffect, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
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
import {
  add,
  checkmark,
  close,
  cog,
  home,
  logOut,
  pencil,
  person,
  trash,
} from "ionicons/icons";
import { useHistory } from "react-router";
import LocalStorageHelper from "../../components/LocalStorageHelper";

import "./styles.css";
import { environment } from "../../environments/environment";

const Home = () => {
  const history = useHistory();

  const [presentAlert] = useIonAlert();

  const { setItem, getItem, clear } = LocalStorageHelper();

  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState<any>("2");
  const [refeicoes, setRefeicoes] = useState<any>([]);
  const [refeicoesGeradas, setRefeicoesGeradas] = useState<any>([]);
  const [toggleEdit, setToggleEdit] = useState(false);

  const [totalCarboidrato, setTotalCarboidrato] = useState(0);
  const [totalProteina, setTotalProteina] = useState(0);
  const [totalGordura, setTotalGordura] = useState(0);
  const [totalCalorias, setTotalCalorias] = useState(0);

  const deselecionarTodasComidas = () => {
    const updatedRefeicoes = refeicoesGeradas.map((ref: any) => ({
      ...ref,
      comidas: ref.comidas.map((com: any) => ({
        ...com,
        selecionado: false,
      })),
    }));
    setRefeicoesGeradas(updatedRefeicoes);
  };

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
          handler: async () => {
            try {
              await fetch(`${environment.apiUrl}/api/logoutUsuario`, {
                method: "GET",
              });
            } catch (error) {
              console.error(error);
            } finally {
              clear();
              history.push("/");
            }
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

  const gerarRefeicoesParcial = async () => {
    const selectedIds: any = [];

    refeicoesGeradas.forEach((refeicao: any) => {
      refeicao.comidas.forEach((comida: any) => {
        if (comida.selecionado) {
          selectedIds.push(comida.id);
        }
      });
    });

    console.log(selectedIds);
  };

  const transformarDados = (res: any) => {
    if (!res || !res.refeicoes || !Array.isArray(res.refeicoes)) {
      throw new Error("Parâmetro inválido");
    }

    const resultado: any = [];

    let caloriasTotais = res.base_atividade
    let carboidratoTotais = res.macros_necessarios.carboidrato;
    let proteinaTotais = res.macros_necessarios.proteina;
    let gorduraTotais = res.macros_necessarios.lipideos;

    res.refeicoes.forEach((refeicao: any) => {
      const comidas: any = [];

      refeicao.alimentos.forEach((alimento: any) => {
        comidas.push({
          id: alimento.id,
          nome: alimento.descricaoAlimento,
          quantidade: alimento.quantidade.toFixed(2),
          carboidrato: alimento.macroNutrientes.carboidrato.toFixed(2),
          proteina: alimento.macroNutrientes.proteina.toFixed(2),
          gordura: alimento.macroNutrientes.lipideos.toFixed(2),
          selecionado: false,
        });
      });

      resultado.push({
        refeicao: resultado.length + 1,
        comidas,
      });
    });

    return {
      ref: resultado,
      totais: { calorias: caloriasTotais.toFixed(2), carboidrato: carboidratoTotais.toFixed(2), proteina: proteinaTotais.toFixed(2), gordura: gorduraTotais.toFixed(2)},
    };
  };

  const gerarRefeicoes = async () => {
    setLoading(true);
    setRefeicoes([]);

    const params = new FormData();
    params.append('id_pessoa', "12");
    params.append('email', 'lucaspaquelin@gmail.com');
    params.append('senha', '123456');

    refeicoes.forEach((refeicao: any) => {
      params.append('porcentagem[]', refeicao.inputValue);
    });

    const response = await fetch(`${environment.apiUrl}/api/gerarRefeicoes`, {
      method: "POST",
      body: params
    });

    const res = await response.json();

    const { ref, totais } = transformarDados(res);

    setTotalCalorias(Number(totais.calorias));
    setTotalCarboidrato(Number(totais.carboidrato));
    setTotalProteina(Number(totais.proteina));
    setTotalGordura(Number(totais.gordura));

    setTimeout(() => {
      setRefeicoesGeradas(ref);
      setItem("refeicoesGeradas", JSON.stringify(ref));
      setItem("totais", JSON.stringify(totais));
    }, 1000);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const resetRefeicoes = () => {
    presentAlert({
      header: "Resetar Refeições",
      message: "Deseja realmente resetar as refeições?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
        },
        {
          text: "Resetar",
          handler: () => {
            setRefeicoes([]);
            setRefeicoesGeradas([]);
            setItem("refeicoesGeradas", JSON.stringify([]));
            setItem("totais", JSON.stringify({}));
          },
        },
      ],
    });
  };

  const handleAddRefeicao = () => {
    const novaRefeicao = {
      id: refeicoes.length + 1,
      inputValue: 0,
    };
    setRefeicoes([...refeicoes, novaRefeicao]);

    setTimeout(() => {
      const element = document.querySelector(".card-container");
      element?.scrollTo(0, element.scrollHeight);
    },200);
  };

  const handleRemoveRefeicao = (id: number) => {
    const novasRefeicoes = refeicoes.filter(
      (refeicao: any) => refeicao.id !== id
    );
    setRefeicoes(novasRefeicoes);
  };

  useEffect(() => {
    const id = getItem("userId");

    if (!id) {
      history.push("/login");
      return;
    }

    setUserId(id);

    const refeicoesGeradas = getItem("refeicoesGeradas");
    const totais = getItem("totais");

    if (totais) {
      const { calorias, carboidrato, proteina, gordura } = JSON.parse(totais);

      setTotalCalorias(calorias);
      setTotalCarboidrato(carboidrato);
      setTotalProteina(proteina);
      setTotalGordura(gordura);
    }

    if (refeicoesGeradas) {
      setRefeicoesGeradas(JSON.parse(refeicoesGeradas));
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
              <IonFab className="fab-add">
                <IonFabButton onClick={handleAddRefeicao}>
                  <IonIcon icon={add}></IonIcon>
                </IonFabButton>
              </IonFab>

              {refeicoes.length > 0 && (
                <IonFab className="fab-generate">
                  <IonFabButton color={"success"} onClick={gerarRefeicoes}>
                    <IonIcon color="light" icon={checkmark}></IonIcon>
                  </IonFabButton>
                </IonFab>
              )}
            </>
          ) : (
            <>
              {toggleEdit ? (
                <>
                  <IonFab className="fab-save">
                    <IonFabButton
                      color={"success"}
                      onClick={gerarRefeicoesParcial}
                    >
                      <IonIcon color="light" icon={checkmark}></IonIcon>
                    </IonFabButton>
                  </IonFab>

                  <IonFab className="fab-reset">
                    <IonFabButton
                      color={"medium"}
                      onClick={() => {
                        deselecionarTodasComidas();
                        setToggleEdit(false);
                      }}
                    >
                      <IonIcon icon={close}></IonIcon>
                    </IonFabButton>
                  </IonFab>
                </>
              ) : (
                <IonFab className="fab-config">
                  <IonFabButton color={"medium"} onClick={handleAddRefeicao}>
                    <IonIcon icon={cog}></IonIcon>
                  </IonFabButton>
                  <IonFabList side="top">
                    <IonFabButton
                      color={"warning"}
                      onClick={() => setToggleEdit(true)}
                    >
                      <IonIcon color="light" icon={pencil}></IonIcon>
                    </IonFabButton>
                    <IonFabButton
                      onClick={() => resetRefeicoes()}
                      color={"danger"}
                    >
                      <IonIcon color="light" icon={trash}></IonIcon>
                    </IonFabButton>
                  </IonFabList>
                </IonFab>
              )}

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
                  <p>{totalCalorias}</p>
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
                        <IonItem
                          key={comida.id}
                          onClick={() => {
                            const updatedRefeicoes = refeicoesGeradas.map(
                              (ref: any) =>
                                ref.refeicao === refeicao.refeicao
                                  ? {
                                      ...ref,
                                      comidas: ref.comidas.map((com: any) =>
                                        com.id === comida.id
                                          ? {
                                              ...com,
                                              selecionado: !com.selecionado,
                                            }
                                          : com
                                      ),
                                    }
                                  : ref
                            );
                            setRefeicoesGeradas(updatedRefeicoes);
                          }}
                        >
                          {toggleEdit && (
                            <IonCheckbox
                              slot="start"
                              checked={comida.selecionado}
                            />
                          )}

                          <IonLabel>
                            <h2>{comida.nome}</h2>
                            {!toggleEdit && <p>Qntd: {comida.quantidade}g</p>}
                          </IonLabel>

                          {!toggleEdit && (
                            <div className="badge-container">
                              <IonBadge
                                className="badge-item"
                                color={"success"}
                              >
                                {comida.carboidrato}
                              </IonBadge>
                              <IonBadge className="badge-item">
                                {comida.proteina}
                              </IonBadge>
                              <IonBadge className="badge-item" color={"danger"}>
                                {comida.gordura}
                              </IonBadge>
                            </div>
                          )}
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

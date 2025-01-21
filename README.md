🥗 Nutriplaning - Projeto Integrador II
Este projeto foi desenvolvido para a disciplina de Projeto Integrador II. O objetivo é fornecer um aplicativo que monta refeições personalizadas com base nas necessidades e preferências do usuário, como:

Peso
Altura
Sexo
Plano alimentar
Alergias
Nível de atividade física

🚀 Como executar o projeto
1️⃣ Clone e configure a API
Acesse o repositório da API: https://github.com/Baldasar/api-nutriplaning
Siga as instruções do repositório para executar a API localmente.

2️⃣ Configure o front-end
Navegue até a pasta src/environments.

Abra o arquivo environment.ts.

Atualize o valor de apiUrl para o IP do seu computador onde a API está rodando, conforme o exemplo:

export const environment = {  
  production: false,  
  apiUrl: 'http://<SEU_IP>:<PORTA_DA_API>'  
};  

3️⃣ Execute o projeto

Instale as dependências:
npm install

Inicie o projeto:
ionic s

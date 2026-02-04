# Inclusion 

## Objetivo 

- Facilitar a comunicação e disseminação de informação pelo mundo. 

## Motivação 

- O Instagram hoje em dia tornou-se insuportável. Aquilo que inicialmente era suposto ser uma aplicação para facilitar a partilha de informação tornou-se numa aplicação principalmente dominada por bots, IA, falsa informação, ódio e discriminação. 

- Pretendemos alterar esse paradigma das redes sociais! 

- O nosso objetivo é misturar duas aplicações da Meta, o Threads com o Instagram. 

## Descrição 

- O nome da nossa app é Inclusion, dado que pretendemos promover a inclusão de todos os indivíduos e fomentar a comunicação e disseminação de informação. De modo a cumprir estes requisitos pretendemos que seja possível os utilizadores criarem posts, histórias (com duração de 24h) e tweets (cujo nome será alterado para não colidir com o Twitter). 

- Portanto vão haver 2 feeds, um para os tweets e outro para os posts. 

- Os utilizadores poderão comunicar entre si através de DMs (direct messages), tomando partido de websockets para comunicação em tempo real. 

- Teremos a privacidade dos utilizadores em mente e portanto a conta de cada utilizador pode ser privada ou pública. 

- Os utilizadores podem pedir amizade uns aos outros. Apenas utilizadores amigos podem ver o perfil de outros, em caso de conta privada. Caso a conta seja pública qualquer utilizador registado na plataforma tem acesso aos conteúdos publicados na conta. 

- Um utilizador tem de conseguir visualizar o seu perfil e o de outros. 

- Os utilizadores podem dar like em posts e tweets. 

- Os utilizadores podem comentar em posts e tweets. 

- Os utilizadores podem dar e remover like em comentários. 

- Os utilizadores podem remover like de posts e tweets. 

- Nos feeds, os posts ou tweets com mais interações devem aparecer em primeiro. 

- No contexto da aplicação definimos o número total de interacoes como interações = nºlikes + nºcomentários. 

- Os utilizadores poderão registar-se e autenticar-se na plataforma. 

## Sugestão de Tech stack 

### Backend
- Python3 tomando partido da framework Django Rest Framework. 

#### Justificação 
- Todos nós aprendemos Python3 na cadeira de Análise Numérica pelo que estamos familiarizados com a linguagem, para além disso a Django Rest Framework torna a criação de APIs muito ágil e dado que vamos utilizar SCRUM como método de desenvolvimento ágil acreditamos que o Tech stack deva refletir isso. Para além disso a framework é relativamente fácil de aprender e há inúmeros recursos disponíveis para aprendermos mais sobre a framework em questão. A framework tem uma excelente documentação. 

### Frontend

- Typescript tomando partido da framework React. 

#### Justificação
- Todos nós aprendemos React e Typescript na cadeira de Desenvolvimento de Aplicações para a Web portanto pensamos que faz todo o sentido utilizar esta tecnologia para desenvolver o frontend. Para além disso acreditamos também que React é uma escolha excelente dado que permite o desenvolvimento ágil do frontend, com incrementos por componentes, à medida que vamos desenvolvendo a aplicação. 

 

 

 

 
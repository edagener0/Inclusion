# Inclusion 

# Tabela de Conteúdos
- [Inclusion](#inclusion)
- [Tabela de Conteúdos](#tabela-de-conteúdos)
- [Acerca do projeto](#acerca-do-projeto)
  - [Introdução](#introdução)
  - [Objetivo](#objetivo)
  - [Tech Stack](#tech-stack)
- [Equipa](#equipa)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Requisitos](#requisitos)
  - [Requisitos Funcionais](#requisitos-funcionais)
  - [Requisitos de qualidade](#requisitos-de-qualidade)
  - [Restrições](#restrições)
- [Base de Dados](#base-de-dados)
  - [Modelo Entidade Relação](#modelo-entidade-relação)
  - [Modelo Relacional](#modelo-relacional)
- [Diagrama de arquitetura de alto nível de componentes](#diagrama-de-arquitetura-de-alto-nível-de-componentes)
- [Contexto](#contexto)
- [User Stories](#user-stories)

# Acerca do projeto

## Introdução
- **Inclusion** trata-se de uma aplicação cross-platform que mistura algumas funcionalidades do X, Threads e Instagram. 
- Esta iniciativa surgiu da vontade de procurar criar uma aplicação na qual os utilizadores possam usufruir dos seus direitos base de liberdade de expressão, irradicar o conteúdo produzido em massa por bots ou inteligência artificial e combater o ódio e a discriminação.
- Deste modo pretende-se alterar o paradigma das redes sociais, garantindo a inclusão de todos os utilizadores da nossa aplicação através da solidariedade.

## Objetivo
- O principal objetivo do nosso projeto é facilitar a comunicação e disseminação de informação pelo mundo.

## Tech Stack
- Se pretender obter uma lista mais aprofundada das dependências utilizadas no nosso projeto pode consultar [aqui]() 

# Equipa

- A aplicação foi desenvolvida por quatro elementos, que se dividiram em duas equipas: uma equipa de frontend e outra de backend.

## Backend
- edagener0: Martim Neves
- Monstercreft: Gabriel Vaz

## Frontend
- jethroTLOU: Vadym Lemnaru
- GuilhermeCarmo6: Guilherme Carmo

# Requisitos

## Requisitos Funcionais

RF1 – O utilizador pode registar-se na plataforma.
RF2 – O utilizador pode autenticar-se na plataforma.
RF3 – O utilizador pode criar um post.
RF4 – O utilizador pode eliminar um post.
RF5 – O utilizador pode dar like num post.
RF6 – O utilizador pode dar remover o like de um post.
RF7 – O utilizador pode criar um inc
RF8 – O utilizador pode eliminar um inc
RF9 – O utilizador pode dar like num inc
RF10 – O utilizador pode remover o like de um inc.
RF11 -  O utilizador pode postar histórias em formato de vídeo ou imagem.
RF12 – O utilizador pode eliminar histórias.
RF13 – As histórias têm uma duração de 24h, após a qual são apagadas.
RF14 – O utilizador pode dar like nas histórias.
RF15 – O utilizador pode remover o like das histórias.
RF16 – O utilizador pode postar notas.
RF17 – O utilizador pode editar notas.
RF18 – O utilizador pode eliminar notas.
RF19 – O utilizador pode dar like em notas.
RF20 – O utilizador pode remover o like das notas.
RF21 – As notas têm uma duração de 24h, após a qual são apagadas.
RF22 – Os utilizadores podem comentar nos posts.
RF23 – Os utilizadores podem comentar nos incs.
RF24 – Os utilizadores podem apagar os seus comentários.
RF25 – Os utilizadores podem dar like em comentários.
RF26 – Os utilizadores podem remover o like em comentários.
RF27 – Os criadores de um post ou inc podem remover qualquer comentário.
RF28 – Um utilizador pode tornar o seu perfil público.
RF29 – Um utilizador pode tornar o seu perfil privado.
RF30 – Por definição, o perfil de utilizador começa publico.
RF31 – O utilizador pode enviar um pedido de amizade a outro utilizador.
RF32 – O utilizador pode aceitar um pedido de amizade.
RF33 – O utilizador pode recusar um pedido de amizade.
RF34 – O utilizador pode remover um amigo.
RF35 – Os amigos podem ver os conteúdos de contas privadas.
RF36 – O utilizador pode enviar mensagem a outro utilizador.
RF37 – O utilizador pode editar as suas próprias mensagens.
RF38 – O utilizador pode eliminar as suas próprias mensagens.
RF-39 – O utilizador pode procurar por outros utilizadores
RF-40 – O utilizador pode ver o perfil de outros utilizador.
RF-41 - O utilizar pode comunicar com um chatbot através de uma prompt.
RF-42 - O utilizador pode jogar um jogo do wordle.

## Requisitos de qualidade


RQ1 – O frontend tem de ser dinâmico e adaptado a todas as plataformas.
RQ2 – Garantir a segurança dos dados do utilizador.
RQ3 – O frontend tem de ser intuitivo.
RQ4 – Garatir uma boa experiência de utilizador.

## Restrições

Restrições

RC1 – O backend tem de ser desenvolvido em Python3 com Django Rest Framework
RC2 – A autenticação tem de ser feita com cookies baseada em JSON Web Token (JWT)
RC3 – O frontend tem de ser desenvolvido em Typescript com React.

# Base de Dados

- De modo a conceber uma base de dados bem estruturada desenhou-se um modelo entidade relação, a partir do qual se fez o modelo relacional.

## Modelo Entidade Relação

![diagrama_bd_er](/docs/database/ER/ModeloEntidadeRelacao.png)

## Modelo Relacional
User(id, username, first_name, last_name, password, biography, picture, is_private, created_at)

UK(username)
NN(username)
NN(first_name)
NN(last_name)
NN(password)
NN(picture)
NN(is_private)
NN(created_at)

FriendRequest(from_user_id, to_user_id, status)

FK(from_user_id) → User
FK(to_user_id) → User
NN(status)

RI: status só pode ser Accepted, Rejected ou Pending

Friends(user_1, user_2)

FK(user_1) → User
FK(user_2) → User
RI: user_1.id < user_2.id
RI: user_1.id != user_2.idg


DirectMessage(id, sender, receiver)
FK(sender) → User
FK(receiver) -> User
NN(receiver)
NN(sender)


Content(id, created_at)

ShortFormContent(id)

FK(id) → Content

LongFormContent(id)
FK(id) → Content

Comments(id, content, long_form_content_id)
FK(long_form_content_id) → LongFormContent
NN(content)
NN(long_form_content)


Stories(id, file)

FK(id) → ShortFormContent
NN(file)

Notes(id, content)

NN(content)
FK(id) → ShortFormContent

Incs(id, content)

FK(id) → LongFormContent
NN(content)

Posts(id, file, description)

FK(id) → LongFormContent
NN(file)
NN(description)

RI: O file só pode ser um vídeo ou imagem.

WordleResult(user_id, wordle_id, guesses, status)
NN(guesses)
NN(status)
FK(user_id) → User
FK(wordle_id) → Wordle
RI: guesses >= 0
RI: Status só pode ser success ou failure.

Wordle(id, date, word)
NN(date)
NN(word)
FK(word) → Word

Word(id, text, length, difficulty)
NN(text)
NN(length)
NN(difficulty)
RI: Difficulty só pode ser easy, medium ou hard

# Diagrama de arquitetura de alto nível de componentes

![diagrama_arq_comp]()

# Contexto

- **Dominio**: Utilizador, histórias, notas, incs, posts,  comentários.

- **Uso**: Formulários para criar histórias, notas, posts, incs e comentários.

- **Tecnologia**: Hardware: Servidor com 1TB de armanezamento e UPS. Software: sistema operativo baseado em Linux, gestor de base de dados PostgreSQL, Python3 com Django Rest Framework para o backend, Typescript com React para o Frontend

- **Desenvolvimento**: Metodologia SCRUM, equipa de desenvolvimento de 4 pessoas e orçamento de 0€.

# User Stories

Épico A – Registo e Autenticação

US-A1 – Registo de conta de utilizador

Como utilizador, quero criar conta utilizando um username, primeiro nome, sobrenome e password.

Critérios de aceitação:

	Dado que todos os dados fornecidos são válidos o utilizador fica registado com sucesso na plataforma.

US-A2 – Autenticação do utilizador

Como utilizador, quero poder autenticar-me na plataforma, efetuando login com o username e password.

Critérios de aceitação:
	Dado que o utilizador existe e todos os dados fornecidos são válidos o utilizador fica autenticado com sucesso.


Épico B – Gestão de utilizadores

US-B1 – Listar utilizadores

Como utilizador, quero obter uma listagem de outros utilizadores paginada com um limite de 10 utilizadores por página, podendo filtrar por username, primeiro nome e sobrenome, na qual obtemos o username, primeiro nome, sobrenome e avatar para cada utilizador da lista.

Critérios de aceitação:
	Os filtros funcionam de acordo com o expectável.
	A paginação funciona de acordo com o expectável.

US-B2 – Detalhes de utilizador

Como utilizador, quero obter os detalhes acerca de um utilizador em específico. Os detalhes incluem o username, primeiro nome, sobrenome, biografia e avatar.

Critérios de aceitação:
	O utilizador existe e obtemos os seus detalhes.



Épico C – Gestão de Posts

US-C1 – Criação de Post
	Como utilizador quero criar um post com uma imagem ou vídeo e uma descrição.
	Critérios de aceitação:
		Se os dados submetidos forem válidos o post é criado com sucesso.
US-C2 – Eliminação de Post
	Como utilizador, dono de post, quero poder eliminar o respetivo post.
	Critérios de aceitação:
		Se for o dono do post o post é eliminado com sucesso.
US-C3 – Dar like em um Post
	Como utilizador quero poder dar like em um post.
	Critérios de aceitação:
		Se ainda não foi dado um like nesse post pelo respetivo utilizador, então o like é atribuido ao post.
US-C4 - Remover like de um Post
	Como utilizador quero poder remover o like de um post
	Critérios de aceitação:
		Se o utilizador deu like no post então consegue remover o like com sucesso.
US-C5 – Comentar num post
	Como utilizador quero poder comentar num post.
	Critérios de aceitação:
		Se a length do comentário for apropriada o comentário é criado com sucesso.
US-C6 – Remoção de comentários
	Enquanto utilizador criador de um post posso remover qualquer comentário.
	Critérios de aceitação:
		Se for o dono de um post posso remover qualquer comentário

Épico D – Gestão de Incs
US-D1 – Criação de um Inc
	Como utilizador quero conseguir criar um inc a partir de um conteúdo (long text)
	Critérios de aceitação:
		Se o conteúdo não exceder o limite de caracteres estabelecido para um inc então o inc é criado com sucesso.
US-D2 – Eliminação de um Inc
	Como utilizador quero conseguir eliminar um inc, se for o seu dono.
	Critérios de aceitação:
		Se for o dono do inc consigo eliminá-lo com sucesso.
US-D3 – Dar like em um Inc
	Como utilizador quero conseguir dar like num inc.
	Critérios de aceitação:
		Se o utilizador ainda não deu like no respetivo inc então pode dar like no inc.
US-D4 – Remover like de um Inc
	Como utilizador quero conseguir remover o like de um inc
	Critérios de aceitação:
		Se o utilizador deu like no inc então devo conseguir remover o like.

US-D5 – Comentar num inc
	Como utilizador quero poder comentar num inc.
	Critérios de aceitação:
		Se a length do comentário for apropriada o comentário é criado com sucesso.
US-D6 – Remoção de comentários
	Enquanto utilizador criador de um inc posso remover qualquer comentário.
	Critérios de aceitação:
		Se for o dono de um inc posso remover qualquer comentário
Épico E – Gestão de histórias

US-E1 – Criar uma história
	Como utilizador quero conseguir criar uma história a partir de um ficheiro de vídeo ou imagem.
	Critérios de aceitação:
		Se a extensão do ficheiro for válida a história é criada.

US-E2 – Eliminar histórias
	Como utilizador, dono de uma história, quero poder eliminar essa história voluntariamente
	Critérios de aceitação:
		Se for o dono da história, a história é eliminada.
US-E3 – Eliminação automática de histórias
	O sistema elimina a história automaticamente, 24h após a sua publicação.
	Critérios de aceitação:
		Verifica-se que 24h após a sua criação a história é eliminada.
US-E4 – Like numa história
	Como utilizador quero poder dar like numa história caso ainda não tenha dado like.
	Critérios de aceitação:
		Se o utilizador ainda não deu like na história, o like é associado à história.
US-E5 – Remover like de uma história
	Como utilizador quero poder remover o like da história caso tenha dado like previamente.
	Critérios de aceitação:
		Se o utilizador deu like na história, então pode remover o like da história.


Épico F – Gestão de Notas

US-F1 – Criar uma nota
	Como utilizador quero conseguir criar uma nota a partir de um conteúdo (short text).
	Critérios de aceitação:
		Se a length do conteúdo for apropriada a nota é criada.

US-F2 – Eliminar notas
	Como utilizador, dono de uma nota, quero poder eliminar essa nota voluntariamente
	Critérios de aceitação:
		Se for o dono da nota, a nota é eliminada.
US-F3 – Eliminação automática de notas
	O sistema elimina a nota automaticamente, 24h após a sua publicação.
	Critérios de aceitação:
		Verifica-se que 24h após a sua criação a nota é eliminada.
US-F4 – Like numa nota
	Como utilizador quero poder dar like numa nota caso ainda não tenha dado like.
	Critérios de aceitação:
		Se o utilizador ainda não deu like na nota, o like é associado à história.
US-F5 – Remover like de uma nota
	Como utilizador quero poder remover o like da nota caso tenha dado like previamente.
	Critérios de aceitação:
		Se o utilizador deu like na nota, então pode remover o like da história.
Épico G – Gestão de Amizades

US-G1 – Envio de pedido de amizade
	Um utilizador pode enviar um pedido de amizade a outro utilizador.
	Critérios de aceitação:
		Se o utilizador ainda não enviou o pedido de amizade então é enviado um pedido de amizade.

US-G2 – Aceitar um pedido de amizade
	Um utilizador que recebeu um pedido de amizade pode aceitar.
	Critérios de aceitação:
		O utilizador pode aceitar um pedido de amizade com status pending que tenha recebido, passando o estado do pedido a accepted.
US-G3 – Recusar um pedido de amizade
	Um utilizador que recebeu um pedido de amizade pode recusar.
	Critérios de aceitação:
		O utilizador pode rejeitar um pedido de amizade com status pending que tenha recebido, passando o estado do pedido a rejected.

US-G4 – Remover amigo
	Um utilizador pode remover outro utilizador da sua lista de amigos.
	Critérios de aceitação:
		O utilizador só pode remover um amigo se este pertencer à sua lista de amigos.
US-G5 – Listar amigos de um utilizador
	Um utilizador pode obter uma listagem dos amigos de outro utilizador.
	Critérios de aceitação:
		O utilizador consegue ver a lista de amigos do outro utilizador.




Épico H – Gestão de mensagens

US-H1 – Enviar mensagem
	Como utilizador quero poder enviar mensagem a outro utilizador.
	Critérios de aceitação:
		A mensagem do utilizador é enviada se a sua length for apropriada.

US-H2 – Editar mensagem
	Como utilizador quero poder enviar as mensagens que enviei a outro utilizador
	Critérios de aceitação:
		O utilizador apenas pode editar as ḿensagens que enviou.

US-H3 – Eliminar mensagem
	Como utilizador quero poder eliminar as mensagens que enviei a outro utilizador
	Critérios de aceitação:
		O utilizador apenas pode eliminar as mensagens que enviou para outro utilizador. 

Épico I – Gestão de feeds

US-I1 – Feed de post
	Como utilizador quero poder visualizar os posts dos meus amigos.
	Critérios de aceitação:
		Os posts demonstrados no feed são apenas dos amigos do utilizador.
US-I2 – Feed de incs
	Como utilizador quero poder visualizar os incs dos meus amigos
	Critérios de aceitação:
		Os incs demonstrados no feed são apenas dos amigos do utilizador.

Épico J – Gestão de Utilizadores

US-J1 – Update de perfil
	Enquanto utilizador quero poder dar update ao meu perfil, nomeadamente alterar a privacidade da conta, biografia, primeiro nome e último nome.
	Critérios de aceitação:
		O utilizador apenas pode dar update ao seu perfil.
		Os dados introduzidos têm de ser válidos para o update ocorrer.
US-J2 – Conta privada
	Enquanto utilizador se a minha conta for privada apenas os meus amigos podem visualizar o meu conteúdo.
	Critérios de aceitação:
		Garantir que quando a conta é privada apenas os amigos do utilizador conseguem visualizar o conteúdo da conta, apesar de todos conseguirem ver o seu perfil.

US-J3 – Conta pública
	Enquanto utilizador, se a minha conta for pública todos podem visualizar os meus conteúdos.
	Critérios de aceitação:
		Garantir que quando a conta é publica todos podem visualizar o conteúdo associado à conta.

US-J4 – Procura de utilizador
	Enquanto utilizador quero poder encontrar outros utilizadores, procurando simultâneamente pelo username, first name, last name e full name.
	Critérios de aceitação:
		Garantir que a procura de utilizadores devolve os utilizadores apropriados para um determinado input

US-J5 – Detalhes de utilizador
	Enquanto utilizador quero poder ver os detalhes de outro utilizador no seu perfil.
	Critérios de aceitação:
		Garantir que é possível ver os detalhes do utilizador no seu perfil em qualquer tipo de conta, seja privada ou pública.

Épico K – Wordle

US-K1 – Adivinhar uma palavra
	Enquanto utilizador quero poder adivinhar uma palavra.
	Critérios de aceitação:
		Garantir que o utilizador consegue adivinhar uma palavra com sucesso.
US-K2 – Criação de um wordle diário
	O sistema cria um wordle novo diariamente.
	Critérios de aceitação:
		Um novo wordle tem de ser criado todos os dias à meia noite.

Épico L – Chatbot

US-L1 – Envio de prompts
	Enquanto utilizador quero poder enviar prompts a um chatbot de Inteligência Artificial
	Critérios de aceitação:
		Obtém-se uma resposta válida da inteligência artificial, de acordo com aquilo que foi pedido.
US-L2 – Receber Resposta
	Enquanto utilizador quero poder receber respostas da inteligência artifical.
	Critérios de aceitação:
		A inteligência artificial consegue responder com sucesso às prompts do utilizador.
US-L3 – Persistência de histórico de mensagens.
	Enquanto utilizador quero poder visualizar todas as minhas outras mensagens com a inteligência artificial.
	Critérios de aceitação:
		Obtém-se um histórico de todos as mensagens trocadas com a inteligência artificial.
 

 

 

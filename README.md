﻿# API-Zero-ao-Junior
  
  Olá, essa API é minha solução para o desafio final proposto pelo curso Zero ao Júnior que realizei na Pingback! Espero atender as expectativas de acordo com o que foi pedido!

# Primeiros Passos

  Primeiramente você deve utilizar o comando ```npm install``` para instalar todas as dependências do projeto. O próximo passo é definir no arquivo ```config.json``` o banco de dados que você irá usar para que as rotas e os testes funcionem de forma correta. Após isso renomeie o arquivo ```.env.example``` para ".env" e defina as variáveis de ambiente de acordo com as suas chaves do Voice RSS e do Cloudinary. 
  
# Executando a API

  Para executar cada rota de forma correta, indico que utilize o Postman!
  
  Após executar a o aplicativo, utilize as rotas abaixo de acordo com o desejado:
  
  - ```POST /user/``` -> Criar um usuário.
  - ```GET /users/``` -> Obter todos os usuários (somente para usuários que são admin). Para que essa rota funcione, é necessário fazer login com um usuário admin na rota ```/auth``` passando o email e senha já cadastrados no banco de dados.
  - ```EDIT /user/:id/``` -> Editar usuário, apenas o próprio usuário usa esta rota. Para que essa rota funcione, é necessário fazer login com o próprio usuário na rota ```/auth``` passando o email e senha já cadastrados no banco de dados.

  - ```POST /text/``` -> Criar um objeto de texto.
  - ```PUT /text/:id/``` -> Editar um objeto de texto. Passe nos parâmetros o id do objeto de texto.
  - ```GET /text/:id/``` -> Obter objeto de texto. Passe nos parâmetros o id do objeto de texto.
  - ```GET /user/:id/texts/``` -> Obter todos os objetos de texto de um determinado usuário. Passe nos parâmetros o id do usuário que deseja obter os textos.
  - ```DELETE /text/:id/``` -> Excluir objeto de texto. Passe nos parâmetros o id do objeto de texto.

  - ```POST /text/:id/audio/``` -> Solicitar TTS. Passe nos parâmetros o id do texto que deseja converter em áudio.
  - ```GET /text/:id/audio/``` -> Obtenha o arquivo de áudio se já estiver convertido, caso contrário, deve executar o método POST. Passe nos parâmetros o id do texto que deseja obter o áudio.
  - ```PUT /text/:id/audio/``` -> Forçar nova conversão TTS. Passe nos parâmetros o id do texto que deseja atualizar o áudio.
 
# Testes

  Para executar os testes utilize o comando ```npm run test``` no terminal.
  
# Considerações Finais

  Por fim, agradeço a oportunidade que me foi dada, bem como pelo aprendizado que obtive em cada aula. O curso Zero ao Júnior, sem dúvidas, me proporcionou vários ensinamentos que levarei para minha vida profissional e carreira.
Com relação ao desafio final, considerei um teste díficil, mas com o qual aprendi muito, principalmente a ser persistente e nunca desistir. Por isso, estou muito feliz e satisfeito com o meu desempenho na resolução, principalmente por ter concluído o desafio. 
  
  Muito obrigado, Pingback!

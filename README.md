# Ficha online SINDPOL

Projeto estático em HTML, CSS e JavaScript para publicar na Vercel. O formulário preenche uma cópia do PDF oficial em `assets/ficha-original.pdf`. Não há servidor nem persistência de dados pessoais.

## Executar localmente

Execute `python -m http.server 8080` nesta pasta e abra `http://localhost:8080`. Abrir o arquivo HTML diretamente (`file://`) impede o navegador de carregar o PDF.

## Publicar

Importe esta pasta como projeto na Vercel, selecione “Other” e deixe o comando de build vazio. O diretório raiz contém `index.html`.

## WhatsApp

Em dispositivos com suporte a Web Share com arquivos, o botão abre o menu de compartilhamento com o PDF. Selecione WhatsApp e o número **+55 91 98164-3641**. No computador, baixe o PDF e anexe-o à conversa aberta pelo botão. Um link `wa.me` não envia anexos sozinho; envio automático exigiria WhatsApp Business Platform, servidor e credenciais do titular da conta.

O arquivo mantém intactos plano de tratamento e assinaturas. Os campos são gravados no layout original por coordenadas. A biblioteca `pdf-lib.min.js` está incluída no projeto para funcionar sem CDN.

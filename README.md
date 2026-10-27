# NDI Bridge Link Web — base de acesso remoto

Este repositório contém a primeira camada do **NDI Bridge Link**, um aplicativo separado do NDI Bridge local. Há dois componentes:

- `viewer/`: página estática que abre um link de transmissão e recebe o vídeo via WebRTC.
- `worker/`: Cloudflare Worker de sinalização. Ele só conecta publicador e espectador; não transporta vídeo nem armazena a tela.

## Hospedagem escolhida

O projeto foi preparado para **Cloudflare Pages** ligado a este repositório GitHub e para um **Cloudflare Worker**. O repositório pode ser público ou privado — o Cloudflare Pages consegue acessar ambos depois que a conta GitHub for autorizada.

Na criação do Pages, selecione `viewer` como diretório de saída e não use comando de build. Depois do deploy do Worker, substitua `YOUR-WORKER.workers.dev` em `viewer/app.js` pelo domínio WebSocket seguro (`wss://...`) informado pelo Cloudflare.

O plano gratuito é apropriado para validar a conexão P2P. Algumas redes corporativas, CGNAT e firewalls exigem um relay TURN para funcionar de forma confiável; esse relay não faz parte desta primeira fase.

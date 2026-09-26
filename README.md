# 🚌 Kombinado App

Bem-vindo ao aplicativo móvel do **Kombinado**, a comunidade universitária de caronas!  
Este é o front-end móvel construído com **React Native**, **Expo** e **NativeWind**.

## 🚀 Status do Projeto e Funcionalidades

O aplicativo possui uma arquitetura robusta e profissional, dividido em fluxos de **Autenticação**, **Passageiro** e **Motorista**, totalmente integrado com nossa API em `.NET 8`.

### 🛡️ Autenticação e Segurança
* **Armazenamento Criptografado**: Uso do `expo-secure-store` para guardar tokens (Access e Refresh) de forma inviolável no chaveiro do sistema operacional.
* **Auto-Refresh de Sessão**: Rotação invisível e automática de Refresh Tokens. Se o token de acesso expirar, o app consome a rota `/api/Auth/refresh` e renova a sessão em segundo plano, não interrompendo a experiência do usuário.
* **Route Guarding Reativo**: Controle de fluxo rígido baseado em estados com `Expo Router`. Impede acessos a páginas privadas sem login e redireciona o usuário de forma limpa.
* **Cliente HTTP Customizado**: Serviço centralizado (`api.ts`) que injeta automaticamente o token JWT nas requisições protegidas e lida com retentativas após *refresh* de token.

### 👤 Perfil e UX
* **Telas Premium e Responsivas**: Interface fluida desenvolvida com `NativeWind` (Tailwind CSS), abrangendo desde o Login e Cadastro até os *Dashboards* de caronas.
* **Tratamento de Dados**: Máscaras de entrada (como o número de WhatsApp) são aplicadas na interface e os dados são limpos antes de serem enviados para a API.
* **Feedback Resiliente e Tratamento de Erros**: O cliente de API está blindado contra erros catastróficos do servidor (como páginas 500 HTML) e exibe alertas ou notificações claras para o usuário em todas as interações.

### 🚗 Fluxo de Caronas (Passageiros e Motoristas)
* **Busca de Caronas**: Passageiros podem buscar caronas disponíveis (`Home`) filtrando por origem ou destino utilizando a barra de busca.
* **Solicitação de Vagas e Paradas**: Possibilidade de pedir carona enviando o local exato onde o passageiro deseja embarcar (`SuggestStopModal`).
* **Painel do Motorista**: Área exclusiva (`Motorista`) para o usuário visualizar e gerenciar as caronas que ele mesmo publicou.
* **Criação de Caronas**: Motoristas podem publicar novas rotas, definindo origem, destino, total de vagas disponíveis, preço e horário de saída (`CreateRideModal`).
* **Gestão de Solicitações (Aceitar/Recusar)**: Motoristas podem visualizar em tempo real quem solicitou vaga na sua carona e aprovar ou recusar o pedido, visualizando a parada sugerida (`RequestsModal`).
* **Acompanhamento de Status**: Passageiros acompanham o status dos seus pedidos (Pendente, Aceito, Rejeitado ou Cancelado) diretamente no painel.

## 🏗️ Arquitetura do Projeto

O projeto adota o padrão de **Custom Hooks** para abstrair a comunicação com a API, isolando a lógica de acesso a dados e gerenciamento de estado da camada de interface (UI).

* `/src/app`: Rotas da aplicação organizadas via Expo Router (divididas em grupos `(auth)` e `(private)`).
* `/src/components`: Componentes reutilizáveis de interface. Divididos em componentes genéricos e de domínio de negócio (`/feature`).
* `/src/hooks`: Ganchos customizados de consumo de API (ex: `useCreateRide`, `useProfile`, `useDriverRides`, `useAvailableRides`), garantindo que os componentes visuais permaneçam limpos.
* `/services`: Serviços base de infraestrutura, como o cliente HTTP (`api.ts`) e gerenciamento de armazenamento seguro (`storage.ts`).

## 🛠️ Tecnologias

* [Expo](https://expo.dev) SDK 54
* [React Native](https://reactnative.dev)
* [NativeWind](https://www.nativewind.dev/) (Integração com Tailwind CSS)
* [Expo Router](https://docs.expo.dev/router/introduction) (Roteamento moderno baseado em arquivos)
* [Lucide React Native](https://lucide.dev/) (Ícones modernos)
* [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

## ⚙️ Como Rodar o Projeto (com a API Local)

Para que o aplicativo mobile consiga se comunicar com a API rodando em sua máquina, é estritamente necessário configurar as portas de rede, visto que simuladores e celulares rodam em redes diferentes da sua máquina.

### Passo 1: Subir a API (repositório `kombinado-api`)
O app precisa acessar a API a partir de **outra rede** (o emulador ou o celular), então a API tem que escutar em todas as interfaces de rede, e não apenas no `localhost`.

**Opção A — Docker Compose (recomendado):** na raiz do repositório `kombinado-api` (com o `.env` configurado conforme o README de lá), rode:
```bash
docker compose up -d --build
```
Isso sobe o banco e a API, aplica as migrações automaticamente e deixa a API disponível na **porta `8080`**, já acessível pela rede.

**Opção B — `dotnet run` (para depurar a API):** com o banco já rodando, entre na pasta `Kombinado.Api` e inicie a API forçando uma **porta HTTP** em todas as interfaces:
```bash
dotnet run --launch-profile http --urls "http://0.0.0.0:5198"
```
Nesse caso, use a porta **`5198`** no passo seguinte.

> **⚠️ Aviso Importante (Android):** Use sempre `HTTP` localmente. O cliente nativo do Android recusa conexões `HTTPS` com certificados locais de desenvolvimento autoassinados, o que causará erros de *Network Request Failed* no aplicativo.

### Passo 2: Configurar o Endereço no Aplicativo (Arquivo `.env`)
Na raiz deste projeto Expo, crie um arquivo chamado `.env` (ou copie e renomeie o `.env.example`).
O endereço depende de onde o app está rodando (os exemplos usam a porta `8080` do Docker; troque para `5198` se estiver usando a Opção B):

* **Emulador Android**: Use o IP **`10.0.2.2`** (este é o gateway interno do emulador que aponta para o localhost do seu computador).
  ```env
  EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
  ```
* **Celular Físico / Expo Go via Wi-Fi**: Use o IP real da sua máquina na rede local (ex: `192.168.X.YZ`).
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.X.YZ:8080
  ```

### Passo 3: Rodar o Aplicativo
Após configurar o `.env`, instale as dependências e inicie o servidor do Expo limpando o cache para garantir que a variável de ambiente foi lida:

```bash
npm install
npx expo start -c
```

No terminal, pressione **`a`** para abrir no Emulador Android, ou escaneie o QR Code usando o aplicativo Expo Go no seu celular Android!

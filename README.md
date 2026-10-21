# 🚌 Kombinado App

Bem-vindo ao aplicativo móvel do **Kombinado**, a comunidade universitária de caronas!  
Este é o front-end móvel construído com **React Native**, **Expo** e **NativeWind**.

## 🚀 Status do Projeto e Funcionalidades

O aplicativo possui uma arquitetura robusta e profissional, dividido em fluxos de **Autenticação**, **Passageiro** e **Motorista**, totalmente integrado com nossa API em `.NET 8` (requer a **API v1.3.0** ou mais recente).

### 🛡️ Autenticação e Segurança
* **Armazenamento Criptografado**: Uso do `expo-secure-store` para guardar tokens (Access e Refresh) de forma inviolável no chaveiro do sistema operacional.
* **Auto-Refresh de Sessão**: Rotação invisível e automática de Refresh Tokens. Se o token de acesso expirar, o app consome a rota `/api/Auth/refresh` e renova a sessão em segundo plano, não interrompendo a experiência do usuário. Se a renovação falhar, o usuário volta para o login sem nenhuma tela travada.
* **Route Guarding Reativo**: Controle de fluxo rígido baseado em estados com `Expo Router`. Impede acessos a páginas privadas sem login e redireciona o usuário de forma limpa.
* **Cliente HTTP Customizado**: Serviço centralizado (`api.ts`) que injeta automaticamente o token JWT nas requisições protegidas, lida com retentativas após *refresh* de token e encerra requisições que passam de 30 segundos.

### 👤 Perfil e UX
* **Telas Premium e Responsivas**: Interface fluida desenvolvida com `NativeWind` (Tailwind CSS), abrangendo desde o Login e Cadastro até os *Dashboards* de caronas.
* **Edição de Perfil**: O usuário atualiza nome, WhatsApp e curso; motoristas também atualizam modelo, cor, placa e vagas do veículo.
* **Tratamento de Dados**: Máscaras de entrada (como o número de WhatsApp) são aplicadas na interface e os dados são limpos antes de serem enviados para a API.
* **Estados de Carregamento, Erro e Vazio**: Todas as telas usam os mesmos componentes (`LoadingState`, `ErrorState` com "Tentar novamente", `EmptyState` e `ErrorBanner`), exibindo as mensagens da API em português.
* **Formulários Resilientes**: Em caso de erro, login, cadastro e criação de carona mantêm os dados digitados.

### 🚗 Fluxo de Caronas (Passageiros e Motoristas)
* **Busca de Caronas**: Passageiros podem buscar caronas disponíveis (`Home`) filtrando por origem ou destino utilizando a barra de busca. O card mostra o nome do motorista, e caronas já solicitadas não aparecem no feed.
* **Destino no Google Maps**: O destino da carona abre direto no Google Maps.
* **Solicitação de Vagas e Paradas**: Possibilidade de pedir carona enviando o local exato onde o passageiro deseja embarcar (`SuggestStopModal`).
* **Painel do Motorista**: Área exclusiva (`Motorista`) para o usuário visualizar e gerenciar as caronas que ele mesmo publicou.
* **Criação de Caronas**: Motoristas podem publicar novas rotas, definindo origem, destino, horário de saída e vagas, limitadas à capacidade do veículo informada no cadastro (1 a 8) (`CreateRideModal`).
* **Gestão de Solicitações (Aceitar/Recusar)**: Motoristas podem visualizar em tempo real quem solicitou vaga na sua carona e aprovar ou recusar o pedido, visualizando a parada sugerida (`RequestsModal`).
* **Acompanhamento de Status**: Passageiros acompanham o status dos seus pedidos (Pendente, Aceita ou Negada) diretamente no painel. Ao cancelar um pedido, ele sai da lista e a carona volta para o feed.
* **Contato por WhatsApp**: Após o aceite, passageiro e motorista podem conversar pelo WhatsApp com um toque.

## 🏗️ Arquitetura do Projeto

O projeto adota o padrão de **Custom Hooks** para abstrair a comunicação com a API, isolando a lógica de acesso a dados e gerenciamento de estado da camada de interface (UI).

* `/src/app`: Rotas da aplicação organizadas via Expo Router (divididas em grupos `(auth)` e `(private)`).
* `/src/components`: Componentes reutilizáveis de interface. Divididos em componentes genéricos (`/ui`) e de domínio de negócio (`/feature`).
* `/src/hooks`: Ganchos customizados de consumo de API (ex: `useCreateRide`, `useProfile`, `useDriverRides`, `useAvailableRides`), garantindo que os componentes visuais permaneçam limpos.
* `/src/context`: Contexto de autenticação (`AuthProvider`), com a sessão e os dados do usuário logado.
* `/services`: Serviços base de infraestrutura, como o cliente HTTP (`api.ts`) e gerenciamento de armazenamento seguro (`storage.ts`).

## 🛠️ Tecnologias

* [Expo](https://expo.dev) SDK 57
* [React Native](https://reactnative.dev) 0.86
* [NativeWind](https://www.nativewind.dev/) (Integração com Tailwind CSS)
* [Expo Router](https://docs.expo.dev/router/introduction) (Roteamento moderno baseado em arquivos)
* [Lucide React Native](https://lucide.dev/) (Ícones modernos)
* [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

## 📋 Pré-requisitos

* **Node.js** `20.19.4` ou mais recente, `22.13` ou mais recente, ou `24.3` ou mais recente (exigência do React Native 0.86). Confira com `node -v`.
* **Expo Go** atualizado no celular, compatível com o **SDK 57**. Se o Expo Go disser *"Project is incompatible with this version of Expo Go"*, atualize o app pela loja.
* **Docker** (apenas se for usar a API local).
* Celular e computador na **mesma rede Wi-Fi** (ou use o modo túnel, veja abaixo).

---

## ⚙️ Como Rodar o Projeto

O app pode usar a **API publicada no Azure** (mais simples, ideal para demonstrações) ou a **API rodando na sua máquina** (para desenvolver as duas partes juntas).

### Opção 1: Usar a API do Azure
Na raiz deste projeto, crie um arquivo `.env` (ou copie e renomeie o `.env.example`) com a URL da API publicada:
```env
EXPO_PUBLIC_API_URL=https://<sua-api>.azurewebsites.net
```
Depois siga para o [Passo 3](#passo-3-rodar-o-aplicativo).

### Opção 2: Usar a API Local
Para que o aplicativo mobile consiga se comunicar com a API rodando em sua máquina, é estritamente necessário configurar as portas de rede, visto que simuladores e celulares rodam em redes diferentes da sua máquina.

#### Passo 1: Subir a API (repositório `kombinado-api`)
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

#### Passo 2: Configurar o Endereço no Aplicativo (Arquivo `.env`)
Na raiz deste projeto Expo, crie um arquivo chamado `.env` (ou copie e renomeie o `.env.example`).
O endereço depende de onde o app está rodando (os exemplos usam a porta `8080` do Docker; troque para `5198` se estiver usando a Opção B):

* **Emulador Android**: Use o IP **`10.0.2.2`** (este é o gateway interno do emulador que aponta para o localhost do seu computador).
  ```env
  EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
  ```
* **Celular Físico / Expo Go via Wi-Fi**: Use o IP real da sua máquina na rede local (ex: `192.168.X.YZ`). No Linux, descubra com `ip -4 addr` (ou `hostname -I`).
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.X.YZ:8080
  ```

### Passo 3: Rodar o Aplicativo
Após configurar o `.env`, instale as dependências e inicie o servidor do Expo limpando o cache para garantir que a variável de ambiente foi lida:

```bash
npm install
npx expo start -c
```

No terminal, pressione **`a`** para abrir no Emulador Android, ou escaneie o QR Code usando o aplicativo Expo Go no seu celular!

> Sempre que alterar o `.env`, pare o Expo e rode de novo com `-c`. Sem isso, o app continua usando o endereço antigo.

#### Firewall (Linux com `ufw`)
Se o celular não conseguir abrir o projeto pelo QR Code, o firewall pode estar bloqueando o servidor do Expo (porta `8081`). Libere a porta apenas para a sua rede local (troque pela faixa da sua rede):
```bash
sudo ufw allow from 192.168.X.0/24 to any port 8081 proto tcp
```
Se usar a API local com `dotnet run` (Opção B), libere também a porta `5198` da mesma forma. A porta `8080` do Docker não precisa: o Docker já libera as portas que publica.

**Alternativa sem mexer no firewall:** rode em modo túnel (mais lento, mas funciona até em redes diferentes):
```bash
npx expo start -c --tunnel
```

---

## 🎬 Modo Demonstração (sem o debug visual)

Para apresentar o app sem os avisos amarelos/vermelhos do **LogBox** e sem as ferramentas de desenvolvimento, rode o Expo em modo produção:

```bash
npx expo start -c --no-dev --minify
```

* O app fica mais rápido e se comporta como a versão final.
* Nesse modo **não há recarregamento automático** ao salvar arquivos. Para voltar a desenvolver, pare o Expo e rode `npx expo start -c` de novo.

---

## ✅ Verificação do Código

Antes de abrir um PR, rode:
```bash
npm run lint
npx tsc --noEmit
```

---

## 🧯 Problemas Comuns

| Sintoma | Solução |
|---|---|
| *"Project is incompatible with this version of Expo Go"* | Atualize o Expo Go pela loja (o projeto usa o SDK 57). |
| O celular continua mostrando código antigo | Rode `npx expo start -c`. Se persistir, apague os dados do app Expo Go (Configurações → Apps → Expo Go → Armazenamento → Limpar dados). |
| *Network request failed* | Confira o `EXPO_PUBLIC_API_URL`: use `HTTP` na API local, o IP correto da máquina e a porta certa (`8080` no Docker, `5198` no `dotnet run`). Depois rode com `-c`. |
| O QR Code não abre o projeto | Confira se celular e computador estão na mesma Wi-Fi, libere a porta `8081` no firewall ou use `--tunnel`. |

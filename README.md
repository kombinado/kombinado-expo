# 🚌 Kombinado App

Bem-vindo ao aplicativo móvel do **Kombinado**, a comunidade universitária de caronas!  
Este é o front-end móvel construído com **React Native** e **Expo**.

## 🚀 Status do Projeto e Funcionalidades

Atualmente, o aplicativo possui uma arquitetura robusta e profissional de **Autenticação**, totalmente integrada com nossa API em `.NET 8`.

### Funcionalidades Concluídas:
* **Telas Premium**: Interface fluida usando `NativeWind` para as telas de Login, Cadastro e Perfil.
* **Comunicação Segura**: Cliente HTTP customizado (`fetch`) que injeta automaticamente o token JWT nas requisições protegidas.
* **Auto-Refresh de Sessão**: Rotação invisível e automática de Refresh Tokens. Se o seu token de acesso expirar, o app consome a rota `/api/Auth/refresh` e renova a sessão em segundo plano, não interrompendo a experiência do usuário.
* **Armazenamento Criptografado**: Uso do `expo-secure-store` para guardar os tokens e os dados vitais do usuário de forma inviolável no chaveiro do sistema operacional.
* **Route Guarding reativo**: Controle de fluxo rígido baseado em estados, impedindo acessos a páginas privadas sem login e redirecionando o usuário de forma limpa.
* **Tratamento Resiliente de Erros**: O cliente de API está blindado contra erros catastróficos do servidor (como páginas 500 HTML) e exibe notificações localizadas nos formulários.

## 🛠️ Tecnologias
* [Expo](https://expo.dev) SDK 54
* [React Native](https://reactnative.dev)
* [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
* [Expo Router](https://docs.expo.dev/router/introduction) (Roteamento moderno baseado em arquivos)
* [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

## ⚙️ Como Rodar o Projeto (com a API Local)

Para que o aplicativo mobile consiga se comunicar com a API rodando em sua máquina, é estritamente necessário configurar as portas de rede, visto que simuladores e celulares rodam em redes diferentes da sua máquina.

### Passo 1: Iniciar a API .NET liberando acesso de rede
Por padrão, a API .NET 8 aceita apenas conexões do próprio `localhost`. Para que o emulador Android ou seu celular físico consigam acessar a API de fora, você deve instruir o `.NET` a escutar em **todas as interfaces de rede (`0.0.0.0`)**.

Abra o terminal na pasta do repositório da sua API (`Kombinado.Api`) e rode o comando de inicialização forçando uma **porta HTTP** (ex: `5198`):
```bash
dotnet run --urls "http://0.0.0.0:5198"
```
> **⚠️ Aviso Importante (Android):** Dê preferência a testar via porta `HTTP` não-segura localmente. O cliente nativo do Android recusa conexões `HTTPS` com certificados locais de desenvolvimento autoassinados, o que causará erros de *Network Request Failed* no aplicativo.

### Passo 2: Configurar o Endereço no Aplicativo (Arquivo `.env`)
Na raiz deste projeto Expo, crie um arquivo chamado `.env` (ou copie e renomeie o `.env.example`).
O endereço que você colocará dependerá de onde o app está rodando:

* **Emulador Android**: Use o IP **`[IP_ADDRESS]`** (este é o gateway interno do emulador que aponta para o localhost do seu computador).
  ```env
  EXPO_PUBLIC_API_URL=http://[IP_ADDRESS]:5198
  ```
* **Celular Físico / Expo Go via Wi-Fi**: Use o IP real da sua máquina na rede local (ex: `[IP_ADDRESS]`).
  ```env
  EXPO_PUBLIC_API_URL=http://[IP_ADDRESS]:5198
  ```

### Passo 3: Rodar o Aplicativo
Após configurar o `.env`, instale as dependências e inicie o servidor do Expo limpando o cache para garantir que a variável de ambiente foi lida:

```bash
npm install
npx expo start -c
```

No terminal, pressione **`a`** para abrir no Emulador Android, ou escaneie o QR Code usando o aplicativo Expo Go no seu celular Android!

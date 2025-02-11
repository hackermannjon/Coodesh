# DictionaryApp

## Descrição

Aplicativo móvel para listagem e gerenciamento de palavras em inglês, utilizando a API Free Dictionary API. O projeto implementa conceitos modernos de arquitetura de software, incluindo Clean Architecture e Redux Toolkit para gerenciamento de estado.

## Por que Expo?

Escolhemos o **Expo** para este projeto devido à sua facilidade de configuração, velocidade no desenvolvimento e escopo do projeto. Algumas vantagens incluem:

- **Rápida inicialização** sem configuração manual do ambiente nativo.
- **Expo Go** permite testar o app instantaneamente sem recompilação completa.
- **APIs integradas** para armazenamento local (**AsyncStorage**), gestão de estado (**Redux Toolkit**) e manipulação de áudio (**expo-av**).
- **Menos problemas com Gradle/Xcode**, tornando o fluxo mais ágil.

## Tecnologias Utilizadas

### **Frontend**

- React Native via Expo
- Redux Toolkit
- Styled Components
- React Navigation

### **Backend e Banco de Dados**

- Firebase (para favoritos e histórico)
- AsyncStorage (para favoritos e histórico, caso o usuário não queira se autenticar)

## Como Instalar e Usar

1. Clone o repositório:

   ```sh
   git clone https://github.com/hackermannjon/Coodesh.git
   cd DictionaryApp
   ```

2. Instale as dependências:

   ```sh
   npm install  # ou yarn install
   ```

3. Execute o projeto no Expo:
   ```sh
   npx expo start
   ```

## Estrutura do Projeto

```
/app
| -- _layout          # Provider, renderização do Menu e rotas iniciais
| -- index            # rota default do expo, não utilizado
| -- routes           # rotas que importam e renderição screens
|
/src
|-- api/              # Comunicação com a API externa
|-- components/       # Componentes reutilizáveis
|-- screens/          # Telas (HomeScreen, DetailsScreen)
|-- store/            # Estado global (Redux Toolkit)
|-- theme/            # Configuração de tema e estilos globais
|-- App.tsx           # Componente principal
```

## Challenge by Coodesh

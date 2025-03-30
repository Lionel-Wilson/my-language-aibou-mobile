# My Language Aibou Mobile App
Frontend for the 'My Language Aibou' mobile app

## How to run

### Prerequisites

- Docker installed on your machine.
- Git installed on your machine.
- Node JS installed
- npm installed.

### How to run the whole application

1. Clone the API repository - https://github.com/Lionel-Wilson/My-Language-Aibou-API
2. Follow its README.md instructions on how to get it running locally.
3. Clone this mobile frontend repository
4. Create a .env file at the root of this repository and paste the following variable in it and save.
```
EXPO_PUBLIC_API_URL=http://localhost:8080
```
5. Open a terminal in the repository and run the following commands. Make sure you're in the root of the repository:

```
npm install
npm install -g expo-cli  
npx expo start
```


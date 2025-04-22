# My Language Aibou Mobile 
> Created a language studying tool that utilises OpenAi's API.


## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [How to run](#how-to-run)
* [Project Status](#project-status)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)

## General Information
- This is a mobile application that allows users to paste in a sentence in a foreign language they're learning and get an explantion of the grammar and words used in their native language. 
- Originally made this to increase the efficiency of my personal Japanese language study. So rather than constantly writing out prompts to Chat GPT asking it to explain the meaning of a sentence, I made a wrapper that did this for me.

## Technologies Used
- React Native
- Typescript
- Golang
- OpenAI APIs

## Features
- A 'Sentence Analyser' that provides an explanation of the provided sentences meaning. Breaks down the meaning of each word and grammar structure used in the sentence and shows why it means what it means.
- 'Sentence Correction' that corrects sentences in any language and tells you why it's incorrect in your native language.
- A Dictionary that defines, provides example sentences, synonyms and the history of the word provided.


## Screenshots

<img src="https://github.com/user-attachments/assets/fc790cc6-7328-487a-a839-63873366f43b" width="300" />
<img src="https://github.com/user-attachments/assets/6ebb025b-9f7c-410d-bda2-9e187edda730" width="300" />
<img src="https://github.com/user-attachments/assets/a90f9e8d-9fbd-4e97-a926-cfc7a56225d3" width="300" />
<img src="https://github.com/user-attachments/assets/0b738ae6-b6c5-4d58-9b77-908a2dbe2c8f" width="300" />
<img src="https://github.com/user-attachments/assets/7c33a5bd-4354-4747-9abb-cc54915acec0" width="300" />
<img src="https://github.com/user-attachments/assets/6e52f3de-84ac-4d15-a861-c51937b0f27e" width="300" />



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

## Project Status
Project is: _In Progress_

## Acknowledgements
- I would like to thank first and foremost Jesus Christ my Lord and saviour for
getting me this far and keeping me at peace.

## Contact
Created by [Lionel Wilson](https://github.com/Lionel-Wilson) - feel free to contact me!

# Aptos Developers Portal with AI Assistant

This project integrates document retrieval, a FastAPI-based LLM assistant, and a Next.js frontend to create an enhanced developer experience for Aptos. The application mimics the Aptos.dev UI while providing an additional interactive AI assistance feature.

---

## Overview

The project is composed of three main parts:

1. **Document Vector Store Creation**
   - **File:** `vector_store.py`
   - **Purpose:**  
     This script scrapes Aptos.dev documentation (starting from [Get Started](https://aptos.dev/en/build/get-started) and related pages) and converts the content into LangChain Document objects. It then creates a FAISS vector store (saved as `aptos_vector_store`) using Azure OpenAI embeddings (or optionally Sentence Transformer embeddings) to support retrieval augmented generation (RAG).

2. **FastAPI Retrieval and LLM Processing**
   - **File:** `fastapi_retrieval.py`
   - **Purpose:**  
     This FastAPI server loads the pre-built vector store and exposes an API endpoint (`/chat_endpoint`) that:
     - Performs a similarity search against the vector store when a user query is received.
     - For each matching document, conducts 1st level scraping (retrieving updated content, headings, links, etc.) to enrich the context.
     - Constructs a prompt that blends the user query and the retrieved content.
     - Uses a HuggingFace-based LLM (via `ChatHuggingFace` and `HuggingFaceEndpoint`) to generate a friendly, Markdown-formatted response.
     - Returns the LLM response along with any relevant scraped URLs for display on the frontend.

3. **Next.js Frontend**
   - **Location:** Inside the `app` folder (built with TypeScript)
   - **Key Files:**
     - **API Endpoint:** `chatbot/app/api/chat/route.ts`  
       Forwards user queries to the FastAPI server and relays responses back to the frontend.
     - **Navigation & UI:**  
       The frontend is styled to resemble the Aptos.dev website. An additional Aptos AI button is integrated into the main navigation ([`ClientNav.tsx`](chatbot/app/components/ClientNav.tsx)). Clicking the button opens a modal ([`AptosAIModal.tsx`](chatbot/app/components/AptosAIModal.tsx)) that handles the conversation with the LLM.

---

## Integration with Aptos.dev

To integrate this solution with the actual Aptos.dev webpage:
- **Navigation Bar Update:**  
  Add the Aptos AI button to the main navigation bar.
- **Aptos AI Modal:**  
  Create a modal component (as demonstrated in `AptosAIModal.tsx`) to handle user queries. This modal should fetch LLM responses via an API handler that calls the FastAPI server (`/chat_endpoint`).

This integration allows developers to receive interactive, contextual assistance directly on the Aptos documentation site.

---

## Setup Instructions

### Python Environment Setup

0. **Configure HuggingFace Access Token:**  
   Before proceeding, ensure you have a `.env` file with your HuggingFace access token. Add your token to the file by setting the environment variable `HF_ACCESS_TOKEN`. Also, verify that your token has the necessary permissions from HuggingFace to access the Mistral repository for the model we are using.

1. **Python Version:**  
   Ensure you are using **Python 3.9.21**.

2. **Install Required Packages:**
   ```bash
   pip install -r python_requirements.txt
   ```

3. **Create the Document Vector Store:**
   # Run the following command to create the document vector store
   ```bash
   python vector_store.py
   ```
   Note: Creating a new vector store can take up to 15 minutes. Please be patient as the script scrapes Aptos documentation and builds the local FAISS vector store (`aptos_vector_store`).

4. **Start the FastAPI Server:**
   # Run the following command to start the FastAPI server
   ```bash
   fastapi dev fastapi_retrieval.py
   ```
   The FastAPI server will handle retrieval and LLM processing on `http://localhost:8000`.

---

### Node (Next.js) Environment Setup

1. **Install Node Dependencies:**
   Run the following commands in your project's root directory:
   ```bash
   npm install @langchain/community @langchain/core @huggingface/inference@2
   npm install langchain
   npm install
   ```
2. **Start the Next.js Application:**
   # Navigate to the chatbot directory and run the Next.js application
   ```bash
   cd chatbot
   npm run dev
   ```
   The Next.js app will be available at `http://localhost:3000`.

---

## How the Application Works

1. **Vector Store Creation:**
   - The `create_vector_store.ipynb` notebook scrapes the Aptos documentation.
   - Document content is converted to LangChain Document objects and then split into manageable chunks for better vector embedding quality.
   - A FAISS vector store is created using Azure OpenAI (or Sentence Transformer) embeddings and saved locally as `aptos_vector_store`.

2. **FastAPI Retrieval & LLM Processing:**
   - The FastAPI server (`fastapi_retrieval.py`) loads the `aptos_vector_store` and exposes a `/chat_endpoint`.
   - When a query is submitted, it searches for relevant documents using similarity search.
   - It conducts additional scraping on the retrieved source URLs for dynamic content.
   - A combined prompt is built (including retrieved data) and sent to the LLM backend (HuggingFace endpoint) to generate a Markdown-formatted, friendly response.
   - The response, as well as any scraped URLs, are sent back to the frontend.

3. **Next.js Frontend Functionality:**
   - The UI, built using TypeScript and TailwindCSS, mirrors the design of Aptos.dev.
   - The API route (`chatbot/app/api/chat/route.ts`) bridges requests from the frontend to the FastAPI server.
   - The navigation bar includes an Aptos AI button (see `ClientNav.tsx`) that opens the modal (`AptosAIModal.tsx`) for interactive LLM conversation.

4. **Aptos AI Chat Feature:**
   - Users can click the Aptos AI button in the navigation.
   - The modal allows users to enter queries and view responses enhanced with Markdown formatting and emojis for a friendly, casual conversation.

---

## Limitations & Future Work

- **Chat History:**  
  A persistent chat history module was not implemented. Since the LLM processes dynamically retrieved content (RAG), including extensive chat history may cause context length overflow. This feature could be considered for implementations with larger context window models or by using paid models.

- **Scalability & Error Handling:**  
  Future improvements include better error handling for scraping failures, asynchronous processing enhancements, and further integration refinements.

---

## Conclusion

This project presents a full-stack solution that combines document retrieval, LLM-powered responses, and a modern Next.js user interface. With its integration potential into the Aptos.dev platform, it offers an innovative way to assist developers in navigating and understanding Aptos documentation through conversational AI.

Happy coding! 🚀💻😊
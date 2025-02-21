from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel
from langchain.vectorstores import FAISS
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_community.llms import HuggingFaceEndpoint
from langchain_community.chat_models import ChatHuggingFace
import os
import dotenv
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urlunparse

"""
FastAPI application for chat-based document retrieval and response generation.
This module implements a REST API that:
1. Accepts user queries
2. Retrieves relevant documents using FAISS vector store
3. Scrapes referenced URLs for additional context
4. Generates responses using HuggingFace's Mixtral model
"""

_ = dotenv.load_dotenv(dotenv.find_dotenv())

class ChatRequest(BaseModel):
    """
    Pydantic model for chat request validation.
    
    Attributes:
        query (str): The user's input query
    """
    query: str

# Initialize embeddings model
embeddings = SentenceTransformerEmbeddings(model_name="multi-qa-MiniLM-L6-cos-v1")

app = FastAPI()

# Load vector store
vector_store = FAISS.load_local("aptos_vector_store", embeddings, allow_dangerous_deserialization=True)

# Initialize HuggingFace endpoint with API token from environment
hf_endpoint = HuggingFaceEndpoint(
    repo_id="mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingfacehub_api_token=os.getenv("HF_ACCESS_TOKEN")
)

chat_hf = ChatHuggingFace(llm=hf_endpoint)

@app.post("/chat_endpoint")
async def chat_endpoint(request: ChatRequest):
    """
    Process chat requests and generate responses.
    
    Args:
        request (ChatRequest): The chat request containing the user query
        
    Returns:
        dict: Contains the generated response and list of scraped URLs
        
    Raises:
        HTTPException: If there's an error processing the request
    """
    try:
        query = request.query
        relevant_docs = vector_store.similarity_search(query, k=3)
        output_string = ""
        scraped_urls = []
        
        # Process each document found by vector search
        for doc in relevant_docs:
            source_url = doc.metadata.get("source")
            if source_url:
                truncated_url = source_url
                doc.metadata["truncated_source"] = truncated_url
                scraped_urls.append(truncated_url)

                # Perform 1st level scraping on the truncated URL
                try:
                    response = requests.get(truncated_url)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, "html.parser")
                        # Extract only essential information
                        title = soup.title.get_text(strip=True) if soup.title else ""
                        
                        # Get main headings only (h1 and h2)
                        headings = []
                        for level in range(1, 3):
                            heading_tags = soup.find_all(f'h{level}')
                            headings.extend([tag.get_text(strip=True) for tag in heading_tags])
                        
                        # Get a shorter version of the content
                        main_content = soup.find('main') or soup.find('article') or soup.find('body')
                        page_text = main_content.get_text(separator="\n", strip=True)[:1000] if main_content else ""
                        
                        # Store minimal scraped data
                        scraped_data = {
                            "URL": truncated_url,
                            "Title": title,
                            "Headings": headings[:5],  # Limit to first 5 headings
                            "Summary": page_text,  # Using truncated content
                        }
                    else:
                        scraped_data = {"error": f"Failed to retrieve page"}
                except Exception as scrape_err:
                    scraped_data = {"error": str(scrape_err)}
                
                # Include the scraped data within the document's metadata
                output_string += str(scraped_data)  # Limit the size of each document

        # Format the scraped URLs into a comma-separated string
        urls_str = ", ".join(scraped_urls)

        prompt = f"""User Query: {query}\n
		    Retrieved Information: {output_string[:20000]}\n\n

		    Objective:
		    1. Generate a reply to the user query using Markdown formatting for a clear and attractive presentation. 
		    2. Check if the user query is relevant to any help or documentation asked by the user. If it's a casual conversation, don't include any retrieved information in your response, just reply casually and brielfy.
		    2. In your response, kindly address the user directly (using 'you') and provide a concise reply of the user query using the retrieved information.
		    3. Also, please use emojis throughout your reply to enhance the friendly experience!
		    4. If any content is not relevant to the user query, please do not include it in your response.

		    Most important note: the last part of the response should be -
		    <casual> if the user query is an aptos unrelated conversation.

		    Example of casual conversation:
		    User: Hey, how are you?
		    Assistant: Hey there! I'm APTOS AI and I'm doing great. How can I help you today? <casual>

		    Output:
		"""

        response = chat_hf.invoke(prompt)

        if "casual" in response.content:
            scraped_urls = []

        response.content = response.content.replace("<casual>", "")
        response.content = response.content.replace("</casual>", "")

        return {"response": response, "scraped_urls": scraped_urls}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
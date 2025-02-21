"""
Vector Store Creation Module for Aptos Documentation

This module crawls the Aptos documentation website, processes the content,
and creates a FAISS vector store for semantic search capabilities. It:
1. Crawls aptos.dev documentation pages
2. Processes and splits the content into manageable chunks
3. Creates embeddings using SentenceTransformer
4. Stores the vectors in a FAISS index for efficient similarity search
"""

import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain.vectorstores import FAISS
import spacy
import warnings
import faiss
import numpy as np
import json
import pandas as pd
import matplotlib.pyplot as plt
from langchain_community.docstore.in_memory import InMemoryDocstore

embeddings = SentenceTransformerEmbeddings(model_name="multi-qa-MiniLM-L6-cos-v1")

def crawl_website(start_url, max_pages=1000):
    """
    Crawl the Aptos documentation website and extract content.
    
    Args:
        start_url (str): The initial URL to start crawling from
        max_pages (int): Maximum number of pages to crawl (default: 1000)
        
    Returns:
        list: List of dictionaries containing page URLs and their content
    """
    visited = set()
    frontier = [start_url]
    pages = []
    
    while frontier and len(visited) < max_pages:
        url = frontier.pop(0)
        if url in visited:
            continue
        print(f"Crawling: {url}")
        try:
            response = requests.get(url, timeout=10)
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            visited.add(url)
            continue
        
        if response.status_code != 200:
            print(f"Non-200 status code for {url}")
            visited.add(url)
            continue
        
        content_type = response.headers.get("Content-Type", "")
        if "text/html" not in content_type:
            visited.add(url)
            continue
        
        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator="\n")
        pages.append({"url": url, "content": text})
        visited.add(url)
        
        for link in soup.find_all("a", href=True):
            href = link.get("href")
            full_url = urljoin(url, href)
            parsed = urlparse(full_url)
            if "aptos.dev" in parsed.netloc:
                full_url = full_url.split("#")[0]
                if full_url not in visited and full_url not in frontier:
                    frontier.append(full_url)
        
        time.sleep(0.5)
                    
    return pages

# Initialize crawling
start_url = "https://aptos.dev/en/build/get-started"
pages = crawl_website(start_url, max_pages=1000)
print(f"Total pages scraped: {len(pages)}")

# Create documents with metadata
documents = [
    Document(page_content=page["content"], metadata={"source": page["url"]})
    for page in pages
]

# Initialize FAISS index
index = faiss.IndexFlatIP(len(embeddings.embed_query("Hello World")))
index.reset()

vectorstore = FAISS( 
    embedding_function=embeddings, 
    index=index,
    docstore=InMemoryDocstore({}),
    index_to_docstore_id={}
)

# Split documents and create embeddings
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
split_docs = text_splitter.split_documents(documents)
vectorstore.add_documents(split_docs)

print("Vectorstore created.")
print("Number of vectors:", len(vectorstore.index_to_docstore_id))

# Save the vectorstore
vectorstore.save_local("aptos_vector_store")
print("Vectorstore saved to aptos_vector_store")
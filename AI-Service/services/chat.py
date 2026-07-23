from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()
import os

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2
)

def generate_chat_response(repo_id: str, query: str):
    """
    Executes a Retrieval-Augmented Generation (RAG) chain.
    """
    # 1. Connect to the specific repository's vector collection
    vectorstore = Chroma(
        collection_name=f"repo_{repo_id}",
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )
    
    # 2. Create a retriever to fetch the top 5 most relevant code chunks
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    
    # 3. Create the Prompt Template instructing Gemini how to behave
    template = """You are an expert software architect and senior developer assistant.
    Use the following retrieved code snippets from the user's repository to answer their question.
    If you don't know the answer or the code isn't in the context, just say you don't know.
    Always include the file path of the code you are referencing if applicable to help the user find it.
    Format your response cleanly using markdown if providing code blocks.
    
    Context Code Snippets:
    {context}
    
    User Question:
    {question}
    
    Answer:"""
    
    prompt = ChatPromptTemplate.from_template(template)
    
    # Helper to format the retrieved documents cleanly
    def format_docs(docs):
        return "\n\n".join(f"--- File: {doc.metadata.get('source', 'Unknown')} ---\n{doc.page_content}" for doc in docs)
    
    # 4. Construct the LCEL
    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return chain.invoke(query)
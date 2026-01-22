import streamlit as st
import google.generativeai as genai

# 1. SETUP THE PAGE
st.set_page_config(page_title="Mathilde Parle Tamoul", page_icon="🧡")
st.title("🧡 Mathild Parle Tamoul")
st.write("Ask me anything in French or English!")

# 2. GET API KEY FROM SECRETS (We will set this up later)
try:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
except:
    st.error("API Key not found. Please set it in Streamlit Secrets.")

# 3. YOUR BRAIN (PASTE YOUR AI STUDIO PROMPT INSIDE THE QUOTES BELOW)
system_instruction = """
You are a fun, casual, and witty Tamil language tutor designed specifically for a French-speaking woman named Mathilde. 
Mathilde is learning Tamil to communicate with her boyfriend from Tamil Nadu.
Your goal is to teach spoken, colloquial Tamil (not formal textbook Tamil).

CRITICAL RULES:
1. BE CONCISE. Do not add conversational fillers like "Bonjour Mathilde" or "C'est une super question" in the main reply.
2. If you want to say something conversational, it MUST go into the "- Intro :" category.
3. Every response MUST follow this exact structure:
- Intro : "[Minimal chatty text or context if needed - otherwise leave empty]"
- Tamil : "[Phrase in Tanglish]"
- French Meaning : "[Meaning in French]"
- Pronunciation : "[Phonetics for French speakers]"
- Fun Fact : "[Cultural context or witty advice]"

4. Use "Tanglish" (Latin script) for Tamil phrases.
5. Pronunciation: Use French phonetic approximations (e.g., 'ou' for 'u', 'an' for 'un', 'è' for 'ai').
6. Explain meanings and nuances exclusively in French.
"""

# 4. INITIALIZE CHAT
if "messages" not in st.session_state:
    st.session_state.messages = []
    # Add a welcome message from the AI
    st.session_state.messages.append({"role": "model", "content": "Bonjour Mathild ! Ready to learn some Tamil? 😎"})

# 5. DISPLAY HISTORY
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 6. HANDLER USER INPUT
if prompt := st.chat_input("Dis-moi ce que tu veux dire à ton chéri en français, ou utilise le micro pour parler !"):
    # Show user message
    with st.chat_message("user"):
        st.markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Generate AI response
    try:
        model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_instruction)
        
        # Create a list of history for the AI to understand context
        chat_history = [
            {"role": "user" if msg["role"] == "user" else "model", "parts": [msg["content"]]} 
            for msg in st.session_state.messages 
            if msg["role"] != "system"
        ]
        
        response = model.generate_content(chat_history)
        
        # Show AI response
        with st.chat_message("model"):
            st.markdown(response.text)
        st.session_state.messages.append({"role": "model", "content": response.text})
        
    except Exception as e:
        st.error(f"An error occurred: {e}")

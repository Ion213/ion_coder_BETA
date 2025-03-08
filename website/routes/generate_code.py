from flask import (
    Blueprint, 
    render_template, 
    request, 
    jsonify,
    Response,
    session
)

from website import db
#from website.models.chat_model import ChatHistory
#from website.ai_api.openai import client

from pytz import timezone
from datetime import time,datetime
import os

from llama_cpp import Llama



manila_tz = timezone('Asia/Manila')

# Route name
generate_code = Blueprint('generate_code', __name__)

MODEL_DIR = "gguf"
def list_models():
    try:
        models = [f for f in os.listdir(MODEL_DIR) if f.endswith(".gguf")]
        if not models:
            print("\033[91m No AI models found in the directory.\033[0m")
            return None
        return models
    except Exception as e:
        print(f"\033[91m Error accessing model directory: {e}\033[0m")
        return None
    

# Display the main page
@generate_code.route('/', methods=['GET'])  # ✅ Single route
@generate_code.route('/generate_html_page', methods=['GET'])  # ✅ Additional route
def generate_html_page():
    models = list_models() or []  # Avoid nested lists
    convert=['jinja_Flask','blade_laravel']
    return render_template('/html/generate_code.html',models=models,convert=convert)


#sent prompt to ai
@generate_code.route("/generate_html")
def generate_html():
    try:
        prompt = request.args.get("prompt")
        model = request.args.get("model")
        if not prompt:
            return Response("Invalid input", status=400)
        
        model_path = os.path.join(MODEL_DIR, model)
        if not os.path.exists(model_path):
            return Response("Model file not found", status=404)
        
        rule_chat = f"Only respond the whole HTML or full HTML, JavaScript, and CSS for the user's request: ['{prompt}']. Always use Bootstrap and don't explain anything just give the raw code."
        '''
        #for openai api or connect to hosting api
        stream = client.chat.completions.create(
            model="IONGPT",
            messages=[{"role": "user", "content": rule_chat}],
            stream=True,
        )

        def stream_response():
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield f"data: {chunk.choices[0].delta.content}\n\n"

        '''

        llm = Llama(
            model_path=model_path,
            chat_format="chatml",
            n_ctx=4098,
            n_batch=512,
            n_threads=3,
            n_threads_batch=1,
        )

        stream = llm.create_chat_completion(
            messages=[
                {"role": "system", "content": "You are an assistant that only generates HTML-related responses."},
                {"role": "user", "content": rule_chat},
            ],
            stream=True
        )

        def stream_response():
            for chunk in stream:
                if "choices" in chunk and chunk["choices"]:  # Ensure "choices" key exists
                    delta = chunk["choices"][0].get("delta", {})
                    if "content" in delta:  # Ensure "content" key exists
                        yield f"data: {delta['content']}\n\n"

        return Response(stream_response(), content_type="text/event-stream")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


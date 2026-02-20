# app/services/classify.py

from groq import Groq
import os
import json
from dotenv import load_dotenv
load_dotenv()


# Initialize Groq client (FREE!)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def explain_anomaly(log_message, attack_type=None, ip=None, endpoint=None):
    """
    Uses Groq AI to explain why a log is suspicious (100% FREE!)
    
    Args:
        log_message: The suspicious log message
        attack_type: Detected attack pattern (optional)
        ip: IP address (optional)
        endpoint: API endpoint (optional)
    
    Returns:
        dict: AI analysis with threat_type, severity, explanation, recommended_action
    """
    prompt = f"""
You are a cybersecurity expert. Analyze this suspicious log entry:

IP Address: {ip or "Unknown"}
Endpoint: {endpoint or "Unknown"}
Log Message: {log_message}
Detected Pattern: {attack_type or "Unknown anomaly"}

Provide a detailed security analysis in JSON format with these exact keys:
{{
    "threat_type": "specific attack classification (e.g., SQL Injection, XSS, Brute Force, DDoS, etc.)",
    "severity": "Low/Medium/High/Critical",
    "explanation": "2-3 sentence explanation of why this is suspicious and what the attacker might be trying to do",
    "recommended_action": "specific action to take (e.g., block IP, review logs, update firewall rules)"
}}

Return ONLY valid JSON, no extra text.
"""
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Fast & FREE model
            messages=[
                {
                    "role": "system",
                    "content": "You are a cybersecurity expert. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=500,
            response_format={"type": "json_object"}  # Forces JSON response
        )
        
        # Parse JSON response
        ai_response = json.loads(response.choices[0].message.content)
        
        return ai_response
    
    except json.JSONDecodeError as e:
        # Fallback if JSON parsing fails
        return {
            "threat_type": attack_type or "Unknown Anomaly",
            "severity": "Medium",
            "explanation": f"Suspicious activity detected: {log_message}",
            "recommended_action": "Manual investigation recommended"
        }
    
    except Exception as e:
        # Fallback for any other error
        return {
            "threat_type": attack_type or "Detection Error",
            "severity": "Medium",
            "explanation": f"AI analysis failed but anomaly was detected. Error: {str(e)}",
            "recommended_action": "Review logs manually and investigate the activity"
        }
# from fastapi import FastAPI
# from pydantic import BaseModel
# import random

# app = FastAPI()

# class LogItem(BaseModel):
#     ip: str
#     endpoint: str
#     severity: str
#     message: str

# @app.post("/analyze")
# def analyze_logs(logs: list[LogItem]):
#     # Dummy AI logic for now
#     score = random.random()
#     suspicious = score > 0.7

#     return {
#         "anomaly_score": score,
#         "is_suspicious": suspicious,
#         "reason": "High anomaly detected" if suspicious else "Normal activity"
#     }

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import AI-enhanced detection
from app.services.anomaly import detect_anomaly_with_ai, detect_anomaly

app = FastAPI()

class LogItem(BaseModel):
    ip: str
    endpoint: str
    severity: str
    message: str

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "status": "AI Security Log Analyzer Running",
        "version": "2.0",
        "ai_enabled": True
    }

@app.post("/analyze")
def analyze_logs(logs: List[LogItem]):
    """
    Analyze logs with AI-powered explanations
    Returns detailed analysis with threat classification and recommendations
    """
    
    # Prepare log dictionaries
    log_dicts = []
    for log in logs:
        log_dicts.append({
            'ip': log.ip,
            'endpoint': log.endpoint,
            'severity': log.severity,
            'message': log.message
        })
    
    # Detect anomalies with AI explanations
    anomaly_results = detect_anomaly_with_ai(log_dicts)
    
    # Build enhanced response
    response = []
    for i, log in enumerate(logs):
        result = anomaly_results[i]
        
        log_response = {
            "ip": log.ip,
            "endpoint": log.endpoint,
            "severity": log.severity,
            "message": log.message,
            "is_suspicious": result['is_anomaly'],
            "detection_details": {
                "ml_detected": result['detection_methods']['ml_detected'],
                "ml_score": result['detection_methods']['ml_score'],
                "rule_detected": result['detection_methods']['rule_detected'],
                "attack_type": result['detection_methods']['attack_type'],
                "brute_force_detected": result['detection_methods']['brute_force_detected'],
                "attempt_count": result['detection_methods']['attempt_count']
            }
        }
        
        # Add AI analysis if anomaly detected
        if 'ai_analysis' in result:
            log_response['ai_analysis'] = result['ai_analysis']
        
        response.append(log_response)
    
    # Summary statistics
    suspicious_count = sum(1 for r in response if r['is_suspicious'])
    
    return {
        "total_logs": len(response),
        "suspicious_logs": suspicious_count,
        "clean_logs": len(response) - suspicious_count,
        "results": response
    }

@app.post("/analyze-simple")
def analyze_logs_simple(logs: List[LogItem]):
    """
    Fast analysis without AI (no API calls)
    Use this for quick scans or when AI explanations not needed
    """
    
    log_dicts = []
    for log in logs:
        log_dicts.append({
            'ip': log.ip,
            'endpoint': log.endpoint,
            'severity': log.severity,
            'message': log.message
        })
    
    # Basic detection only
    anomaly_results = detect_anomaly(log_dicts)
    
    response = []
    for i, log in enumerate(logs):
        response.append({
            "ip": log.ip,
            "endpoint": log.endpoint,
            "severity": log.severity,
            "message": log.message,
            "is_suspicious": bool(anomaly_results[i])
        })

    return response
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
import re
import logging
from collections import defaultdict
from datetime import datetime, timedelta

# ============ CONFIGURATION ============
BRUTE_FORCE_THRESHOLD = 5
TIME_WINDOW = timedelta(minutes=5)
ANOMALY_THRESHOLD = -0.5

# ============ LOGGING ============
logging.basicConfig(
    filename='security.log',
    level=logging.WARNING,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# ============ ML MODEL SETUP ============
vectorizer = TfidfVectorizer(
    max_features=100,
    ngram_range=(1, 2),
    min_df=1
)

model = IsolationForest(
    contamination=0.05,
    random_state=42,
    n_estimators=100
)

# Training data
training_data = [
    "user login success",
    "user login success from ip 192.168.1.10",
    "user login successful",
    "page loaded successfully",
    "home page loaded",
    "dashboard page loaded",
    "normal api request",
    "api request to /users",
    "api request to /products",
    "normal api request completed",
    "user logout",
    "user logout successful",
    "session ended",
    "profile updated",
    "profile viewed",
    "user profile modified",
    "dashboard loaded",
    "dashboard accessed",
    "main dashboard opened",
    "settings opened",
    "settings page accessed",
    "configuration viewed",
    "password changed successfully",
    "password updated",
    "email changed successfully",
    "file uploaded successfully",
    "document downloaded",
    "report generated",
    "notification sent",
    "user registered successfully",
    "account created",
    "session refreshed"
]

X_train = vectorizer.fit_transform(training_data)
model.fit(X_train)

# ============ TRACKERS ============
ip_tracker = defaultdict(list)

# ============ RULE-BASED DETECTION ============
def rule_based_check(message):
    """Detect known attack patterns"""
    patterns = [
        (r"\bor\s+1\s*=\s*1\b", "SQL Injection"),
        (r"\bunion\s+select\b", "SQL Injection"),
        (r"'\s*or\s*'", "SQL Injection"),
        (r";\s*drop\s+table", "SQL Injection"),
        (r"<script[^>]*>", "XSS Attack"),
        (r"javascript:", "XSS Attack"),
        (r"onerror\s*=", "XSS Attack"),
        (r"\brm\s+-rf\b", "Command Injection"),
        (r";\s*cat\s+/etc/passwd", "Command Injection"),
        (r"\|\s*bash", "Command Injection"),
        (r"\.\./", "Path Traversal"),
        (r"\.\.\\", "Path Traversal"),
    ]
    
    for pattern, attack_type in patterns:
        if re.search(pattern, message.lower()):
            return True, attack_type
    
    return False, None

# ============ BRUTE FORCE DETECTION ============
def brute_force_check(ip, timestamp=None):
    """Detect brute force attacks based on IP frequency"""
    if timestamp is None:
        timestamp = datetime.now()
    
    # Clean old entries
    ip_tracker[ip] = [t for t in ip_tracker[ip] if timestamp - t < TIME_WINDOW]
    
    # Add new entry
    ip_tracker[ip].append(timestamp)
    
    # Check threshold
    if len(ip_tracker[ip]) > BRUTE_FORCE_THRESHOLD:
        return True, len(ip_tracker[ip])
    
    return False, len(ip_tracker[ip])

# ============ SEVERITY WEIGHTS ============
severity_weight = {
    'CRITICAL': 1.5,
    'ERROR': 1.2,
    'WARN': 1.0,
    'INFO': 0.8
}

# ============ MAIN DETECTION FUNCTION ============
def detect_anomaly(logs):
    """
    Main anomaly detection function
    
    Args:
        logs: List of strings (messages) OR List of log dictionaries with keys: ip, endpoint, severity, message
    
    Returns:
        List of booleans indicating if each log is suspicious
    """
    # Check if logs are strings or dictionaries
    if logs and isinstance(logs[0], str):
        # Convert strings to dictionary format
        logs = [
            {
                'ip': 'unknown',
                'endpoint': 'unknown',
                'severity': 'INFO',
                'message': log
            }
            for log in logs
        ]
    
    # Prepare messages for ML
    messages = [
        f"{log['ip']} {log['endpoint']} {log['severity']} {log['message']}"
        for log in logs
    ]
    
    # ML detection
    X = vectorizer.transform(messages)
    preds = model.predict(X)
    scores = model.score_samples(X)
    
    results = []
    
    for i, log in enumerate(logs):
        ml_score = scores[i]
        
        # Severity-adjusted threshold
        adjusted_threshold = ANOMALY_THRESHOLD * severity_weight.get(log['severity'], 1.0)
        ml_result = (preds[i] == -1) or (ml_score < adjusted_threshold)
        
        # Rule-based detection
        rule_result, attack_type = rule_based_check(log['message'])
        
        # Brute force detection
        brute_result, attempt_count = brute_force_check(log['ip'])
        
        # Final decision (any trigger = anomaly)
        is_anomaly = ml_result or rule_result or brute_result
        
        # Log suspicious activity
        if is_anomaly:
            logging.warning(
                f"ANOMALY DETECTED | IP: {log['ip']} | Endpoint: {log['endpoint']} | "
                f"Severity: {log['severity']} | ML: {ml_result} | Rule: {rule_result} | "
                f"Attack: {attack_type} | BruteForce: {brute_result} | "
                f"Attempts: {attempt_count} | Message: {log['message']}"
            )
        
        results.append(is_anomaly)
    
    return results

# ============ DETAILED DETECTION ============
# ============ DETAILED DETECTION ============
def detect_anomaly_detailed(logs):
    """
    Returns detailed detection results with all scores
    """
    # Check if logs are strings or dictionaries
    if logs and isinstance(logs[0], str):
        # Convert strings to dictionary format
        logs = [
            {
                'ip': 'unknown',
                'endpoint': 'unknown',
                'severity': 'INFO',
                'message': log
            }
            for log in logs
        ]
    
    messages = [
        f"{log['ip']} {log['endpoint']} {log['severity']} {log['message']}"
        for log in logs
    ]
    
    X = vectorizer.transform(messages)
    preds = model.predict(X)
    scores = model.score_samples(X)
    
    results = []
    
    for i, log in enumerate(logs):
        ml_score = scores[i]
        adjusted_threshold = ANOMALY_THRESHOLD * severity_weight.get(log['severity'], 1.0)
        ml_result = (preds[i] == -1) or (ml_score < adjusted_threshold)
        
        rule_result, attack_type = rule_based_check(log['message'])
        brute_result, attempt_count = brute_force_check(log['ip'])
        
        is_anomaly = ml_result or rule_result or brute_result
        
        results.append({
            'is_anomaly': bool(is_anomaly),  # ← Convert to Python bool
            'detection_methods': {
                'ml_detected': bool(ml_result),  # ← Convert to Python bool
                'ml_score': float(ml_score),
                'rule_detected': bool(rule_result),  # ← Convert to Python bool
                'attack_type': attack_type,
                'brute_force_detected': bool(brute_result),  # ← Convert to Python bool
                'attempt_count': int(attempt_count)  # ← Convert to Python int
            }
        })
    
    return results
# ============ AI-ENHANCED DETECTION ============
def detect_anomaly_with_ai(logs):
    """
    Enhanced detection with AI explanations
    Calls AI only for suspicious logs to save API costs
    """
    # Import here to avoid circular imports
    from .classify import explain_anomaly
    
    # Check if logs are strings or dictionaries
    if logs and isinstance(logs[0], str):
        logs = [
            {
                'ip': 'unknown',
                'endpoint': 'unknown',
                'severity': 'INFO',
                'message': log
            }
            for log in logs
        ]
    
    # Get basic detection results
    basic_results = detect_anomaly_detailed(logs)
    
    # Add AI analysis only for anomalies
    for i, result in enumerate(basic_results):
        if result['is_anomaly']:
            try:
                ai_response = explain_anomaly(
                    log_message=logs[i]['message'],
                    attack_type=result['detection_methods']['attack_type'],
                    ip=logs[i]['ip'],
                    endpoint=logs[i]['endpoint']
                )
                result['ai_analysis'] = ai_response
            except Exception as e:
                # Fallback if AI fails
                result['ai_analysis'] = {
                    'threat_type': result['detection_methods']['attack_type'] or 'Unknown',
                    'severity': 'Medium',
                    'explanation': f'Anomaly detected but AI analysis unavailable',
                    'recommended_action': 'Manual review recommended'
                }
    
    return basic_results
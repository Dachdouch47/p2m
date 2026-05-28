# Simple user analysis history (in-memory, replace with DB in prod)
user_analysis_history = {}

def save_analysis(username, file_name, result):
    if username not in user_analysis_history:
        user_analysis_history[username] = []
    user_analysis_history[username].append({
        'file_name': file_name,
        'result': result
    })

def get_user_history(username):
    return user_analysis_history.get(username, [])

import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

# Simulated Login Logs (In real-world, fetch this data from your database or log files)
log_data = pd.DataFrame({
    'user_id': ['user1', 'user1', 'user2', 'user2', 'user3', 'user3', 'user4', 'user4', 'user5', 'user5'],
    'failed_attempts': [1, 5, 2, 3, 0, 10, 1, 7, 1, 0],  # Number of failed login attempts in the last X minutes
    'time_between_attempts': [2, 1, 3, 2, 0, 1, 4, 1, 5, 1],  # Time between login attempts (in minutes)
    'ip_frequency': [1, 2, 1, 1, 0, 3, 1, 2, 1, 1]  # Frequency of login attempts from the same IP address
})

# Feature Engineering
# Here, we are using 'failed_attempts', 'time_between_attempts', and 'ip_frequency' as features
# For simplicity, you can add more features based on your data

features = log_data[['failed_attempts', 'time_between_attempts', 'ip_frequency']]

# Initialize and train the Isolation Forest model
model = IsolationForest(contamination=0.2, random_state=42)  # contamination=0.2 means 20% of the data will be flagged as anomalies
model.fit(features)

# Make predictions (1 = normal, -1 = anomaly/fraud)
log_data['is_anomaly'] = model.predict(features)

# Print the data with anomaly flags
print("Login Logs with Anomaly Detection:")
print(log_data)

# Flagging the Suspicious Users
suspicious_users = log_data[log_data['is_anomaly'] == -1]
if not suspicious_users.empty:
    print("\nSuspicious Users Detected:")
    print(suspicious_users[['user_id', 'is_anomaly']])
else:
    print("\nNo suspicious users detected.")

# Example function for handling flagged users (e.g., lock account, notify admin, etc.)
def handle_suspicious_users(suspicious_users):
    for user in suspicious_users['user_id']:
        print(f"\nHandling suspicious user: {user}")
        # Here, you can add your code to lock the user account, notify admin, or take action
        # For example, you could lock the user's account in the system or require additional verification

# Call the function to handle flagged suspicious users
handle_suspicious_users(suspicious_users)

# In real-world scenario, you would save the results back to the database or trigger further actions.

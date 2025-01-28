import os
import datetime
import subprocess

# Get the current time and calculate the time 15 minutes ago
now = datetime.datetime.utcnow()
fifteen_minutes_ago = now - datetime.timedelta(minutes=15)

# Format timestamps for SNScrape
since = fifteen_minutes_ago.strftime("%Y-%m-%d_%H:%M:%S")
until = now.strftime("%Y-%m-%d_%H:%M:%S")

# Define the search query
keyword = "story protocol"
query = f'"{keyword}" since:{since} until:{until}'

# Run SNScrape command and save to file
output_file = "tweets.json"
command = f"snscrape --jsonl twitter-search '{query}' > {output_file}"
subprocess.run(command, shell=True)

print(f"Scraped tweets from {since} to {until} and saved to {output_file}.")

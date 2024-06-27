def read_config(file_path):
    config = {}
    with open(file_path, 'r') as file:
        for line in file:
            key, value = line.strip().split('=')
            config[key] = value
    return config

# Specify the path to your config file
# config_file_path = 'config.txt'

# # Read the configuration
# config = read_config(config_file_path)

# # Extract values
# api_key = config.get('api_key')
# ip_address = config.get('ip_address')
# port = config.get('port')

# Print extracted values
# print(f"API Key: {api_key}")
# print(f"IP Address: {ip_address}")
# print(f"Port: {port}")

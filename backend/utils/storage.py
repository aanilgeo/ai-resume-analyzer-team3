# utils/storage.py
temp_storage = {}

def store_data(key, data_type, data):
    if key not in temp_storage:
        temp_storage[key] = {}
    temp_storage[key][data_type] = data

def get_data(key, data_type):
    return temp_storage.get(key, {}).get(data_type)

def clear_data(key, data_type):
    if key in temp_storage:
        temp_storage[key].pop(data_type, None)
        if not temp_storage[key]:  # Clean up if empty
            temp_storage.pop(key)
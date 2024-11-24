"""
Functions to handle temporary in-memory storage for uploaded data
"""
temp_storage = {}

def store_data(key, data_type, data):
    """
    key contains session identifer 
    data_type contains type of the data stored
    data contains real data that needs to be stored
    """
    if key not in temp_storage:
        temp_storage[key] = {}
    temp_storage[key][data_type] = data

def get_data(key, data_type):
    """
    Data from the temporary in-memory storage is being accessed
    """
    return temp_storage.get(key, {}).get(data_type)

def clear_data(key, data_type):
    """
    Data is being cleaned as necessary based on session id and type of data
    """
    if key in temp_storage:
        if data_type is None:
            temp_storage.pop(key, None)
        else:
            temp_storage[key].pop(data_type, None)

        if key in temp_storage and not temp_storage[key]:  # Clean up if empty
            temp_storage.pop(key)
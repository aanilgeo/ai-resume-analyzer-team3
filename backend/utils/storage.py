temp_storage = {}

def store_data(key, data_type, data):
    # key contains session identifier
    # data_type contains type of the data stored
    # data contains real data that needs to be stored
    if key not in temp_storage:
        temp_storage[key] = {}
    temp_storage[key][data_type] = data
    print(f"Stored {data_type} in {key}: {data[:100]}...")  # Debugging to check data size and content

def get_data(key, data_type):
    # Data from the temporary in-memory storage is being accessed
    data = temp_storage.get(key, {}).get(data_type)
    if data:
        print(f"Retrieved {data_type} from {key}: {data[:100]}...")  # Debugging to check data retrieval
    else:
        print(f"No data found for {data_type} in {key}.")
    return data

def clear_data(key, data_type):
    # Make sure data is being cleaned as necessary
    if key in temp_storage:
        if data_type is None:
            temp_storage.pop(key, None)
        else:
            temp_storage[key].pop(data_type, None)

        if key in temp_storage and not temp_storage[key]:  # Clean up if empty
            temp_storage.pop(key)

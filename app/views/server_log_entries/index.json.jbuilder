json.array!(@server_log_entries) do |server_log_entry|
  json.extract! server_log_entry, :id, :entrytime, :flags, :source, :message
  json.url server_log_entry_url(server_log_entry, format: :json)
end

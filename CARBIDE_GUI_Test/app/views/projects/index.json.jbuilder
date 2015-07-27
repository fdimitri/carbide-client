json.array!(@projects) do |project|
  json.extract! project, :id, :name, :Owner_id, :ProjectProfile_id
  json.url project_url(project, format: :json)
end

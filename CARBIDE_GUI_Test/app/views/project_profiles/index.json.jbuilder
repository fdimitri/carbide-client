json.array!(@project_profiles) do |project_profile|
  json.extract! project_profile, :id, :About, :Homepage, :Project_id
  json.url project_profile_url(project_profile, format: :json)
end

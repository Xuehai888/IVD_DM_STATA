import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Plus, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProjectList() {
  const { projects, createProject, setCurrentProject } = useProjectStore();
  const [newProjectName, setNewProjectName] = React.useState('');
  const navigate = useNavigate();

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      createProject(newProjectName);
      setNewProjectName('');
    }
  };

  const handleProjectClick = (project: any) => {
    setCurrentProject(project);
    navigate(`/project/${project.id}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <form onSubmit={handleCreateProject} className="flex gap-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProjectClick(project)}
          >
            <div className="flex items-center space-x-3">
              <FolderOpen className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
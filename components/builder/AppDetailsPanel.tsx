'use client';

import { useState } from 'react';
import type { Project } from '@/types';

interface AppDetailsPanelProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AppDetailsPanel({ 
  project, 
  onUpdate, 
  onClose, 
  isOpen 
}: AppDetailsPanelProps) {
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onUpdate({
        features: [...(project.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...(project.features || [])];
    newFeatures.splice(index, 1);
    onUpdate({ features: newFeatures });
  };

  return (
    <div 
      className={`absolute top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">App Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={project.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="My Amazing App"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Details</label>
            <textarea
              value={project.business_details || ''}
              onChange={(e) => onUpdate({ business_details: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={5}
              placeholder="Describe your business needs and target customers..."
            />
          </div>
          
          {project.app_idea && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App Idea</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {project.app_idea}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <div className="space-y-2">
              {(project.features || []).map((feature, index) => (
                <div key={index} className="flex items-center">
                  <span className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {feature}
                  </span>
                  <button 
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <div className="flex">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                  placeholder="Add new feature"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddFeature();
                    }
                  }}
                />
                <button 
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
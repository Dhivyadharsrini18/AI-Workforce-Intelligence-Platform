import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import type { EmployeeSkill } from '../../types/employee';
import { SkillRating } from './SkillBadge';

interface SkillEditorProps {
  skills: EmployeeSkill[];
  onUpdate: (skills: EmployeeSkill[]) => void;
}

export default function SkillEditor({ skills, onUpdate }: SkillEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLevel, setEditLevel] = useState(0);

  const startEdit = (skill: EmployeeSkill) => {
    setEditingId(skill.id);
    setEditLevel(skill.proficiency_level);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (skillId: string) => {
    const updated = skills.map(s => 
      s.id === skillId ? { ...s, proficiency_level: editLevel } : s
    );
    onUpdate(updated);
    setEditingId(null);
  };

  const deleteSkill = (skillId: string) => {
    onUpdate(skills.filter(s => s.id !== skillId));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skills Profile</h3>
        <button className="btn-secondary py-1.5 text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skills.map((empSkill) => (
          <div key={empSkill.id} className="card p-4 flex items-center justify-between group">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                {empSkill.skill?.name || 'Unknown'}
                {empSkill.skill?.is_critical && (
                  <span className="w-2 h-2 rounded-full bg-red-500" title="Critical Skill" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                {empSkill.skill?.category}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {editingId === empSkill.id ? (
                <div className="flex items-center gap-2">
                  <select 
                    value={editLevel} 
                    onChange={e => setEditLevel(Number(e.target.value))}
                    className="input-field py-1 px-2 text-sm w-16"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <button onClick={() => saveEdit(empSkill.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <SkillRating level={empSkill.proficiency_level} />
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(empSkill)} className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteSkill(empSkill.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="col-span-full text-center py-6 text-gray-500 text-sm">
            No skills added yet.
          </div>
        )}
      </div>
    </div>
  );
}

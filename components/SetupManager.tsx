import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CameraSetup } from '../types';
import { CAMERA_DATABASE } from '../constants';
import { XIcon, PlusIcon, TrashIcon, SaveIcon, CopyIcon, ShareIcon, SendIcon } from './Icons';

interface SetupManagerProps {
  onClose: () => void;
  onApplySetup: (setup: CameraSetup) => void;
}

const SetupManager: React.FC<SetupManagerProps> = ({ onClose, onApplySetup }) => {
  const [setups, setSetups] = useState<CameraSetup[]>([]);
  const [view, setView] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<Partial<CameraSetup>>({});
  const [shareId, setShareId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cineassist_setups');
    if (saved) {
      setSetups(JSON.parse(saved));
    }
  }, []);

  const saveSetupsToStorage = (newSetups: CameraSetup[]) => {
    setSetups(newSetups);
    localStorage.setItem('cineassist_setups', JSON.stringify(newSetups));
  };

  const handleSave = () => {
    if (!formData.name || !formData.camera) return;

    const newSetup: CameraSetup = {
      id: uuidv4(),
      name: formData.name,
      camera: formData.camera,
      fps: formData.fps || '23.98',
      shutter: formData.shutter || '180°',
      iso: formData.iso || '800',
      wb: formData.wb || '5600K',
      resolution: formData.resolution || '4K',
      codec: formData.codec || 'ProRes 4444',
      lens: formData.lens || '',
      notes: formData.notes || '',
      dateCreated: Date.now(),
    };

    saveSetupsToStorage([newSetup, ...setups]);
    setView('list');
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this setup?')) {
      saveSetupsToStorage(setups.filter(s => s.id !== id));
    }
  };

  const handleShare = (id: string) => {
    setShareId(id === shareId ? null : id);
    setCopied(false);
  };

  const copyToClipboard = (setup: CameraSetup) => {
    const text = `🎬 CAMERA SETUP: ${setup.name}
📷 CAM: ${setup.camera}
⏱️ FPS: ${setup.fps} | SHUTTER: ${setup.shutter}
💡 ISO: ${setup.iso} | WB: ${setup.wb}
🎞️ RES: ${setup.resolution} | CODEC: ${setup.codec}
🔍 LENS: ${setup.lens}
📝 NOTES: ${setup.notes || 'N/A'}

----------------------------------------
🚀 APPLY THIS SETUP:
Paste this entire text into CineAssist AI to get a step-by-step guide on how to configure the camera.
----------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-cinema-panel border border-gray-800 rounded-2xl flex flex-col h-[85vh] shadow-2xl overflow-hidden relative animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-cinema-dark">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <SaveIcon width={20} height={20} className="text-cinema-accent" />
                Camera Setups
            </h2>
            <p className="text-xs text-gray-500 mt-1">Manage, share, and replicate configurations.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <XIcon width={24} height={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/20">
          
          {view === 'list' && (
            <>
              {setups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                  <SaveIcon width={48} height={48} className="text-gray-600 mb-4" />
                  <p className="text-gray-400 mb-4">No setups saved yet.</p>
                  <button 
                    onClick={() => setView('create')}
                    className="px-6 py-3 bg-cinema-accent hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <PlusIcon width={18} height={18} />
                    Create First Setup
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setView('create')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-800 rounded-xl hover:border-cinema-accent/50 hover:bg-gray-900/50 transition-all group min-h-[200px]"
                  >
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <PlusIcon width={24} height={24} className="text-gray-400 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white">New Setup</span>
                  </button>

                  {setups.map(setup => (
                    <div key={setup.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors relative group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-bold text-white text-lg">{setup.name}</h3>
                            <span className="text-xs font-mono text-cinema-arri uppercase tracking-wider">{setup.camera}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => handleShare(setup.id)}
                                className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded"
                                title="Share"
                            >
                                <ShareIcon width={16} height={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(setup.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded"
                                title="Delete"
                            >
                                <TrashIcon width={16} height={16} />
                            </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-400 mb-4 font-mono text-xs">
                        <div>FPS: <span className="text-gray-200">{setup.fps}</span></div>
                        <div>SHUTTER: <span className="text-gray-200">{setup.shutter}</span></div>
                        <div>ISO: <span className="text-gray-200">{setup.iso}</span></div>
                        <div>WB: <span className="text-gray-200">{setup.wb}</span></div>
                        <div>RES: <span className="text-gray-200">{setup.resolution}</span></div>
                        <div>CODEC: <span className="text-gray-200">{setup.codec}</span></div>
                      </div>
                      
                      {setup.lens && (
                          <div className="text-xs text-gray-500 mb-3 border-t border-gray-800 pt-2">
                              <span className="uppercase tracking-wider">Lens:</span> {setup.lens}
                          </div>
                      )}

                      {shareId === setup.id && (
                        <div className="absolute inset-0 bg-cinema-panel/95 backdrop-blur flex flex-col items-center justify-center p-6 text-center animate-fade-in rounded-xl z-10">
                            <h4 className="text-white font-bold mb-4">Share Configuration</h4>
                            <p className="text-xs text-gray-400 mb-4">Copy this summary to share with your team.</p>
                            <button 
                                onClick={() => copyToClipboard(setup)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm mb-3 transition-all
                                    ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white text-black hover:bg-gray-200'}
                                `}
                            >
                                {copied ? 'Copied!' : <><CopyIcon width={16} height={16} /> Copy to Clipboard</>}
                            </button>
                            <p className="text-[10px] text-gray-500 max-w-xs">
                                Includes instructions for CineAssist AI to help the recipient set it up.
                            </p>
                            <button onClick={() => setShareId(null)} className="text-xs text-gray-500 hover:text-white mt-4">Cancel</button>
                        </div>
                      )}

                      <button 
                        onClick={() => onApplySetup(setup)}
                        className="w-full py-2 bg-gray-800 hover:bg-cinema-arri hover:text-black text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-auto"
                      >
                        <SendIcon width={14} height={14} />
                        Ask AI to Guide Setup
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {view === 'create' && (
            <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Setup Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. A-Cam High Speed"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cinema-accent focus:outline-none"
                            value={formData.name || ''}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Camera Model</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cinema-accent focus:outline-none appearance-none"
                            value={formData.camera || ''}
                            onChange={e => setFormData({...formData, camera: e.target.value})}
                        >
                            <option value="">Select Camera...</option>
                            {Object.entries(CAMERA_DATABASE).map(([brand, models]) => (
                                <optgroup key={brand} label={brand} className="bg-gray-900 text-white font-bold">
                                    {models.map(model => (
                                        <option key={model} value={`${brand} ${model}`} className="bg-gray-800 text-gray-300 font-normal">
                                            {model}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Settings Grid */}
                    {[
                        { label: 'FPS', key: 'fps', placeholder: '23.98' },
                        { label: 'Shutter', key: 'shutter', placeholder: '180 deg' },
                        { label: 'ISO / EI', key: 'iso', placeholder: '800' },
                        { label: 'White Balance', key: 'wb', placeholder: '5600K' },
                        { label: 'Resolution', key: 'resolution', placeholder: '4K' },
                        { label: 'Codec', key: 'codec', placeholder: 'ProRes / RAW' },
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">{field.label}</label>
                            <input 
                                type="text" 
                                placeholder={field.placeholder}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cinema-accent focus:outline-none font-mono text-sm"
                                value={(formData as any)[field.key] || ''}
                                onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                            />
                        </div>
                    ))}
                    
                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Lens Info</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Master Prime 35mm T1.3"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cinema-accent focus:outline-none"
                            value={formData.lens || ''}
                            onChange={e => setFormData({...formData, lens: e.target.value})}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Notes</label>
                        <textarea 
                            placeholder="Additional notes..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-cinema-accent focus:outline-none h-24 resize-none"
                            value={formData.notes || ''}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                    <button 
                        onClick={() => setView('list')}
                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!formData.name || !formData.camera}
                        className="flex-1 py-3 bg-cinema-accent hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-cinema-accent text-white rounded-lg font-bold transition-colors shadow-lg shadow-red-900/20"
                    >
                        Save Setup
                    </button>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SetupManager;
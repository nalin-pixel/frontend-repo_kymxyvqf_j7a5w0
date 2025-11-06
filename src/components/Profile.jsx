import React, { useRef, useState } from 'react';
import { ImagePlus, Pencil, Check, X } from 'lucide-react';

export default function Profile({ user, onUpdateUser }) {
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name || '');

  function openPicker() {
    fileRef.current?.click();
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdateUser({ ...user, photo: reader.result });
    reader.readAsDataURL(file);
  }

  function saveName() {
    onUpdateUser({ ...user, name: nameDraft });
    setEditing(false);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          <img
            src={user?.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'U')}`}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <button onClick={openPicker} className="absolute -bottom-2 -right-2 p-2 rounded-full bg-blue-600 text-white shadow">
            <ImagePlus size={16} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="px-3 py-2 rounded-md border border-slate-300"
                />
                <button onClick={saveName} className="p-2 rounded-md bg-emerald-600 text-white"><Check size={16} /></button>
                <button onClick={() => { setNameDraft(user?.name || ''); setEditing(false); }} className="p-2 rounded-md bg-slate-100"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <button onClick={() => setEditing(true)} className="p-2 rounded-md bg-slate-100"><Pencil size={16} /></button>
              </div>
            )}
          </div>
          <p className="text-slate-500">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

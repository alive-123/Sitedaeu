import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Note, SubjectId } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Star,
  Trash2,
  Tag,
  BookOpen,
  Calendar,
  Sparkles,
  Edit3
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, subjects } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);

  // Form modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectId>('maths');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredNotes = notes.filter(n => {
    if (subjectFilter !== 'all' && n.subjectId !== subjectFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addNote({
      title: newTitle.trim(),
      subjectId: newSubject,
      content: newContent.trim(),
      isImportant: false,
      tags: newTags.trim() ? newTags.split(',').map(t => t.trim()) : undefined
    });

    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Mes Notes & Fiches de Révision
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Rédigez vos propres fiches synthétiques. Mémorisez les formules importantes, vos moyens mnémotechniques et vos astuces de calcul.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une fiche</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans mes notes..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
        >
          <option value="all">Toutes les matières ({notes.length})</option>
          <option value="maths">Mathématiques</option>
          <option value="physique">Physique</option>
          <option value="biologie">Biologie</option>
          <option value="francais">Français</option>
        </select>
      </div>

      {/* Master Detail Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Notes List */}
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
              Aucune fiche trouvée.
            </div>
          ) : (
            filteredNotes.map(note => {
              const subject = subjects.find(s => s.id === note.subjectId);
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ backgroundColor: `${subject?.color}20`, color: subject?.color }}
                    >
                      {subject?.name}
                    </span>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        updateNote(note.id, { isImportant: !note.isImportant });
                      }}
                      className="p-1 hover:text-amber-400"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          note.isImportant ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm">{note.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{note.content}</p>

                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Modifié le {note.updatedAt}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Note Detail View */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          {selectedNote ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase">
                    {subjects.find(s => s.id === selectedNote.subjectId)?.name}
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedNote.title}</h3>
                </div>

                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Supprimer la fiche"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Note Content Editor / Viewer */}
              <textarea
                value={selectedNote.content}
                onChange={e => {
                  const updated = { ...selectedNote, content: e.target.value };
                  setSelectedNote(updated);
                  updateNote(selectedNote.id, { content: e.target.value });
                }}
                className="w-full h-80 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
              />

              {/* Tags */}
              {selectedNote.tags && selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedNote.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Sélectionnez une fiche dans la colonne de gauche pour l'afficher ou l'éditer.
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <h3 className="font-bold text-lg text-slate-100">Créer une fiche de révision</h3>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Matière</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value as SubjectId)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="maths">Mathématiques</option>
                  <option value="physique">Physique</option>
                  <option value="biologie">Biologie</option>
                  <option value="francais">Français</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Titre de la fiche</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Formules d'énergie et conversions"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Contenu de la fiche</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Écrivez le résumé de votre cours..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="Ex: Formules, Examen, Méthode"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20"
                >
                  Créer la fiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

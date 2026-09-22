import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BabyProfile, NannyProfile } from '../types';
import { Baby, Key, Plus, Trash2, UserPlus, Users, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageFamilyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    babies,
    addBaby,
    updateBaby,
    deleteBaby,
    nannies,
    addNanny,
    updateNanny,
    deleteNanny,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bebes' | 'babas'>('bebes');
  const [showAddBabyForm, setShowAddBabyForm] = useState(false);
  const [showAddNannyForm, setShowAddNannyForm] = useState(false);

  // New Baby Form state
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('2024-03-01');
  const [gender, setGender] = useState<'menino' | 'menina'>('menino');
  const [loadTemplate, setLoadTemplate] = useState(true);
  const [allergies, setAllergies] = useState('');

  // New Nanny Form state
  const [nannyName, setNannyName] = useState('');
  const [nannyPhone, setNannyPhone] = useState('');
  const [nannyPin, setNannyPin] = useState('1234');

  if (!isOpen) return null;

  const calculateMonths = (birth: string) => {
    const diff = Date.now() - new Date(birth).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24 * 30.44)));
  };

  const handleCreateBaby = (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName.trim()) return;

    const months = calculateMonths(birthDate);
    const photo =
      gender === 'menina'
        ? 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=300&q=80';

    addBaby(
      {
        name: babyName.trim(),
        birthDate,
        monthsAge: months,
        gender,
        photoUrl: photo,
        allergiesNotes: allergies.trim() || undefined,
        focusMode: false,
      },
      loadTemplate
    );

    setBabyName('');
    setShowAddBabyForm(false);
  };

  const handleCreateNanny = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nannyName.trim()) return;

    addNanny({
      name: nannyName.trim(),
      phone: nannyPhone.trim() || '(11) 99999-9999',
      pin: nannyPin.trim() || '1234',
      linkedBabyIds: babies.map((b) => b.id),
      active: true,
    });

    setNannyName('');
    setNannyPhone('');
    setNannyPin('1234');
    setShowAddNannyForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2 text-[#7E57C2]">
            <Users className="w-5 h-5" />
            <h3 className="font-headline font-bold text-lg text-neutral-900">
              Vínculo Familiar & Perfis (RN-01 / RN-04)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Bebês vs Babás */}
        <div className="flex bg-[#F6E9FF] p-1 rounded-2xl mb-4">
          <button
            onClick={() => setActiveTab('bebes')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bebes'
                ? 'bg-white text-[#7E57C2] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Bebês Dependentes ({babies.length})
          </button>
          <button
            onClick={() => setActiveTab('babas')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'babas'
                ? 'bg-white text-[#7E57C2] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Babás Vinculadas ({nannies.length})
          </button>
        </div>

        {/* BEBÊS TAB */}
        {activeTab === 'bebes' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {babies.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.photoUrl}
                      alt={b.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <div className="font-headline font-bold text-neutral-900 text-sm">
                        {b.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {b.monthsAge} meses • Nasc.: {b.birthDate}
                      </div>
                      {b.allergiesNotes && (
                        <div className="text-[11px] text-amber-700">
                          {b.allergiesNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {babies.length > 1 && (
                    <button
                      onClick={() => deleteBaby(b.id)}
                      className="text-neutral-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50"
                      title="Excluir perfil do bebê"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!showAddBabyForm ? (
              <button
                onClick={() => setShowAddBabyForm(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-[#7E57C2]/40 text-[#7E57C2] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F6E9FF]/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Novo Bebê (com Template de Rotina)
              </button>
            ) : (
              <form
                onSubmit={handleCreateBaby}
                className="p-4 rounded-2xl border border-purple-200 bg-[#FAF8F5] space-y-3"
              >
                <h4 className="font-headline font-bold text-sm text-neutral-900">
                  Novo Bebê na Família
                </h4>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Nome do Bebê:
                  </label>
                  <input
                    type="text"
                    required
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    placeholder="Ex: Theo, Maya, Bernardo"
                    className="w-full text-xs py-2 px-3 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Data de Nascimento:
                    </label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-white border border-neutral-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Gênero:
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-xs py-2 px-3 bg-white border border-neutral-300 rounded-xl"
                    >
                      <option value="menino">Menino</option>
                      <option value="menina">Menina</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Alergias / Restrições (opcional):
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Ex: Sem lactose, pele sensível"
                    className="w-full text-xs py-2 px-3 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                {/* RN-05: Template de Boas-Vindas */}
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loadTemplate}
                      onChange={(e) => setLoadTemplate(e.target.checked)}
                      className="w-4 h-4 text-[#7E57C2] rounded-sm mt-0.5"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#311B92]">
                        Carregar Quadro Padrão Sugerido por Idade (RN-05)
                      </span>
                      <p className="text-neutral-500 mt-0.5">
                        Importa automaticamente introdução alimentar, tummy time, banho de sol e
                        vitaminas adequadas para a idade calculada.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddBabyForm(false)}
                    className="flex-1 py-2.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#7E57C2] text-white text-xs font-bold shadow-md hover:bg-[#653DA7]"
                  >
                    Salvar Bebê
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* BABÁS TAB */}
        {activeTab === 'babas' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {nannies.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-headline font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                      {n.name}
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Ativa
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Tel: {n.phone}
                    </div>
                    <div className="text-xs text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Key className="w-3 h-3" />
                      PIN de Acesso: <strong className="tracking-widest">{n.pin}</strong>
                    </div>
                  </div>

                  {nannies.length > 1 && (
                    <button
                      onClick={() => deleteNanny(n.id)}
                      className="text-neutral-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50"
                      title="Desvincular babá"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!showAddNannyForm ? (
              <button
                onClick={() => setShowAddNannyForm(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-[#006A62]/40 text-[#006A62] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#E0F2F1]/40 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Vincular Nova Babá (com PIN de Execução)
              </button>
            ) : (
              <form
                onSubmit={handleCreateNanny}
                className="p-4 rounded-2xl border border-teal-200 bg-[#FAF8F5] space-y-3"
              >
                <h4 className="font-headline font-bold text-sm text-neutral-900">
                  Cadastrar Babá
                </h4>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Nome Completo da Babá:
                  </label>
                  <input
                    type="text"
                    required
                    value={nannyName}
                    onChange={(e) => setNannyName(e.target.value)}
                    placeholder="Ex: Mariana Silva"
                    className="w-full text-xs py-2 px-3 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Telefone / WhatsApp:
                    </label>
                    <input
                      type="text"
                      value={nannyPhone}
                      onChange={(e) => setNannyPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full text-xs py-2 px-3 bg-white border border-neutral-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      PIN Simples (4 dígitos):
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={nannyPin}
                      onChange={(e) => setNannyPin(e.target.value)}
                      placeholder="1234"
                      className="w-full text-xs py-2 px-3 bg-white border border-neutral-300 rounded-xl text-center font-bold tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddNannyForm(false)}
                    className="flex-1 py-2.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#006A62] text-white text-xs font-bold shadow-md hover:bg-[#004D40]"
                  >
                    Vincular Babá
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

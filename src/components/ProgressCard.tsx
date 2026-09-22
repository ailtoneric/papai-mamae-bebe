import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const ProgressCard: React.FC = () => {
  const { dailyProgress, activeBaby } = useApp();
  const { completed, total, percentage } = dailyProgress;
  const remaining = Math.max(0, total - completed);

  let message = 'Tudo pronto para começar o dia com muito carinho!';
  if (completed === total && total > 0) {
    message = `Parabéns! Todas as ${total} atividades do dia do ${activeBaby.name} foram cumpridas com sucesso!`;
  } else if (completed > 0) {
    message = `Ótimo ritmo! Mais ${remaining} ${
      remaining === 1 ? 'tarefa programada' : 'tarefas programadas'
    } para o dia do ${activeBaby.name}.`;
  }

  return (
    <section className="bg-[#F6E9FF] rounded-3xl p-4 border border-[#7E57C2]/15 shadow-xs">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#7E57C2] text-white flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-headline font-bold text-neutral-900 text-base">
            Progresso da Rotina
          </span>
        </div>
        <span className="font-headline font-bold text-[#7E57C2] text-lg">
          {completed} de {total}
        </span>
      </div>

      <p className="text-xs text-neutral-600 mb-2.5 leading-relaxed font-body">
        {message}
      </p>

      {/* Visual Progress Bar */}
      <div className="w-full bg-[#EBDDF8] rounded-full h-3 p-0.5 overflow-hidden">
        <div
          className="bg-[#7E57C2] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(4, percentage))}%` }}
        />
      </div>
    </section>
  );
};

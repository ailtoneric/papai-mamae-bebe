# papai-mamae-bebe
Aplicação web mobile-first com interface lúdica em blocos, projetada para simplificar a rotina diária de cuidados do bebê e facilitar a comunicação entre pais e babás.


💻 Módulos e Regras de Negócio do Sistema

1. Perfil de Usuários e Permissões (RBAC)

⚬ RN-01 (Tipos de Perfil): O sistema deve ter 3 tipos de usuários: Pai/Mãe (Admin), Dependente (Bebê) e Babá (Executor).
⚬ RN-02 (Acesso do Perfil Pais):
  ⚬ Criar, editar e excluir perfis de Bebês e Babás.
  ⚬ Criar, editar e excluir qualquer atividade, refeição, medicamento ou obrigação.
  ⚬ Visualizar relatórios de cumprimento de tarefas em tempo real.
⚬ RN-03 (Acesso do Perfil Babá):
  ⚬ Acesso estritamente de execução: Apenas visualiza a rotina diária/semanal e marca como "concluída" (check/tick).
  ⚬ Pode adicionar Anotações de Observação ao concluir uma tarefa (ex: "Não comeu toda a banana", "Cocô com consistência normal").
  ⚬ Bloqueio: A babá não pode alterar horários, criar novas obrigações estruturais ou excluir tarefas existentes.
⚬ RN-04 (Vínculo de Família): Uma conta de Pai/Mãe pode cadastrar mais de um bebê e vincular uma ou mais babás à mesma conta familiar.

2. Rotina Base (Padrão/Template)

⚬ RN-05 (Template de Boas-Vindas): Ao cadastrar um novo bebê e inserir a data de nascimento, o aplicativo deve carregar automaticamente um Quadro Padrão Sugerido baseado na idade do bebê (ex: template de 6-7 meses com introdução alimentar, tummy time, vitaminas e sol).
⚬ RN-06 (Personalização do Quadro): Os pais podem aceitar o template padrão, modificar itens ou criar uma rotina 100% personalizada do zero.

3. Gestão de Atividades, Obrigações e Remédios

⚬ RN-07 (Categorização de Atividades): Cada item do quadro deve pertencer a uma categoria visual (com ícone e cor distinta):
  1. 🥗 Alimentação: Frutas, Almoço, Jantar, Mamadeira/Leite.
  2. 💊 Saúde & Medicamentos: Vitaminas, remédios com dose e horário exato.
  3. ⚽ Desenvolvimento & Lazer: Tummy time, passeio no sol, leitura, banho.
  4. 🧹 Obrigações de Organização: Lavar mamadeiras, guardar brinquedos, higienizar utensílios.
⚬ RN-08 (Recorrência de Tarefas):
  ⚬ Diária: Repete de segunda a domingo (ou dias selecionados).
  ⚬ Pontual: Ocorre apenas em uma data e horário específicos.
  ⚬ Alarme/Lembrete de Medicamento: Permite configurar alertas com frequência fixa (ex: "Dar 5 gotas a cada 8 horas").

4. Execução da Rotina pela Babá (Fluxo Diário)

⚬ RN-09 (Check-list Diário):
  ⚬ A tela principal da babá exibe a linha do tempo (timeline) do dia atual, ordenada por horário.
  ⚬ Ao tocar em um item, o aplicativo registra a hora exata da marcação e altera o status para Concluído.
⚬ RN-10 (Edição de Exceção): Se uma tarefa não puder ser realizada (ex: chuva impediu o passeio no sol), a babá pode marcar como Não Realizado e obrigatoriamente selecionar ou digitar o motivo.
⚬ RN-11 (Registro de Medicamentos): Para tarefas da categoria Medicamentos, o aplicativo exige uma confirmação simples de dose ministrada antes de marcar o check.

5. Notificações e Monitoramento dos Pais

⚬ RN-12 (Notificação em Tempo Real): Os pais podem ativar notificações push configuráveis (ex: "Avisar quando a babá der a vitamina" ou "Avisar se o almoço atrasar mais de 30 minutos").
⚬ RN-13 (Resumo Diário): Ao final do dia (ex: 19h), o sistema gera um card com o percentual de cumprimento da rotina diária (ex: "8/8 tarefas concluídas hoje").

📱 Diretrizes de UI/UX Mobile (Foco do seu Design)

Para garantir alta adesão e facilidade de uso, o design mobile deve seguir estas premissas:

1. Dashboard da Babá ("Modo Operacional"):
  ⚬ Botões grandes para check (fáceis de clicar com uma mão só enquanto segura o bebê).
  ⚬ Cores contrastantes para identificar facilmente tarefas Pendentes, Concluídas e Atrasadas.
  ⚬ Modo "Sem Interrupção": A tela principal não deve ter menus complexos que poluam a navegação da babá.
2. Dashboard dos Pais ("Modo Gestão"):
  ⚬ Visão estilo calendário semanal para arrastar e soltar (drag-and-drop) tarefas.
  ⚬ Alternância rápida entre perfis se houver mais de um bebê.
3. Cards com Apoio Ilustrativo:
  ⚬ Uso de ícones visuais claros para cada tipo de refeição, fruta e atividade para leitura rápida sem necessidade de ler longos textos.

## 📐 Módulo de Especificações Técnicas e Arquitetura

### 1. Stack Tecnológica
* **Frontend / Framework Mobile:** React / Next.js (ou React Native/PWA) focado em UI Mobile-First.
* **Backend & Banco de Dados:** Supabase (PostgreSQL).
  * **Autenticação:** Supabase Auth (Login para Pais e acesso simplificado/PIN para Babás).
  * **Realtime:** Inscrição em tempo real para sincronizar o status das tarefas entre Pais e Babás.
* **Versionamento & Hospedagem:** GitHub (Repositório) + Vercel (CI/CD Deploy Automático).

### 2. Diretrizes de Design & UI/UX (Estilo Lúdico)
* **Layout por Componentes (Bento Grid / Big Blocks):** Interface baseada em cartões/blocos grandes arredondados, com alto contraste e cores pastel por categoria (Alimentação, Saúde, Lazer, Organização).
* **Usabilidade Operacional (Babá):**
  * Botões de ação em formato gigante no rodapé ou na lateral do card.
  * Ícones ilustrativos proeminentes para rápida identificação visual.
  * Resposta tátil/visual (animação de conclusão ao clicar no check).
* **Acessibilidade:** Padrão de toque amplo (mínimo de 48px de área clicável para uso em telas móveis).

### 3. Segurança e Permissões no Banco (Supabase RLS)
* **Políticas de RLS (Row Level Security):**
  * `pais_role`: Permissão total (INSERT, UPDATE, DELETE, SELECT) na tabela de Atividades/Rotinas.
  * `baba_role`: Permissão de leitura (SELECT) em todas as atividades e permissão de atualização (UPDATE) restrita apenas aos campos `status` (concluído/não concluído) e `observacao`.

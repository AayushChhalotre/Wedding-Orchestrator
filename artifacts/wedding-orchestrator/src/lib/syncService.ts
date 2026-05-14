import { supabase } from './supabase';
import { AppState } from '@/store/useStore';

/**
 * Cloud Sync Service
 * Handles persisting the state to Supabase Postgres
 */

export const syncService = {
  /**
   * Upserts the entire wedding state to the database
   */
  async saveWeddingToCloud(userId: string, state: AppState) {
    if (!userId || !state.weddingInfo.id) return;

    try {
      // 1. Sync Wedding Info
      const { error: weddingError } = await supabase
        .from('weddings')
        .upsert({
          id: state.weddingInfo.id,
          user_id: userId,
          couple_name: state.weddingInfo.coupleName,
          partner1_name: state.weddingInfo.partner1Name,
          partner2_name: state.weddingInfo.partner2Name,
          wedding_date: state.weddingInfo.weddingDate,
          city: state.weddingInfo.city,
          location: state.weddingInfo.location,
          budget: state.weddingInfo.budget,
          guests: state.weddingInfo.guests,
          planning_pace: state.weddingInfo.planningPace,
          budget_phase: state.weddingInfo.budgetPhase,
          active_scenario_id: state.weddingInfo.activeScenarioId,
          events: state.events,
          locked_dates: state.weddingInfo.lockedDates,
          status_tracking: state.statusTracking,
          updated_at: new Date().toISOString()
        });

      if (weddingError) throw weddingError;

      // 2. Sync Tasks (Delete existing and batch insert for consistency)
      // For simplicity in a prototype, we'll upsert by ID
      const { error: tasksError } = await supabase
        .from('tasks')
        .upsert(state.tasks.map(t => ({
          id: t.id,
          wedding_id: state.weddingInfo.id,
          title: t.title,
          due_date: t.dueDate,
          status: t.status,
          phase: t.phase,
          phase_id: t.phaseId,
          owner: t.owner,
          owner_type: t.ownerType,
          category: t.category,
          priority: t.priority,
          effort: t.effort,
          why_it_matters: t.whyItMatters,
          notes: t.notes,
          custom_action_type: t.customActionType,
          custom_action_data: t.customActionData,
          requirements: (t as any).requirements, // From rich metadata fix
          dependencies: t.dependencies,
          blocks: t.blocks,
          estimated_cost: t.estimatedCost,
          actual_cost: t.actualCost,
          budget_category_id: t.budgetCategoryId,
          updated_at: new Date().toISOString()
        })));

      if (tasksError) throw tasksError;

      // 3. Sync Budget Categories
      const { error: budgetError } = await supabase
        .from('budget_categories')
        .upsert(state.budgetCategories.map(c => ({
          id: c.id,
          wedding_id: state.weddingInfo.id,
          name: c.name,
          planned: c.planned,
          forecast: c.forecast,
          actual: c.actual,
          confidence: c.confidence,
          priority: c.priority,
          notes: c.notes
        })));

      if (budgetError) throw budgetError;

      // 4. Sync Stakeholders
      const { error: stakeholderError } = await supabase
        .from('stakeholders')
        .upsert(state.stakeholders.map(s => ({
          id: s.id,
          wedding_id: state.weddingInfo.id,
          name: s.name,
          role: s.role,
          type: s.type,
          initials: s.initials,
          email: s.email,
          tasks: s.tasks,
          communication_log: (s as any).communicationLog || []
        })));

      if (stakeholderError) throw stakeholderError;

      // 5. Sync Risks
      const { error: risksError } = await supabase
        .from('risks')
        .upsert(state.risks.map(r => ({
          id: r.id,
          wedding_id: state.weddingInfo.id,
          title: r.title,
          category: r.category,
          severity: r.severity,
          probability: r.probability,
          mitigation: r.mitigation,
          status: r.status,
          assistance: r.assistance
        })));

      if (risksError) throw risksError;

      // 6. Sync Activities (Append new ones)
      const { error: activityError } = await supabase
        .from('activities')
        .upsert(state.activities.map(a => ({
          id: a.id,
          wedding_id: state.weddingInfo.id,
          timestamp: a.timestamp,
          description: a.description,
          icon: a.icon,
          actor: a.actor
        })));

      if (activityError) throw activityError;

      return { success: true };
    } catch (err) {
      console.error('Sync error:', err);
      throw err;
    }
  },

  /**
   * Loads the entire wedding state for a user
   */
  async loadWeddingFromCloud(userId: string) {
    try {
      // Get the most recent wedding for this user
      const { data: wedding, error: weddingError } = await supabase
        .from('weddings')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .single();

      if (weddingError || !wedding) return null;

      // Fetch all related data in parallel
      const [
        { data: tasks },
        { data: budgetCategories },
        { data: stakeholders },
        { data: activities },
        { data: risks }
      ] = await Promise.all([
        supabase.from('tasks').select('*').eq('wedding_id', wedding.id),
        supabase.from('budget_categories').select('*').eq('wedding_id', wedding.id),
        supabase.from('stakeholders').select('*').eq('wedding_id', wedding.id),
        supabase.from('activities').select('*').eq('wedding_id', wedding.id).order('timestamp', { ascending: false }),
        supabase.from('risks').select('*').eq('wedding_id', wedding.id)
      ]);

      return {
        weddingInfo: {
          id: wedding.id,
          coupleName: wedding.couple_name,
          partner1Name: wedding.partner1_name,
          partner2Name: wedding.partner2_name,
          weddingDate: wedding.wedding_date,
          city: wedding.city,
          location: wedding.location,
          budget: wedding.budget,
          guests: wedding.guests,
          planningPace: wedding.planning_pace,
          budgetPhase: wedding.budget_phase,
          activeScenarioId: wedding.active_scenario_id,
          lockedDates: wedding.locked_dates || {},
          weddingDuration: 3 // Default
        },
        events: wedding.events || [],
        statusTracking: wedding.status_tracking || {},
        tasks: tasks || [],
        budgetCategories: budgetCategories || [],
        stakeholders: stakeholders || [],
        activities: activities || [],
        risks: risks || []
      };
    } catch (err) {
      console.error('Load error:', err);
      return null;
    }
  }
};

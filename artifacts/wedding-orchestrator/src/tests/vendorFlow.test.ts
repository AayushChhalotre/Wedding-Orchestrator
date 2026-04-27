import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/store/useStore';

describe('Vendor Management Flow', () => {
  beforeEach(() => {
    // Reset store state if needed, though useStore usually preserves state in memory
    // For unit tests, we want a clean state.
    // If useStore doesn't have a reset action, we might just work with initial state.
  });

  it('should unblock t1 when t2 is completed', () => {
    const { tasks, completeTask } = useStore.getState();
    
    const t2 = tasks.find(t => t.id === 't2');
    const t1 = tasks.find(t => t.id === 't1');
    
    expect(t2?.status).toBe('overdue');
    expect(t1?.dependencies).toContain('t2');
    
    // Complete t2
    completeTask('t2');
    
    const updatedT1 = useStore.getState().tasks.find(t => t.id === 't1');
    const updatedT2 = useStore.getState().tasks.find(t => t.id === 't2');
    
    expect(updatedT2?.status).toBe('done');
    expect(updatedT1?.dependencies).not.toContain('t2');
    expect(updatedT1?.dependencies.length).toBe(0);
  });

  it('should unblock t5 when t1 is completed', () => {
    const { completeTask } = useStore.getState();
    
    // t1 still depends on t2 from previous test state? 
    // Zustand store is singleton in tests too if not careful.
    // Let's ensure t1 is ready.
    completeTask('t2'); // Just in case
    
    const t1 = useStore.getState().tasks.find(t => t.id === 't1');
    const t5 = useStore.getState().tasks.find(t => t.id === 't5');
    
    expect(t5?.dependencies).toContain('t1');
    
    // Complete t1
    completeTask('t1');
    
    const updatedT5 = useStore.getState().tasks.find(t => t.id === 't5');
    expect(updatedT5?.dependencies).not.toContain('t1');
  });

  it('should mark task as done when vendor data is submitted', () => {
    const { submitVendorData } = useStore.getState();
    
    const t5 = useStore.getState().tasks.find(t => t.id === 't5');
    expect(t5?.status).not.toBe('done');
    
    submitVendorData('t5');
    
    const updatedT5 = useStore.getState().tasks.find(t => t.id === 't5');
    expect(updatedT5?.status).toBe('done');
  });
});

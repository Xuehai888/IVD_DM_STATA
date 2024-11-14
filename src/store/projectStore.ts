import { create } from 'zustand';
import { Project, DataRecord, DataField } from '../types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  records: DataRecord[];
  fields: DataField[];
  createProject: (name: string) => void;
  setCurrentProject: (project: Project) => void;
  addRecord: (data: Record<string, any>) => void;
  addRecords: (records: Record<string, any>[]) => void;
  updateRecord: (id: string, data: Record<string, any>) => void;
  deleteRecord: (id: string) => void;
  calculateDerivedFields: (record: Record<string, any>) => Record<string, any>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  records: [],
  fields: [
    { name: 'sequenceNumber', type: 'number', required: true },
    { name: 'enrollmentNumber', type: 'text', required: true },
    { name: 'evaluationBlindNumber', type: 'text', required: true },
    { name: 'comparisonBlindNumber', type: 'text', required: true },
    { name: 'evaluationReagentResult', type: 'number', required: true },
    { name: 'comparisonReagentResult', type: 'number', required: true },
    { name: 'absoluteDeviation', type: 'number', required: false },
    { name: 'absoluteDeviationValue', type: 'number', required: false },
    { name: 'relativeDeviation', type: 'number', required: false },
    { name: 'evaluationComparisonRatio', type: 'number', required: false },
  ],
  createProject: (name) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      userId: '1',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
  calculateDerivedFields: (data) => {
    const evalResult = parseFloat(data.evaluationReagentResult);
    const compResult = parseFloat(data.comparisonReagentResult);
    
    const absoluteDeviation = evalResult - compResult;
    const absoluteDeviationValue = Math.abs(absoluteDeviation);
    const relativeDeviation = absoluteDeviationValue / evalResult;
    const evaluationComparisonRatio = evalResult / compResult;

    return {
      ...data,
      absoluteDeviation: absoluteDeviation.toFixed(2),
      absoluteDeviationValue: absoluteDeviationValue.toFixed(2),
      relativeDeviation: relativeDeviation.toFixed(4),
      evaluationComparisonRatio: evaluationComparisonRatio.toFixed(4),
    };
  },
  addRecord: (data) => {
    const { calculateDerivedFields } = get();
    const enrichedData = calculateDerivedFields(data);
    const newRecord: DataRecord = {
      id: Date.now().toString(),
      projectId: get().currentProject?.id || '',
      data: enrichedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ records: [...state.records, newRecord] }));
  },
  addRecords: (records) => {
    const { calculateDerivedFields } = get();
    const newRecords = records.map((data) => ({
      id: Date.now().toString() + Math.random(),
      projectId: get().currentProject?.id || '',
      data: calculateDerivedFields(data),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    set((state) => ({ records: [...state.records, ...newRecords] }));
  },
  updateRecord: (id, data) => {
    const { calculateDerivedFields } = get();
    const enrichedData = calculateDerivedFields(data);
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id
          ? { ...record, data: enrichedData, updatedAt: new Date().toISOString() }
          : record
      ),
    }));
  },
  deleteRecord: (id) => {
    set((state) => ({
      records: state.records.filter((record) => record.id !== id),
    }));
  },
}));
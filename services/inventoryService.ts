
import { AnimalType, AnimalBatch, CutInventory, SaleOrder } from '../types';
import { YIELD_FORMULAS } from '../constants';

export const generateAnimalBatch = (type: AnimalType, weight: number): AnimalBatch => {
  const formulas = YIELD_FORMULAS[type];
  const batchId = `BATCH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const cuts: CutInventory[] = formulas.map((f, index) => {
    const cutWeight = weight * f.percentage;
    return {
      id: `${batchId}-CUT-${index}`,
      name: f.name,
      type,
      totalWeight: Number(cutWeight.toFixed(2)),
      availableWeight: Number(cutWeight.toFixed(2)),
      unitPrice: f.unitPrice
    };
  });

  return {
    id: batchId,
    type,
    initialWeight: weight,
    date: new Date(),
    cuts
  };
};

export const saveBatchToStorage = (batch: AnimalBatch) => {
  const existing = JSON.parse(localStorage.getItem('batches') || '[]');
  localStorage.setItem('batches', JSON.stringify([batch, ...existing]));
};

export const getBatches = (): AnimalBatch[] => {
  const data = localStorage.getItem('batches');
  if (!data) return [];
  return JSON.parse(data).map((b: any) => ({
    ...b,
    date: new Date(b.date)
  }));
};

export const saveOrderToStorage = (order: SaleOrder) => {
  const existing = JSON.parse(localStorage.getItem('orders') || '[]');
  localStorage.setItem('orders', JSON.stringify([order, ...existing]));
  
  // Update inventory
  const batches = getBatches();
  order.items.forEach(item => {
    batches.forEach(batch => {
      const cut = batch.cuts.find(c => c.id === item.cutId);
      if (cut) {
        cut.availableWeight = Math.max(0, cut.availableWeight - item.weight);
      }
    });
  });
  localStorage.setItem('batches', JSON.stringify(batches));
};

export const getOrders = (): SaleOrder[] => {
  const data = localStorage.getItem('orders');
  if (!data) return [];
  return JSON.parse(data).map((o: any) => ({
    ...o,
    date: new Date(o.date)
  }));
};

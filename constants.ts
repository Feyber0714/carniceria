
import { AnimalType, CutDefinition } from './types';

export const YIELD_FORMULAS: Record<AnimalType, CutDefinition[]> = {
  [AnimalType.PORK]: [
    { name: 'Costilla', percentage: 0.11, unitPrice: 120 },
    { name: 'Paleta', percentage: 0.10, unitPrice: 95 },
    { name: 'Espinazo', percentage: 0.07, unitPrice: 70 },
    { name: 'Pierna', percentage: 0.18, unitPrice: 110 },
    { name: 'Lomo', percentage: 0.08, unitPrice: 135 },
    { name: 'Tocino', percentage: 0.12, unitPrice: 85 },
    { name: 'Cabeza/Otros', percentage: 0.15, unitPrice: 45 }
  ],
  [AnimalType.BEEF]: [
    { name: 'Lomo Fino', percentage: 0.06, unitPrice: 280 },
    { name: 'Costillar', percentage: 0.14, unitPrice: 150 },
    { name: 'Pierna / Pulpa Negra', percentage: 0.22, unitPrice: 180 },
    { name: 'Bistec / Aguayón', percentage: 0.15, unitPrice: 195 },
    { name: 'Falda', percentage: 0.10, unitPrice: 140 },
    { name: 'Chambarete', percentage: 0.08, unitPrice: 130 },
    { name: 'Otros/Hueso', percentage: 0.12, unitPrice: 60 }
  ]
};

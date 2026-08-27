import type { StructureModel } from '../types/structure'

export const defaultStructure: StructureModel = {
  nodes: [
    { id: 1, label: '1', restrained: false, supportType: 'hinge' }, // Apoyo móvil
    { id: 2, label: '2', restrained: false, supportType: 'hinge' }, // Apoyo móvil
    { id: 3, label: '3', restrained: false, supportType: 'hinge' }, // Apoyo móvil
    { id: 4, label: '4', restrained: true, supportType: 'fixed' },  // Empotramiento
  ],
  elements: [
    { id: 1, nodeI: 1, nodeJ: 2, E: 21000, I: 0.0002, L: 4 },
    { id: 2, nodeI: 2, nodeJ: 3, E: 21000, I: 0.0002, L: 3 },
    { id: 3, nodeI: 3, nodeJ: 4, E: 21000, I: 0.0002, L: 6 },
  ],
  elementLoads: [
    { id: 1, elementId: 1, type: 'point', value: 8, position: 2 }, // 8 toneladas a 2m
    { id: 2, elementId: 2, type: 'udl', value: 5 },               // 5 t/m
    { id: 3, elementId: 3, type: 'point', value: 5, position: 2 }, // 5 t a 2m
  ],
  nodalLoads: [],
}

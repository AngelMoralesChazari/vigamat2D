export let currentForceUnit: 'kN' | 't' = 'kN'

export const units = {
  E: 'MPa',
  I: 'm⁴',
  L: 'm',
  get moment() {
    return currentForceUnit === 'kN' ? 'kN·m' : 't·m'
  },
  get udl() {
    return currentForceUnit === 'kN' ? 'kN/m' : 't/m'
  },
  get point() {
    return currentForceUnit === 'kN' ? 'kN' : 't'
  },
  rotation: 'rad',
  get shear() {
    return currentForceUnit === 'kN' ? 'kN' : 't'
  },
}

export function setForceUnit(unit: 'kN' | 't') {
  currentForceUnit = unit
}

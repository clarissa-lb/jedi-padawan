import { BubbleEmployee } from '../services/bubbleApi';

export interface OrgChartNode {
  id: string;
  name: string;
  email?: string;
  position?: string;
  seniority?: string;
  level?: number;
  color?: string;
  children?: OrgChartNode[];
  jediMentor?: string;
  active?: boolean;
  salary?: number;
  legajo?: number;
  [key: string]: unknown;
}

export class OrgChartDataTransformer {
  private employees: BubbleEmployee[];
  private colorMap: Map<string, string>;
  private seniorityNames: Map<string, string>;
  private seniorityAbbreviations: Map<string, string>;
  private positionNames: Map<string, string>;

  constructor(
    employees: BubbleEmployee[], 
    seniorityNames?: Map<string, string>,
    seniorityAbbreviations?: Map<string, string>,
    positionNames?: Map<string, string>
  ) {
    this.employees = employees;
    this.colorMap = new Map();
    this.seniorityNames = seniorityNames || new Map();
    this.seniorityAbbreviations = seniorityAbbreviations || new Map();
    this.positionNames = positionNames || new Map();
    this.initializeColorMap();
  }

  private initializeColorMap(): void {
    // Colores por posición específica
    const positionColors: { [key: string]: string } = {
      'Product Owner': '#67B9A4',
      'Agile Crafter': '#FE566A',
      'Product Designer': '#FFC700',
      'Developer': '#4F80FF',
      'CTO': '#4F80FF',
    };

    // Asignar colores basados en position
    this.employees.forEach(emp => {
      if (emp.Position) {
        const positionName = this.positionNames.get(emp.Position) || emp.Position;
        
        // Buscar coincidencia exacta o parcial
        let color = '#8B8EA1'; // Color por defecto para otras posiciones
        
        for (const [key, value] of Object.entries(positionColors)) {
          if (positionName.toLowerCase().includes(key.toLowerCase())) {
            color = value;
            break;
          }
        }
        
        this.colorMap.set(emp._id, color);
      }
    });
  }

  private getColorForEmployee(employee: BubbleEmployee): string {
    // Usar el color asignado por posición
    if (this.colorMap.has(employee._id)) {
      return this.colorMap.get(employee._id)!;
    }

    // Color por defecto
    return '#8B8EA1';
  }

  private findJediWithPadawans(): BubbleEmployee[] {
    // Encontrar empleados ACTIVOS que tienen Padawans (son Jedi de otros)
    const jediWithPadawans = this.employees.filter(employee => {
      // Solo empleados activos
      if (employee.active !== true) return false;
      
      const hasPadawans = this.employees.some(emp => 
        emp.Jedi === employee._id && emp.active === true
      );
      return hasPadawans;
    });

    return jediWithPadawans;
  }

  private findRootJedi(): BubbleEmployee[] {
    // Encontrar Jedi ACTIVOS que tienen Padawans pero no tienen Jedi mentor
    const jediWithPadawans = this.findJediWithPadawans();
    
    return jediWithPadawans.filter(jedi => {
      // Solo empleados activos
      if (jedi.active !== true) return false;
      
      // No tiene Jedi mentor
      return !jedi.Jedi;
    });
  }

  private buildHierarchy(employee: BubbleEmployee): OrgChartNode {
    // Incluir TODOS los Padawans ACTIVOS de este Jedi
    const padawans = this.employees
      .filter(emp => emp.Jedi === employee._id && emp.active === true)
      .map(child => this.buildHierarchy(child));

    // Obtener nombres reales de position y seniority abbreviation
    const positionName = employee.Position ? 
      (this.positionNames.get(employee.Position) || employee.Position) : undefined;
    
    const seniorityAbbreviation = employee.Seniority ? 
      (this.seniorityAbbreviations.get(employee.Seniority) || employee.Seniority) : undefined;

    return {
      id: employee._id,
      name: `${employee.first_name} ${employee.last_name}`,
      email: employee.PeopleForceEmail,
      position: positionName,
      seniority: seniorityAbbreviation,
      level: employee.salary ? Math.floor(employee.salary / 1000) : undefined,
      color: this.getColorForEmployee(employee),
      jediMentor: employee.Jedi,
      active: employee.active,
      salary: employee.salary,
      legajo: employee.legajo,
      children: padawans.length > 0 ? padawans : undefined
    };
  }

  public transformToOrgChartData(): OrgChartNode | null {
    if (this.employees.length === 0) {
      return null;
    }

    const jediWithPadawans = this.findJediWithPadawans();
    
    if (jediWithPadawans.length === 0) {
      return null; // No hay Jedi con Padawans
    }

    const rootJedi = this.findRootJedi();

    if (rootJedi.length === 0) {
      return null; // No hay Jedi raíz
    }

    if (rootJedi.length === 1) {
      // Un solo Jedi raíz
      return this.buildHierarchy(rootJedi[0]);
    }

    // Múltiples Jedi raíz - crear un nodo raíz virtual
    return {
      id: 'virtual-root',
      name: 'Organización Jedi',
      position: 'Líderes',
      color: '#FF6B6B',
      children: rootJedi.map(jedi => this.buildHierarchy(jedi))
    };
  }

  public getSeniorityStats(): { seniority: string; count: number; color: string }[] {
    const stats = new Map<string, number>();

    this.employees.forEach(emp => {
      const seniority = emp.Seniority || 'Sin seniority';
      const seniorityName = this.seniorityNames.get(seniority) || seniority;
      stats.set(seniorityName, (stats.get(seniorityName) || 0) + 1);
    });

    return Array.from(stats.entries()).map(([seniority, count]) => ({
      seniority,
      count,
      color: this.colorMap.get(seniority) || '#4CAF50'
    }));
  }

  public getPositionStats(): { position: string; count: number; color: string }[] {
    const stats = new Map<string, number>();

    this.employees.forEach(emp => {
      const position = emp.Position || 'Sin posición';
      const positionName = this.positionNames.get(position) || position;
      stats.set(positionName, (stats.get(positionName) || 0) + 1);
    });

    return Array.from(stats.entries()).map(([position, count]) => ({
      position,
      count,
      color: this.colorMap.get(position) || '#4CAF50'
    }));
  }

  public getJediMentorStats(): { mentorCount: number; menteeCount: number } {
    const mentors = new Set(this.employees.map(emp => emp.Jedi).filter(Boolean));
    const mentees = this.employees.filter(emp => emp.Jedi).length;
    
    return {
      mentorCount: mentors.size,
      menteeCount: mentees
    };
  }

  public getActiveStats(): { active: number; inactive: number } {
    const active = this.employees.filter(emp => emp.active).length;
    const inactive = this.employees.filter(emp => !emp.active).length;
    
    return {
      active,
      inactive
    };
  }
} 
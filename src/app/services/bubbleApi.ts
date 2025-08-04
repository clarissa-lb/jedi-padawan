import axios from 'axios';

export interface BubbleEmployee {
  _id: string;
  first_name: string;
  last_name: string;
  PeopleForceEmail: string;
  Jedi?: string; // ID del mentor/líder (EmployeeProfile)
  Position?: string; // ID de la posición
  Seniority?: string; // ID de la seniority
  active?: boolean;
  salary?: number;
  legajo?: number;
  PeopleForceId?: number;
  avatar?: string;
  Cell?: string; // ID del celular
  "hired-on"?: string;
  "Created Date"?: string;
  "Modified Date"?: string;
  "Created By"?: string;
  // Campos adicionales que puedas tener
  [key: string]: unknown;
}

export interface BubblePosition {
  _id: string;
  name?: string;
  title?: string;
  [key: string]: unknown;
}

export interface BubbleSeniority {
  _id: string;
  name?: string;
  "Seniority Abreviation"?: string;
  level?: string;
  [key: string]: unknown;
}

export interface BubbleApiConfig {
  apiKey: string;
  appId: string;
  baseUrl?: string;
}

class BubbleApiService {
  private config: BubbleApiConfig;
  private baseUrl: string;

  constructor(config: BubbleApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || `https://${config.appId}.bubbleapps.io/api/1.1/obj`;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async fetchEmployees(): Promise<BubbleEmployee[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/EmployeeProfile`, {
        headers: this.getHeaders(),
        params: {
          limit: 1000,
        }
      });

      return response.data.response.results || [];
    } catch (error) {
      console.error('Error fetching employees from Bubble:', error);
      throw new Error('Failed to fetch employees from Bubble');
    }
  }

  async fetchEmployeeById(id: string): Promise<BubbleEmployee | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/EmployeeProfile/${id}`, {
        headers: this.getHeaders(),
      });

      return response.data.response || null;
    } catch (error) {
      console.error(`Error fetching employee ${id} from Bubble:`, error);
      return null;
    }
  }

  async fetchPositionById(positionId: string): Promise<BubblePosition | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/Position/${positionId}`, {
        headers: this.getHeaders(),
      });

      return response.data.response || null;
    } catch (error) {
      console.error(`Error fetching position ${positionId} from Bubble:`, error);
      return null;
    }
  }

  async fetchSeniorityById(seniorityId: string): Promise<BubbleSeniority | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/Seniority/${seniorityId}`, {
        headers: this.getHeaders(),
      });

      return response.data.response || null;
    } catch (error) {
      console.error(`Error fetching seniority ${seniorityId} from Bubble:`, error);
      return null;
    }
  }

  async createEmployee(employeeData: Partial<BubbleEmployee>): Promise<BubbleEmployee> {
    try {
      const response = await axios.post(`${this.baseUrl}/EmployeeProfile`, employeeData, {
        headers: this.getHeaders(),
      });

      return response.data.response;
    } catch (error) {
      console.error('Error creating employee in Bubble:', error);
      throw new Error('Failed to create employee in Bubble');
    }
  }

  async updateEmployee(id: string, employeeData: Partial<BubbleEmployee>): Promise<BubbleEmployee> {
    try {
      const response = await axios.patch(`${this.baseUrl}/EmployeeProfile/${id}`, employeeData, {
        headers: this.getHeaders(),
      });

      return response.data.response;
    } catch (error) {
      console.error(`Error updating employee ${id} in Bubble:`, error);
      throw new Error('Failed to update employee in Bubble');
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/EmployeeProfile/${id}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error(`Error deleting employee ${id} from Bubble:`, error);
      throw new Error('Failed to delete employee from Bubble');
    }
  }

  async getJediMentorName(jediId: string): Promise<string> {
    try {
      const jedi = await this.fetchEmployeeById(jediId);
      if (jedi) {
        return `${jedi.first_name} ${jedi.last_name}`;
      }
      return 'Mentor no encontrado';
    } catch (error) {
      console.error(`Error fetching Jedi mentor ${jediId}:`, error);
      return 'Error al cargar mentor';
    }
  }

  async getEmployeeWithDetails(employee: BubbleEmployee): Promise<BubbleEmployee & { positionName?: string; seniorityName?: string }> {
    const details = { ...employee };

    if (employee.Position) {
      try {
        const position = await this.fetchPositionById(employee.Position);
        if (position) {
          details.positionName = position.name || position.title || 'Sin posición';
        }
      } catch (error) {
        console.error('Error fetching position details:', error);
        details.positionName = 'Error al cargar posición';
      }
    }

    if (employee.Seniority) {
      try {
        const seniority = await this.fetchSeniorityById(employee.Seniority);
        if (seniority) {
          details.seniorityName = seniority.name || seniority.level || 'Sin seniority';
        }
      } catch (error) {
        console.error('Error fetching seniority details:', error);
        details.seniorityName = 'Error al cargar seniority';
      }
    }

    return details;
  }
}

export default BubbleApiService; 
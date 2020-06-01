import { Vehicle } from "./Vehicle";

export interface Supply {
  data: string;
  id: number;
  kmAtual: number;
  posto:	string;
  precoCombustivel:	number;
  valor: number;
  veiculo: Vehicle;
}

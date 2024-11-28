import { Component, OnInit } from '@angular/core';

interface Vehicle {
  id: string;
  status: string;
  vehicleNo: string;
  make: string;
  colour: string;
  type: string;
  fees: string;
}

@Component({
  selector: 'app-resident-my-vehicle',
  templateUrl: './resident-my-vehicle.page.html',
  styleUrls: ['./resident-my-vehicle.page.scss'],
})
export class ResidentMyVehiclePage implements OnInit {
  userRole: string = 'household';

  vehicles: Vehicle[] = [
    {
      id: 'approve',
      status: 'approve',
      vehicleNo: 'SYK1234A',
      make: 'Toyota',
      colour: 'Black',
      type: 'Car',
      fees: 'S$0.00',
    },
    {
      id: 'pending',
      status: 'pending',
      vehicleNo: 'SYK5678B',
      make: 'Honda',
      colour: 'White',
      type: 'Car',
      fees: 'S$0.00',
    },
    {
      id: 'pending payment',
      status: 'pending_payment',
      vehicleNo: 'SYK9101C',
      make: 'Nissan',
      colour: 'Red',
      type: 'Car',
      fees: 'S$0.00',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  getVehicleValue(vehicle: Vehicle, field: string): string {
    const fieldMap: { [key: string]: keyof Vehicle } = {
      'vehicle no': 'vehicleNo',
      'make': 'make',
      'colour': 'colour',
      'vehicle type': 'type',
      'fees': 'fees'
    };

    const mappedField = fieldMap[field.toLowerCase()];
    return mappedField ? vehicle[mappedField] : '';
  }
}
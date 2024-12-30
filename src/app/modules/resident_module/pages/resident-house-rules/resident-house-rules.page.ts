import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resident-house-rules',
  templateUrl: './resident-house-rules.page.html',
  styleUrls: ['./resident-house-rules.page.scss'],
})
export class ResidentHouseRulesPage implements OnInit {
  houseRules: { title: string }[] = [
    { title: '8th AGM Meeting - 12/12/2024' },
    { title: 'Council Meeting Minutes of the 6th Management Council' },
    // Add more house rules as needed
  ];

  filteredHouseRules: { title: string }[] = [];
  searchTerm: string = '';

  constructor() { }

  ngOnInit() {
    this.filteredHouseRules = this.houseRules; // Initialize with all house rules
  }

  searchHouseRules() {
    this.filteredHouseRules = this.houseRules.filter(rule =>
      rule.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearFilter() {
    this.searchTerm = '';
    this.filteredHouseRules = this.houseRules; // Reset to all house rules
  }
}
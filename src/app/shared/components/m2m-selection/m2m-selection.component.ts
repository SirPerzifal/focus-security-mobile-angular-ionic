import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-m2m-selection',
  templateUrl: './m2m-selection.component.html',
  styleUrls: ['./m2m-selection.component.scss'],
})
export class M2mSelectionComponent implements OnInit {

  private _arrays: any[] = [];
  private _selected: any;
  private _arraysSelection: any[] = [];
  private lock = false

  @Input()
  set Arrays(value: any[]) {
    this._arrays = value || [];
    this.showUnit = [...this._arrays];
    this.unitNames = []
    this.unitArrayProcess = []
  }

  get Arrays(): any[] {
    return this._arrays;
  }

  @Input()
  set Selected(value: any) {
    console.log("TEST", value)
    if (this.lock) return
    console.log("WORK", value)
    this.unitNames = []
    this.unitArrayProcess = []
    this._selected = this.isOne ? value || '' : value || [];
    console.log(this._selected)
    if (this._selected instanceof Array) {
      console.log('array')
      for(let i = 0; i < this._selected.length; i++ ){
        console.log(i, this._selected[i])
        this.onUnitChange(this._selected[i])
      }
    } else {
      console.log('string')
      this.onUnitChange(this._selected)
    }
    console.log(this._selected)
  }

  get Selected(): any {
    console.log(this._selected)
    return this.unitArrayProcess
  }

  @Input() labelText: string = ''
  @Input() placeholder: string = ''
  @Input() isOne: boolean = false
  @Input() isVMS: boolean = false
  @Input() divOuterClass: string = 'min-h-14 text-base'
  @Input() customTextClass: string = 'p-0'

  @Output() outputValue = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
    this.showUnit = this.Arrays
  }

  showUnit: any = []
  unitNames: any[] = [];
  unitArrayProcess: any = []
  setDropdownChooseUnit = false;
  unit_key = ''
  @ViewChild('unit_typing') unitInput!: ElementRef;
  @ViewChild('before_click_unit') beforeUnitInput!: ElementRef;
  toggleDropdownChooseUnit() {
    if (this.unitInput) {
      this.unitInput?.nativeElement.focus()
    } else {
      this.beforeUnitInput?.nativeElement.focus()
    }
     // Toggle dropdown
  }
  toggleOnlyDrop() {
    this.setDropdownChooseUnit = !this.setDropdownChooseUnit;
  }
  focusInput() {
    if (this.unitInput) {
      this.unitInput?.nativeElement.focus()
    } else {
      this.beforeUnitInput?.nativeElement.focus()
    }
    // this.setDropdownChooseUnit = true
  }
  hideDropdownChooseUnit() {
    this.setDropdownChooseUnit = false; // Menyembunyikan dropdown
  }
  // Menangani pemilihan opsi
  selectOptionChooseUnit(unitId: number) {
    this.unit_key = ''
    this.showUnit = this.Arrays
    // console.log(`Selected option: ${value}`); // Tindakan yang diinginkan saat opsi dipilih
    this.onUnitChange(unitId)
  }

  onUnitChange(unitId: any) {
    console.log(unitId)
    if (unitId) {
      const unit = this.Arrays.find((u: any) => u.id === unitId); // Temukan unit berdasarkan ID
      if (unit) {
        const index = this.unitArrayProcess.indexOf(unitId);
        console.log(this.unitArrayProcess)
        console.log(index)
        if (index !== -1) {
          console.log("WANT TO ERASE")
          // Jika ada, hapus unit_id dari array
          this.unitArrayProcess.splice(index, 1);
          this.unitNames = this.unitNames.filter((item: any) => { console.log(item, item.id, unitId); return item.id !== unitId }); // Hapus nama dari array
        } else {
          console.log("WANT TO ADD")
          // Jika tidak ada, tambahkan unit_id ke dalam array
          if (this.isOne) {
            this.unitArrayProcess = [unitId]
            this.unitNames = [{ 'name': unit.name, 'id': unitId }]
            this.setDropdownChooseUnit = false
          } else {
            this.unitArrayProcess.push(unitId);
            this.unitNames.push({ 'name': unit.name, 'id': unitId });
          }
          
        }
        console.log("OKEY END", this.unitArrayProcess)
        this.lock = true
        this.outputValue.emit([...this.unitArrayProcess]);
        this.lock = false
      }
    }
  }

  onUnitKeyUp(event: any) {
    console.log(event.target.value)
    this.setDropdownChooseUnit = true
    this.showUnit = this.Arrays.filter((item: any) => item.name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  optionCheck(unit_id: number) {
    let filter = this.unitNames.filter((item: any) => item.id == unit_id)
    return filter.length > 0
  }

  onFocusInput() {
    // this.setDropdownChooseUnit = true
  }

  selectAllSelection() {
    this.selectAll = !this.selectAll
    console.log(this.selectAll)
    if (this.selectAll) {
      this.unitNames = []
      this.unitArrayProcess = []
      this.showUnit.map((item: any) => {
        this.onUnitChange(item.id)
      })
      this.showUnit = this.Arrays
      console.log(this.unitNames)
    } else {
      this.unitNames = []
      this.unitArrayProcess = []
      this.outputValue.emit([]);
    }
    this.unit_key = ''
  }

  selectAll = false

}

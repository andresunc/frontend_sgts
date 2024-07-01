import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrackingStorage } from 'src/app/models/DomainModels/TrackingStorage';
import { TrackingStorageService } from 'src/app/services/DomainServices/tracking-storage.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.0, 0.0, 0.0, 0)')),
    ]),
  ],
})
export class TrackingComponent implements OnInit {
  dataSource: TrackingStorage[] = [];
  columnsToDisplay = ['action', 'eventLog', 'dataResponsable', 'rol', 'timestamp'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: TrackingStorage | null;
  trackingList: TrackingStorage[] = [];
  idServ: number;

  constructor(
    private trackingService: TrackingStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idServ = data;
  }

  ngOnInit(): void {
    this.getTrackingList();
  }

  getTrackingList() {
    this.trackingService.getTrackingStorageByServicio(this.idServ).subscribe((data: TrackingStorage[]) => {
      this.trackingList = data;
      this.dataSource = data;
    });
  }
}
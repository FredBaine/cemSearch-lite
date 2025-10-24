import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { CemeteryRecord, CemeteryRecordWithId } from '../../types';
import { SearchStateService } from '../../services/search-state.service';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
 
  private firestore = inject(Firestore);
  private router = inject(Router);
  private searchStateService = inject(SearchStateService);
  
  searchName = signal('');
  selectedSection = signal('');
  selectedLot = signal('');
  records = signal<CemeteryRecordWithId[]>([]);
  isLoading = signal(false);
  currentSearchType = signal('');
  sections = signal<string[]>([]);
  lots = signal<string[]>([]);
  
  // Flag to prevent unwanted change events when programmatically clearing fields
  private skipChangeEvents = false;
  
 
  ngOnInit(): void {
    console.log('SearchComponent ngOnInit called');
    this.loadDropdownData();
    
    // Check if we have saved state to restore
    const savedState = this.searchStateService.getState();
    if (savedState) {
      this.searchName.set(savedState.searchName);
      this.selectedSection.set(savedState.selectedSection);
      this.selectedLot.set(savedState.selectedLot);
      this.records.set(savedState.records);
      this.isLoading.set(savedState.isLoading);
    }
  }

  ngOnDestroy(): void {
    // Save current state when component is destroyed
    this.saveCurrentState();
  }

  private saveCurrentState(): void {
    const currentState = {
     searchName: this.searchName(),
      selectedSection: this.selectedSection(),
      selectedLot: this.selectedLot(),
      records: this.records(),
      isLoading: this.isLoading()
    };
    this.searchStateService.saveState(currentState);
    console.log('Saved search state:', currentState);
  }

  async loadDropdownData(): Promise<void> {
    console.log('Loading dropdown data...');
    try {
      const cemeteryCollection = collection(this.firestore, 'cemeteryRegistry');
      const q = query(cemeteryCollection, limit(1000));
      const querySnapshot = await getDocs(q);
      
      console.log(`Retrieved ${querySnapshot.docs.length} documents for dropdown data`);
      
      const sectionsSet = new Set<string>();
      const lotsSet = new Set<string>();
      
      querySnapshot.docs.forEach(doc => {
        const record = doc.data() as CemeteryRecord;
        console.log('Sample record for dropdown:', record);
        
        // Filter out section '82 EAST' from dropdown options
        if (record.section && record.section !== '82 EAST') {
          sectionsSet.add(record.section);
        }
        if (record.lot) lotsSet.add(record.lot);
        
        // Also check for capitalized field names
        const recordAny = record as any;
        if (recordAny.Section && recordAny.Section !== '82 EAST') {
          sectionsSet.add(recordAny.Section);
        }
        if (recordAny.Lot) lotsSet.add(recordAny.Lot);
      });
      
      this.sections.set(Array.from(sectionsSet).sort());
      this.lots.set(Array.from(lotsSet).sort());
      
      console.log(`Loaded ${this.sections.length} sections:`, this.sections);
      console.log(`Loaded ${this.lots.length} lots:`, this.lots);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  }

  async search(): Promise<void> {
    console.log('=== SEARCH DEBUG START ===');
    console.log('Search parameters:', {
      searchName: this.searchName()
    });

    if (!this.searchName()) {
      console.log('No valid search criteria: Need occupant name');
      this.records.set([]);
      return;
    }

    this.isLoading.set(true)
    try {
      const cemeteryCollection = collection(this.firestore, 'cemeteryRegistry');
      let q = query(cemeteryCollection);
      let searchType = '';

      // Simplified search with only one mode:
      // 1. Occupant name search only

      if (this.searchName()) {
        // Mode 1: Search by occupant name only
        const searchTerm = this.searchName().toLowerCase();
        console.log(`SEARCH MODE: Occupant name search only - searchTerm: "${searchTerm}"`);
        searchType = 'occupant-name';
        
        // Search occupant names only
        try {
          q = query(q, where('searchOccupantName', '>=', searchTerm), where('searchOccupantName', '<=', searchTerm + '\uf8ff'));
          console.log('Using camelCase field: searchOccupantName');
        } catch (error) {
          console.log('camelCase failed, using lowercase field: searchoccupantname');
          q = query(q, where('searchoccupantname', '>=', searchTerm), where('searchoccupantname', '<=', searchTerm + '\uf8ff'));
        }
      }

      console.log(`Executing search type: ${searchType}`);
      this.currentSearchType.set(searchType);

      console.log('Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log(`Firestore query returned ${querySnapshot.docs.length} documents`);
      
      // Filter out records with section = '82 EAST'
      const filteredRecords = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          console.log(`Raw document data for ${doc.id}:`, data);
          return {
            id: doc.id,
            ...data
          } as CemeteryRecordWithId;
        })
        .filter(record => record.section !== '82 EAST');
      
      this.records.set(filteredRecords);

      console.log(`Records after filtering out section '82 EAST': ${this.records().length}`);
      if (this.records().length > 0) {
        console.log('Sample record structure:', Object.keys(this.records()[0]));
        console.log('First record data:', this.records()[0]);
        console.log('Available search fields in first record:');
        console.log('  searchOccupantName (camelCase):', this.records()[0].searchOccupantName);
        console.log('  searchOwnerName (camelCase):', this.records()[0].searchOwnerName);
        console.log('  searchoccupantname (lowercase):', (this.records()[0] as any)['searchoccupantname']);
        console.log('  searchownername (lowercase):', (this.records()[0] as any)['searchownername']);
        console.log('  section:', this.records()[0].section);
        console.log('  lot:', this.records()[0].lot);
      }

      // Apply client-side filtering for occupant name searches (no additional filtering needed)
      if (searchType === 'occupant-name' && this.searchName()) {
        console.log('Occupant name search complete - no additional filtering needed');
      } else {
        console.log(`No client-side filtering needed for search type: ${searchType}`);
      }

      // Sort results by Section, Lot, Site, Space
      this.sortRecords();

      console.log(`=== SEARCH DEBUG END - Final result count: ${this.records().length} ===`);

    } catch (error) {
      console.error('Error searching records:', error);
      this.records.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  viewOnMap(record: CemeteryRecordWithId): void {
    if (record.section && record.lot) {
      // Save current state before navigation
      this.saveCurrentState();
      
      this.router.navigate(['/map', record.section, record.lot], {
        state: { fromSearch: true }
      });
    }
  }

  onRowClick(record: CemeteryRecordWithId): void {
    this.viewOnMap(record);
  }

  private sortRecords(): void {
    this.records.update(records => records.sort((a, b) => {
      // Sort by Section first
      const sectionA = a.section || '';
      const sectionB = b.section || '';
      if (sectionA !== sectionB) {
        return sectionA.localeCompare(sectionB, undefined, { numeric: true });
      }

      // Then by Lot
      const lotA = a.lot || '';
      const lotB = b.lot || '';
      if (lotA !== lotB) {
        return lotA.localeCompare(lotB, undefined, { numeric: true });
      }

      // Then by Site
      const siteA = a.site || '';
      const siteB = b.site || '';
      if (siteA !== siteB) {
        return siteA.localeCompare(siteB, undefined, { numeric: true });
      }

      // Finally by Space
      const spaceA = a.space || '';
      const spaceB = b.space || '';
      return spaceA.localeCompare(spaceB, undefined, { numeric: true });
    }));
  }

  onSearchNameKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  onSearchNameInput(): void {
    // Input handling for occupant name search
    // No additional logic needed since section/lot search is removed
  }

  clearSearchName(): void {
    this.searchName.set('');
    this.search();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}

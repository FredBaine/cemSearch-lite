import { Injectable } from '@angular/core';
import { CemeteryRecordWithId } from '../types';

export interface SearchState {
  searchName: string;
  selectedSection: string;
  selectedLot: string;
  records: CemeteryRecordWithId[];
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private savedState: SearchState | null = null;

  saveState(state: SearchState): void {
    this.savedState = { ...state };
  }

  getState(): SearchState | null {
    return this.savedState ? { ...this.savedState } : null;
  }

  clearState(): void {
    this.savedState = null;
  }

  hasState(): boolean {
    return this.savedState !== null;
  }
}
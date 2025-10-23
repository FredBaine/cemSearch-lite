export interface CemeteryRecord {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  lastContactDate: Date;
  associatedPlots: Array<string>;
  notes: string;
}


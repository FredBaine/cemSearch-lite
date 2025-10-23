import { CemeteryRecord } from './cemetery';

export interface CemeteryRecordWithId extends CemeteryRecord {
  id: string;
}

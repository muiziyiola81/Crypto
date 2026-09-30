import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { RecordForm } from '../components/records/RecordForm';
import { CryptoRecordInput } from '../types/crypto';

export const AddRecordView: React.FC = () => {
  const { navigateTo, showToast } = useAuth();
  const { saveRecord } = useRecords();

  const handleSave = async (data: CryptoRecordInput) => {
    const res = await saveRecord(data);
    if (res.success) {
      showToast('Record created and secured in vault');
    }
    return res;
  };

  return (
    <div>
      <RecordForm
        title="Add Crypto Record"
        onSave={handleSave}
        onCancel={() => navigateTo('records')}
      />
    </div>
  );
};

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { RecordForm } from '../components/records/RecordForm';
import { CryptoRecordInput } from '../types/crypto';

export const EditRecordView: React.FC = () => {
  const { selectedRecordId, navigateTo, showToast } = useAuth();
  const { getRecordById, saveRecord } = useRecords();

  const record = getRecordById(selectedRecordId);

  if (!record) {
    return (
      <div className="vault-panel p-8 rounded-2xl text-center">
        <p className="text-xs text-zinc-400">Record not found or access expired.</p>
        <button
          onClick={() => navigateTo('records')}
          className="mt-4 px-4 py-2 bg-white text-zinc-950 text-xs font-semibold rounded-xl"
        >
          Return to Records
        </button>
      </div>
    );
  }

  const handleSave = async (data: CryptoRecordInput) => {
    const res = await saveRecord(data, record.id);
    if (res.success) {
      showToast('Record updated successfully');
    }
    return res;
  };

  return (
    <div>
      <RecordForm
        initialData={record}
        title={`Edit ${record.wallet_name}`}
        onSave={handleSave}
        onCancel={() => navigateTo('record_details', record.id)}
      />
    </div>
  );
};

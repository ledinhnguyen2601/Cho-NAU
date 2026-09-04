// File: src/pages/Admin/AdminReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllReports, updateReportStatus } from '../../services/reportService';
import { ReportModerationTable } from '../../components/admin/ReportModerationTable';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const AdminReportsPage = () => {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await getAllReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpdateStatus = async (reportId, status, adminNote) => {
    try {
      await updateReportStatus(reportId, status, adminNote);
      toast.success('Đã cập nhật trạng thái xử lý báo cáo.');
      loadReports();
    } catch (e) {
      toast.error('Lỗi khi cập nhật báo cáo.');
    }
  };

  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-xl font-black text-nau-text dark:text-nau-text flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-nau-danger" />
          <span>Xử Lý Báo Cáo Vi Phạm & Lừa Đảo ({pendingReportsCount} chờ xử lý)</span>
        </h1>
        <p className="text-xs text-nau-text-muted dark:text-nau-text-muted mt-1">
          Tiếp nhận tố cáo từ sinh viên, tiến hành xác minh và xử lý nghiêm các trường hợp gian lận
        </p>
      </div>

      <ReportModerationTable
        reports={reports}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

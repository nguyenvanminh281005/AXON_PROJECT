import React, { useState } from 'react';
import { ManagerConfirmRejectModal } from '@/app/shared/components/ManagerConfirmRejectModal';
import { ApprovalService, RequestService } from '@/app/shared/services/approval.services';
import { ApprovalRequest, User } from '@/app/shared/types/approval.types';

const dummyManager = new User('m1', 'Nguyễn Quản Lý', 'manager@example.com', 2, 'Phòng Nhân sự');

const approvalService = new ApprovalService();
const requestService = new RequestService();

export const ManagerConfirmAndRejectPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Core state: full list, mỗi object sẽ có status đúng!
  const [allRequests, setAllRequests] = useState<ApprovalRequest[]>([]);

  // Init chỉ 1 lần
  React.useEffect(() => {
    requestService.getPendingRequests().then(requests => setAllRequests(requests));
  }, []);

  // Chia nhỏ từng list trạng thái
  const pendingRequests = allRequests.filter(r => r.status === 'PENDING');
  const approvedRequests = allRequests.filter(r => r.status === 'APPROVED');
  const rejectedRequests = allRequests.filter(r => r.status === 'REJECTED');

  const handleSelectRequest = (req: ApprovalRequest) => {
    setSelectedRequest(req);
    setIsOpen(true);
    setFeedback(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedRequest(null);
    setFeedback(null);
  };

  // Xác nhận
  const handleConfirm = async () => {
    if (!selectedRequest) return;
    setLoading(true);
    setFeedback(null);
    try {
      // tạo object mới có status APPROVED bằng service chuẩn
      const approved = await approvalService.approveRequest(selectedRequest, {
        actionBy: dummyManager,
        reason: undefined,
      });
      setFeedback('Xác nhận thành công!');
      setAllRequests(requests => requests.map(rq => rq.id === approved.id ? approved : rq));
      closeModal();
    } catch (e: any) {
      setFeedback(e.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  // Từ chối
  const handleReject = async (reason: string) => {
    if (!selectedRequest) return;
    setLoading(true);
    setFeedback(null);
    try {
      // tạo object mới có status REJECTED bằng service chuẩn
      const rejected = await approvalService.rejectRequest(selectedRequest, {
        actionBy: dummyManager,
        reason,
      });
      setFeedback('Đã từ chối yêu cầu!');
      setAllRequests(requests => requests.map(rq => rq.id === rejected.id ? rejected : rq));
      closeModal();
    } catch (e: any) {
      setFeedback(e.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg flex flex-col items-center py-5">
          <div className="text-xl font-semibold text-gray-600">Chờ phê duyệt</div>
          <div className="text-3xl font-bold text-[#48B7D6] mt-2">{pendingRequests.length}</div>
        </div>
        <div className="bg-white shadow rounded-lg flex flex-col items-center py-5">
          <div className="text-xl font-semibold text-gray-600">Đã phê duyệt</div>
          <div className="text-3xl font-bold text-green-500 mt-2">{approvedRequests.length}</div>
        </div>
        <div className="bg-white shadow rounded-lg flex flex-col items-center py-5">
          <div className="text-xl font-semibold text-gray-600">Đã từ chối</div>
          <div className="text-3xl font-bold text-red-500 mt-2">{rejectedRequests.length}</div>
        </div>
      </div>
      <h2 className="text-lg font-bold mb-4">Danh sách yêu cầu chờ xác nhận (manager)</h2>
      <ul className="space-y-3 mb-6">
        {pendingRequests.map((rq) => (
          <li key={rq.id}>
            <button
              className="w-full px-4 py-3 rounded border hover:bg-gray-50 text-left"
              onClick={() => handleSelectRequest(rq)}
            >
              <div className="font-semibold">{rq.title}</div>
              <div className="text-sm text-gray-500">{rq.description}</div>
            </button>
          </li>
        ))}
        {pendingRequests.length === 0 && <p>Không có yêu cầu nào.</p>}
      </ul>
      <ManagerConfirmRejectModal
        isOpen={isOpen}
        title="Xét duyệt yêu cầu nhân viên"
        requestInfo={selectedRequest}
        onClose={closeModal}
        loading={loading}
        onConfirm={handleConfirm}
        onReject={() => {
          const reason = window.prompt('Nhập lý do từ chối?');
          if (reason) handleReject(reason);
        }}
      />
      {feedback && (
        <div className="mt-4 p-3 rounded bg-blue-50 text-blue-800 border border-blue-200">
          {feedback}
        </div>
      )}
      {/* Hiển thị đơn giản các hồ sơ đã duyệt và đã từ chối */}
      <div className="mt-10">
        <h3 className="font-semibold text-green-700 mb-2">Danh sách đã phê duyệt</h3>
        <ul className="mb-6 space-y-1">
          {approvedRequests.map(rq => (
            <li key={rq.id} className="text-green-700">✔ {rq.title}</li>
          ))}
          {approvedRequests.length === 0 && <li>Không có</li>}
        </ul>
        <h3 className="font-semibold text-red-700 mb-2">Danh sách đã từ chối</h3>
        <ul className="space-y-1">
          {rejectedRequests.map(rq => (
            <li key={rq.id} className="text-red-700">✖ {rq.title}</li>
          ))}
          {rejectedRequests.length === 0 && <li>Không có</li>}
        </ul>
      </div>
    </div>
  );
};

export default ManagerConfirmAndRejectPage;

import { useState } from 'react';
import { adminApplicationService } from '../../services/adminApplicationService';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const ApplicationDetailModal = ({ application, onClose, onApplicationProcessed }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = async () => {
    setProcessing(true);
    setError('');
    try {
      await adminApplicationService.approveApplication(application.id);
      onApplicationProcessed();
    } catch (err) {
      setError(err.message || 'Failed to approve application');
    } finally {
      setProcessing(false);
      setShowApproveConfirm(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    setError('');
    try {
      await adminApplicationService.rejectApplication(
        application.id,
        rejectionReason
      );
      onApplicationProcessed();
    } catch (err) {
      setError(err.message || 'Failed to reject application');
    } finally {
      setProcessing(false);
      setShowRejectDialog(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Application Details</span>
              {getStatusBadge(application.status)}
            </DialogTitle>
            <DialogDescription>
              Review the provider application information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Applicant Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Applicant Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium">{application.applicant_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{application.applicant_email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="text-sm font-medium">{application.phone_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium">{formatDate(application.submitted_at)}</p>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Business Name</p>
                  <p className="text-sm font-medium">{application.business_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Years of Experience</p>
                  <p className="text-sm font-medium">{application.years_of_experience} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service Address</p>
                  <p className="text-sm font-medium">{application.service_address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bio</p>
                  <p className="text-sm whitespace-pre-wrap">{application.bio}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service Categories</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {application.service_categories && application.service_categories.length > 0 ? (
                      application.service_categories.map((category, index) => (
                        <Badge key={index} variant="outline">{category}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Information (if processed) */}
            {application.status !== 'pending' && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Review Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Reviewed By</p>
                    <p className="text-sm font-medium">{application.reviewer_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Processed Date</p>
                    <p className="text-sm font-medium">{formatDate(application.reviewed_at)}</p>
                  </div>
                </div>
                {application.status === 'rejected' && application.rejection_reason && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Rejection Reason</p>
                    <p className="text-sm whitespace-pre-wrap">{application.rejection_reason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            {application.status === 'pending' ? (
              <div className="flex gap-2 w-full justify-end">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={processing}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => setShowApproveConfirm(true)}
                  disabled={processing}
                >
                  Approve
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      {showApproveConfirm && (
        <Dialog open={true} onOpenChange={() => setShowApproveConfirm(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this application? The user will be promoted to a provider.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApproveConfirm(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button onClick={handleApprove} disabled={processing}>
                {processing ? 'Approving...' : 'Confirm Approval'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <Dialog open={true} onOpenChange={() => setShowRejectDialog(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this application. This will be shown to the applicant.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rejection Reason *</label>
                <textarea
                  className="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Explain why this application is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
              >
                {processing ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ApplicationDetailModal;

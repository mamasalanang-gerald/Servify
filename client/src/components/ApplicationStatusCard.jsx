import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ApplicationStatusCard = ({ application, onReapply }) => {
  if (!application) {
    return null;
  }

  const { status, submittedAt, processedAt, rejectionReason, canReapply, daysUntilReapply } = application;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-600">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        );
      case 'approved':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Provider Application Status</h3>
            {getStatusBadge()}
          </div>

          {/* Pending Status */}
          {status === 'pending' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your application is currently under review by our admin team.
              </p>
              <p className="text-xs text-muted-foreground">
                Submitted on {formatDate(submittedAt)}
              </p>
              <div className="mt-4 rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Estimated review time:</strong> 1-3 business days
                </p>
              </div>
            </div>
          )}

          {/* Approved Status */}
          {status === 'approved' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Congratulations! Your application has been approved.
              </p>
              <p className="text-xs text-muted-foreground">
                Approved on {formatDate(processedAt)}
              </p>
              <div className="mt-4">
                <Button onClick={() => window.location.href = '/provider-dashboard'}>
                  Go to Provider Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* Rejected Status */}
          {status === 'rejected' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Unfortunately, your application was not approved at this time.
              </p>
              <p className="text-xs text-muted-foreground">
                Rejected on {formatDate(processedAt)}
              </p>
              
              {rejectionReason && (
                <div className="mt-3 rounded-md bg-red-50 p-3 dark:bg-red-950/20">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Reason for rejection:
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {rejectionReason}
                  </p>
                </div>
              )}

              <div className="mt-4">
                {canReapply ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      You are now eligible to submit a new application.
                    </p>
                    <Button onClick={onReapply}>
                      Submit New Application
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-950/20">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      You can reapply in <strong>{daysUntilReapply}</strong> day{daysUntilReapply !== 1 ? 's' : ''}.
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Please wait 30 days from the rejection date before submitting a new application.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApplicationStatusCard;

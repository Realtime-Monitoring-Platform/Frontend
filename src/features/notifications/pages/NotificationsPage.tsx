import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
import { Notification } from '@/types';
import { DeleteNotification, getMyNotifications, getUnredNotificationsCount, markAsRead } from '@/services/notificationAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';


export const NotificationsPage = () => {
 // const [notifications, setNotifications] = useState<Notification[]>([]);
 /// const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);
  const {user}=useAuth();
  const {data: unreadNotificationsCount, isLoading, error} = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: getUnredNotificationsCount,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const {data: notifs, isLoading: notifsLoading, error: notifsError} = useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  // const markAsRead = async (id: string) => {
  //   try {
  //     // TODO: Implement mark as read API call
  //     // await api.put(`/notifications/${id}/read`);
  //     setNotifications(prev =>
  //       prev.map(notif =>
  //         notif.id === id ? { ...notif, read: true } : notif
  //       )
  //     );
  //     toast.success('Notification marked as read');
  //   } catch (error) {
  //     toast.error('Failed to mark notification as read');
  //   }
  // };

  // const markAllAsRead = async () => {
  //   try {
  //     // TODO: Implement mark all as read API call
  //     // await api.put('/notifications/read-all');
  //     setNotifications(prev =>
  //       prev.map(notif => ({ ...notif, read: true }))
  //     );
  //     toast.success('All notifications marked as read');
  //   } catch (error) {
  //     toast.error('Failed to mark all notifications as read');
  //   }
  // };

  // const deleteNotification = async (id: string) => {
  //   try {
  //     // TODO: Implement delete notification API call
  //     // await api.delete(`/notifications/${id}`);
  //     setNotifications(prev => prev.filter(notif => notif.id !== id));
  //     toast.success('Notification deleted');
  //   } catch (error) {
  //     toast.error('Failed to delete notification');
  //   }
  // };

  // const filteredNotifications = filter === 'unread'
  //   ? notifications.filter(n => !n.read)
  //   : notifications;

  // const unreadCount = notifications.filter(n => !n.read).length;

  // const getNotificationIcon = (type: string) => {
  //   switch (type) {
  //     case 'ALERT':
  //       return '🔔';
  //     case 'COMMAND':
  //       return '⚡';
  //     case 'DEVICE':
  //       return '📱';
  //     case 'USER':
  //       return '👤';
  //     case 'SYSTEM':
  //       return '⚙️';
  //     default:
  //       return '📢';
  //   }
  // };
  const queryClient = useQueryClient();
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const deleteMutation = useMutation({
    mutationFn: DeleteNotification,

    onSuccess: async () => {
      toast.success("Notification deleted successfully");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["notifications","unread-notifications"],
      });
    },

    onError: () => {
      toast.error("Failed to delete notification");
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,

    onSuccess: async () => {
      toast.success("Notification marked as unread successfully");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries({
        queryKey: ["notifications","unread-notifications"],
      });
    },

    onError: () => {
      toast.error("Failed to delete notification");
    },
  });


  if (notifsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadNotificationsCount || 0 > 0 && (
              <p className="text-sm text-muted-foreground">
                You have {unreadNotificationsCount} unread notification{unreadNotificationsCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={(value: 'all' | 'unread') => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
            </SelectContent>
          </Select>

          {/* {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )} */}
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'unread' ? 'Unread Notifications' : 'All Notifications'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No notifications to display
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : 'You don\'t have any notifications yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifs?.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                    !notification.read
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-background hover:bg-muted/50'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-2xl">
                      {/* {getNotificationIcon(notification.type)} */}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {notification.type}
                          </Badge>
                          <span>{formatTimestamp(notification.timestamp)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                             aria-label={`Mark notification as read`}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                             onClick={() => markAsReadMutation.mutate(notification.id)}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(notification.id)}
                          title="Delete notification"
                          aria-label={`Delete notification ${notification.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
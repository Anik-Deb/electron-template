import { toast } from '@/components/ui/use-toast';
export const showToast = (
  type = 'success',
  message = 'Operation completed!'
) => {
  let variant = 'default';
  if (type === 'error') variant = 'destructive';
  if (type === 'info') variant = 'default'; // Keep default for warnings/info

  toast({
    title: type === 'success' ? 'Success' : type === 'info' ? 'Info' : 'Failed',
    description: message,
    variant,
  });
};
